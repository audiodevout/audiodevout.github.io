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
        this.generateDownloadsContent();
        this.generateAboutContent();
        this.generateContactContent();
        this.generateThesisContent();
        
        console.log('✓ All page content generated');
    },
    
    generatePageContent(pageId) {
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
            case 'downloads':
                this.generateDownloadsContent();
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
    
    generateHomeContent() {
        this.generateFeaturedAudio();
        this.generateFeaturedImages();
        this.generateFeaturedTexts();
    },
    
    generateFeaturedAudio() {
        const container = Utils.$('#featured-audio .featured-items');
        if (!container || !portfolioData.audio) return;
        
        const featured = portfolioData.audio.filter(item => item.featured).slice(0, 3);
        
        container.innerHTML = featured.map(item => `
            <div class="featured-item" data-audio-id="${item.id}">
                <div class="featured-item-header">
                    <h3 class="featured-item-title">${item.title}</h3>
                    <span class="featured-item-year">${item.year}</span>
                </div>
                <p class="featured-item-description">${item.description}</p>
                <div class="featured-item-actions">
                    <button class="featured-action-btn" onclick="Navigation.navigateTo('audio')">
                        <i class="fas fa-headphones"></i>
                        Listen
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
                <div class="featured-item-visual">
                    <img src="${item.thumb || item.src}" alt="${item.title}" loading="lazy">
                </div>
                <div class="featured-item-header">
                    <h3 class="featured-item-title">${item.title}</h3>
                    <span class="featured-item-year">${item.year}</span>
                </div>
                <p class="featured-item-description">${item.description}</p>
                <div class="featured-item-actions">
                    <button class="featured-action-btn" onclick="Navigation.navigateTo('images')">
                        <i class="fas fa-images"></i>
                        View Gallery
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
                <div class="featured-item-header">
                    <h3 class="featured-item-title">${item.title}</h3>
                    <span class="featured-item-year">${item.year}</span>
                </div>
                <p class="featured-item-description">${item.description}</p>
                <div class="featured-item-tags">
                    ${item.tags ? item.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <div class="featured-item-actions">
                    <button class="featured-action-btn" onclick="Navigation.navigateTo('texts')">
                        <i class="fas fa-book-open"></i>
                        Read More
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    generateAudioContent() {
        // Audio content is handled by AudioPlayer.js
        // This method ensures the container exists
        const container = Utils.$('#audio-players');
        if (container && !container.hasChildNodes()) {
            if (typeof AudioPlayer !== 'undefined') {
                AudioPlayer.createPlayers();
            }
        }
    },
    
    generateImageContent() {
        const container = Utils.$('#image-gallery');
        if (!container || !portfolioData.images) return;
        
        container.innerHTML = portfolioData.images.map(item => `
            <div class="gallery-item" data-image-id="${item.id}">
                <div class="gallery-item-image">
                    <img src="${item.thumb || item.src}" 
                         alt="${item.title}" 
                         loading="lazy"
                         data-full-src="${item.src}">
                    <div class="gallery-item-overlay">
                        <button class="gallery-view-btn" aria-label="View ${item.title}">
                            <i class="fas fa-search-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="gallery-item-info">
                    <h3 class="gallery-item-title">${item.title}</h3>
                    <p class="gallery-item-description">${item.description}</p>
                    <div class="gallery-item-meta">
                        <span class="meta-item">
                            <i class="fas fa-calendar"></i> ${item.year}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-palette"></i> ${item.medium || 'Digital'}
                        </span>
                        ${item.dimensions ? `
                            <span class="meta-item">
                                <i class="fas fa-expand-arrows-alt"></i> ${item.dimensions}
                            </span>
                        ` : ''}
                    </div>
                    ${item.tags ? `
                        <div class="gallery-item-tags">
                            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },
    
    generateVideoContent() {
        const container = Utils.$('#video-gallery');
        if (!container || !portfolioData.videos) return;
        
        container.innerHTML = portfolioData.videos.map(item => `
            <div class="gallery-item video-item" data-video-id="${item.id}">
                <div class="video-embed-container">
                    <iframe src="https://www.youtube.com/embed/${item.embedId}" 
                            title="${item.title}" 
                            frameborder="0" 
                            allowfullscreen
                            loading="lazy">
                    </iframe>
                </div>
                <div class="gallery-item-info">
                    <h3 class="gallery-item-title">${item.title}</h3>
                    <p class="gallery-item-description">${item.description}</p>
                    <div class="gallery-item-meta">
                        <span class="meta-item">
                            <i class="fas fa-clock"></i> ${item.duration}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-calendar"></i> ${item.year}
                        </span>
                        ${item.venue ? `
                            <span class="meta-item">
                                <i class="fas fa-map-marker-alt"></i> ${item.venue}
                            </span>
                        ` : ''}
                    </div>
                    ${item.tags ? `
                        <div class="gallery-item-tags">
                            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
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
    
    generateDownloadsContent() {
        const container = Utils.$('#downloads-list');
        if (!container || !portfolioData.downloads) return;
        
        // Group downloads by category
        const categories = {};
        portfolioData.downloads.forEach(item => {
            const category = item.category || 'General';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(item);
        });
        
        container.innerHTML = Object.entries(categories).map(([category, items]) => `
            <div class="download-category">
                <h3 class="download-category-title">${category}</h3>
                <div class="download-items">
                    ${items.map(item => `
                        <div class="download-item" data-download-id="${item.id}">
                            <div class="download-item-icon">
                                ${this.getFileIcon(item.type)}
                            </div>
                            <div class="download-item-info">
                                <h4 class="download-item-title">${item.title}</h4>
                                <p class="download-item-description">${item.description}</p>
                                <div class="download-item-meta">
                                    <span class="meta-item">
                                        <i class="fas fa-file"></i> ${item.type}
                                    </span>
                                    <span class="meta-item">
                                        <i class="fas fa-hdd"></i> ${item.size}
                                    </span>
                                    ${item.lastUpdated ? `
                                        <span class="meta-item">
                                            <i class="fas fa-clock"></i> ${item.lastUpdated}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="download-item-actions">
                                <a href="${item.file}" class="download-btn" download="${item.filename || item.title}">
                                    <i class="fas fa-download"></i>
                                    Download
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },
    
    getFileIcon(fileType) {
        const iconMap = {
            'PDF': 'fas fa-file-pdf',
            'DOC': 'fas fa-file-word',
            'DOCX': 'fas fa-file-word',
            'TXT': 'fas fa-file-alt',
            'MP3': 'fas fa-file-audio',
            'WAV': 'fas fa-file-audio',
            'MP4': 'fas fa-file-video',
            'ZIP': 'fas fa-file-archive',
            'RAR': 'fas fa-file-archive',
            'JPG': 'fas fa-file-image',
            'PNG': 'fas fa-file-image',
            'GIF': 'fas fa-file-image'
        };
        
        const iconClass = iconMap[fileType.toUpperCase()] || 'fas fa-file';
        return `<i class="${iconClass}"></i>`;
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
        
        container.innerHTML = `
            <div class="contact-sections">
                <div class="contact-form-section">
                    <h3>Send a Message</h3>
                    <form id="contact-form" class="contact-form" action="${contact.formspreeUrl}" method="POST">
                        <div class="form-group">
                            <label for="name" class="form-label">Name *</label>
                            <input type="text" id="name" name="name" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email" class="form-label">Email *</label>
                            <input type="email" id="email" name="email" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="subject" class="form-label">Subject *</label>
                            <input type="text" id="subject" name="subject" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="message" class="form-label">Message *</label>
                            <textarea id="message" name="message" class="form-textarea" rows="5" required></textarea>
                        </div>
                        
                        <button type="submit" class="form-submit">
                            <i class="fas fa-paper-plane"></i>
                            Send Message
                        </button>
                    </form>
                </div>
                
                <div class="contact-info-section">
                    <h3>Connect</h3>
                    <div class="social-links">
                        ${contact.socials.map(social => `
                            <a href="${social.url}" class="social-link" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-${social.platform.toLowerCase()}"></i>
                                <span class="social-label">${social.label}</span>
                                <span class="social-handle">${social.handle}</span>
                            </a>
                        `).join('')}
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
    PageGenerator.init();
    PageGenerator.updateLastModified();
});

// Export for global access
window.PageGenerator = PageGenerator;