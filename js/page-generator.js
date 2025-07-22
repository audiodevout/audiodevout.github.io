// ===================================================================
// PAGE GENERATOR SYSTEM
// Dynamic content rendering from portfolio data
// ===================================================================

const PageGenerator = {
    isInitialized: false,

    init() {
        this.bindEvents();
        this.generateAllPages();

        Utils.performance.mark('page-generator-init');
        console.log('✓ Page generator system initialized');
        this.isInitialized = true;
    },

    bindEvents() {
        // Listen for data updates
        appEvents.on('dataLoaded', () => {
            this.generateAllPages();
        });

        // Listen for page changes to generate content on demand
        appEvents.on('pageChange', (data) => {
            this.generatePageContent(data.to);
        });
    },

    generateAllPages() {
        if (typeof portfolioData === 'undefined') {
            console.warn('Portfolio data not available for page generation');
            return;
        }

        // Generate all page content
        this.generateHomeContent();
        this.generateAudioContent();
        this.generateImageContent();
        this.generateVideoContent();
        this.generateTextContent();
        this.generateAboutContent();
        this.generateContactContent();
        this.generateThesisContent();

        console.log('✓ All page content generated');
    },

    generatePageContent(pageId) {
        // Always populate featured pane regardless of current page
        this.populateFeaturedPane();
        
        // Hide home featured sections on all pages except home
        if (pageId !== 'home') {
            this.hideFeaturedSections();
        }
        
        switch (pageId) {
            case 'home':
                this.generateHomeContent();
                break;
            case 'audio':
                this.generateAudioContent();
                break;
            case 'images':
                this.generateImageContent();
                break;
            case 'videos':
                this.generateVideoContent();
                break;
            case 'texts':
                this.generateTextContent();
                break;
            case 'about':
                this.generateAboutContent();
                break;
            case 'contact':
                this.generateContactContent();
                break;
            case 'thesis':
                this.generateThesisContent();
                break;
        }
    },

    hideFeaturedSections() {
        const featuredSections = Utils.$$('.featured-section');
        featuredSections.forEach(section => {
            section.style.display = 'none';
        });
    },

    generateHomeContent() {
        // Generate featured content for both home page and featured pane
        const homeSection = Utils.$('#home');
        if (!homeSection) return;
        
        this.generateFeaturedAudio();
        this.generateFeaturedImages();
        this.generateFeaturedVideos();
        this.generateFeaturedTexts();
        this.addSocialIconsToHome();
        
        // Always populate the fixed featured pane
        this.populateFeaturedPane();
    },

    populateFeaturedPane() {
        this.populateFeaturedAudioPane();
        this.populateFeaturedVideosPane();
        this.populateFeaturedImagesPane();
    },

    populateFeaturedAudioPane() {
        const container = Utils.$('#featured-audio-pane');
        if (!container || !portfolioData.audio) return;

        const featured = portfolioData.audio.filter(item => item.featured).slice(0, 3);
        container.innerHTML = featured.map(item => `
            <div class="featured-item" data-audio-id="${item.id}">
                <div class="featured-item-title">${item.title}</div>
                <div class="featured-item-meta">
                    <span class="featured-item-year">${item.year}</span>
                    <i class="fab fa-bandcamp"></i>
                </div>
            </div>
        `).join('');
    },

    populateFeaturedVideosPane() {
        const container = Utils.$('#featured-videos-pane');
        if (!container || !portfolioData.videos) return;

        const featured = portfolioData.videos.filter(item => item.featured).slice(0, 3);
        container.innerHTML = featured.map(item => `
            <div class="featured-item" data-video-id="${item.id}">
                <div class="featured-item-title">${item.title}</div>
                <div class="featured-item-meta">
                    <span class="featured-item-year">${item.year}</span>
                    <i class="fab fa-youtube"></i>
                </div>
            </div>
        `).join('');
    },

    populateFeaturedImagesPane() {
        const container = Utils.$('#featured-images-pane');
        if (!container || !portfolioData.images) return;

        const featured = portfolioData.images.filter(item => item.featured).slice(0, 3);
        container.innerHTML = featured.map(item => `
            <div class="featured-item" data-image-id="${item.id}">
                <div class="featured-item-title">${item.title}</div>
                <div class="featured-item-meta">
                    <span class="featured-item-year">${item.year}</span>
                    <i class="fas fa-image"></i>
                </div>
            </div>
        `).join('');
    },

    generateFeaturedVideos() {
        const container = Utils.$('#featured-videos .featured-items');
        if (!container || !portfolioData.videos) return;

        const featured = portfolioData.videos.filter(item => item.featured).slice(0, 3);

        container.innerHTML = featured.map(item => `
            <div class="featured-item" data-video-id="${item.id}">
                <div class="featured-item-visual video-visual">
                    <div class="video-thumbnail">
                        <img src="https://img.youtube.com/vi/${item.embedId}/hqdefault.jpg" alt="${item.title}" loading="lazy">
                        <div class="video-overlay">
                            <div class="video-play-btn">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="featured-item-header">
                    <h3 class="featured-item-title">${item.title}</h3>
                    <span class="featured-item-year">${item.year}</span>
                </div>
                <p class="featured-item-description">${item.description}</p>
                <div class="featured-item-meta">
                    <span class="meta-item">
                        <i class="fas fa-clock"></i> ${item.duration}
                    </span>
                    ${item.venue ? `
                        <span class="meta-item">
                            <i class="fas fa-map-marker-alt"></i> ${item.venue}
                        </span>
                    ` : ''}
                </div>
                <div class="featured-item-actions">
                    <button class="featured-action-btn watch-btn" onclick="Navigation.navigateTo('videos')">
                        <i class="fas fa-play-circle"></i>
                        <span class="btn-text">Watch</span>
                        <span class="btn-icon-alt"><i class="fas fa-video"></i></span>
                    </button>
                </div>
            </div>
        `).join('');

        // Add click handlers for featured video items
        const featuredItems = container.querySelectorAll('.featured-item');
        featuredItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.featured-action-btn')) {
                    Navigation.navigateTo('videos');
                }
            });
        });
    },

    addSocialIconsToHome() {
        const heroContent = Utils.$('.hero-content');
        if (!heroContent || !portfolioData.contact) return;

        // Helper function to get platform icon and class
        const getPlatformInfo = (platform) => {
            const platformMap = {
                'Instagram': { icon: 'fab fa-instagram', class: 'instagram' },
                'YouTube': { icon: 'fab fa-youtube', class: 'youtube' },
                'Bandcamp': { icon: 'fab fa-bandcamp', class: 'bandcamp' },
                'Patreon': { icon: 'fab fa-patreon', class: 'patreon' },
                'LinkedIn': { icon: 'fab fa-linkedin', class: 'linkedin' }
            };
            return platformMap[platform] || { icon: 'fas fa-external-link-alt', class: 'default' };
        };

        // Check if social icons already exist
        if (!heroContent.querySelector('.social-icons')) {
            const socialIconsHTML = `
                <div class="social-icons">
                    ${portfolioData.contact.socials.map(social => {
                        const platformInfo = getPlatformInfo(social.platform);
                        return `
                            <a href="${social.url}" 
                               class="social-icon ${platformInfo.class}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               aria-label="${social.label}">
                                <i class="${platformInfo.icon}"></i>
                            </a>
                        `;
                    }).join('')}
                </div>
            `;
            heroContent.insertAdjacentHTML('beforeend', socialIconsHTML);
        }
    },

    generateFeaturedAudio() {
        const container = Utils.$('#featured-audio .featured-items');
        if (!container || !portfolioData.audio) return;

        const featured = portfolioData.audio.filter(item => item.featured).slice(0, 3);

        container.innerHTML = featured.map(item => `
            <div class="featured-item" data-audio-id="${item.id}">
                <div class="featured-item-visual audio-visual">
                    <div class="audio-icon">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="audio-waveform">
                        <span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span>
                    </div>
                </div>
                <div class="featured-item-header">
                    <h3 class="featured-item-title">${item.title}</h3>
                    <span class="featured-item-year">${item.year}</span>
                </div>
                <p class="featured-item-description">${item.description}</p>
                <div class="featured-item-meta">
                    <span class="meta-item">
                        <i class="fas fa-clock"></i> ${item.duration}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-tag"></i> ${item.tags ? item.tags[0] : 'Audio'}
                    </span>
                </div>
                <div class="featured-item-actions">
                    <button class="featured-action-btn listen-btn" onclick="Navigation.navigateTo('audio')">
                        <i class="fas fa-play"></i>
                        <span class="btn-text">Listen</span>
                        <span class="btn-icon-alt"><i class="fas fa-headphones"></i></span>
                    </button>
                </div>
            </div>
        `).join('');
    },

    generateFeaturedImages() {
        const container = Utils.$('#featured-images .featured-items');
        if (!container || !portfolioData.images) return;

        const featured = portfolioData.images.filter(item => item.featured).slice(0, 3);

        container.innerHTML = featured.map(item => `
            <div class="featured-item" data-image-id="${item.id}">
                <div class="featured-item-visual gallery-visual">
                    <img src="${item.thumb || item.src}" alt="${item.title}" loading="lazy">
                    <div class="gallery-overlay">
                        <div class="gallery-icon">
                            <i class="fas fa-expand"></i>
                        </div>
                    </div>
                </div>
                <div class="featured-item-header">
                    <h3 class="featured-item-title">${item.title}</h3>
                    <span class="featured-item-year">${item.year}</span>
                </div>
                <p class="featured-item-description">${item.description}</p>
                <div class="featured-item-meta">
                    <span class="meta-item">
                        <i class="fas fa-palette"></i> ${item.medium || 'Digital'}
                    </span>
                    ${item.dimensions ? `
                        <span class="meta-item">
                            <i class="fas fa-expand-arrows-alt"></i> ${item.dimensions}
                        </span>
                    ` : ''}
                </div>
                <div class="featured-item-actions">
                    <button class="featured-action-btn gallery-btn" onclick="Navigation.navigateTo('images')">
                        <i class="fas fa-images"></i>
                        <span class="btn-text">Open Gallery</span>
                        <span class="btn-icon-alt"><i class="fas fa-search-plus"></i></span>
                    </button>
                </div>
            </div>
        `).join('');
    },

    generateFeaturedTexts() {
        const container = Utils.$('#featured-texts .featured-items');
        if (!container || !portfolioData.texts) return;

        const featured = portfolioData.texts.filter(item => item.featured).slice(0, 3);

        container.innerHTML = featured.map(item => `
            <div class="featured-item" data-text-id="${item.id}">
                <div class="featured-item-visual text-visual">
                    <div class="text-icon">
                        <i class="fas fa-file-text"></i>
                    </div>
                    <div class="text-preview">
                        <div class="text-lines">
                            <span></span><span></span><span></span>
                            <span class="short"></span><span></span>
                        </div>
                    </div>
                </div>
                <div class="featured-item-header">
                    <h3 class="featured-item-title">${item.title}</h3>
                    <span class="featured-item-year">${item.year}</span>
                </div>
                <p class="featured-item-description">${item.description}</p>
                <div class="featured-item-meta">
                    ${item.pages ? `
                        <span class="meta-item">
                            <i class="fas fa-file-alt"></i> ${item.pages} pages
                        </span>
                    ` : ''}
                    <span class="meta-item ${item.published ? 'published' : 'draft'}">
                        <i class="fas ${item.published ? 'fa-check-circle' : 'fa-edit'}"></i> 
                        ${item.published ? 'Published' : 'Draft'}
                    </span>
                </div>
                <div class="featured-item-tags">
                    ${item.tags ? item.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <div class="featured-item-actions">
                    <button class="featured-action-btn read-btn" onclick="Navigation.navigateTo('texts')">
                        <i class="fas fa-book-open"></i>
                        <span class="btn-text">Read More</span>
                        <span class="btn-icon-alt"><i class="fas fa-file-text"></i></span>
                    </button>
                </div>
            </div>
        `).join('');
    },

    generateAudioContent() {
        const container = Utils.$('#audio-content');
        if (!container || !portfolioData.audio) return;

        container.innerHTML = `
            <div class="audio-grid">
                ${portfolioData.audio.map(item => `
                    <div class="audio-card" data-audio-id="${item.id}">
                        <div class="bandcamp-container">
                            <div class="bandcamp-logo">
                                <i class="fab fa-bandcamp"></i>
                            </div>
                            <div class="bandcamp-embed">
                                <iframe src="${item.embedUrl}" 
                                        title="${item.title}"
                                        loading="lazy">
                                </iframe>
                            </div>
                        </div>
                        <div class="audio-info">
                            <h3 class="audio-title">${item.title}</h3>
                            <p class="audio-description">${item.description}</p>
                            <div class="audio-meta">
                                <span class="audio-year">${item.year}</span>
                                ${item.tags ? `<span class="audio-tags">${item.tags.join(', ')}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    hideFeaturedSections() {
        const featuredSections = Utils.$$('.featured-section');
        featuredSections.forEach(section => {
            section.style.display = 'none';
        });
    },

    generateImageContent() {
        const container = Utils.$('#image-gallery');
        if (!container || !portfolioData.images) return;

        container.innerHTML = `
            <div class="content-grid">
                ${portfolioData.images.map(item => `
                    <div class="tile image-tile" data-image-id="${item.id}">
                        <div class="tile-thumbnail">
                            <img src="${item.thumb || item.src}" 
                                 alt="${item.title}" 
                                 loading="lazy"
                                 data-full-src="${item.src}">
                            <div class="tile-overlay">
                                <div class="play-icon">
                                    <i class="fas fa-search-plus"></i>
                                </div>
                            </div>
                        </div>
                        <div class="tile-info">
                            <h3 class="tile-title">${item.title}</h3>
                            <p class="tile-description">${item.description}</p>
                            <div class="tile-meta">
                                <span><i class="fas fa-calendar"></i> ${item.year}</span>
                                <span><i class="fas fa-palette"></i> ${item.medium || 'Digital'}</span>
                                ${item.dimensions ? `<span><i class="fas fa-expand-arrows-alt"></i> ${item.dimensions}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handlers for image tiles
        const imageTiles = container.querySelectorAll('.image-tile');
        imageTiles.forEach(tile => {
            tile.addEventListener('click', (e) => {
                const imageId = tile.getAttribute('data-image-id');
                const imageData = portfolioData.getImageById(imageId);
                if (imageData && typeof Lightbox !== 'undefined') {
                    Lightbox.open(imageData);
                }
            });
        });
    },

    generateVideoContent() {
        const container = Utils.$('#video-gallery');
        if (!container || !portfolioData.videos) {
            console.log('Video container or data not found');
            return;
        }

        console.log('Generating video content for', portfolioData.videos.length, 'videos');

        container.innerHTML = `
            <div class="video-list">
                ${portfolioData.videos.map(video => `
                    <div class="video-item" data-video-id="${video.id}">
                        <div class="video-embed-container">
                            <iframe src="https://www.youtube.com/embed/${video.embedId}" 
                                    title="${video.title}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerpolicy="strict-origin-when-cross-origin" 
                                    allowfullscreen>
                            </iframe>
                        </div>
                        <div class="video-details">
                            <h3 class="video-title">${video.title}</h3>
                            <p class="video-description">${video.description}</p>
                            <div class="video-meta">
                                <span class="video-duration"><i class="fas fa-clock"></i> ${video.duration}</span>
                                <span class="video-year"><i class="fas fa-calendar"></i> ${video.year}</span>
                                ${video.tags ? `<span class="video-tags"><i class="fas fa-tags"></i> ${video.tags.join(', ')}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    generateTextContent() {
        const container = Utils.$('#text-content');
        if (!container || !portfolioData.texts) return;

        container.innerHTML = portfolioData.texts.map(item => `
            <article class="text-item" data-text-id="${item.id}">
                <header class="text-item-header">
                    <h2 class="text-item-title">${item.title}</h2>
                    <div class="text-item-meta">
                        <span class="meta-item">
                            <i class="fas fa-calendar"></i> ${item.year}
                        </span>
                        ${item.published ? `
                            <span class="meta-item published">
                                <i class="fas fa-check-circle"></i> Published
                            </span>
                        ` : `
                            <span class="meta-item draft">
                                <i class="fas fa-edit"></i> Draft
                            </span>
                        `}
                        ${item.pages ? `
                            <span class="meta-item">
                                <i class="fas fa-file-alt"></i> ${item.pages} pages
                            </span>
                        ` : ''}
                    </div>
                </header>

                <div class="text-item-description">
                    <p>${item.description}</p>
                </div>

                <div class="text-item-content">
                    ${this.formatTextContent(item.content)}
                </div>

                ${item.tags ? `
                    <div class="text-item-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}

                ${item.downloadUrl ? `
                    <div class="text-item-actions">
                        <a href="${item.downloadUrl}" class="download-btn" download>
                            <i class="fas fa-download"></i>
                            Download PDF
                        </a>
                    </div>
                ` : ''}
            </article>
        `).join('');

        // Add click handlers for text expansion
        const expandBtns = container.querySelectorAll('.text-expand-btn');
        expandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const textItem = e.target.closest('.text-item');
                const expandContent = textItem.querySelector('.text-expand-content');
                const expandText = e.target.querySelector('.expand-text');
                const collapseText = e.target.querySelector('.collapse-text');
                const icon = e.target.querySelector('i');

                if (expandContent.style.display === 'none') {
                    expandContent.style.display = 'block';
                    expandText.style.display = 'none';
                    collapseText.style.display = 'inline';
                    icon.className = 'fas fa-chevron-up';
                } else {
                    expandContent.style.display = 'none';
                    expandText.style.display = 'inline';
                    collapseText.style.display = 'none';
                    icon.className = 'fas fa-chevron-down';
                }
            });
        });
    },

    formatTextContent(content) {
        if (!content) return '';

        // Simple markdown-like formatting
        const paragraphs = content.split('\n\n');
        const preview = paragraphs.slice(0, 3);
        const hasMore = paragraphs.length > 3;

        let formattedContent = preview.map(p => `<p>${this.formatInlineText(p)}</p>`).join('');

        if (hasMore) {
            const remainingContent = paragraphs.slice(3).map(p => `<p>${this.formatInlineText(p)}</p>`).join('');
            formattedContent += `
                <div class="text-expand-content" style="display: none;">
                    ${remainingContent}
                </div>
                <button class="text-expand-btn">
                    <span class="expand-text">Read More</span>
                    <span class="collapse-text" style="display: none;">Read Less</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
            `;
        }

        return formattedContent;
    },

    formatInlineText(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    },



    generateAboutContent() {
        const container = Utils.$('#about-content');
        if (!container || !portfolioData.about) return;

        const about = portfolioData.about;

        container.innerHTML = `
            <div class="about-sections">
                <section class="about-section bio-section">
                    <h2 class="section-title">Biography</h2>
                    <div class="section-content">
                        <p>${about.bio}</p>
                    </div>
                </section>

                <section class="about-section statement-section">
                    <h2 class="section-title">Artist Statement</h2>
                    <div class="section-content">
                        <p>${about.statement}</p>
                    </div>
                </section>

                <section class="about-section education-section">
                    <h2 class="section-title">Education</h2>
                    <div class="section-content">
                        <ul class="education-list">
                            ${about.education.map(edu => `
                                <li class="education-item">
                                    <div class="education-degree">${edu.degree}</div>
                                    <div class="education-institution">${edu.institution}</div>
                                    <div class="education-location">${edu.location}</div>
                                    <div class="education-year">${edu.year} (${edu.status})</div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </section>

                <section class="about-section exhibitions-section">
                    <h2 class="section-title">Selected Exhibitions</h2>
                    <div class="section-content">
                        <ul class="exhibitions-list">
                            ${about.exhibitions.map(ex => `
                                <li class="exhibition-item">
                                    <div class="exhibition-title">${ex.title}</div>
                                    <div class="exhibition-type">${ex.type}</div>
                                    <div class="exhibition-venue">${ex.venue}, ${ex.location}</div>
                                    <div class="exhibition-year">${ex.year}</div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </section>

                <section class="about-section tools-section">
                    <h2 class="section-title">Tools & Technologies</h2>
                    <div class="section-content">
                        <div class="tools-grid">
                            ${about.tools.map(tool => `
                                <div class="tool-item">
                                    <span class="tool-name">${tool}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>
            </div>
        `;
    },

    generateContactContent() {
        const container = Utils.$('#contact-content');
        if (!container || !portfolioData.contact) return;

        const contact = portfolioData.contact;

        // Helper function to get platform icon and class
        const getPlatformInfo = (platform, url) => {
            const platformMap = {
                'Instagram': { icon: 'fab fa-instagram', class: 'instagram' },
                'YouTube': { icon: 'fab fa-youtube', class: 'youtube' },
                'Bandcamp': { icon: 'fab fa-bandcamp', class: 'bandcamp' },
                'Patreon': { icon: 'fab fa-patreon', class: 'patreon' },
                'LinkedIn': { icon: 'fab fa-linkedin', class: 'linkedin' }
            };
            return platformMap[platform] || { icon: 'fas fa-external-link-alt', class: 'default' };
        };

        container.innerHTML = `
            <div class="contact-sections">
                <div class="contact-info-section">
                    <h3>Connect</h3>

                    <!-- Social Media Icons -->
                    <div class="social-icons">
                        ${contact.socials.map(social => {
                            const platformInfo = getPlatformInfo(social.platform, social.url);
                            return `
                                <a href="${social.url}" 
                                   class="social-icon ${platformInfo.class}" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   aria-label="${social.label}">
                                    <i class="${platformInfo.icon}"></i>
                                </a>
                            `;
                        }).join('')}
                    </div>

                    <!-- Detailed Social Links -->
                    <div class="social-links">
                        ${contact.socials.map(social => {
                            const platformInfo = getPlatformInfo(social.platform, social.url);
                            return `
                                <a href="${social.url}" class="social-link" target="_blank" rel="noopener noreferrer">
                                    <i class="${platformInfo.icon}"></i>
                                    <span class="social-label">${social.label}</span>
                                    <span class="social-handle">${social.handle}</span>
                                </a>
                            `;
                        }).join('')}
                    </div>

                    <div class="location-info">
                        <h4>Location</h4>
                        <p>${contact.location}</p>
                    </div>
                </div>
            </div>
        `;
    },

    generateThesisContent() {
        const container = Utils.$('#thesis-content');
        if (!container || !portfolioData.thesis) return;

        const thesis = portfolioData.thesis;

        container.innerHTML = `
            <div class="thesis-sections">
                <div class="thesis-overview">
                    <h3>Abstract</h3>
                    <p class="thesis-abstract">${thesis.abstract}</p>

                    <div class="thesis-meta">
                        <div class="meta-item">
                            <label>Institution:</label>
                            <span>${thesis.institution}</span>
                        </div>
                        <div class="meta-item">
                            <label>Year:</label>
                            <span>${thesis.year}</span>
                        </div>
                        <div class="meta-item">
                            <label>Pages:</label>
                            <span>${thesis.pages}</span>
                        </div>
                        <div class="meta-item">
                            <label>Supervisor:</label>
                            <span>${thesis.supervisor}</span>
                        </div>
                    </div>

                    <div class="thesis-keywords">
                        <h4>Keywords</h4>
                        <div class="keyword-tags">
                            ${thesis.keywords.map(keyword => `<span class="tag">${keyword}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="thesis-viewer">
                    <iframe src="${thesis.file}" 
                            width="100%" 
                            height="600"
                            title="Thesis PDF Viewer">
                        <p>Your browser does not support embedded PDFs. 
                           <a href="${thesis.file}" target="_blank">Download the thesis</a>.</p>
                    </iframe>
                </div>

                <div class="thesis-download">
                    <a href="${thesis.file}" class="download-btn large" download>
                        <i class="fas fa-download"></i>
                        Download Full Thesis (PDF)
                    </a>
                </div>
            </div>
        `;
    },

    // Utility method to refresh all content
    refreshAllContent() {
        if (this.isInitialized) {
            this.generateAllPages();
        }
    },

    // Method to update last modified time
    updateLastModified() {
        const lastUpdatedElement = Utils.$('#last-updated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    // Ensure home page is visible first
    const homePage = Utils.$('#home');
    if (homePage) {
        homePage.classList.add('active');
    }

    PageGenerator.init();
    PageGenerator.updateLastModified();
});

// Export for global access
window.PageGenerator = PageGenerator;