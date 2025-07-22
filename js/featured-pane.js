/* ===================================================================
   FEATURED PANE FUNCTIONALITY
   Handles the fixed vertical featured pane and mobile interactions
   =================================================================== */

const FeaturedPane = {
    isInitialized: false,
    isMobileOpen: false,

    init() {
        if (this.isInitialized) return;
        
        this.bindEvents();
        this.setupMobileToggle();
        this.isInitialized = true;
        
        console.log('✓ Featured pane system initialized');
    },

    bindEvents() {
        // Click handlers for featured items
        this.bindFeaturedItemClicks();
        
        // Scroll optimization
        this.optimizeScrolling();
    },

    bindFeaturedItemClicks() {
        const featuredPane = Utils.$('#featured-pane');
        if (!featuredPane) return;

        // Audio items
        featuredPane.addEventListener('click', (e) => {
            const audioItem = e.target.closest('[data-audio-id]');
            if (audioItem) {
                const audioId = audioItem.getAttribute('data-audio-id');
                Navigation.navigateTo('audio');
                // Scroll to specific audio item after navigation
                setTimeout(() => {
                    const targetAudio = Utils.$(`[data-audio-id="${audioId}"]`);
                    if (targetAudio) {
                        targetAudio.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        });

        // Video items
        featuredPane.addEventListener('click', (e) => {
            const videoItem = e.target.closest('[data-video-id]');
            if (videoItem) {
                const videoId = videoItem.getAttribute('data-video-id');
                Navigation.navigateTo('videos');
                setTimeout(() => {
                    const targetVideo = Utils.$(`[data-video-id="${videoId}"]`);
                    if (targetVideo) {
                        targetVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        });

        // Image items
        featuredPane.addEventListener('click', (e) => {
            const imageItem = e.target.closest('[data-image-id]');
            if (imageItem) {
                const imageId = imageItem.getAttribute('data-image-id');
                Navigation.navigateTo('images');
                setTimeout(() => {
                    const targetImage = Utils.$(`[data-image-id="${imageId}"]`);
                    if (targetImage) {
                        targetImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        });
    },

    setupMobileToggle() {
        const toggle = Utils.$('#featured-pane-toggle');
        const pane = Utils.$('#featured-pane');
        
        if (!toggle || !pane) return;

        toggle.addEventListener('click', () => {
            this.toggleMobilePane();
        });

        // Close on outside click (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && 
                this.isMobileOpen && 
                !pane.contains(e.target) && 
                !toggle.contains(e.target)) {
                this.closeMobilePane();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileOpen) {
                this.closeMobilePane();
            }
        });
    },

    toggleMobilePane() {
        const pane = Utils.$('#featured-pane');
        if (!pane) return;

        if (this.isMobileOpen) {
            this.closeMobilePane();
        } else {
            this.openMobilePane();
        }
    },

    openMobilePane() {
        const pane = Utils.$('#featured-pane');
        const toggle = Utils.$('#featured-pane-toggle');
        
        if (!pane || !toggle) return;

        pane.classList.add('mobile-open');
        toggle.setAttribute('aria-expanded', 'true');
        this.isMobileOpen = true;
    },

    closeMobilePane() {
        const pane = Utils.$('#featured-pane');
        const toggle = Utils.$('#featured-pane-toggle');
        
        if (!pane || !toggle) return;

        pane.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
        this.isMobileOpen = false;
    },

    optimizeScrolling() {
        const pane = Utils.$('#featured-pane');
        if (!pane) return;

        // Smooth scrolling for featured pane
        pane.style.scrollBehavior = 'smooth';
    },

    refresh() {
        // Refresh featured content when data changes
        if (typeof PageGenerator !== 'undefined' && PageGenerator.populateFeaturedPane) {
            PageGenerator.populateFeaturedPane();
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    FeaturedPane.init();
});

// Export for global access
window.FeaturedPane = FeaturedPane;