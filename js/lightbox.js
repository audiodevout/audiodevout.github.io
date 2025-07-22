// ===================================================================
// LIGHTBOX IMAGE GALLERY SYSTEM
// ===================================================================

class Lightbox {
    constructor() {
        this.modal = document.getElementById('lightbox-modal');
        this.image = document.getElementById('lightbox-image');
        this.title = document.getElementById('lightbox-title');
        this.description = document.getElementById('lightbox-description');
        this.closeBtn = this.modal?.querySelector('.lightbox-close');
        this.prevBtn = this.modal?.querySelector('.lightbox-prev');
        this.nextBtn = this.modal?.querySelector('.lightbox-next');
        
        this.currentGallery = [];
        this.currentIndex = 0;
        this.isOpen = false;
        
        if (this.modal) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.bindKeyboard();
    }
    
    bindEvents() {
        // Close button
        this.closeBtn?.addEventListener('click', () => this.close());
        
        // Background click to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        // Touch/swipe support for mobile
        if (isMobile()) {
            this.bindTouchEvents();
        }
    }
    
    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch (e.code) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
                case 'Space':
                    e.preventDefault();
                    this.next();
                    break;
            }
        });
    }
    
    bindTouchEvents() {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        const threshold = 50;
        
        this.image.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: true });
        
        this.image.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            distX = touch.clientX - startX;
            distY = touch.clientY - startY;
        });
        
        this.image.addEventListener('touchend', () => {
            // Horizontal swipe
            if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > threshold) {
                if (distX > 0) {
                    this.prev();
                } else {
                    this.next();
                }
            }
            
            // Reset
            startX = 0;
            startY = 0;
            distX = 0;
            distY = 0;
        }, { passive: true });
    }
    
    open(gallery, index = 0) {
        this.currentGallery = gallery;
        this.currentIndex = index;
        this.isOpen = true;
        
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.focus();
        
        this.loadImage();
        this.updateNavigation();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        window.appEvents.emit('lightboxOpened', { gallery, index });
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to trigger element if possible
        const activeGalleryImage = document.querySelector('.gallery-image:focus');
        if (activeGalleryImage) {
            activeGalleryImage.focus();
        }
        
        window.appEvents.emit('lightboxClosed');
    }
    
    prev() {
        if (this.currentGallery.length <= 1) return;
        
        this.currentIndex = this.currentIndex === 0 
            ? this.currentGallery.length - 1 
            : this.currentIndex - 1;
            
        this.loadImage();
        this.updateNavigation();
    }
    
    next() {
        if (this.currentGallery.length <= 1) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.currentGallery.length;
        this.loadImage();
        this.updateNavigation();
    }
    
    loadImage() {
        const imageData = this.currentGallery[this.currentIndex];
        if (!imageData) return;
        
        // Show loading state
        this.image.style.opacity = '0.5';
        
        // Create new image to preload
        const newImg = new Image();
        newImg.onload = () => {
            this.image.src = newImg.src;
            this.image.alt = imageData.alt || imageData.title || '';
            this.image.style.opacity = '1';
            
            // Update info
            this.title.textContent = imageData.title || '';
            this.description.textContent = imageData.description || '';
            
            // Update aria-label for lightbox
            this.modal.setAttribute('aria-labelledby', 'lightbox-title');
        };
        
        newImg.onerror = () => {
            this.image.style.opacity = '1';
            this.title.textContent = 'Error loading image';
            this.description.textContent = '';
        };
        
        newImg.src = imageData.file;
    }
    
    updateNavigation() {
        const hasPrev = this.currentGallery.length > 1;
        const hasNext = this.currentGallery.length > 1;
        
        if (this.prevBtn) {
            this.prevBtn.style.display = hasPrev ? 'block' : 'none';
            this.prevBtn.disabled = !hasPrev;
        }
        
        if (this.nextBtn) {
            this.nextBtn.style.display = hasNext ? 'block' : 'none';
            this.nextBtn.disabled = !hasNext;
        }
    }
}

// ===================================================================
// IMAGE GALLERY COMPONENT
// ===================================================================

