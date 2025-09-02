/**
 * ATHARVA GUPTA Portfolio - Interactive Block-Based Gallery Script
 * Handles block rendering, level controls, navigation, and performative interactions
 */

class BlockBasedGallery {
  constructor() {
    this.currentSection = 'entropy';
    this.levels = {
      entropy: 30,
      noise: 20,
      occupation: 40
    };
    this.isKineticEnabled = true;
    this.isGlitchEnabled = false;
    this.isSoundEnabled = false;
    this.isDarkMode = false;
    this.particles = [];
    this.animationId = null;
    this.searchQuery = '';
    this.activeFilters = [];
    
    // DOM elements
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas?.getContext('2d');
    this.modal = document.getElementById('modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.getElementById('modal-body');
    this.ambientAudio = document.getElementById('ambient-audio');
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupCanvas();
    this.loadUserPreferences();
    this.renderBlocks();
    this.createLevelControls();
    this.startParticleSystem();
    
    // Initialize with first section
    this.showSection(this.currentSection);
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
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    document.getElementById('kinetic-toggle')?.addEventListener('click', () => {
      this.toggleKinetic();
    });

    document.getElementById('glitch-toggle')?.addEventListener('click', () => {
      this.toggleGlitch();
    });

    document.getElementById('sound-toggle')?.addEventListener('click', () => {
      this.toggleSound();
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
      this.adjustBlockLayout();
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
    
    // Initialize particles based on entropy level
    this.particles = [];
    const baseCount = Math.min(50, Math.floor(window.innerWidth / 30));
    const entropyMultiplier = 1 + (this.levels.entropy / 100);
    const particleCount = Math.floor(baseCount * entropyMultiplier);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * (0.5 + this.levels.entropy / 200),
        vy: (Math.random() - 0.5) * (0.5 + this.levels.entropy / 200),
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
      
      // Add entropy-based chaos to particle movement
      const entropyJitter = this.levels.entropy / 1000;
      
      // Update and draw particles
      this.particles.forEach(particle => {
        // Add random jitter based on entropy level
        const jitterX = (Math.random() - 0.5) * entropyJitter;
        const jitterY = (Math.random() - 0.5) * entropyJitter;
        
        // Update position with jitter
        particle.x += particle.vx + jitterX;
        particle.y += particle.vy + jitterY;
        
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
        
        // Draw particle with noise-based opacity variation
        const noiseOpacity = particle.opacity * (1 + (this.levels.noise / 500) * (Math.random() - 0.5));
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color + Math.floor(Math.max(0, Math.min(255, noiseOpacity * 255))).toString(16).padStart(2, '0');
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
    
    const maxDistance = 150 * (1 + this.levels.occupation / 200);
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - (distance / maxDistance)) * (1 + this.levels.occupation / 200);
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

  createLevelControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'level-controls-container';
    controlsContainer.innerHTML = `
      <div class="level-controls">
        <div class="level-controls-header">
          <h3>Levels</h3>
          <button class="level-controls-close" id="level-controls-close" aria-label="Minimize level controls">
            <i data-feather="minus"></i>
          </button>
        </div>
        <div class="level-sliders">
          <div class="level-control">
            <label for="entropy-slider">Entropy <span id="entropy-value">${this.levels.entropy}</span></label>
            <input type="range" id="entropy-slider" min="0" max="100" value="${this.levels.entropy}">
            <p class="level-description">Controls randomness and layout chaos</p>
          </div>
          <div class="level-control">
            <label for="noise-slider">Noise <span id="noise-value">${this.levels.noise}</span></label>
            <input type="range" id="noise-slider" min="0" max="100" value="${this.levels.noise}">
            <p class="level-description">Adjusts glitch effects and interference</p>
          </div>
          <div class="level-control">
            <label for="occupation-slider">Occupation <span id="occupation-value">${this.levels.occupation}</span></label>
            <input type="range" id="occupation-slider" min="0" max="100" value="${this.levels.occupation}">
            <p class="level-description">Modifies density and content overlap</p>
          </div>
        </div>
        <div class="level-presets">
          <button class="preset-btn" data-preset="calm">Calm</button>
          <button class="preset-btn" data-preset="neutral">Neutral</button>
          <button class="preset-btn" data-preset="chaotic">Chaotic</button>
        </div>
      </div>
    `;

    // Add level controls as floating panel
    document.body.appendChild(controlsContainer);

    // Setup level control event listeners
    ['entropy', 'noise', 'occupation'].forEach(level => {
      const slider = document.getElementById(`${level}-slider`);
      const valueDisplay = document.getElementById(`${level}-value`);
      
      slider?.addEventListener('input', (e) => {
        this.levels[level] = parseInt(e.target.value);
        valueDisplay.textContent = this.levels[level];
        this.applyLevelEffects();
        this.saveUserPreferences();
      });
    });

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.dataset.preset;
        this.applyPreset(preset);
      });
    });

    // Close/minimize button
    const closeBtn = document.getElementById('level-controls-close');
    closeBtn?.addEventListener('click', () => {
      this.toggleLevelControls();
    });

    // Click to expand when minimized
    controlsContainer.addEventListener('click', (e) => {
      if (!controlsContainer.classList.contains('expanded') && e.target === controlsContainer) {
        this.toggleLevelControls();
      }
    });
  }

