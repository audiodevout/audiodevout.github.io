// ===================================================================
// MAIN APPLICATION
// Static Portfolio Site Initialization
// ===================================================================

const PortfolioApp = {
    // Application state
    isInitialized: false,
    startTime: null,
    
    // System modules
    systems: {},

    async init() {
        this.startTime = performance.now();
        Utils.performance.mark('app-init-start');
        
        try {
            // Show loading state
            Utils.loading.show('INITIALIZING EXPERIMENTAL SYSTEMS');
            
            // Initialize core systems
            await this.initializeSystems();
            
            // Load content
            await this.loadInitialContent();
            
            // Setup event listeners
            this.bindGlobalEvents();
            
            // Hide loading and show content
            this.completeInitialization();
            
            Utils.performance.mark('app-init-end');
            Utils.performance.measure('app-initialization', 'app-init-start', 'app-init-end');
            
        } catch (error) {
            Utils.error.log(error, 'App Initialization');
            this.handleInitializationError(error);
        }
    },

    async initializeSystems() {
        const initPromises = [];
        
        // Initialize cursor system (desktop only)
        if (!Utils.isTouchDevice()) {
            initPromises.push(this.initSystem('cursor', CursorSystem));
        }
        
        // Initialize navigation
        initPromises.push(this.initSystem('navigation', Navigation));
        
        // Initialize other systems that might be defined
        if (typeof BackgroundCanvas !== 'undefined') {
            initPromises.push(this.initSystem('canvas', BackgroundCanvas));
        }
        
        if (typeof FloatingText !== 'undefined') {
            initPromises.push(this.initSystem('floatingText', FloatingText));
        }
        
        if (typeof SearchSystem !== 'undefined') {
            initPromises.push(this.initSystem('search', SearchSystem));
        }
        
        if (typeof AudioPlayerSystem !== 'undefined') {
            initPromises.push(this.initSystem('audioPlayer', AudioPlayerSystem));
        }
        
        if (typeof LightboxSystem !== 'undefined') {
            initPromises.push(this.initSystem('lightbox', LightboxSystem));
        }
        
        // Wait for all systems to initialize
        await Promise.all(initPromises);
    },

    async initSystem(name, system) {
        try {
            if (system && typeof system.init === 'function') {
                await system.init();
                this.systems[name] = system;
                console.log(`✓ ${name} system initialized`);
            }
        } catch (error) {
            console.warn(`Failed to initialize ${name} system:`, error);
        }
    },

    async loadInitialContent() {
        // Validate portfolio data
        const errors = portfolioData.validate();
        if (errors.length > 0) {
            console.warn('Portfolio data validation errors:', errors);
        }
        
        // Load featured content for home page
        this.loadFeaturedContent();
        
        // Preload critical content
        await this.preloadCriticalContent();
    },

    loadFeaturedContent() {
        // Load featured audio
        const featuredAudio = portfolioData.getFeaturedAudio();
        this.populateFeaturedSection('featured-audio', featuredAudio, 'audio');
        
        // Load featured images
        const featuredImages = portfolioData.getFeaturedImages();
        this.populateFeaturedSection('featured-images', featuredImages, 'images');
        
        // Load featured texts
        const featuredTexts = portfolioData.getFeaturedTexts();
        this.populateFeaturedSection('featured-texts', featuredTexts, 'texts');
    },

    populateFeaturedSection(containerId, items, type) {
        const container = Utils.$(`#${containerId}`);
        if (!container || !items.length) return;
        
        container.innerHTML = '';
        
        items.slice(0, 3).forEach(item => {
            const element = this.createFeaturedItem(item, type);
            container.appendChild(element);
        });
    },

    createFeaturedItem(item, type) {
        const element = Utils.createElement('div', {
            className: 'featured-preview',
            'data-type': type,
            'data-id': item.id
        });
        
        switch (type) {
            case 'audio':
                element.innerHTML = `
                    <div class="featured-preview-header">
                        <h4>${Utils.sanitizeHTML(item.title)}</h4>
                        <span class="featured-preview-meta">${Utils.formatTime(item.duration)}</span>
                    </div>
                    <p class="featured-preview-description">${Utils.sanitizeHTML(item.description)}</p>
                `;
                break;
                
            case 'images':
                const firstImage = item.images[0];
                element.innerHTML = `
                    <div class="featured-preview-header">
                        <h4>${Utils.sanitizeHTML(item.title)}</h4>
                        <span class="featured-preview-meta">${item.images.length} images</span>
                    </div>
                    <p class="featured-preview-description">${Utils.sanitizeHTML(item.description)}</p>
                `;
                break;
                
            case 'texts':
                element.innerHTML = `
                    <div class="featured-preview-header">
                        <h4>${Utils.sanitizeHTML(item.title)}</h4>
                        <span class="featured-preview-meta">${item.category}</span>
                    </div>
                    <p class="featured-preview-description">${Utils.sanitizeHTML(item.description)}</p>
                `;
                break;
        }
        
        // Add click handler to navigate to appropriate section
        Utils.events.on(element, 'click', () => {
            Navigation.navigateTo(type);
        });
        
        return element;
    },

    async preloadCriticalContent() {
        // Preload about content if it's in a separate file
        if (portfolioData.contact) {
            this.loadAboutContent();
        }
        
        // Preload first few audio files metadata
        const audioWorks = portfolioData.audioWorks.slice(0, 3);
        audioWorks.forEach(work => {
            // Create audio element to preload metadata
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.src = work.file;
        });
    },

    loadAboutContent() {
        const aboutContainer = Utils.$('#about-content');
        if (!aboutContainer) return;
        
        // Simple about content based on portfolio data
        aboutContainer.innerHTML = `
  <div class="about-text">
    <p>${portfolioData.siteConfig.description}</p>
    
    <h3>Current Work</h3>
    <p>
      Currently pursuing advanced studies in experimental media at the Frank Mohr Institute, 
      where I investigate the aesthetic and political dimensions of surveillance, 
      experimental sound, and kinetic sculpture through practice-based research. 
      My projects span immersive installations, performance, and interactive systems 
      that blend physical and digital technologies.
    </p>
    
    <h3>Approach</h3>
    <p>
      My practice centers on creating experimental systems that reveal the hidden 
      infrastructures of digital culture. Through kinetic installations, sound compositions, 
      interactive audiovisual works, and generative media built with TouchDesigner and Ableton, 
      I explore how technology shapes perception, embodiment, and social relations.
    </p>
    
    <h3>Workshops & Community</h3>
    <p>
      I also lead workshops and share knowledge on creative coding, interactive media, and 
      sound design, fostering communities around experimental digital arts and new media tools.
    </p>
    
    <h3>Interests</h3>
    <ul>
      ${portfolioData.contact.interests.map(interest => 
          `<li>${Utils.sanitizeHTML(interest)}</li>`
      ).join('')}
    </ul>
  </div>
`;


    bindGlobalEvents() {
        // Custom event listeners for content loading
        Utils.events.on(document, 'loadFeaturedContent', () => {
            this.loadFeaturedContent();
        });
        
        Utils.events.on(document, 'loadAboutContent', () => {
            this.loadAboutContent();
        });
        
        // Handle form submissions
        Utils.events.on(document, 'submit', (e) => {
            if (e.target.id === 'contact-form') {
                this.handleContactForm(e);
            }
        });
        
        // Handle page visibility changes
        Utils.events.on(document, 'visibilitychange', () => {
            if (document.hidden) {
                // Pause any audio when page is hidden
                Navigation.stopAllAudio();
            }
        });
        
        // Handle window resize
        Utils.events.on(window, 'resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Handle scroll for performance optimizations
        Utils.events.on(window, 'scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 16));
        
        // Global keyboard shortcuts
        Utils.events.on(document, 'keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });
        
        // Handle page change events
        Utils.events.on(document, 'pageChanged', (e) => {
            this.handlePageChange(e.detail.page);
        });
    },

    handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!Utils.validate.email(data.email)) {
            Utils.error.show('Please enter a valid email address');
            return;
        }
        
        if (!Utils.validate.notEmpty(data.message)) {
            Utils.error.show('Please enter a message');
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'SENDING...';
        submitButton.disabled = true;
        
        // Since this is a static site, we'll just show success message
        // In production, this would submit to Formspree or similar service
        setTimeout(() => {
            submitButton.textContent = 'MESSAGE SENT';
            form.reset();
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        }, 1000);
    },

    handleResize() {
        // Notify systems about resize
        Object.values(this.systems).forEach(system => {
            if (system.handleResize) {
                system.handleResize();
            }
        });
    },

    handleScroll() {
        // Implement scroll-based optimizations
        const scrollY = window.scrollY;
        
        // Update scroll position for systems that need it
        Object.values(this.systems).forEach(system => {
            if (system.handleScroll) {
                system.handleScroll(scrollY);
            }
        });
    },

    handleGlobalKeyboard(e) {
        // Global keyboard shortcuts
        switch (e.key) {
            case 'F11':
                // Allow fullscreen
                break;
                
            case 'F5':
                // Allow refresh
                break;
                
            case 'F12':
                // Allow dev tools in development
                if (location.hostname !== 'localhost') {
                    e.preventDefault();
                }
                break;
                
            default:
                // Other keys handled by individual systems
                break;
        }
    },

    handlePageChange(page) {
        // Update analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_TRACKING_ID', {
                page_title: Navigation.getPageTitle(page),
                page_location: window.location.href
            });
        }
        
        // Update any page-specific optimizations
        this.optimizeForPage(page);
    },

    optimizeForPage(page) {
        // Page-specific optimizations
        switch (page) {
            case 'audio':
                // Preload audio metadata
                this.preloadAudioMetadata();
                break;
                
            case 'images':
                // Lazy load images
                this.setupLazyLoading();
                break;
        }
    },

    preloadAudioMetadata() {
        portfolioData.audioWorks.slice(0, 5).forEach(work => {
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.src = work.file;
        });
    },

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = Utils.$$('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    },

    completeInitialization() {
        // Hide loading screen
        setTimeout(() => {
            Utils.loading.hide();
            this.isInitialized = true;
            
            // Trigger initialized event
            Utils.events.trigger(document, 'appInitialized');
            
            const initTime = performance.now() - this.startTime;
            console.log(`✓ Portfolio app initialized in ${Math.round(initTime)}ms`);
            
        }, 500); // Small delay for smooth transition
    },

    handleInitializationError(error) {
        console.error('Failed to initialize portfolio app:', error);
        
        // Show error message
        Utils.error.show('Failed to load portfolio. Please refresh the page.');
        
        // Hide loading screen
        Utils.loading.hide();
    },

    // Public API methods
    getSystem(name) {
        return this.systems[name];
    },

    isReady() {
        return this.isInitialized;
    },

    destroy() {
        // Destroy all systems
        Object.values(this.systems).forEach(system => {
            if (system.destroy) {
                system.destroy();
            }
        });
        
        this.systems = {};
        this.isInitialized = false;
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    Utils.events.on(document, 'DOMContentLoaded', () => {
        PortfolioApp.init();
    });
} else {
    PortfolioApp.init();
}

// Make PortfolioApp available globally
window.PortfolioApp = PortfolioApp;
