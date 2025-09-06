/**
 * script.js - Dynamic content rendering and navigation
 * Handles portfolio navigation, content rendering, and media playback
 */

class PortfolioApp {
  constructor() {
    this.data = null;
    this.currentView = 'portfolio';
    this.currentWork = null;
    this.audioPlayer = null;
    this.observedImages = new Set();
    
    this.init();
  }

  async init() {
    try {
      // Wait for data to be available
      await this.waitForData();
      
      // Initialize components
      this.setupNavigation();
      this.setupAudioPlayer();
      this.setupLazyLoading();
      this.setupKeyboardNavigation();
      
      // Render initial view
      this.renderPortfolio();
      this.showPortfolio();
      this.hideLoading();
      
      console.log('Portfolio app initialized successfully');
    } catch (error) {
      console.error('Failed to initialize portfolio app:', error);
      this.showError('Failed to load portfolio. Please refresh the page.');
    }
  }

  async waitForData() {
    return new Promise((resolve, reject) => {
      const checkData = () => {
        if (window.portfolioData) {
          this.data = window.portfolioData;
          resolve();
        } else {
          setTimeout(checkData, 100);
        }
      };
      
      checkData();
      
      // Timeout after 5 seconds
      setTimeout(() => {
        if (!this.data) {
          reject(new Error('Data loading timeout'));
        }
      }, 5000);
    });
  }

  setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backButton = document.querySelector('.back-button');

