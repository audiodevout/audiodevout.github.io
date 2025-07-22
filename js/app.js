// ===================================================================
// MAIN APPLICATION CONTROLLER
// Initializes and coordinates all portfolio site systems
// ===================================================================

const PortfolioApp = {
    // Application state
    isInitialized: false,
    currentPage: 'home',
    isLoading: false,

    // System references
    systems: {},

    // Initialization sequence
    async init() {
        Utils.performance.mark('app-init-start');

        try {
            console.log('🚀 Initializing Atharva Gupta Portfolio...');

            // Show loading state
            this.showLoading('Initializing systems...');

            // Initialize core systems in parallel
            await this.initializeSystems();

            // Set up page routing
            this.initializeRouting();

            // Set up global event handlers
            this.bindGlobalEvents();

            // Initialize UI components
            this.initializeUI();

            // Load initial page
            this.loadInitialPage();

            // Hide loading state (initial transition will handle the overlay)
            this.hideLoading();

            this.isInitialized = true;
            Utils.performance.mark('app-init-end');

            console.log('✅ Portfolio application initialized successfully');

            // Emit ready event
            appEvents.emit('appReady');

        } catch (error) {
            Utils.error.log(error, 'app-init');
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    },

    async initializeSystems() {
        console.log('🔧 Initializing core systems...');

        // Initialize systems that don't depend on DOM content
        const systemPromises = [];

        // Background systems disabled for clean sakura theme
        console.log('✓ Clean sakura theme - canvas and floating text disabled');
        
        // Only keep essential background systems

        if (typeof CursorSystem !== 'undefined') {
            systemPromises.push(Promise.resolve(CursorSystem.init()));
            this.systems.cursor = CursorSystem;
        }

        // Wait for all background systems
        await Promise.all(systemPromises);

        // Initialize content-dependent systems
        await this.initializeContentSystems();
    },

    async initializeContentSystems() {
        // Initialize systems that depend on page content
        const contentSystems = [];

        // Audio system
        if (typeof AudioPlayer !== 'undefined') {
            contentSystems.push(AudioPlayer.init());
            this.systems.audio = AudioPlayer;
        }

        // Lightbox system
        if (typeof Lightbox !== 'undefined') {
            contentSystems.push(Lightbox.init());
            this.systems.lightbox = Lightbox;
        }

        // Navigation system
        if (typeof Navigation !== 'undefined') {
            contentSystems.push(Navigation.init());
            this.systems.navigation = Navigation;
        }

        await Promise.all(contentSystems);
    },

    initializeRouting() {
        // Handle hash changes for client-side routing
        Utils.events.on(window, 'hashchange', () => {
            this.handleRouteChange();
        });

        // Handle back/forward buttons
        Utils.events.on(window, 'popstate', () => {
            this.handleRouteChange();
        });
    },

    bindGlobalEvents() {
        // Window focus/blur for performance optimization
        Utils.events.on(window, 'blur', () => {
            this.pauseNonEssentialSystems();
        });

        Utils.events.on(window, 'focus', () => {
            this.resumeNonEssentialSystems();
        });

        // Keyboard shortcuts
        Utils.events.on(document, 'keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });

        // Error handling
        Utils.events.on(window, 'error', (e) => {
            Utils.error.log(e.error, 'global-error');
        });

        Utils.events.on(window, 'unhandledrejection', (e) => {
            Utils.error.log(e.reason, 'unhandled-promise');
        });

        // App events
        appEvents.on('pageChange', (data) => {
            this.handlePageChange(data);
        });

        appEvents.on('systemError', (data) => {
            this.handleSystemError(data);
        });
    },

    initializeUI() {
        // Initialize dynamic title rotation
        this.initializeTitleRotation();

        // Initialize theme system
        this.initializeTheme();

        // Initialize responsive behavior
        this.initializeResponsive();

        // Initialize accessibility features
        this.initializeAccessibility();
    },

    initializeTitleRotation() {
        const titleElement = Utils.$('title');
        if (!titleElement || typeof portfolioData === 'undefined') return;

        const titles = portfolioData.site?.titles || ['ATHARVA GUPTA'];
        let currentIndex = 0;

        const rotateTitles = () => {
            if (titles.length > 1) {
                currentIndex = (currentIndex + 1) % titles.length;
                titleElement.textContent = titles[currentIndex];
            }
        };

        // Rotate every 5 seconds
        setInterval(rotateTitles, 5000);
    },

    initializeTheme() {
        // Handle system theme changes
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeQuery.addEventListener('change', () => {
            // Portfolio is always dark theme, but we can adjust intensity
            this.adjustThemeIntensity();
        });

        // Handle high contrast mode
        const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
        highContrastQuery.addEventListener('change', () => {
            document.body.classList.toggle('high-contrast', highContrastQuery.matches);
        });
    },

    initializeResponsive() {
        // Handle viewport changes
        const handleViewportChange = Utils.debounce(() => {
            const viewport = Utils.getViewportSize();

            // Update systems with new viewport info
            appEvents.emit('viewportChange', viewport);

            // Adjust particle systems for mobile
            if (viewport.width < 768) {
                this.optimizeForMobile();
            } else {
                this.optimizeForDesktop();
            }
        }, 250);

        Utils.events.on(window, 'resize', handleViewportChange);
        Utils.events.on(window, 'orientationchange', handleViewportChange);

        // Initial check
        handleViewportChange();
    },

    initializeAccessibility() {
        // Skip links functionality
        const skipLinks = Utils.$$('.skip-link');
        skipLinks.forEach(link => {
            Utils.events.on(link, 'click', (e) => {
                e.preventDefault();
                const target = Utils.$(link.getAttribute('href'));
                if (target) {
                    target.focus();
                    Utils.scrollTo(target);
                }
            });
        });

        // Reduced motion handling
        if (Utils.prefersReducedMotion()) {
            document.body.classList.add('reduced-motion');
            this.pauseAnimations();
        }

        // High contrast handling
        const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
        if (highContrastQuery.matches) {
            document.body.classList.add('high-contrast');
        }
    },

    loadInitialPage() {
        const hash = Utils.url.getHash();
        this.currentPage = hash || 'home';
        
        // Ensure home page is visible immediately
        const homePage = Utils.$('#home');
        if (homePage && this.currentPage === 'home') {
            homePage.classList.add('active');
        }
        
        this.showPage(this.currentPage);
    },

    handleRouteChange() {
        const newPage = Utils.url.getHash() || 'home';
        if (newPage !== this.currentPage) {
            this.navigateToPage(newPage);
        }
    },

    navigateToPage(page) {
        if (this.isLoading) return;

        console.log(`🔄 Navigating to: ${page}`);

        // Show transition effect
        this.showPageTransition();

        // Update current page
        const oldPage = this.currentPage;
        this.currentPage = page;

        // Show new page
        setTimeout(() => {
            this.showPage(page);
            this.hidePageTransition();

            // Emit page change event
            appEvents.emit('pageChange', { from: oldPage, to: page });

            // Track page view
            Utils.analytics.page(`/${page}`);
        }, 300);
    },

    showPage(page) {
        // Hide all pages
        const allPages = Utils.$$('.page-section');
        allPages.forEach(pageEl => {
            pageEl.classList.remove('active');
        });

        // Show requested page - match actual HTML structure
        const targetPage = Utils.$(`#${page}`) || Utils.$('#home');
        if (targetPage) {
            targetPage.classList.add('active');

            // Initialize page-specific components
            this.initializePageComponents(page);

            // Update navigation
            this.updateNavigation(page);
        }
    },

    initializePageComponents(page) {
        switch (page) {
            case 'audio':
                if (this.systems.audio) {
                    this.systems.audio.refreshPlayers();
                }
                break;
            case 'images':
                if (this.systems.lightbox) {
                    this.systems.lightbox.refreshGallery();
                }
                break;
            case 'contact':
                // Contact form removed
                break;
        }
    },

    initializeContactForm() {
        const form = Utils.$('#contact-form');
        if (form) {
            Utils.events.on(form, 'submit', this.handleContactSubmit.bind(this));
        }
    },

    async handleContactSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!this.validateContactForm(data)) {
            return;
        }

        try {
            this.showLoading('Sending message...');

            // Send via Formspree or similar service
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showSuccess('Message sent successfully!');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }

        } catch (error) {
            Utils.error.log(error, 'contact-form');
            Utils.error.show('Failed to send message. Please try again.');
        } finally {
            this.hideLoading();
        }
    },

    validateContactForm(data) {
        // Basic validation
        if (!data.name?.trim()) {
            Utils.error.show('Please enter your name');
            return false;
        }

        if (!data.email?.trim() || !Utils.isValidEmail(data.email)) {
            Utils.error.show('Please enter a valid email address');
            return false;
        }

        if (!data.message?.trim()) {
            Utils.error.show('Please enter a message');
            return false;
        }

        return true;
    },

    updateNavigation(activePage) {
        const navLinks = Utils.$$('.nav-link');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href')?.replace('#', '') || 'home';
            link.classList.toggle('active', linkPage === activePage);
            link.setAttribute('aria-current', linkPage === activePage ? 'page' : 'false');
        });
    },

    showInitialTransition() {
        // Skip initial transition to reduce loading time
        return;
    },

    showPageTransition() {
        const transition = Utils.$('#glitch-transition');
        if (transition) {
            transition.classList.add('active');
        }
    },

    hidePageTransition() {
        const transition = Utils.$('#glitch-transition');
        if (transition) {
            transition.classList.remove('active');
        }
    },

    showLoading(message = 'Loading...') {
        this.isLoading = true;
        Utils.loading.show(message);
    },

    hideLoading() {
        this.isLoading = false;
        Utils.loading.hide();
    },

    showSuccess(message) {
        // Create success notification (similar to error but green)
        const notification = Utils.createElement('div', {
            className: 'success-notification',
            innerHTML: `
                <i class="fas fa-check-circle"></i>
                <span>${Utils.sanitizeHTML(message)}</span>
                <button class="close-btn" aria-label="Close">&times;</button>
            `
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        const closeBtn = notification.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            });
        }
    },

    showError(message) {
        Utils.error.show(message);
    },

    handlePageChange(data) {
        console.log(`📄 Page changed: ${data.from} → ${data.to}`);

        // Update document title
        this.updateDocumentTitle(data.to);

        // Analytics tracking
        Utils.analytics.track('page_view', {
            page: data.to,
            previous_page: data.from
        });
    },

    updateDocumentTitle(page) {
        const pageMap = {
            home: 'Home',
            audio: 'Audio Works',
            images: 'Visual Documentation',
            videos: 'Video Works',
            texts: 'Written Works',
            downloads: 'Downloads',
            about: 'About',
            contact: 'Contact',
            thesis: 'Thesis'
        };

        const pageTitle = pageMap[page] || 'Portfolio';
        const siteTitle = portfolioData?.site?.title || 'Atharva Gupta';

        document.title = `${pageTitle} - ${siteTitle}`;
    },

    handleSystemError(data) {
        console.error('System error:', data);
        Utils.error.log(data.error, data.system);
    },

    handleGlobalKeyboard(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'h':
                    e.preventDefault();
                    this.navigateToPage('home');
                    break;
                case 'k':
                    e.preventDefault();
                    // TODO: Implement search/command palette
                    break;
            }
        }

        // Escape key handling
        if (e.key === 'Escape') {
            // Close any open modals/overlays
            appEvents.emit('escapePressed');
        }
    },

    optimizeForMobile() {
        document.body.classList.add('mobile-optimized');

        // Reduce particle counts
        if (this.systems.canvas) {
            this.systems.canvas.maxParticles = 20;
        }

        if (this.systems.floatingText) {
            this.systems.floatingText.setMaxItems(8);
        }
    },

    optimizeForDesktop() {
        document.body.classList.remove('mobile-optimized');

        // Restore full particle counts
        if (this.systems.canvas) {
            this.systems.canvas.maxParticles = 50;
        }

        if (this.systems.floatingText) {
            this.systems.floatingText.setMaxItems(15);
        }
    },

    pauseNonEssentialSystems() {
        console.log('⏸️ Pausing non-essential systems...');

        if (this.systems.canvas) {
            this.systems.canvas.pause();
        }

        if (this.systems.floatingText) {
            this.systems.floatingText.pause();
        }
    },

    resumeNonEssentialSystems() {
        console.log('▶️ Resuming systems...');

        if (this.systems.canvas) {
            this.systems.canvas.resume();
        }

        if (this.systems.floatingText) {
            this.systems.floatingText.resume();
        }
    },

    pauseAnimations() {
        document.body.classList.add('animations-paused');

        Object.values(this.systems).forEach(system => {
            if (system.pause) {
                system.pause();
            }
        });
    },

    resumeAnimations() {
        document.body.classList.remove('animations-paused');

        Object.values(this.systems).forEach(system => {
            if (system.resume) {
                system.resume();
            }
        });
    },

    adjustThemeIntensity() {
        // Adjust theme based on system preferences
        const isDark = Utils.prefersDarkMode();
        document.body.classList.toggle('system-dark', isDark);
    },

    getSystemStatus() {
        return {
            initialized: this.isInitialized,
            currentPage: this.currentPage,
            loading: this.isLoading,
            systems: Object.keys(this.systems).reduce((status, key) => {
                status[key] = this.systems[key].isActive || true;
                return status;
            }, {})
        };
    },

    restart() {
        console.log('🔄 Restarting application...');

        // Cleanup existing systems
        Object.values(this.systems).forEach(system => {
            if (system.destroy) {
                system.destroy();
            }
        });

        // Reset state
        this.isInitialized = false;
        this.systems = {};

        // Reinitialize
        this.init();
    },

    destroy() {
        console.log('🔚 Destroying application...');

        // Cleanup all systems
        Object.values(this.systems).forEach(system => {
            if (system.destroy) {
                system.destroy();
            }
        });

        // Reset state
        this.isInitialized = false;
        this.systems = {};
        this.currentPage = 'home';
        this.isLoading = false;
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PortfolioApp.init();
});

// Make globally available for debugging
window.PortfolioApp = PortfolioApp;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}