/* main.js - Core Portfolio Application Logic
 * 
 * PURPOSE: Parses portfolioData.js and dynamically renders all page content
 * 
 * EDITABLE PARAMETERS:
 * - Page segments mapping (line 160): Controls mandala complexity per page
 * - Animation timing (line 100): Scroll and transition speeds
 * - Mobile breakpoint (line 480): Responsive behavior threshold
 * 
 * STRUCTURE:
 * - Setup: DOM caching and system initialization
 * - Rendering: Dynamic content injection from portfolioData
 * - Events: Navigation, scroll tracking, modal handling
 */
class PortfolioApp {
  constructor() {
    this.currentPage = 'home';
    this.scrollProgress = 0;
    this.mandalaGenerator = null;
    this.particleSystem = null;
    this.cursorTrail = null;
    
    // Validate portfolioData exists with fallback
    this.data = window.portfolioData || this.getDefaultData();
    if (!window.portfolioData) {
      console.warn('portfolioData.js not loaded. Using fallback data.');
    }
    
    this.elements = {}; // Cache DOM elements
    this.eventListeners = []; // Track event listeners for cleanup
    this.isMobile = this.detectMobile();
    this.init();
  }
  
  /**
   * Detect mobile devices for performance optimization
   */
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  /**
   * Provide fallback data structure if portfolioData.js fails to load
   */
  getDefaultData() {
    return {
      projects: {
        soundInstallations: [],
        performance: [],
        generativeAV: [],
        interactive: [],
        drawings: [],
        writing: []
      },
      pageContent: {
        home: {
          title: "Experimental Systems",
          subtitle: "Portfolio temporarily unavailable. Please refresh the page.",
          description: "Loading content..."
        }
      },
      socialLinks: []
    };
  }

  init() {
    this.cacheElements();
    this.setupBackgroundSystems();
    this.setupNavigation();
    this.setupScrollTracking();
    this.renderCurrentPage();
    this.setupModal();
  }

  cacheElements() {
    this.elements = {
      mainContent: document.getElementById('mainContent'),
      mandalaCanvas: document.getElementById('mandalaCanvas'),
      particleCanvas: document.getElementById('particleCanvas'),
      projectModal: document.getElementById('projectModal'),
      modalBody: document.getElementById('modalBody'),
      modalClose: document.getElementById('modalClose'),
      navLinks: document.getElementById('navLinks'),
      mobileToggle: document.getElementById('mobileMenuToggle'),
      cursorCrosshair: document.getElementById('cursorCrosshair'),
      cursorTrail: document.getElementById('cursorTrail')
    };
    
    // Validate critical elements exist
    const criticalElements = ['mainContent', 'mandalaCanvas', 'particleCanvas'];
    for (const elementKey of criticalElements) {
      if (!this.elements[elementKey]) {
        console.error(`Critical element missing: ${elementKey}`);
        throw new Error(`Required DOM element #${elementKey} not found`);
      }
    }
  }

