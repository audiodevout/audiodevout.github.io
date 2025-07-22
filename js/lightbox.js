// ===================================================================
// LIGHTBOX GALLERY SYSTEM
// Image viewer with cyberpunk styling and touch support
// ===================================================================

const Lightbox = {
    isOpen: false,
    currentImages: [],
    currentIndex: 0,
    touchStartX: 0,
    touchEndX: 0,
    
    // Elements
    modal: null,
    overlay: null,
    image: null,
    title: null,
    description: null,
    counter: null,
    prevButton: null,
    nextButton: null,
    closeButton: null,
    
    init() {
        this.getElements();
        this.bindEvents();
        this.loadImages();
        
        Utils.performance.mark('lightbox-init');
        console.log('✓ Lightbox system initialized');
    },
    
    getElements() {
        this.modal = Utils.$('#lightbox-modal');
        this.overlay = this.modal?.querySelector('.lightbox-overlay');
        this.image = this.modal?.querySelector('#lightbox-image');
        this.title = this.modal?.querySelector('#lightbox-title');
        this.description = this.modal?.querySelector('#lightbox-description');
        this.prevButton = this.modal?.querySelector('.lightbox-prev');
        this.nextButton = this.modal?.querySelector('.lightbox-next');
        this.closeButton = this.modal?.querySelector('.lightbox-close');
    },
    
    bindEvents() {
        if (!this.modal) return;
        
        // Image gallery clicks
        Utils.events.delegate(document, '.gallery-item img, .featured-item[data-image-id]', 'click', (e) => {
            e.preventDefault();
            const imageId = this.getImageIdFromElement(e.target);
            if (imageId) {
                this.openLightbox(imageId);
            }
        });
        
        // Navigation buttons
        if (this.prevButton) {
            Utils.events.on(this.prevButton, 'click', () => this.previousImage());
        }
        
        if (this.nextButton) {
            Utils.events.on(this.nextButton, 'click', () => this.nextImage());
        }
        
        // Close button
        if (this.closeButton) {
            Utils.events.on(this.closeButton, 'click', () => this.close());
        }
        
        // Overlay click to close
        if (this.overlay) {
            Utils.events.on(this.overlay, 'click', () => this.close());
        }
        
        // Keyboard navigation
        Utils.events.on(document, 'keydown', (e) => {
            if (this.isOpen) {
                this.handleKeyboard(e);
            }
        });
        
        // Touch/swipe events
        if (Utils.isTouchDevice()) {
            this.bindTouchEvents();
        }
        
        // Escape key global handler
        appEvents.on('escapePressed', () => {
            if (this.isOpen) {
                this.close();
            }
        });
        
        // Page change event
        appEvents.on('pageChange', (data) => {
            if (data.to === 'images') {
                this.refreshGallery();
            }
        });
    },
    
    bindTouchEvents() {
        if (!this.modal) return;
        
        Utils.events.on(this.modal, 'touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        Utils.events.on(this.modal, 'touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    },
    
    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                this.previousImage();
            } else {
                this.nextImage();
            }
        }
    },
    
    loadImages() {
        if (typeof portfolioData !== 'undefined' && portfolioData.images) {
            this.currentImages = portfolioData.images;
        }
    },
    
    getImageIdFromElement(element) {
        // Try to get image ID from various sources
        const galleryItem = element.closest('.gallery-item, .featured-item');
        if (galleryItem) {
            return galleryItem.dataset.imageId;
        }
        
        // Fallback: try to match by src
        const imgSrc = element.src;
        if (imgSrc && this.currentImages) {
            const matchingImage = this.currentImages.find(img => 
                imgSrc.includes(img.src) || imgSrc.includes(img.thumb)
            );
            return matchingImage?.id;
        }
        
        return null;
    },
    
    openLightbox(imageId) {
        const imageIndex = this.currentImages.findIndex(img => img.id === imageId);
        if (imageIndex === -1) return;
        
        this.currentIndex = imageIndex;
        this.isOpen = true;
        
        // Show modal
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        
        // Load and display image
        this.displayCurrentImage();
        
        // Prevent body scroll
        document.body.classList.add('lightbox-open');
        
        // Focus management
        this.closeButton?.focus();
        
        // Analytics
        const currentImage = this.currentImages[this.currentIndex];
        Utils.analytics.track('lightbox_open', {
            image_id: currentImage.id,
            image_title: currentImage.title
        });
        
        console.log(`📷 Opened lightbox: ${currentImage.title}`);
    },
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // Hide modal
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.classList.remove('lightbox-open');
        
        // Clear image
        if (this.image) {
            this.image.src = '';
            this.image.alt = '';
        }
        
        // Focus management - return to trigger element
        const currentImage = this.currentImages[this.currentIndex];
        if (currentImage) {
            const triggerElement = Utils.$(`[data-image-id="${currentImage.id}"]`);
            if (triggerElement) {
                triggerElement.focus();
            }
        }
        
        console.log('📷 Closed lightbox');
    },
    
    nextImage() {
        if (this.currentImages.length > 1) {
            this.currentIndex = (this.currentIndex + 1) % this.currentImages.length;
            this.displayCurrentImage();
        }
    },
    
    previousImage() {
        if (this.currentImages.length > 1) {
            this.currentIndex = this.currentIndex === 0 ? 
                this.currentImages.length - 1 : 
                this.currentIndex - 1;
            this.displayCurrentImage();
        }
    },
    
    displayCurrentImage() {
        const currentImage = this.currentImages[this.currentIndex];
        if (!currentImage) return;
        
        // Show loading state
        this.showLoading();
        
        // Load image
        this.loadImageAsync(currentImage.src)
            .then(() => {
                this.hideLoading();
                this.updateDisplay(currentImage);
            })
            .catch(error => {
                console.error('Failed to load image:', error);
                this.showError('Failed to load image');
            });
    },
    
    loadImageAsync(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                if (this.image) {
                    this.image.src = src;
                    this.image.alt = this.currentImages[this.currentIndex].title;
                }
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
    },
    
    updateDisplay(imageData) {
        // Update title
        if (this.title) {
            this.title.textContent = imageData.title;
        }
        
        // Update description
        if (this.description) {
            this.description.textContent = imageData.description;
        }
        
        // Update counter (if exists)
        this.updateCounter();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Update meta information
        this.updateMetaInfo(imageData);
        
        // Announce to screen readers
        this.announceImageChange(imageData);
    },
    
    updateCounter() {
        const counter = this.modal?.querySelector('.lightbox-counter');
        if (counter) {
            counter.textContent = `${this.currentIndex + 1} / ${this.currentImages.length}`;
        }
    },
    
    updateNavigationButtons() {
        // Update previous button
        if (this.prevButton) {
            this.prevButton.disabled = this.currentImages.length <= 1;
            this.prevButton.style.opacity = this.currentImages.length <= 1 ? '0.3' : '1';
        }
        
        // Update next button
        if (this.nextButton) {
            this.nextButton.disabled = this.currentImages.length <= 1;
            this.nextButton.style.opacity = this.currentImages.length <= 1 ? '0.3' : '1';
        }
    },
    
    updateMetaInfo(imageData) {
        const metaContainer = this.modal?.querySelector('.lightbox-meta');
        if (metaContainer) {
            metaContainer.innerHTML = `
                <span><i class="fas fa-calendar"></i> ${imageData.year}</span>
                <span><i class="fas fa-palette"></i> ${imageData.medium || 'Digital'}</span>
                ${imageData.tags ? `
                    <span><i class="fas fa-tags"></i> ${imageData.tags.join(', ')}</span>
                ` : ''}
            `;
        }
    },
    
    showLoading() {
        const loading = this.modal?.querySelector('.lightbox-loading');
        if (loading) {
            loading.style.display = 'block';
        }
        
        if (this.image) {
            this.image.style.opacity = '0.5';
        }
    },
    
    hideLoading() {
        const loading = this.modal?.querySelector('.lightbox-loading');
        if (loading) {
            loading.style.display = 'none';
        }
        
        if (this.image) {
            this.image.style.opacity = '1';
        }
    },
    
    showError(message) {
        const errorContainer = this.modal?.querySelector('.lightbox-error') || 
                               this.createErrorContainer();
        
        if (errorContainer) {
            errorContainer.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            `;
            errorContainer.style.display = 'block';
        }
        
        this.hideLoading();
    },
    
    createErrorContainer() {
        const error = Utils.createElement('div', {
            className: 'lightbox-error'
        });
        
        this.modal?.querySelector('.lightbox-content')?.appendChild(error);
        return error;
    },
    
    handleKeyboard(e) {
        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                this.close();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextImage();
                break;
            case ' ':
                e.preventDefault();
                this.nextImage();
                break;
            case 'Home':
                e.preventDefault();
                if (this.currentImages.length > 0) {
                    this.currentIndex = 0;
                    this.displayCurrentImage();
                }
                break;
            case 'End':
                e.preventDefault();
                if (this.currentImages.length > 0) {
                    this.currentIndex = this.currentImages.length - 1;
                    this.displayCurrentImage();
                }
                break;
        }
    },
    
    announceImageChange(imageData) {
        const announcement = `Image ${this.currentIndex + 1} of ${this.currentImages.length}: ${imageData.title}`;
        const liveRegion = this.modal?.querySelector('.lightbox-sr-announcement');
        
        if (liveRegion) {
            liveRegion.textContent = announcement;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    },
    
    refreshGallery() {
        // Reload images when gallery page is shown
        this.loadImages();
        this.createGalleryHTML();
    },
    
    createGalleryHTML() {
        const galleryContainer = Utils.$('#image-gallery');
        if (!galleryContainer || !this.currentImages.length) return;
        
        galleryContainer.innerHTML = this.currentImages.map(image => `
            <div class="gallery-item" data-image-id="${image.id}">
                <img src="${image.thumb || image.src}" 
                     alt="${image.title}" 
                     loading="lazy"
                     data-full-src="${image.src}">
                <div class="gallery-item-info">
                    <h3 class="gallery-item-title">${image.title}</h3>
                    <p class="gallery-item-description">${image.description}</p>
                    <div class="gallery-item-meta">
                        <span><i class="fas fa-calendar"></i> ${image.year}</span>
                        <span><i class="fas fa-palette"></i> ${image.medium || 'Digital'}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // Public API methods
    openImageById(imageId) {
        this.openLightbox(imageId);
    },
    
    getCurrentImage() {
        return this.currentImages[this.currentIndex];
    },
    
    getImageCount() {
        return this.currentImages.length;
    },
    
    isLightboxOpen() {
        return this.isOpen;
    },
    
    destroy() {
        this.close();
        this.currentImages = [];
        this.currentIndex = 0;
        
        // Clear gallery
        const galleryContainer = Utils.$('#image-gallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = '';
        }
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    Lightbox.init();
});

// Export for global access
window.Lightbox = Lightbox;