class ImageGallery {
    constructor(galleryData) {
        this.galleryData = galleryData;
        this.container = null;
        this.images = [];
        this.id = generateId();
    }
    
    render() {
        this.container = createElement('div', {
            className: 'image-gallery-container',
            'data-gallery-id': this.id
        });
        
        // Gallery header
        const header = createElement('div', {
            className: 'gallery-header'
        });
        
        if (this.galleryData.title) {
            const title = createElement('h3', {
                className: 'gallery-title'
            }, this.galleryData.title);
            header.appendChild(title);
        }
        
        if (this.galleryData.description) {
            const description = createElement('p', {
                className: 'gallery-description'
            }, this.galleryData.description);
            header.appendChild(description);
        }
        
        // Gallery grid
        const grid = createElement('div', {
            className: 'image-gallery'
        });
        
        // Add images
        this.galleryData.images.forEach((imageData, index) => {
            const imageElement = this.createImageElement(imageData, index);
            grid.appendChild(imageElement);
            this.images.push(imageElement);
        });
        
        this.container.appendChild(header);
        this.container.appendChild(grid);
        
        // Lazy load images
        setTimeout(() => lazyLoadImages(), 100);
        
        return this.container;
    }
    
    createImageElement(imageData, index) {
        const imageContainer = createElement('div', {
            className: 'gallery-image',
            tabindex: '0',
            role: 'button',
            'aria-label': `View ${imageData.title || 'image'} in lightbox`
        });
        
        // Create image with lazy loading
        const img = createElement('img', {
            'data-src': imageData.file, // Lazy loading
            alt: imageData.alt || imageData.title || '',
            className: 'lazy',
            loading: 'lazy'
        });
        
        // Overlay with info
        const overlay = createElement('div', {
            className: 'gallery-overlay'
        });
        
        if (imageData.title) {
            const title = createElement('h4', {}, imageData.title);
            overlay.appendChild(title);
        }
        
        if (imageData.description) {
            const description = createElement('p', {}, imageData.description);
            overlay.appendChild(description);
        }
        
        // Click/keyboard event to open lightbox
        const openLightbox = () => {
            if (window.lightbox) {
                window.lightbox.open(this.galleryData.images, index);
            }
        };
        
        imageContainer.addEventListener('click', openLightbox);
        imageContainer.addEventListener('keydown', (e) => {
            if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault();
                openLightbox();
            }
        });
        
        imageContainer.appendChild(img);
        imageContainer.appendChild(overlay);
        
        return imageContainer;
    }
    
    // Method to update gallery if data changes
    update(newGalleryData) {
        this.galleryData = newGalleryData;
        if (this.container) {
            const newContainer = this.render();
            this.container.replaceWith(newContainer);
            this.container = newContainer;
        }
    }
    
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// ===================================================================
// LAZY LOADING ENHANCEMENTS
// ===================================================================

class LazyImageLoader {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                }
            );
        }
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        // Create loading placeholder
        img.style.backgroundColor = 'var(--bg-tertiary)';
        img.style.minHeight = '200px';
        
        // Load actual image
        const newImg = new Image();
        newImg.onload = () => {
            img.src = newImg.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            img.style.backgroundColor = '';
            img.style.minHeight = '';
        };
        
        newImg.onerror = () => {
            img.classList.remove('lazy');
            img.classList.add('error');
            img.alt = 'Failed to load image';
            img.style.backgroundColor = 'var(--bg-secondary)';
        };
        
        newImg.src = src;
    }
    
    observe(img) {
        if (this.observer && img.dataset.src) {
            this.observer.observe(img);
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadImage(img);
        }
    }
    
    observeAll() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.observe(img));
    }
}

// ===================================================================
// INITIALIZE LIGHTBOX SYSTEM
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    window.lightbox = new Lightbox();
    window.lazyImageLoader = new LazyImageLoader();
    
    // Export classes for use by page generator
    window.ImageGallery = ImageGallery;
    
    // Auto-observe lazy images on page changes
    window.appEvents.on('pageChanged', () => {
        setTimeout(() => {
            window.lazyImageLoader.observeAll();
        }, 100);
    });
});