/**
 * Portfolio Website JavaScript
 * Clean, minimal functionality for white cube gallery presentation
 */

class PortfolioSite {
  constructor() {
    this.currentSection = 'works';
    this.modal = null;
    this.focusedElement = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderContent();
    this.showSection(this.currentSection);
    this.handleHashChange();
  }

  setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const section = e.target.dataset.section;
        this.showSection(section);
      });
    });

    // Modal controls
    const modal = document.getElementById('modal');
    const modalClose = modal?.querySelector('.modal-close');
    const modalBackdrop = modal?.querySelector('.modal-backdrop');

    modalClose?.addEventListener('click', () => this.closeModal());
    modalBackdrop?.addEventListener('click', () => this.closeModal());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Hash change for direct links
    window.addEventListener('hashchange', () => this.handleHashChange());

    // Prevent modal content clicks from closing modal
    modal?.querySelector('.modal-content')?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  showSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === sectionId);
    });

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.toggle('active', section.id === sectionId);
    });

    this.currentSection = sectionId;
    
    // Update URL without triggering hashchange
    history.replaceState(null, null, `#${sectionId}`);
  }

  renderContent() {
    if (!window.portfolioData) {
      console.error('Portfolio data not loaded');
      return;
    }

    this.renderWorks();
    this.renderThesis();
    this.renderAbout();
  }

  renderWorks() {
    const grid = document.getElementById('works-grid');
    if (!grid || !window.portfolioData.works) return;

    grid.innerHTML = window.portfolioData.works.map(work => `
      <article class="work-item" data-work-id="${work.id}" tabindex="0" role="button" aria-label="View details for ${work.title}">
        ${work.images && work.images[0] ? `
          <img src="${work.images[0].src}" 
               alt="${work.images[0].alt}" 
               class="work-image" 
               loading="lazy">
        ` : ''}
        <div class="work-meta">
          <span class="work-type">${work.type}</span>
          <span class="work-year">${work.year}</span>
          <span class="work-media">${work.media}</span>
        </div>
        <h3 class="work-title">${work.title}</h3>
        <p class="work-description">${work.description}</p>
      </article>
    `).join('');

    // Add click handlers
    grid.querySelectorAll('.work-item').forEach(item => {
      const workId = item.dataset.workId;
      const work = window.portfolioData.works.find(w => w.id === workId);
      
      if (work) {
        item.addEventListener('click', () => this.openModal(work));
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openModal(work);
          }
        });
      }
    });
  }

  renderThesis() {
    const content = document.getElementById('thesis-content');
    if (!content || !window.portfolioData.thesis) return;

    const thesis = window.portfolioData.thesis;
    
    content.innerHTML = `
      <header class="thesis-header">
        <h2 class="thesis-title">${thesis.title}</h2>
        <p class="thesis-subtitle">${thesis.subtitle}</p>
        <div class="thesis-year mono">${thesis.year}</div>
        <p class="thesis-abstract">${thesis.abstract}</p>
      </header>

      <div class="thesis-sections">
        ${thesis.sections.map(section => `
          <section class="thesis-section" id="${section.id}">
            <h3>${section.title}</h3>
            <div class="section-content">${section.content}</div>
          </section>
        `).join('')}
      </div>

      <section class="thesis-references">
        <h3>References</h3>
        ${thesis.references.map(ref => `
          <div class="reference-item">
            <div class="reference-author">${ref.author}</div>
            <div class="reference-title">${ref.title}</div>
            <div class="reference-year">${ref.year}</div>
            ${ref.description ? `<div class="reference-description">${ref.description}</div>` : ''}
          </div>
        `).join('')}
      </section>
    `;
  }

  renderAbout() {
    const content = document.getElementById('about-content');
    if (!content || !window.portfolioData.about) return;

    const about = window.portfolioData.about;
    
    content.innerHTML = `
      <div class="about-section">
        <div class="bio">${about.bio}</div>
      </div>

      ${about.education ? `
        <div class="about-section">
          <h3>Education</h3>
          ${about.education.map(edu => `
            <div class="education-item">
              <div class="item-title">${edu.degree}</div>
              <div class="item-meta">${edu.institution}, ${edu.year}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${about.exhibitions ? `
        <div class="about-section">
          <h3>Exhibitions</h3>
          ${about.exhibitions.map(ex => `
            <div class="exhibition-item">
              <div class="item-title">${ex.title}</div>
              <div class="item-meta">${ex.venue}, ${ex.year} (${ex.type})</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${about.contact ? `
        <div class="about-section">
          <h3>Contact</h3>
          <div class="contact-info">
            ${about.contact.email ? `<p><a href="mailto:${about.contact.email}">${about.contact.email}</a></p>` : ''}
            ${about.contact.website ? `<p><a href="${about.contact.website}" target="_blank" rel="noopener">Website</a></p>` : ''}
          </div>
        </div>
      ` : ''}
    `;
  }

  openModal(work) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;

    // Store current focus
    this.focusedElement = document.activeElement;

    // Set modal content
    modalBody.innerHTML = this.renderModalContent(work);

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus management
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
      closeButton.focus();
    }

    // Update URL
    history.pushState(null, null, `#${work.id}`);
  }

  renderModalContent(work) {
    return `
      <div class="modal-meta">
        <span class="modal-type">${work.type}</span>
        <span class="modal-year">${work.year}</span>
        <span class="modal-media">${work.media}</span>
      </div>

      <h3>${work.title}</h3>
      <p>${work.description}</p>

      ${work.images && work.images.length > 0 ? `
        <div class="modal-images">
          ${work.images.map(img => `
            <img src="${img.src}" 
                 alt="${img.alt}" 
                 class="modal-image" 
                 loading="lazy">
            ${img.caption ? `<p class="image-caption">${img.caption}</p>` : ''}
          `).join('')}
        </div>
      ` : ''}

      ${work.audio && work.audio.length > 0 ? `
        <div class="modal-audio">
          <h4>Audio</h4>
          ${work.audio.map(audio => `
            <div class="audio-item">
              <div class="audio-title">${audio.title}</div>
              <div class="audio-meta">Duration: ${audio.duration}</div>
              <div class="audio-description">${audio.description}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${work.video && work.video.length > 0 ? `
        <div class="modal-video">
          <h4>Video</h4>
          ${work.video.map(video => `
            <div class="video-item">
              <div class="video-title">${video.title}</div>
              <div class="video-meta">Duration: ${video.duration}</div>
              <div class="video-description">${video.description}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  }

  closeModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // Restore focus
    if (this.focusedElement) {
      this.focusedElement.focus();
      this.focusedElement = null;
    }

    // Update URL
    history.pushState(null, null, `#${this.currentSection}`);
  }

  handleKeyDown(e) {
    // Global keyboard shortcuts
    if (e.key === 'Escape') {
      this.closeModal();
      return;
    }

    // Modal navigation
    const modal = document.getElementById('modal');
    if (modal?.classList.contains('active')) {
      this.handleModalKeyDown(e);
    }
  }

  handleModalKeyDown(e) {
    const modal = document.getElementById('modal');
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Trap focus within modal
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  handleHashChange() {
    const hash = window.location.hash.slice(1);
    
    if (!hash) {
      this.showSection('works');
      return;
    }

    // Check if it's a section
    const sections = ['works', 'thesis', 'about'];
    if (sections.includes(hash)) {
      this.showSection(hash);
      return;
    }

    // Check if it's a work ID
    if (window.portfolioData?.works) {
      const work = window.portfolioData.works.find(w => w.id === hash);
      if (work) {
        this.showSection('works');
        // Delay modal opening to ensure section is loaded
        setTimeout(() => this.openModal(work), 100);
        return;
      }
    }

    // Check if it's a thesis section
    if (window.portfolioData?.thesis?.sections) {
      const thesisSection = window.portfolioData.thesis.sections.find(s => s.id === hash);
      if (thesisSection) {
        this.showSection('thesis');
        // Scroll to section after delay
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        return;
      }
    }

    // Fallback
    this.showSection('works');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioSite();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden - could pause animations, etc.
  } else {
    // Page is visible - resume if needed
  }
});