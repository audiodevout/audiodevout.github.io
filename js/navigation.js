// ===================================================================
// NAVIGATION SYSTEM
// Client-side routing and page transitions
// ===================================================================

const Navigation = {
    currentPage: 'home',
    isTransitioning: false,
    
    init() {
        this.bindEvents();
        this.handleInitialRoute();
        
        Utils.performance.mark('navigation-init');
        console.log('✓ Navigation system initialized');
    },
    
    bindEvents() {
        // Navigation link clicks
        Utils.events.delegate(document, '.nav-link', 'click', (e) => {
            e.preventDefault();
            const targetPage = e.target.getAttribute('href').replace('#', '');
            this.navigateTo(targetPage);
        });
        
        // Logo click
        Utils.events.delegate(document, '.logo-link', 'click', (e) => {
            e.preventDefault();
            this.navigateTo('home');
        });
        
        // Browser back/forward buttons
        Utils.events.on(window, 'popstate', () => {
            this.handleRouteChange();
        });
        
        // Hash change
        Utils.events.on(window, 'hashchange', () => {
            this.handleRouteChange();
        });
        
        // Mobile menu toggle
        const mobileToggle = Utils.$('.nav-mobile-toggle');
        if (mobileToggle) {
            Utils.events.on(mobileToggle, 'click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu on outside click
        Utils.events.on(document, 'click', (e) => {
            if (!e.target.closest('.fixed-nav')) {
                this.closeMobileMenu();
            }
        });
        
        // Escape key closes mobile menu
        Utils.events.on(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    },
    
    handleInitialRoute() {
        const hash = window.location.hash.replace('#', '');
        const initialPage = hash || 'home';
        this.showPage(initialPage, false); // No transition on initial load
    },
    
    handleRouteChange() {
        const hash = window.location.hash.replace('#', '');
        const targetPage = hash || 'home';
        
        if (targetPage !== this.currentPage && !this.isTransitioning) {
            this.showPage(targetPage);
        }
    },
    
    navigateTo(page) {
        if (page === this.currentPage || this.isTransitioning) {
            return;
        }
        
        console.log(`🔄 Navigating to: ${page}`);
        
        // Update URL
        if (page === 'home') {
            window.history.pushState({}, '', window.location.pathname);
        } else {
            window.history.pushState({}, '', `#${page}`);
        }
        
        // Show page
        this.showPage(page);
        
        // Close mobile menu
        this.closeMobileMenu();
        
        // Track navigation
        Utils.analytics.track('page_view', { page: page });
    },
    
    showPage(targetPage, withTransition = true) {
        if (this.isTransitioning) return;
        
        const previousPage = this.currentPage;
        this.currentPage = targetPage;
        
        if (withTransition) {
            this.isTransitioning = true;
            this.showTransition();
            
            setTimeout(() => {
                this.updatePageVisibility(targetPage);
                this.updateNavigation(targetPage);
                this.hideTransition();
                this.isTransitioning = false;
                
                // Emit page change event
                appEvents.emit('pageChange', {
                    from: previousPage,
                    to: targetPage
                });
            }, 300);
        } else {
            this.updatePageVisibility(targetPage);
            this.updateNavigation(targetPage);
        }
        
        // Update document title
        this.updateDocumentTitle(targetPage);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    updatePageVisibility(activePage) {
        // Hide all pages
        const allPages = Utils.$$('.page-section');
        allPages.forEach(page => {
            page.classList.remove('active');
            page.setAttribute('aria-hidden', 'true');
        });
        
        // Show target page - match the actual HTML structure
        const targetPageElement = Utils.$(`#${activePage}`);
        if (targetPageElement) {
            targetPageElement.classList.add('active');
            targetPageElement.setAttribute('aria-hidden', 'false');
            
            // Focus management for accessibility
            const heading = targetPageElement.querySelector('h1, .page-title');
            if (heading) {
                heading.focus();
            }
        }
    },
    
    updateNavigation(activePage) {
        // Update nav link states
        const navLinks = Utils.$$('.nav-link');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', linkPage === activePage);
            link.setAttribute('aria-current', linkPage === activePage ? 'page' : 'false');
        });
    },
    
    updateDocumentTitle(page) {
        const pageTitles = {
            home: 'Experimental Systems',
            audio: 'Audio Works',
            images: 'Image Gallery',
            videos: 'Video Works',
            texts: 'Written Works',
            downloads: 'Downloads',
            about: 'About',
            contact: 'Contact',
            thesis: 'Thesis'
        };
        
        const pageTitle = pageTitles[page] || 'Portfolio';
        const siteTitle = 'Atharva Gupta';
        
        document.title = page === 'home' ? siteTitle : `${pageTitle} - ${siteTitle}`;
    },
    
    showTransition() {
        const transition = Utils.$('#glitch-transition');
        if (transition) {
            transition.classList.add('active');
        }
    },
    
    hideTransition() {
        const transition = Utils.$('#glitch-transition');
        if (transition) {
            transition.classList.remove('active');
        }
    },
    
    toggleMobileMenu() {
        const nav = Utils.$('.fixed-nav');
        const toggle = Utils.$('.nav-mobile-toggle');
        
        if (nav && toggle) {
            const isOpen = nav.classList.contains('mobile-open');
            
            nav.classList.toggle('mobile-open', !isOpen);
            toggle.setAttribute('aria-expanded', !isOpen);
            
            // Prevent body scroll when menu is open
            document.body.classList.toggle('menu-open', !isOpen);
        }
    },
    
    closeMobileMenu() {
        const nav = Utils.$('.fixed-nav');
        const toggle = Utils.$('.nav-mobile-toggle');
        
        if (nav && toggle) {
            nav.classList.remove('mobile-open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    },
    
    getCurrentPage() {
        return this.currentPage;
    },
    
    isCurrentPage(page) {
        return this.currentPage === page;
    },
    
    getPreviousPage() {
        return this.previousPage || 'home';
    },
    
    // Programmatic navigation methods
    goHome() {
        this.navigateTo('home');
    },
    
    goBack() {
        window.history.back();
    },
    
    goForward() {
        window.history.forward();
    },
    
    // Breadcrumb generation
    getBreadcrumbs() {
        const breadcrumbs = [
            { label: 'Home', page: 'home' }
        ];
        
        if (this.currentPage !== 'home') {
            const pageLabels = {
                audio: 'Audio Works',
                images: 'Image Gallery',
                videos: 'Video Works',
                texts: 'Written Works',
                downloads: 'Downloads',
                about: 'About',
                contact: 'Contact',
                thesis: 'Thesis'
            };
            
            breadcrumbs.push({
                label: pageLabels[this.currentPage] || this.currentPage,
                page: this.currentPage
            });
        }
        
        return breadcrumbs;
    },
    
    // Add accessibility announcement
    announcePageChange(fromPage, toPage) {
        const announcement = `Navigated from ${fromPage} to ${toPage} page`;
        const liveRegion = Utils.$('#live-region-polite');
        
        if (liveRegion) {
            liveRegion.textContent = announcement;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    },
    
    destroy() {
        this.currentPage = 'home';
        this.isTransitioning = false;
        this.closeMobileMenu();
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
});

// Export for global access
window.Navigation = Navigation;