  setupBackgroundSystems() {
    try {
      // Initialize particle system with mobile optimization
      if (this.elements.particleCanvas) {
        this.particleSystem = new ParticleSystem(this.elements.particleCanvas, {
          maxParticles: this.isMobile ? 75 : 150, // Reduce particles on mobile
          enableConnections: !this.isMobile // Disable connections on mobile for performance
        });
        this.particleSystem.start();
      }

      // Initialize mandala generator
      if (this.elements.mandalaCanvas) {
        this.mandalaGenerator = new MandalaGenerator(this.elements.mandalaCanvas);
        this.mandalaGenerator.updateSize();
        this.mandalaGenerator.startAnimation();
      }

      // Initialize cursor trail (skip on touch devices)
      if (!this.isMobile && this.elements.cursorCrosshair && this.elements.cursorTrail) {
        this.cursorTrail = new CursorTrail();
      }

      // Handle window resize with debouncing
      let resizeTimeout;
      const resizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.mandalaGenerator?.updateSize();
          this.particleSystem?.updateSize();
        }, 250);
      };
      window.addEventListener('resize', resizeHandler);
      this.eventListeners.push({ element: window, event: 'resize', handler: resizeHandler });
      
    } catch (error) {
      console.error('Error initializing background systems:', error);
      // Continue without background effects if they fail
    }
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const clickHandler = (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.navigateToPage(page);
        
        // Close mobile menu if open
        this.elements.navLinks.classList.remove('active');
      };
      link.addEventListener('click', clickHandler);
      this.eventListeners.push({ element: link, event: 'click', handler: clickHandler });
    });

    // Mobile menu toggle
    const toggleHandler = () => {
      this.elements.navLinks.classList.toggle('active');
    };
    this.elements.mobileToggle.addEventListener('click', toggleHandler);
    this.eventListeners.push({ element: this.elements.mobileToggle, event: 'click', handler: toggleHandler });

    // Handle browser back/forward
    const popstateHandler = (e) => {
      const page = e.state?.page || 'home';
      this.navigateToPage(page, false);
    };
    window.addEventListener('popstate', popstateHandler);
    this.eventListeners.push({ element: window, event: 'popstate', handler: popstateHandler });
  }

  setupScrollTracking() {
    let ticking = false;
    
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    this.eventListeners.push({ element: window, event: 'scroll', handler: scrollHandler });
  }

  updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = Math.min(scrollTop / Math.max(docHeight, 1), 1);
    
    // Update mandala based on scroll
    if (this.mandalaGenerator) {
      this.mandalaGenerator.setScrollProgress(this.scrollProgress);
    }
  }

  navigateToPage(page, updateHistory = true) {
    if (page === this.currentPage) return;

    // Update navigation state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });

    // Update page
    this.currentPage = page;
    this.renderCurrentPage();

    // Update mandala canvas class for page-specific styling
    this.elements.mandalaCanvas.className = `mandala-canvas ${page}`;

    // Update mandala segments based on page
    if (this.mandalaGenerator) {
      const pageSegments = this.getPageSegments(page);
      this.mandalaGenerator.setSegments(pageSegments);
    }

    // Update browser history
    if (updateHistory) {
      history.pushState({ page }, '', `#${page}`);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageSegments(page) {
    const segmentMap = {
      'home': 8,
      'sound-installations': 6,
      'performance': 10,
      'generative-av': 12,
      'interactive': 8,
      'drawings': 7,
      'writing': 9,
      'contact': 16
    };
    return segmentMap[page] || 8;
  }

  renderCurrentPage() {
    const mainContent = this.elements.mainContent;
    
    switch (this.currentPage) {
      case 'home':
        mainContent.innerHTML = this.renderHomePage();
        break;
      case 'sound-installations':
        mainContent.innerHTML = this.renderSoundInstallationsPage();
        break;
      case 'performance':
        mainContent.innerHTML = this.renderPerformancePage();
        break;
      case 'generative-av':
        mainContent.innerHTML = this.renderGenerativeAVPage();
        break;
      case 'interactive':
        mainContent.innerHTML = this.renderInteractivePage();
        break;
      case 'drawings':
        mainContent.innerHTML = this.renderDrawingsPage();
        break;
      case 'writing':
        mainContent.innerHTML = this.renderWritingPage();
        break;
      case 'contact':
        mainContent.innerHTML = this.renderContactPage();
        break;
      default:
        mainContent.innerHTML = this.renderHomePage();
    }

    // Bind project card events
    this.bindProjectCardEvents();
  }

  renderHomePage() {
    return `
      <section class="page-section active">
        <div class="home-container">
          <h1 class="tri-phase-title">
            <span class="title-line">EXPERIMENTAL</span>
            <span class="title-line">SYSTEMS</span>
            <span class="title-line">BY</span>
            <span class="title-line">ATHARVA GUPTA</span>
          </h1>
        </div>
      </section>
    `;
  }

  renderSoundInstallationsPage() {
    const projects = this.data.projects.soundInstallations;
    
    return `
      <section class="page-section active">
        <div class="page-content">
          <div class="page-header">
            <h2 class="page-title" style="color: var(--saffron);">SOUND INSTALLATIONS</h2>
          </div>
          
          <div class="project-grid">
            ${projects.map(project => this.renderProjectCard(project)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderPerformancePage() {
    const projects = this.data.projects.performance;
    
    return `
      <section class="page-section active">
        <div class="page-content">
          <div class="page-header">
            <h2 class="page-title" style="color: var(--cerulean);">PERFORMANCE</h2>
          </div>
          
          <div class="project-grid">
            ${projects.map(project => this.renderProjectCard(project)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderGenerativeAVPage() {
    const projects = this.data.projects.generativeAV;
    
    return `
      <section class="page-section active">
        <div class="page-content">
          <div class="page-header">
            <h2 class="page-title" style="color: var(--neon-magenta);">GENERATIVE AUDIOVISUAL</h2>
          </div>
          
          <div class="project-grid">
            ${projects.map(project => this.renderProjectCard(project)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderInteractivePage() {
    const projects = this.data.projects.interactive;
    
    return `
      <section class="page-section active">
        <div class="page-content">
          <div class="page-header">
            <h2 class="page-title" style="color: var(--electric-lime);">INTERACTIVE INSTALLATIONS</h2>
          </div>
          
          <div class="project-grid">
            ${projects.map(project => this.renderProjectCard(project)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderDrawingsPage() {
    const project = this.data.projects.drawings[0];
    
    return `
      <section class="page-section active">
        <div class="page-content">
          <div class="page-header">
            <h2 class="page-title" style="color: var(--saffron);">DRAWINGS / SKETCH</h2>
          </div>
          
          <div class="project-grid">
            ${this.renderProjectCard(project)}
          </div>
        </div>
      </section>
    `;
  }

  renderWritingPage() {
    const projects = this.data.projects.writing;
    
    return `
      <section class="page-section active">
        <div class="page-content">
          <div class="page-header">
            <h2 class="page-title" style="color: var(--cerulean);">WRITING / THEORY</h2>
          </div>
          
          <div class="project-grid">
            ${projects.map(project => this.renderProjectCard(project)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderContactPage() {
    const contact = this.data.contact;
    
    return `
      <section class="page-section active">
        <div class="page-content">
          <div class="page-header">
            <h2 class="page-title" style="color: var(--electric-lime);">CONTACT / SOCIAL</h2>
          </div>
          
          <div class="social-grid">
            ${contact.social.map(platform => this.renderSocialLink(platform)).join('')}
          </div>
          
          <div class="glass-panel" style="margin-top: 3rem; padding: 3rem; text-align: center; max-width: 600px; margin-left: auto; margin-right: auto;">
            <p style="font-size: 1.1rem; line-height: 1.8; opacity: 0.9;">
              ${contact.description}
            </p>
          </div>
        </div>
      </section>
    `;
  }

  renderProjectCard(project) {
    return `
      <div class="project-card ${project.color}" data-project-id="${project.id}">
        <h3 class="project-title">${project.title}</h3>
        <div class="project-category mono" style="color: var(--${project.color});">${project.category}</div>
        <p class="project-description">${project.description}</p>
        ${project.medium ? `<div class="mono" style="font-size: 0.8rem; opacity: 0.7; margin-top: 1rem;">${project.medium}</div>` : ''}
      </div>
    `;
  }

  renderSocialLink(platform) {
    return `
      <a href="${platform.url}" target="_blank" rel="noopener noreferrer" class="social-link">
        <div class="social-icon" style="color: var(--${platform.color});">
          ${this.getSocialIcon(platform.icon)}
        </div>
        <div class="social-name">${platform.name.toUpperCase()}</div>
      </a>
    `;
  }

  getSocialIcon(type) {
    const icons = {
      youtube: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>',
      instagram: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
      bandcamp: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M0 12.36l5.14-8.72h13.72L24 12.36l-5.14 8.72H5.14L0 12.36z"/></svg>',
      patreon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M0 .48v23.04h4.22V.48zm15.385 0c-4.764 0-8.641 3.88-8.641 8.65 0 4.755 3.877 8.623 8.641 8.623 4.75 0 8.615-3.868 8.615-8.623C24 4.36 20.136.48 15.385.48z"/></svg>',
      linkedin: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
    };
    return icons[type] || '<div style="width: 100%; height: 100%; background: currentColor; border-radius: 4px;"></div>';
  }

  bindProjectCardEvents() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const projectId = card.dataset.projectId;
        this.openProjectModal(projectId);
      });
    });
  }

  openProjectModal(projectId) {
    // Find project data
    let project = null;
    for (const category of Object.values(this.data.projects)) {
      project = category.find(p => p.id === projectId);
      if (project) break;
    }

    if (!project) return;

    this.elements.modalBody.innerHTML = `
      <h2 style="color: var(--${project.color}); margin-bottom: 1rem; font-size: 2rem;">${project.title}</h2>
      <div class="mono" style="color: var(--${project.color}); margin-bottom: 2rem; font-size: 0.9rem; letter-spacing: 0.1em;">${project.category}</div>
      
      ${project.fullDescription ? `
        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem; opacity: 0.9;">
          ${project.fullDescription}
        </p>
      ` : ''}
      
      ${project.medium ? `
        <div style="margin-bottom: 2rem;">
          <h4 style="color: var(--off-white); margin-bottom: 0.5rem;">Medium</h4>
          <p class="mono" style="font-size: 0.9rem; opacity: 0.8;">${project.medium}</p>
        </div>
      ` : ''}
      
      ${project.technical ? `
        <div style="margin-bottom: 2rem;">
          <h4 style="color: var(--off-white); margin-bottom: 0.5rem;">Technical Details</h4>
          <p class="mono" style="font-size: 0.9rem; opacity: 0.8;">${project.technical}</p>
        </div>
      ` : ''}
      
      ${project.themes ? `
        <div style="margin-bottom: 2rem;">
          <h4 style="color: var(--off-white); margin-bottom: 0.5rem;">Themes</h4>
          <p style="font-size: 0.95rem; opacity: 0.8;">${project.themes}</p>
        </div>
      ` : ''}
      
      ${project.urls ? `
        <div style="margin-top: 2rem;">
          <h4 style="color: var(--off-white); margin-bottom: 1rem;">Links</h4>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            ${Object.entries(project.urls).map(([key, url]) => 
              url ? `<a href="${url}" target="_blank" rel="noopener noreferrer" 
                       style="color: var(--${project.color}); text-decoration: none; 
                              padding: 0.5rem 1rem; border: 1px solid var(--${project.color}); 
                              border-radius: 0.5rem; transition: all 0.3s ease;"
                       onmouseover="this.style.background = 'var(--${project.color})'; this.style.color = 'var(--deep-black)';"
                       onmouseout="this.style.background = 'transparent'; this.style.color = 'var(--${project.color})';">
                ${key.toUpperCase()}
              </a>` : ''
            ).join('')}
          </div>
        </div>
      ` : ''}
    `;

    this.elements.projectModal.classList.add('active');
  }

  setupModal() {
    const closeModal = () => {
      this.elements.projectModal.classList.remove('active');
    };

    const closeHandler = () => closeModal();
    this.elements.modalClose.addEventListener('click', closeHandler);
    this.eventListeners.push({ element: this.elements.modalClose, event: 'click', handler: closeHandler });

    const modalClickHandler = (e) => {
      if (e.target === this.elements.projectModal) {
        closeModal();
      }
    };
    this.elements.projectModal.addEventListener('click', modalClickHandler);
    this.eventListeners.push({ element: this.elements.projectModal, event: 'click', handler: modalClickHandler });

    const keydownHandler = (e) => {
      if (e.key === 'Escape' && this.elements.projectModal.classList.contains('active')) {
        closeModal();
      }
    };
    document.addEventListener('keydown', keydownHandler);
    this.eventListeners.push({ element: document, event: 'keydown', handler: keydownHandler });
  }

  destroy() {
    // Clean up event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];

    // Stop animations and destroy systems
    this.mandalaGenerator?.stopAnimation();
    this.particleSystem?.destroy();
    this.cursorTrail?.destroy();
    
    // Clear references
    this.mandalaGenerator = null;
    this.particleSystem = null;
    this.cursorTrail = null;
    this.elements = {};
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});