/**
 * ATHARVA GUPTA Portfolio - Interactive Block-Based Gallery Script
 * Handles block rendering, level controls, navigation, and performative interactions
 */

class BlockBasedGallery {
  constructor() {
    this.currentSection = 'entropy';
    this.isKineticEnabled = true;
    this.isGlitchEnabled = false;
    this.particles = [];
    this.animationId = null;
    this.activeModal = null;
    this.focusedElement = null;
    
    // DOM elements
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas?.getContext('2d');
    this.modal = document.getElementById('modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.getElementById('modal-body');
    this.loadingOverlay = document.getElementById('loading-overlay');
    
    this.init();
  }

  init() {
    this.loadUserPreferences();
    this.setupEventListeners();
    this.setupCanvas();
    this.renderAllBlocks();
    this.startParticleSystem();
    this.hideLoading();
    this.showSection(this.currentSection);
    this.handleHashChange();
  }

  setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.target.dataset.section;
        this.showSection(section);
        
        if (this.isGlitchEnabled) {
          this.triggerGlitch(e.target);
        }
      });
    });

    // Control toggles
    document.getElementById('kinetic-toggle')?.addEventListener('click', () => {
      this.toggleKinetic();
    });

    document.getElementById('glitch-toggle')?.addEventListener('click', () => {
      this.toggleGlitch();
    });

    

    // Modal controls
    document.getElementById('modal-close')?.addEventListener('click', () => {
      this.closeModal();
    });

    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal || e.target.classList.contains('modal-backdrop')) {
        this.closeModal();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.setupCanvas();
    });

    // Hash change for permalinks
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });
  }

  

  setupCanvas() {
    if (!this.canvas || !this.ctx) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Initialize particles
    this.particles = [];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#00CFFF' : '#FFD966'
      });
    }
  }

  startParticleSystem() {
    if (!this.ctx || !this.isKineticEnabled) return;
    
    const animate = () => {
      if (!this.isKineticEnabled) {
        this.animationId = requestAnimationFrame(animate);
        return;
      }
      
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update and draw particles
      this.particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x <= 0 || particle.x >= this.canvas.width) {
          particle.vx *= -1;
        }
        if (particle.y <= 0 || particle.y >= this.canvas.height) {
          particle.vy *= -1;
        }
        
        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        
        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        const alpha = Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        this.ctx.fillStyle = particle.color + alpha;
        this.ctx.fill();
      });
      
      // Connect nearby particles
      this.drawConnections();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  drawConnections() {
    if (!this.ctx) return;
    
    const maxDistance = 150;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = 1 - (distance / maxDistance);
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(0, 207, 255, ${opacity * 0.2})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  renderAllBlocks() {
    if (!window.portfolioData) {
      console.error('Portfolio data not loaded');
      return;
    }

    // Render blocks for each section
    ['entropy', 'noise', 'occupation', 'extras'].forEach(section => {
      this.renderBlocksForSection(section);
    });
  }

  renderBlocksForSection(section) {
    const container = document.getElementById(`${section}-blocks`);
    if (!container) return;

    // Get blocks for this section
    const sectionBlocks = Object.values(window.portfolioData.blocks)
      .filter(block => block.section === section);

    // Clear existing content
    container.innerHTML = '';

    // Render each block
    sectionBlocks.forEach(block => {
      const blockElement = this.createBlockElement(block);
      container.appendChild(blockElement);
    });

    
  }

  createBlockElement(block) {
    const blockEl = document.createElement('article');
    blockEl.className = `content-block size-${block.sizeHint}`;
    blockEl.dataset.blockId = block.id;
    blockEl.dataset.blockType = block.blockType;
    blockEl.setAttribute('role', 'region');
    blockEl.setAttribute('aria-labelledby', `${block.id}-title`);
    blockEl.setAttribute('tabindex', '0');

    // Block type icon
    const iconMap = {
      text: 'file-text',
      works: 'grid',
      gallery: 'image',
      sound: 'headphones',
      process: 'edit-3',
      tech: 'code',
      download: 'download'
    };

    const icon = iconMap[block.blockType] || 'square';

    blockEl.innerHTML = `
      <div class="block-header">
        <div class="block-type">
          <i data-feather="${icon}"></i>
          <span class="block-type-label">${block.blockType}</span>
        </div>
        <div class="block-meta">
          <span class="block-date">${block.date}</span>
        </div>
      </div>
      <div class="block-content">
        <h3 id="${block.id}-title" class="block-title">${block.title}</h3>
        <p class="block-summary">${block.summary}</p>
        ${this.renderBlockPreview(block)}
      </div>
      <div class="block-footer">
        <div class="block-tags">
          ${block.tags.map(tag => `<span class="block-tag">${tag}</span>`).join('')}
        </div>
        <button class="block-expand-btn" aria-label="Expand ${block.title}">
          <i data-feather="maximize-2"></i>
          <span>Expand</span>
        </button>
      </div>
    `;

    // Add click handler
    blockEl.addEventListener('click', () => {
      this.openModal(block);
    });

    // Add keyboard handler
    blockEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openModal(block);
      }
    });

    return blockEl;
  }

  renderBlockPreview(block) {
    switch (block.blockType) {
      case 'gallery':
        if (block.media && block.media.length > 0) {
          const firstImage = block.media[0];
          return `
            <div class="block-preview-gallery">
              <img src="${firstImage.thumbnail || firstImage.url}" 
                   alt="${firstImage.alt}" 
                   loading="lazy"
                   class="preview-image">
              <div class="gallery-count">${block.media.length} images</div>
            </div>
          `;
        }
        break;
      case 'sound':
        return `
          <div class="block-preview-sound">
            <div class="sound-wave"></div>
            <span class="sound-count">${block.media?.length || 0} tracks</span>
          </div>
        `;
      case 'works':
        if (block.media && block.media.length > 0) {
          const firstImage = block.media[0];
          return `
            <div class="block-preview-work">
              <img src="${firstImage.url}" 
                   alt="${firstImage.alt}" 
                   loading="lazy"
                   class="preview-image">
            </div>
          `;
        }
        break;
      case 'download':
        return `
          <div class="block-preview-download">
            <i data-feather="download"></i>
            <span class="download-size">${block.downloadSize || 'Download'}</span>
          </div>
        `;
    }
    return '';
  }

  openModal(block) {
    if (!this.modal) return;

    this.activeModal = block;
    this.focusedElement = document.activeElement;

    // Set modal content
    this.modalTitle.textContent = block.title;
    this.modalBody.innerHTML = this.renderModalContent(block);

    // Show modal
    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.classList.add('active');
    document.body.classList.add('modal-open');

    // Focus management
    this.modal.focus();
    this.trapFocus(this.modal);

    // Replace feather icons in modal
    feather.replace();

    // Set up media players if needed
    this.setupModalMedia();

    // Update URL hash
    window.history.pushState(null, null, `#${block.id}`);
  }

  renderModalContent(block) {
    let content = `
      <div class="modal-content-body">
        <div class="modal-meta">
          <span class="modal-type">${block.blockType}</span>
          <span class="modal-date">${block.date}</span>
        </div>
        <div class="modal-text">
          ${block.content}
        </div>
    `;

    // Add media content based on block type
    if (block.media && block.media.length > 0) {
      content += `<div class="modal-media">`;
      
      switch (block.blockType) {
        case 'gallery':
          content += this.renderGalleryModal(block.media);
          break;
        case 'sound':
          content += this.renderSoundModal(block.media);
          break;
        case 'works':
          content += this.renderWorksModal(block.media);
          break;
      }
      
      content += `</div>`;
    }

    // Add download button if applicable
    if (block.download && block.downloadUrl) {
      content += `
        <div class="modal-download">
          <a href="${block.downloadUrl}" download class="download-btn">
            <i data-feather="download"></i>
            Download ${block.downloadSize || ''}
          </a>
        </div>
      `;
    }

    // Add credits if present
    if (block.credits) {
      content += `
        <div class="modal-credits">
          <p><strong>Credits:</strong> ${block.credits}</p>
        </div>
      `;
    }

    // Add tags at the bottom
    content += `
        <div class="modal-tags">
          ${block.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
        </div>
    `;

    content += `</div>`;
    return content;
  }

  renderGalleryModal(media) {
    return `
      <div class="gallery-modal">
        ${media.map((item, index) => `
          <div class="gallery-item" data-index="${index}">
            <img src="${item.url}" alt="${item.alt}" loading="lazy">
            ${item.caption ? `<p class="gallery-caption">${item.caption}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  renderSoundModal(media) {
    return `
      <div class="sound-modal">
        ${media.map((item, index) => `
          <div class="sound-item" data-index="${index}">
            <div class="sound-header">
              <h4>${item.title}</h4>
              <span class="sound-duration">${item.duration}</span>
            </div>
            <audio controls preload="none">
              <source src="${item.url}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
            ${item.description ? `<p class="sound-description">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  renderWorksModal(media) {
    return `
      <div class="works-modal">
        ${media.map((item, index) => `
          <div class="works-item" data-index="${index}">
            <img src="${item.url}" alt="${item.alt}" loading="lazy">
            ${item.caption ? `<p class="works-caption">${item.caption}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  setupModalMedia() {
    // Setup audio players
    const audioElements = this.modal.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.volume = 0.3;
      audio.addEventListener('play', () => {
        // Pause other audio elements
        audioElements.forEach(other => {
          if (other !== audio) other.pause();
        });
      });
    });
  }

  closeModal() {
    if (!this.modal) return;

    // Hide modal
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.classList.remove('active');
    document.body.classList.remove('modal-open');

    // Restore focus
    if (this.focusedElement) {
      this.focusedElement.focus();
    }

    // Pause any playing audio
    const audioElements = this.modal.querySelectorAll('audio');
    audioElements.forEach(audio => audio.pause());

    this.activeModal = null;

    // Update URL hash
    if (window.location.hash) {
      window.history.pushState(null, null, window.location.pathname);
    }
  }

  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  showSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });

    // Update sections
    document.querySelectorAll('.content-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === section);
    });

    // Update breadcrumb
    const breadcrumb = document.getElementById('current-section');
    if (breadcrumb) {
      breadcrumb.textContent = section.charAt(0).toUpperCase() + section.slice(1);
    }

    this.currentSection = section;
  }

  

  

  toggleKinetic() {
    this.isKineticEnabled = !this.isKineticEnabled;
    
    const kineticBtn = document.getElementById('kinetic-toggle');
    kineticBtn?.classList.toggle('active', this.isKineticEnabled);
    
    if (this.canvas) {
      this.canvas.classList.toggle('disabled', !this.isKineticEnabled);
    }
    
    if (this.isKineticEnabled) {
      this.startParticleSystem();
    } else {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
    
    this.saveUserPreferences();
  }

  toggleGlitch() {
    this.isGlitchEnabled = !this.isGlitchEnabled;
    
    const glitchBtn = document.getElementById('glitch-toggle');
    glitchBtn?.classList.toggle('active', this.isGlitchEnabled);
    
    this.saveUserPreferences();
  }

  

  triggerGlitch(element) {
    element.classList.add('glitch');
    setTimeout(() => {
      element.classList.remove('glitch');
    }, 300);
  }

  handleKeyDown(e) {
    // Modal keyboard handling
    if (this.activeModal) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeModal();
      }
      return;
    }

    // Global keyboard shortcuts
    switch (e.key) {
      case '1':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.showSection('entropy');
        }
        break;
      case '2':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.showSection('noise');
        }
        break;
      case '3':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.showSection('occupation');
        }
        break;
      case 'k':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.toggleKinetic();
        }
        break;
      
    }
  }

  handleHashChange() {
    const hash = window.location.hash.slice(1);
    if (hash && window.portfolioData.blocks[hash]) {
      const block = window.portfolioData.blocks[hash];
      this.showSection(block.section);
      // Small delay to ensure section is visible
      setTimeout(() => {
        this.openModal(block);
      }, 100);
    }
  }

  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('hidden');
      setTimeout(() => {
        this.loadingOverlay.style.display = 'none';
      }, 500);
    }
  }

  saveUserPreferences() {
    const preferences = {
      isKineticEnabled: this.isKineticEnabled,
      isGlitchEnabled: this.isGlitchEnabled,
      currentSection: this.currentSection
    };
    
    try {
      localStorage.setItem('portfolioPreferences', JSON.stringify(preferences));
    } catch (e) {
      console.warn('Could not save preferences to localStorage:', e);
    }
  }

  loadUserPreferences() {
    try {
      const saved = localStorage.getItem('portfolioPreferences');
      if (saved) {
        const preferences = JSON.parse(saved);
        
        
        
        // Load other preferences
        if (typeof preferences.isKineticEnabled === 'boolean') {
          this.isKineticEnabled = preferences.isKineticEnabled;
        }
        
        if (typeof preferences.isGlitchEnabled === 'boolean') {
          this.isGlitchEnabled = preferences.isGlitchEnabled;
        }
        
        if (preferences.currentSection) {
          this.currentSection = preferences.currentSection;
        }
        
        // Update UI to reflect loaded preferences
        this.updateUIFromPreferences();
      }
    } catch (e) {
      console.warn('Could not load preferences from localStorage:', e);
    }
  }

  updateUIFromPreferences() {
    // Update control buttons
    const kineticBtn = document.getElementById('kinetic-toggle');
    const glitchBtn = document.getElementById('glitch-toggle');

    kineticBtn?.classList.toggle('active', this.isKineticEnabled);
    glitchBtn?.classList.toggle('active', this.isGlitchEnabled);
  }
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.gallery = new BlockBasedGallery();
});

// Handle reduced motion preference
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-fast', '0s');
  document.documentElement.style.setProperty('--transition-base', '0s');
  document.documentElement.style.setProperty('--transition-slow', '0s');
}