    // Toggle navigation menu
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('nav-menu--open');
    });

    // Navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href').substring(1);
        this.navigateTo(target);
        
        // Close mobile menu
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('nav-menu--open');
      });
    });

    // Back button
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.navigateTo('portfolio');
      });
    }

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      if (e.state) {
        this.navigateTo(e.state.view, e.state.work, false);
      }
    });
  }

  navigateTo(view, work = null, pushState = true) {
    this.currentView = view;
    this.currentWork = work;

    // Update URL
    if (pushState) {
      const url = work ? `#${view}/${work}` : `#${view}`;
      history.pushState({ view, work }, '', url);
    }

    // Hide all sections
    document.querySelectorAll('main > section').forEach(section => {
      section.style.display = 'none';
    });

    // Show target section and render content
    switch (view) {
      case 'portfolio':
        if (work) {
          this.renderWorkDetail(work);
          document.getElementById('work-detail').style.display = 'block';
        } else {
          this.renderPortfolio();
          document.getElementById('portfolio').style.display = 'block';
        }
        break;
      case 'thesis':
        this.renderThesis();
        document.getElementById('thesis').style.display = 'block';
        break;
      case 'about':
        this.renderAbout();
        document.getElementById('about').style.display = 'block';
        break;
    }

    // Update page title
    document.title = work 
      ? `${this.getWorkTitle(work)} - Thesis Portfolio`
      : `${view.charAt(0).toUpperCase() + view.slice(1)} - Thesis Portfolio`;
  }

  renderPortfolio() {
    const container = document.querySelector('.works-grid');
    container.innerHTML = '';

    // Combine all project types
    const allWorks = [
      ...this.data.projects.soundInstallations || [],
      ...this.data.projects.performance || [],
      ...this.data.projects.installations || [],
      ...this.data.projects.drawings || [],
      ...this.data.projects.writing || []
    ];

    allWorks.forEach(work => {
      const workElement = this.createWorkCard(work);
      container.appendChild(workElement);
    });
  }

  createWorkCard(work) {
    const card = document.createElement('article');
    card.className = 'work-card';
    card.setAttribute('data-color', work.color || 'default');
    
    const hasMedia = work.images?.length > 0 || work.videos?.length > 0;
    const primaryImage = work.images?.[0];
    
    card.innerHTML = `
      ${hasMedia ? `
        <div class="work-media">
          ${primaryImage ? `
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PC9zdmc+"
              data-src="${primaryImage}"
              alt="${work.title}"
              class="work-image lazy-load"
              loading="lazy"
            >
          ` : ''}
        </div>
      ` : ''}
      
      <div class="work-info">
        <h3 class="work-title">${work.title}</h3>
        <p class="work-category">${work.category || work.medium}</p>
        <p class="work-description">${work.description}</p>
        
        ${work.bandcampTracks?.length > 0 ? `
          <div class="work-actions">
            <button class="play-bandcamp-btn" data-url="${work.bandcampTracks[0].url}" aria-label="Listen on Bandcamp">
              ▶ Listen
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // Make card clickable
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking on action buttons
      if (!e.target.closest('.work-actions')) {
        this.navigateTo('portfolio', work.id);
      }
    });

    // Handle Bandcamp links
    const bandcampBtn = card.querySelector('.play-bandcamp-btn');
    if (bandcampBtn) {
      bandcampBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(bandcampBtn.dataset.url, '_blank');
      });
    }

    return card;
  }

  renderWorkDetail(workId) {
    const work = this.findWork(workId);
    if (!work) {
      this.showError('Work not found');
      return;
    }

    const container = document.querySelector('.work-content');
    const hasImages = work.images?.length > 0;
    const hasVideos = work.videos?.length > 0;
    const hasBandcamp = work.bandcampTracks?.length > 0;

    container.innerHTML = `
      <header class="work-header">
        <h1 id="work-title" class="work-detail-title">${work.title}</h1>
        <div class="work-meta">
          <span class="work-category">${work.category || work.medium}</span>
          ${work.dimensions ? `<span class="work-dimensions">${work.dimensions}</span>` : ''}
        </div>
      </header>

      ${hasImages ? `
        <div class="work-gallery" role="region" aria-label="Work images">
          ${work.images.map((image, index) => `
            <figure class="gallery-item">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PC9zdmc+"
                data-src="${image}"
                alt="${work.title} - Image ${index + 1}"
                class="gallery-image lazy-load"
                loading="lazy"
              >
            </figure>
          `).join('')}
        </div>
      ` : ''}

      ${hasVideos ? `
        <div class="work-videos" role="region" aria-label="Work videos">
          ${work.videos.map(video => `
            <div class="video-container">
              ${video.includes('youtube.com') || video.includes('youtu.be') ? `
                <iframe 
                  src="${this.getYouTubeEmbedUrl(video)}"
                  frameborder="0"
                  allowfullscreen
                  aria-label="Video: ${work.title}"
                ></iframe>
              ` : `
                <video controls preload="metadata" aria-label="Video: ${work.title}">
                  <source src="${video}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              `}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="work-text">
        <div class="work-description-full">
          ${this.formatTextContent(work.fullDescription || work.description)}
        </div>

        ${work.themes ? `
          <div class="work-themes">
            <h3>Themes</h3>
            <p>${work.themes}</p>
          </div>
        ` : ''}

        ${work.technical ? `
          <div class="work-technical">
            <h3>Technical</h3>
            <p>${work.technical}</p>
          </div>
        ` : ''}

        ${work.technology ? `
          <div class="work-technology">
            <h3>Technology</h3>
            <p>${work.technology}</p>
          </div>
        ` : ''}
      </div>

      ${hasBandcamp ? `
        <div class="work-audio">
          <h3>Audio</h3>
          <div class="bandcamp-tracks">
            ${work.bandcampTracks.map(track => `
              <a href="${track.url}" target="_blank" class="bandcamp-link">
                ▶ ${track.title} (Bandcamp)
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${work.urls ? `
        <div class="work-links">
          <h3>Links</h3>
          ${Object.entries(work.urls).map(([type, url]) => `
            <a href="${url}" target="_blank" class="external-link">
              ${type.toUpperCase()}
            </a>
          `).join('')}
        </div>
      ` : ''}
    `;

    // Setup lazy loading for new images
    this.setupLazyLoading();
  }

  renderThesis() {
    const container = document.querySelector('.thesis-content');
    const thesis = this.data.thesis;

    container.innerHTML = `
      <header class="thesis-header">
        <h1>${thesis.title}</h1>
      </header>

      <section class="thesis-abstract">
        <h2>Abstract</h2>
        <div class="thesis-text">
          ${this.formatTextContent(thesis.abstract)}
        </div>
      </section>

      <div class="thesis-sections">
        ${thesis.sections.map(section => `
          <section class="thesis-section">
            <h2>${section.title}</h2>
            <div class="thesis-text">
              ${this.formatTextContent(section.content)}
            </div>
          </section>
        `).join('')}
      </div>
    `;
  }

  renderAbout() {
    const container = document.querySelector('.about-content');
    const about = this.data.contact.about;
    const social = this.data.contact.social;

    container.innerHTML = `
      <div class="about-text">
        ${this.formatTextContent(about.description)}
      </div>

      <div class="about-credentials">
        <h3>Practice Areas</h3>
        <ul>
          ${about.credentials.map(cred => `<li>${cred}</li>`).join('')}
        </ul>
      </div>

      <div class="about-contact">
        <h3>Connect</h3>
        <p>${this.data.contact.description}</p>
        
        <div class="social-links">
          ${social.map(link => `
            <a href="${link.url}" target="_blank" class="social-link" data-color="${link.color}">
              ${link.name}
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Helper methods
  findWork(workId) {
    const allWorks = [
      ...this.data.projects.soundInstallations || [],
      ...this.data.projects.performance || [],
      ...this.data.projects.installations || [],
      ...this.data.projects.drawings || [],
      ...this.data.projects.writing || []
    ];
    
    return allWorks.find(work => work.id === workId);
  }

  getWorkTitle(workId) {
    const work = this.findWork(workId);
    return work ? work.title : 'Work';
  }

  formatTextContent(text) {
    if (!text) return '';
    
    return text
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.trim()}</p>`)
      .join('');
  }

  getYouTubeEmbedUrl(url) {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src && !this.observedImages.has(img)) {
            img.src = img.dataset.src;
            img.classList.remove('lazy-load');
            this.observedImages.add(img);
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('.lazy-load').forEach(img => {
      if (!this.observedImages.has(img)) {
        imageObserver.observe(img);
      }
    });
  }

  setupAudioPlayer() {
    const audioPlayer = document.querySelector('.audio-player');
    const audioElement = audioPlayer.querySelector('.audio-element');
    const playPauseBtn = audioPlayer.querySelector('.play-pause-btn');
    const progressBar = audioPlayer.querySelector('.progress-bar');
    const progressFill = audioPlayer.querySelector('.progress-fill');
    const timeDisplay = audioPlayer.querySelector('.time-display');
    const closeBtn = audioPlayer.querySelector('.close-player');

    this.audioPlayer = {
      element: audioElement,
      container: audioPlayer,
      playPauseBtn,
      progressBar,
      progressFill,
      timeDisplay,
      closeBtn
    };

    // Audio controls
    playPauseBtn.addEventListener('click', () => {
      if (audioElement.paused) {
        audioElement.play();
        playPauseBtn.textContent = '⏸';
        playPauseBtn.setAttribute('aria-label', 'Pause');
      } else {
        audioElement.pause();
        playPauseBtn.textContent = '▶';
        playPauseBtn.setAttribute('aria-label', 'Play');
      }
    });

    closeBtn.addEventListener('click', () => {
      audioElement.pause();
      audioPlayer.style.display = 'none';
    });

    // Progress bar
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioElement.currentTime = percent * audioElement.duration;
    });

    // Update progress and time
    audioElement.addEventListener('timeupdate', () => {
      if (audioElement.duration) {
        const percent = (audioElement.currentTime / audioElement.duration) * 100;
        progressFill.style.width = `${percent}%`;
        progressBar.setAttribute('aria-valuenow', percent);
        
        const current = this.formatTime(audioElement.currentTime);
        const total = this.formatTime(audioElement.duration);
        timeDisplay.textContent = `${current} / ${total}`;
      }
    });

    audioElement.addEventListener('ended', () => {
      playPauseBtn.textContent = '▶';
      playPauseBtn.setAttribute('aria-label', 'Play');
      progressFill.style.width = '0%';
    });
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Escape':
          if (this.currentView === 'portfolio' && this.currentWork) {
            this.navigateTo('portfolio');
          }
          break;
        case 'ArrowLeft':
          if (e.altKey && this.currentView === 'portfolio' && this.currentWork) {
            this.navigateTo('portfolio');
          }
          break;
      }
    });
  }

  showPortfolio() {
    // Hide all sections first
    document.querySelectorAll('main > section').forEach(section => {
      section.style.display = 'none';
    });
    // Show portfolio section
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.style.display = 'block';
    }
  }

  hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
      loading.style.display = 'none';
    }
  }

  showError(message) {
    const loading = document.querySelector('.loading');
    if (loading) {
      loading.innerHTML = `<span class="error-text">${message}</span>`;
    }
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Handle cache control for GitHub Pages
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {
    // Service worker registration failed, continue without it
  });
}