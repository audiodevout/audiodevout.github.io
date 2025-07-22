// ===================================================================
// NAVIGATION SYSTEM
// Hash-based routing and smooth glitch transitions
// ===================================================================

const Navigation = {
    // State
    currentPage: 'home',
    isTransitioning: false,
    
    // Elements
    navLinks: null,
    sections: null,
    glitchOverlay: null,
    
    // Settings
    transitionDuration: 500,

    init() {
        this.cacheElements();
        this.bindEvents();
        this.handleInitialRoute();
        
        Utils.performance.mark('navigation-init');
    },

    cacheElements() {
        this.navLinks = Utils.$$('.nav-link');
        this.sections = Utils.$$('.page-section');
        this.glitchOverlay = this.createGlitchOverlay();
    },

    createGlitchOverlay() {
        const overlay = Utils.createElement('div', {
            className: 'glitch-transition',
            innerHTML: '<div class="glitch-transition-text glitch-text" data-text="LOADING">LOADING</div>'
        });
        document.body.appendChild(overlay);
        return overlay;
    },

    bindEvents() {
        // Navigation link clicks
        this.navLinks.forEach(link => {
            Utils.events.on(link, 'click', (e) => {
                e.preventDefault();
                const targetPage = this.getPageFromHref(link.getAttribute('href'));
                this.navigateTo(targetPage);
            });
        });

        // Browser back/forward
        Utils.events.on(window, 'hashchange', () => {
            this.handleHashChange();
        });

        // Keyboard navigation
        Utils.events.on(document, 'keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Escape key to stop audio
        Utils.events.on(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                this.stopAllAudio();
            }
        });
    },

    getPageFromHref(href) {
        return href ? href.replace('#', '') : 'home';
    },

    handleInitialRoute() {
        const hash = Utils.url.getHash();
        const targetPage = hash || 'home';
        this.showPage(targetPage, false); // No transition on initial load
    },

    handleHashChange() {
        if (this.isTransitioning) return;
        
        const hash = Utils.url.getHash();
        const targetPage = hash || 'home';
        
        if (targetPage !== this.currentPage) {
            this.showPage(targetPage, false); // No glitch transition for browser navigation
        }
    },

    navigateTo(page, withTransition = true) {
        if (this.isTransitioning || page === this.currentPage) return;
        
        // Update URL
        Utils.url.setHash(page);
        
        // Show page with optional transition
        this.showPage(page, withTransition);
    },

    showPage(page, withTransition = true) {
        if (this.isTransitioning) return;
        
        const targetSection = Utils.$(`#${page}`);
        if (!targetSection) {
            console.warn(`Page section #${page} not found`);
            return;
        }

        if (withTransition) {
            this.transitionToPage(page, targetSection);
        } else {
            this.displayPage(page, targetSection);
        }
    },

    transitionToPage(page, targetSection) {
        this.isTransitioning = true;
        
        // Update glitch overlay text
        const overlayText = this.glitchOverlay.querySelector('.glitch-transition-text');
        const pageTitle = this.getPageTitle(page);
        overlayText.textContent = pageTitle;
        overlayText.setAttribute('data-text', pageTitle);
        
        // Show glitch overlay
        this.glitchOverlay.classList.add('active');
        
        // Switch page after half transition
        setTimeout(() => {
            this.displayPage(page, targetSection);
        }, this.transitionDuration / 2);
        
        // Hide overlay and complete transition
        setTimeout(() => {
            this.glitchOverlay.classList.remove('active');
            this.isTransitioning = false;
            
            // Trigger custom event for page change
            Utils.events.trigger(document, 'pageChanged', { page });
            
        }, this.transitionDuration);
    },

    displayPage(page, targetSection) {
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        targetSection.classList.add('active');
        
        // Update navigation state
        this.updateNavState(page);
        
        // Update current page
        this.currentPage = page;
        
        // Update page title
        this.updatePageTitle(page);
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Load page-specific content if needed
        this.loadPageContent(page);
    },

    updateNavState(page) {
        this.navLinks.forEach(link => {
            const linkPage = this.getPageFromHref(link.getAttribute('href'));
            
            if (linkPage === page) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    },

    getPageTitle(page) {
        const titles = {
            'home': 'EXPERIMENTAL SYSTEMS',
            'audio': 'AUDIO WORKS',
            'images': 'VISUAL WORKS',
            'videos': 'VIDEO WORKS',
            'texts': 'TEXTS & WRITING',
            'about': 'ABOUT',
            'contact': 'CONTACT',
            'thesis': 'THESIS'
        };
        
        return titles[page] || page.toUpperCase();
    },

    updatePageTitle(page) {
        const pageTitle = this.getPageTitle(page);
        const siteTitle = portfolioData.siteConfig.title;
        
        if (page === 'home') {
            document.title = `${siteTitle} - ${portfolioData.siteConfig.subtitle}`;
        } else {
            document.title = `${pageTitle} - ${siteTitle}`;
        }
    },

    loadPageContent(page) {
        // Trigger content loading for specific pages
        switch (page) {
            case 'home':
                Utils.events.trigger(document, 'loadFeaturedContent');
                break;
            case 'audio':
                Utils.events.trigger(document, 'loadAudioPlayers');
                break;
            case 'images':
                Utils.events.trigger(document, 'loadImageGallery');
                break;
            case 'videos':
                Utils.events.trigger(document, 'loadVideoGallery');
                break;
            case 'texts':
                Utils.events.trigger(document, 'loadTextsList');
                break;
            case 'about':
                Utils.events.trigger(document, 'loadAboutContent');
                break;
            case 'thesis':
                Utils.events.trigger(document, 'loadThesisContent');
                break;
        }
    },

    handleKeyboardNavigation(e) {
        // Don't interfere with form inputs
        if (e.target.matches('input, textarea, select')) return;
        
        const pages = ['home', 'audio', 'images', 'videos', 'texts', 'about', 'contact', 'thesis'];
        const currentIndex = pages.indexOf(this.currentPage);
        
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
                this.navigateTo(pages[prevIndex]);
                break;
                
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % pages.length;
                this.navigateTo(pages[nextIndex]);
                break;
                
            case 'Home':
                e.preventDefault();
                this.navigateTo('home');
                break;
                
            // Number keys for direct navigation
            case '1':
                e.preventDefault();
                this.navigateTo('home');
                break;
            case '2':
                e.preventDefault();
                this.navigateTo('audio');
                break;
            case '3':
                e.preventDefault();
                this.navigateTo('images');
                break;
            case '4':
                e.preventDefault();
                this.navigateTo('videos');
                break;
            case '5':
                e.preventDefault();
                this.navigateTo('texts');
                break;
            case '6':
                e.preventDefault();
                this.navigateTo('about');
                break;
            case '7':
                e.preventDefault();
                this.navigateTo('contact');
                break;
            case '8':
                e.preventDefault();
                this.navigateTo('thesis');
                break;
        }
    },

    stopAllAudio() {
        // Stop all audio players
        const audioElements = Utils.$$('audio');
        audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        // Remove playing states from audio players
        const audioPlayers = Utils.$$('.audio-player.playing');
        audioPlayers.forEach(player => {
            player.classList.remove('playing');
        });
        
        // Trigger audio stopped event
        Utils.events.trigger(document, 'allAudioStopped');
    },

    // Accessibility helpers
    announcePageChange(page) {
        const announcement = `Navigated to ${this.getPageTitle(page)} page`;
        const liveRegion = Utils.$('#live-region-polite');
        if (liveRegion) {
            liveRegion.textContent = announcement;
        }
    },

    // Get current page info
    getCurrentPage() {
        return this.currentPage;
    },

    // Check if currently transitioning
    isNavigating() {
        return this.isTransitioning;
    },

    // Programmatic navigation methods
    goHome() {
        this.navigateTo('home');
    },

    goToAudio() {
        this.navigateTo('audio');
    },

    goToImages() {
        this.navigateTo('images');
    },

    goToVideos() {
        this.navigateTo('videos');
    },

    goToTexts() {
        this.navigateTo('texts');
    },

    goToAbout() {
        this.navigateTo('about');
    },

    goToContact() {
        this.navigateTo('contact');
    },

    goToThesis() {
        this.navigateTo('thesis');
    },

    // Smooth scroll within page
    scrollToElement(selector, offset = 80) {
        const element = Utils.$(selector);
        if (element) {
            Utils.scrollTo(element, offset);
        }
    },

    // Preload content for better performance
    preloadContent() {
        // Preload critical page content
        const preloadPages = ['about', 'audio'];
        preloadPages.forEach(page => {
            setTimeout(() => {
                this.loadPageContent(page);
            }, 1000);
        });
    },

    destroy() {
        // Remove event listeners
        this.navLinks.forEach(link => {
            Utils.events.off(link, 'click');
        });
        
        Utils.events.off(window, 'hashchange');
        Utils.events.off(document, 'keydown');
        
        // Remove glitch overlay
        if (this.glitchOverlay && this.glitchOverlay.parentNode) {
            this.glitchOverlay.parentNode.removeChild(this.glitchOverlay);
        }
    }
};

// Make Navigation available globally
window.Navigation = Navigation;