  toggleLevelControls() {
    const container = document.querySelector('.level-controls-container');
    const closeBtn = document.getElementById('level-controls-close');
    
    if (container) {
      container.classList.toggle('expanded');
      
      if (closeBtn) {
        const icon = closeBtn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-feather', container.classList.contains('expanded') ? 'minus' : 'plus');
          feather.replace();
        }
      }
    }
  }

  applyPreset(preset) {
    const presets = {
      calm: { entropy: 10, noise: 5, occupation: 20 },
      neutral: { entropy: 30, noise: 20, occupation: 40 },
      chaotic: { entropy: 80, noise: 70, occupation: 90 }
    };

    if (presets[preset]) {
      this.levels = { ...presets[preset] };
      
      // Update UI
      ['entropy', 'noise', 'occupation'].forEach(level => {
        const slider = document.getElementById(`${level}-slider`);
        const valueDisplay = document.getElementById(`${level}-value`);
        if (slider && valueDisplay) {
          slider.value = this.levels[level];
          valueDisplay.textContent = this.levels[level];
        }
      });
      
      this.applyLevelEffects();
      this.saveUserPreferences();
    }
  }

  applyLevelEffects() {
    // Apply entropy effects
    document.documentElement.style.setProperty('--entropy-level', this.levels.entropy / 100);
    
    // Apply noise effects
    document.documentElement.style.setProperty('--noise-level', this.levels.noise / 100);
    
    // Apply occupation effects
    document.documentElement.style.setProperty('--occupation-level', this.levels.occupation / 100);
    
    // Update particle system
    this.setupCanvas();
    
    // Filter and reorder blocks based on level affinities
    this.filterBlocksByLevels();
    
    // Apply visual effects to blocks
    this.applyBlockEffects();
  }

  filterBlocksByLevels() {
    if (!window.portfolioData) return;

    const currentBlocks = window.portfolioData.sections[this.currentSection]?.blocks || [];
    const blockElements = document.querySelectorAll('.content-block');
    
    blockElements.forEach(element => {
      const blockId = element.dataset.blockId;
      const block = window.portfolioData.blocks[blockId];
      
      if (block && block.levelAffinities) {
        // Calculate affinity score for current levels
        const affinityScore = 
          (block.levelAffinities.entropy * this.levels.entropy / 100) +
          (block.levelAffinities.noise * this.levels.noise / 100) +
          (block.levelAffinities.occupation * this.levels.occupation / 100);
        
        // Show/hide blocks based on affinity threshold
        const threshold = 50; // Adjustable threshold
        if (affinityScore > threshold) {
          element.style.display = 'block';
          element.style.opacity = 1;
        } else {
          element.style.opacity = 0.5;
        }
      }
    });
  }

  applyBlockEffects() {
    const blocks = document.querySelectorAll('.content-block');
    
    blocks.forEach(block => {
      // Entropy effects - random positioning and jitter
      if (this.levels.entropy > 30) {
        const jitter = (this.levels.entropy - 30) / 10;
        block.style.transform = `translate(${(Math.random() - 0.5) * jitter}px, ${(Math.random() - 0.5) * jitter}px)`;
      }
      
      // Noise effects - glitch styling
      if (this.levels.noise > 40) {
        block.classList.add('noise-effect');
      } else {
        block.classList.remove('noise-effect');
      }
      
      // Occupation effects - density and overlap
      if (this.levels.occupation > 60) {
        block.classList.add('high-occupation');
      } else {
        block.classList.remove('high-occupation');
      }
    });
  }

  renderBlocks() {
    if (!window.portfolioData) {
      console.error('Portfolio data not loaded');
      return;
    }

    const data = window.portfolioData;
    
    // Clear existing sections and rebuild with blocks
    Object.keys(data.sections).forEach(sectionKey => {
      const section = data.sections[sectionKey];
      const sectionElement = document.getElementById(`${sectionKey}-section`);
      
      if (sectionElement) {
        // Clear old content
        sectionElement.innerHTML = `
          <header class="section-header">
            <h2 class="section-title">${section.title}</h2>
            <p class="section-description">${section.subtitle}</p>
          </header>
          <div class="blocks-container" id="${sectionKey}-blocks"></div>
        `;
        
        const blocksContainer = sectionElement.querySelector('.blocks-container');
        
        // Render blocks for this section
        section.blocks.forEach(blockId => {
          const block = data.blocks[blockId];
          if (block) {
            const blockElement = this.createBlockElement(block);
            blocksContainer.appendChild(blockElement);
          }
        });
      }
    });
  }

  createBlockElement(block) {
    const element = document.createElement('div');
    element.className = `content-block block-${block.blockType} size-${block.sizeHint}`;
    element.dataset.blockId = block.id;
    element.setAttribute('role', 'article');
    element.setAttribute('tabindex', '0');
    element.setAttribute('aria-label', `${block.title} - Click to expand`);
    
    // Create block header
    const header = document.createElement('div');
    header.className = 'block-header';
    header.innerHTML = `
      <div class="block-type-icon">
        <i data-feather="${window.portfolioData.config.blockTypes[block.blockType].icon}"></i>
      </div>
      <h3 class="block-title">${block.title}</h3>
      <div class="block-meta">
        <span class="block-type">${block.blockType}</span>
        ${block.date ? `<span class="block-date">${block.date}</span>` : ''}
      </div>
    `;
    
    // Create block content preview
    const contentPreview = document.createElement('div');
    contentPreview.className = 'block-content-preview';
    contentPreview.innerHTML = `
      <p class="block-summary">${block.summary}</p>
      ${this.renderBlockPreview(block)}
    `;
    
    // Create block tags
    if (block.tags && block.tags.length > 0) {
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'block-tags';
      tagsContainer.innerHTML = block.tags.map(tag => 
        `<span class="tag" data-tag="${tag}">${tag}</span>`
      ).join('');
      contentPreview.appendChild(tagsContainer);
    }
    
    element.appendChild(header);
    element.appendChild(contentPreview);
    
    // Add click handlers for expansion
    element.addEventListener('click', () => {
      this.expandBlock(block);
    });
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.expandBlock(block);
      }
    });
    
    return element;
  }

  renderBlockPreview(block) {
    switch (block.blockType) {
      case 'works':
        return block.works ? `
          <div class="works-preview">
            ${block.works.slice(0, 3).map(work => `
              <div class="work-mini-card">
                <img src="${work.thumbnail}" alt="${work.title}" loading="lazy">
                <span>${work.title}</span>
              </div>
            `).join('')}
            ${block.works.length > 3 ? `<span class="more-count">+${block.works.length - 3} more</span>` : ''}
          </div>
        ` : '';
        
      case 'gallery':
        return block.media ? `
          <div class="gallery-preview">
            ${block.media.slice(0, 4).map(item => `
              <img src="${item.thumbnail || item.url}" alt="${item.alt}" loading="lazy">
            `).join('')}
            ${block.media.length > 4 ? `<span class="more-count">+${block.media.length - 4} more</span>` : ''}
          </div>
        ` : '';
        
      case 'sound':
        return block.media ? `
          <div class="sound-preview">
            ${block.media.slice(0, 2).map(item => `
              <div class="sound-item">
                <i data-feather="play-circle"></i>
                <span>${item.title}</span>
                <span class="duration">${item.duration}</span>
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'process':
        return block.entries ? `
          <div class="process-preview">
            ${block.entries.slice(0, 2).map(entry => `
              <div class="process-entry">
                <span class="date">${entry.date}</span>
                <span class="title">${entry.title}</span>
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'download':
        return block.downloads ? `
          <div class="download-preview">
            ${block.downloads.slice(0, 3).map(item => `
              <div class="download-item">
                <i data-feather="download"></i>
                <span>${item.title}</span>
                <span class="format">${item.format}</span>
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'references':
        return block.references ? `
          <div class="references-preview">
            ${block.references.slice(0, 3).map(ref => `
              <div class="reference-item">
                <i data-feather="book-open"></i>
                <div class="ref-info">
                  <span class="ref-title">${ref.title}</span>
                  <span class="ref-author">${ref.author} (${ref.year})</span>
                </div>
              </div>
            `).join('')}
            ${block.references.length > 3 ? `<span class="more-count">+${block.references.length - 3} more</span>` : ''}
          </div>
        ` : '';
        
      case 'archive':
        return block.archives ? `
          <div class="archive-preview">
            ${block.archives.slice(0, 2).map(archive => `
              <div class="archive-item">
                <i data-feather="archive"></i>
                <div class="archive-info">
                  <span class="archive-title">${archive.title}</span>
                  <span class="archive-count">${archive.items} items</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'levels':
        return `
          <div class="levels-preview">
            <div class="level-indicators">
              <div class="level-indicator">
                <span>Entropy</span>
                <div class="level-bar">
                  <div class="level-fill" style="width: ${this.levels.entropy}%"></div>
                </div>
              </div>
              <div class="level-indicator">
                <span>Noise</span>
                <div class="level-bar">
                  <div class="level-fill" style="width: ${this.levels.noise}%"></div>
                </div>
              </div>
              <div class="level-indicator">
                <span>Occupation</span>
                <div class="level-bar">
                  <div class="level-fill" style="width: ${this.levels.occupation}%"></div>
                </div>
              </div>
            </div>
          </div>
        `;
        
      default:
        return '';
    }
  }

  expandBlock(block) {
    if (!this.modal || !this.modalTitle || !this.modalBody) return;
    
    // Set title
    this.modalTitle.textContent = block.title;
    
    // Build expanded content
    let content = this.renderExpandedBlock(block);
    
    this.modalBody.innerHTML = content;
    
    // Update URL hash for permalink
    history.pushState(null, null, `#${block.id}`);
    
    // Re-initialize Feather icons
    feather.replace();
    
    // Show modal
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const closeButton = document.getElementById('modal-close');
    if (closeButton) {
      closeButton.focus();
    }
    
    // Trap focus within modal
    this.trapFocus(this.modal);
  }

  renderExpandedBlock(block) {
    let content = `
      <div class="expanded-block-meta">
        <span class="block-type-badge">${block.blockType}</span>
        ${block.date ? `<span class="block-date">${block.date}</span>` : ''}
        <div class="level-affinities">
          <span>Affinities:</span>
          <span class="affinity">E:${block.levelAffinities?.entropy || 0}</span>
          <span class="affinity">N:${block.levelAffinities?.noise || 0}</span>
          <span class="affinity">O:${block.levelAffinities?.occupation || 0}</span>
        </div>
      </div>
    `;
    
    // Add main content
    if (block.content) {
      content += `<div class="expanded-content">${block.content}</div>`;
    }
    
    // Add block-specific expanded content
    content += this.renderBlockSpecificContent(block);
    
    // Add tags
    if (block.tags && block.tags.length > 0) {
      content += `
        <div class="expanded-tags">
          ${block.tags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join('')}
        </div>
      `;
    }
    
    return content;
  }

  renderBlockSpecificContent(block) {
    switch (block.blockType) {
      case 'works':
        return block.works ? `
          <div class="expanded-works">
            ${block.works.map(work => `
              <div class="work-card">
                <div class="work-header">
                  <h4>${work.title}</h4>
                  <span class="work-year">${work.year}</span>
                </div>
                <img src="${work.thumbnail}" alt="${work.title}" loading="lazy">
                <p>${work.summary}</p>
                ${work.details ? `<div class="work-details">${work.details}</div>` : ''}
                ${work.media ? this.renderMedia(work.media) : ''}
                ${work.links ? this.renderLinks(work.links) : ''}
                <div class="work-tags">
                  ${work.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'gallery':
        return block.media ? `
          <div class="expanded-gallery">
            ${block.media.map(item => `
              <div class="gallery-item">
                <img src="${item.url}" alt="${item.alt}" loading="lazy">
                ${item.caption ? `<p class="caption">${item.caption}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'sound':
        return block.media ? `
          <div class="expanded-sound">
            ${block.media.map(item => `
              <div class="sound-item-expanded">
                <div class="sound-controls">
                  <button class="play-btn" data-audio="${item.url}">
                    <i data-feather="play"></i>
                  </button>
                  <div class="sound-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <span class="duration">${item.duration}</span>
                  </div>
                </div>
                <div class="waveform-placeholder"></div>
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'process':
        return block.entries ? `
          <div class="expanded-process">
            ${block.entries.map(entry => `
              <div class="process-entry-expanded">
                <div class="entry-header">
                  <span class="entry-date">${entry.date}</span>
                  <h4>${entry.title}</h4>
                </div>
                <div class="entry-content">${entry.content}</div>
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'download':
        return block.downloads ? `
          <div class="expanded-downloads">
            ${block.downloads.map(item => `
              <div class="download-item-expanded">
                <div class="download-info">
                  <h4>${item.title}</h4>
                  <p>${item.description}</p>
                  <div class="download-meta">
                    <span class="format">${item.format}</span>
                    <span class="size">${item.size}</span>
                  </div>
                </div>
                <a href="${item.url}" class="download-btn" download>
                  <i data-feather="download"></i>
                  Download
                </a>
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'references':
        return block.references ? `
          <div class="expanded-references">
            ${block.references.map(ref => `
              <div class="reference-item-expanded">
                <div class="reference-header">
                  <h4>${ref.title}</h4>
                  <span class="reference-meta">${ref.author} (${ref.year})</span>
                </div>
                <p class="reference-annotation">${ref.annotation}</p>
                <span class="reference-type">${ref.type}</span>
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'archive':
        return block.archives ? `
          <div class="expanded-archives">
            ${block.archives.map(archive => `
              <div class="archive-item-expanded">
                <div class="archive-info">
                  <h4>${archive.title}</h4>
                  <p>${archive.description}</p>
                  <div class="archive-meta">
                    <span class="item-count">${archive.items} items</span>
                  </div>
                </div>
                <a href="${archive.url}" class="archive-btn" download>
                  <i data-feather="download"></i>
                  Download Archive
                </a>
              </div>
            `).join('')}
          </div>
        ` : '';
        
      case 'levels':
        return `
          <div class="expanded-levels">
            <p>Use these controls to modify the site's behavior and content visibility. Each level affects different aspects of the gallery experience:</p>
            <div class="level-controls-expanded">
              ${block.controls ? block.controls.map(control => `
                <div class="level-control-expanded">
                  <label for="${control.id}">${control.label}</label>
                  <input type="range" id="${control.id}" min="${control.min}" max="${control.max}" value="${this.levels[control.id.split('-')[0]]}" />
                  <span class="level-value">${this.levels[control.id.split('-')[0]]}</span>
                  <p class="control-description">${control.description}</p>
                </div>
              `).join('') : ''}
            </div>
          </div>
        `;
        
      default:
        return '';
    }
  }

  renderMedia(mediaArray) {
    return `
      <div class="media-container">
        ${mediaArray.map(media => {
          switch (media.type) {
            case 'image':
              return `<img src="${media.url}" alt="${media.alt}" loading="lazy">`;
            case 'youtube':
              return `<iframe src="https://www.youtube.com/embed/${media.id}" title="${media.alt}" allowfullscreen loading="lazy"></iframe>`;
            case 'bandcamp':
              return `<iframe src="https://bandcamp.com/EmbeddedPlayer/album=${media.id}" title="${media.alt}" loading="lazy"></iframe>`;
            default:
              return '';
          }
        }).join('')}
      </div>
    `;
  }

  renderLinks(linksArray) {
    return `
      <div class="links-container">
        ${linksArray.map(link => `
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="external-link">
            <i data-feather="${link.icon || 'external-link'}"></i>
            ${link.label}
          </a>
        `).join('')}
      </div>
    `;
  }

  showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.section === sectionName) {
        btn.classList.add('active');
      }
    });

    // Update sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update breadcrumb
    const breadcrumb = document.getElementById('current-section');
    if (breadcrumb) {
      breadcrumb.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
    }

    this.currentSection = sectionName;
    
    // Apply level-based filtering to new section
    this.filterBlocksByLevels();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  adjustBlockLayout() {
    // Responsive block layout adjustments
    const blocks = document.querySelectorAll('.content-block');
    const windowWidth = window.innerWidth;
    
    blocks.forEach(block => {
      if (windowWidth < 768) {
        block.classList.add('mobile-layout');
      } else {
        block.classList.remove('mobile-layout');
      }
    });
  }

  handleHashChange() {
    const hash = window.location.hash.slice(1);
    if (hash && window.portfolioData.blocks[hash]) {
      this.expandBlock(window.portfolioData.blocks[hash]);
    }
  }

  closeModal() {
    if (!this.modal) return;
    
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    
    // Clear hash
    history.pushState(null, null, window.location.pathname);
    
    // Return focus to last focused element
    const activeNavBtn = document.querySelector('.nav-btn.active');
    if (activeNavBtn) {
      activeNavBtn.focus();
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

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
    
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.isDarkMode);
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-feather', this.isDarkMode ? 'sun' : 'moon');
        feather.replace();
      }
    }
    
    this.saveUserPreferences();
  }

  toggleKinetic() {
    this.isKineticEnabled = !this.isKineticEnabled;
    
    const toggleBtn = document.getElementById('kinetic-toggle');
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.isKineticEnabled);
    }
    
    // Update canvas visibility
    if (this.canvas) {
      this.canvas.classList.toggle('disabled', !this.isKineticEnabled);
    }
    
    // Update gallery nodes
    document.querySelectorAll('.content-block').forEach(block => {
      block.classList.toggle('kinetic', this.isKineticEnabled);
    });
    
    if (this.isKineticEnabled) {
      this.startParticleSystem();
    }
    
    this.saveUserPreferences();
  }

  toggleGlitch() {
    this.isGlitchEnabled = !this.isGlitchEnabled;
    
    const toggleBtn = document.getElementById('glitch-toggle');
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.isGlitchEnabled);
    }
    
    this.saveUserPreferences();
  }

  toggleSound() {
    this.isSoundEnabled = !this.isSoundEnabled;
    
    const toggleBtn = document.getElementById('sound-toggle');
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.isSoundEnabled);
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-feather', this.isSoundEnabled ? 'volume-2' : 'volume-x');
        feather.replace();
      }
    }
    
    // Control ambient audio
    if (this.ambientAudio) {
      if (this.isSoundEnabled) {
        this.ambientAudio.play().catch(e => {
          console.log('Audio play failed:', e);
        });
      } else {
        this.ambientAudio.pause();
      }
    }
    
    this.saveUserPreferences();
  }

  triggerGlitch(element) {
    element.classList.add('glitch');
    setTimeout(() => {
      element.classList.remove('glitch');
    }, 300);
  }

  handleKeyDown(e) {
    // Close modal with Escape
    if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
      this.closeModal();
      return;
    }
    
    // Navigation with number keys
    const sectionKeys = {
      '1': 'entropy',
      '2': 'noise',
      '3': 'occupation',
      '4': 'extras'
    };
    
    if (sectionKeys[e.key] && !this.modal?.classList.contains('active')) {
      this.showSection(sectionKeys[e.key]);
    }
    
    // Toggles with keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'd':
          e.preventDefault();
          this.toggleTheme();
          break;
        case 'k':
          e.preventDefault();
          this.toggleKinetic();
          break;
        case 'g':
          e.preventDefault();
          this.toggleGlitch();
          break;
        case 'm':
          e.preventDefault();
          this.toggleSound();
          break;
      }
    }
  }

  saveUserPreferences() {
    const preferences = {
      isDarkMode: this.isDarkMode,
      isKineticEnabled: this.isKineticEnabled,
      isGlitchEnabled: this.isGlitchEnabled,
      isSoundEnabled: this.isSoundEnabled,
      levels: this.levels
    };
    
    try {
      localStorage.setItem('atharva-portfolio-prefs', JSON.stringify(preferences));
    } catch (e) {
      console.log('Failed to save preferences:', e);
    }
  }

  loadUserPreferences() {
    try {
      const saved = localStorage.getItem('atharva-portfolio-prefs');
      if (saved) {
        const preferences = JSON.parse(saved);
        
        if (preferences.isDarkMode) {
          this.toggleTheme();
        }
        
        if (!preferences.isKineticEnabled) {
          this.toggleKinetic();
        }
        
        if (preferences.isGlitchEnabled) {
          this.toggleGlitch();
        }
        
        if (preferences.isSoundEnabled) {
          this.toggleSound();
        }
        
        if (preferences.levels) {
          this.levels = { ...preferences.levels };
        }
      }
    } catch (e) {
      console.log('Failed to load preferences:', e);
    }
  }

  
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
  }
  
  // Initialize gallery
  window.portfolioGallery = new BlockBasedGallery();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (window.portfolioGallery) {
    if (document.hidden) {
      // Pause animations when page is hidden
      if (window.portfolioGallery.animationId) {
        cancelAnimationFrame(window.portfolioGallery.animationId);
      }
    } else {
      // Resume animations when page is visible
      window.portfolioGallery.startParticleSystem();
    }
  }
});