// ===================================================================
// DYNAMIC PAGE GENERATOR
// ===================================================================

class PageGenerator {
    constructor() {
        this.contentContainer = document.getElementById('page-content');
        this.currentPage = null;
        this.pageCache = new Map();
    }
    
    async generatePage(pageType, data = {}) {
        if (!this.contentContainer) return;
        
        // Show loading state
        this.showLoading();
        
        try {
            let content;
            
            switch (pageType) {
                case 'home':
                    content = await this.generateHomePage(data);
                    break;
                case 'about':
                    content = await this.generateAboutPage(data);
                    break;
                case 'projects':
                    content = await this.generateProjectsPage(data);
                    break;
                case 'project-detail':
                    content = await this.generateProjectDetailPage(data);
                    break;
                case 'audio':
                    content = await this.generateAudioPage(data);
                    break;
                case 'contact':
                    content = await this.generateContactPage(data);
                    break;
                default:
                    content = await this.generate404Page();
            }
            
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(content);
            
            this.currentPage = { type: pageType, data };
            
            // Post-processing
            this.postProcessPage();
            
            window.appEvents.emit('pageGenerated', { pageType, data });
            
        } catch (error) {
            console.error('Error generating page:', error);
            this.showError('Failed to generate page content');
        }
    }
    
    showLoading() {
        this.contentContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner" aria-label="Loading content"></div>
                <p>Generating experimental systems...</p>
            </div>
        `;
    }
    
    showError(message) {
        this.contentContainer.innerHTML = `
            <div class="error-state content-block">
                <h2>Error</h2>
                <p>${sanitizeHTML(message)}</p>
                <button onclick="window.router.navigate('/')">Return Home</button>
            </div>
        `;
    }
    
    async generateHomePage(data) {
        const container = createElement('div', { className: 'home-page' });
        
        // Hero section with featured content
        const hero = createElement('section', {
            className: 'hero-section content-block',
            'aria-labelledby': 'hero-title'
        });
        
        hero.innerHTML = `
            <h1 id="hero-title" class="sr-only">Atharva Gupta - Experimental Systems</h1>
            <div class="hero-content">
                <p class="hero-description">
                    I make experimental systems that combine sound, light, code, and kinetic structures. 
                    My work explores the edges between control and collapse—between what is designed and what breaks, flickers, loops, or hums out of place.
                </p>
            </div>
        `;
        
        container.appendChild(hero);
        
        // Featured projects
        if (window.portfolioData.projects.length > 0) {
            const featuredSection = createElement('section', {
                className: 'featured-projects',
                'aria-labelledby': 'featured-title'
            });
            
            const title = createElement('h2', {
                id: 'featured-title',
                className: 'section-title'
            }, 'Featured Works');
            
            featuredSection.appendChild(title);
            
            const projectsGrid = createElement('div', { className: 'projects-grid' });
            
            // Show first 3 projects
            const featuredProjects = window.portfolioData.projects.slice(0, 3);
            
            for (const project of featuredProjects) {
                const projectCard = await this.createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            }
            
            featuredSection.appendChild(projectsGrid);
            container.appendChild(featuredSection);
        }
        
        // Recent audio
        if (window.portfolioData.audioProjects.length > 0) {
            const audioSection = createElement('section', {
                className: 'recent-audio',
                'aria-labelledby': 'audio-title'
            });
            
            const title = createElement('h2', {
                id: 'audio-title',
                className: 'section-title'
            }, 'Recent Audio');
            
            audioSection.appendChild(title);
            
            // Show first 2 audio tracks
            const recentAudio = window.portfolioData.audioProjects.slice(0, 2);
            
            for (const audioData of recentAudio) {
                const audioPlayer = new AudioPlayer(audioData);
                const playerElement = audioPlayer.render();
                audioSection.appendChild(playerElement);
            }
            
            container.appendChild(audioSection);
        }
        
        return container;
    }
    
    async generateAboutPage(data) {
        const container = createElement('div', { className: 'about-page' });
        
        // Load about content from markdown files
        const aboutTexts = window.portfolioData.textProjects.filter(
            text => text.category === 'about' && text.featured
        );
        
        for (const textData of aboutTexts) {
            const textContent = new TextContent(textData);
            const contentElement = await textContent.render();
            container.appendChild(contentElement);
        }
        
        // If no about content found, show basic info
        if (aboutTexts.length === 0) {
            const fallbackContent = createElement('div', {
                className: 'content-block'
            });
            
            fallbackContent.innerHTML = `
                <h1>About</h1>
                <p>
                    I'm Atharva Gupta (aka <em>asymmetrica</em>), an artist from Ajmer, India, 
                    currently based in the Netherlands. I study MADTech at the Frank Mohr Institute in Groningen.
                </p>
                <p>
                    My work includes audiovisual installations, kinetic sound objects, and generative media, 
                    often investigating the politics and poetics of sensing through machines.
                </p>
            `;
            
            container.appendChild(fallbackContent);
        }
        
        return container;
    }
    
    async generateProjectsPage(data) {
        const container = createElement('div', { className: 'projects-page' });
        
        // Page header
        const header = createElement('div', { className: 'content-block' });
        header.innerHTML = `
            <h1>Projects</h1>
            <p>A collection of experimental systems exploring sound, light, code, and kinetic structures.</p>
        `;
        container.appendChild(header);
        
        // Project filters (if needed)
        if (this.hasMultipleProjectTypes()) {
            const filters = this.createProjectFilters();
            container.appendChild(filters);
        }
        
        // Projects grid
        const projectsGrid = createElement('div', { className: 'projects-grid' });
        
        for (const project of window.portfolioData.projects) {
            const projectCard = await this.createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        }
        
        container.appendChild(projectsGrid);
        
        return container;
    }
    
    async generateProjectDetailPage(data) {
        const { projectId } = data;
        const project = window.portfolioData.projects.find(p => p.id === projectId);
        
        if (!project) {
            return this.generate404Page();
        }
        
        const container = createElement('div', { className: 'project-detail-page' });
        
        // Project header
        const header = createElement('div', { className: 'project-header content-block' });
        
        if (project.featuredImage) {
            const image = createElement('img', {
                src: project.featuredImage,
                alt: project.title,
                className: 'project-featured-image'
            });
            header.appendChild(image);
        }
        
        const headerContent = createElement('div', { className: 'project-header-content' });
        headerContent.innerHTML = `
            <h1>${sanitizeHTML(project.title)}</h1>
            ${project.subtitle ? `<p class="project-subtitle">${sanitizeHTML(project.subtitle)}</p>` : ''}
            <div class="project-meta">
                <span class="project-year">${sanitizeHTML(project.year)}</span>
                <span class="project-status">${sanitizeHTML(project.status)}</span>
            </div>
            <p class="project-description">${sanitizeHTML(project.description)}</p>
        `;
        
        header.appendChild(headerContent);
        container.appendChild(header);
        
        // Project content sections
        if (project.text && project.text.length > 0) {
            for (const textId of project.text) {
                const textData = window.portfolioData.textProjects.find(t => t.id === textId);
                if (textData) {
                    const textContent = new TextContent(textData);
                    const contentElement = await textContent.render();
                    container.appendChild(contentElement);
                }
            }
        }
        
        // Project audio
        if (project.audio && project.audio.length > 0) {
            const audioSection = createElement('section', {
                className: 'project-audio',
                'aria-labelledby': 'project-audio-title'
            });
            
            const title = createElement('h2', {
                id: 'project-audio-title'
            }, 'Audio');
            audioSection.appendChild(title);
            
            for (const audioId of project.audio) {
                const audioData = window.portfolioData.audioProjects.find(a => a.id === audioId);
                if (audioData) {
                    const audioPlayer = new AudioPlayer(audioData);
                    const playerElement = audioPlayer.render();
                    audioSection.appendChild(playerElement);
                }
            }
            
            container.appendChild(audioSection);
        }
        
        // Project images
        if (project.images && project.images.length > 0) {
            const imagesSection = createElement('section', {
                className: 'project-images',
                'aria-labelledby': 'project-images-title'
            });
            
            const title = createElement('h2', {
                id: 'project-images-title'
            }, 'Images');
            imagesSection.appendChild(title);
            
            for (const galleryId of project.images) {
                const galleryData = window.portfolioData.imageGalleries.find(g => g.id === galleryId);
                if (galleryData) {
                    const gallery = new ImageGallery(galleryData);
                    const galleryElement = gallery.render();
                    imagesSection.appendChild(galleryElement);
                }
            }
            
            container.appendChild(imagesSection);
        }
        
        // Project links
        if (project.links && Object.keys(project.links).length > 0) {
            const linksSection = createElement('div', { className: 'project-links content-block' });
            
            const title = createElement('h3', {}, 'External Links');
            linksSection.appendChild(title);
            
            const linksList = createElement('ul', { className: 'external-links' });
            
            Object.entries(project.links).forEach(([type, url]) => {
                const listItem = createElement('li');
                const link = createElement('a', {
                    href: url,
                    target: '_blank',
                    rel: 'noopener noreferrer'
                }, type.charAt(0).toUpperCase() + type.slice(1));
                
                listItem.appendChild(link);
                linksList.appendChild(listItem);
            });
            
            linksSection.appendChild(linksList);
            container.appendChild(linksSection);
        }
        
        return container;
    }
    
    async generateAudioPage(data) {
        const container = createElement('div', { className: 'audio-page' });
        
        // Page header
        const header = createElement('div', { className: 'content-block' });
        header.innerHTML = `
            <h1>Audio Works</h1>
            <p>Experimental soundscapes and compositions exploring the intersection of machine and human rhythms.</p>
        `;
        container.appendChild(header);
        
        // Audio players
        for (const audioData of window.portfolioData.audioProjects) {
            const audioPlayer = new AudioPlayer(audioData);
            const playerElement = audioPlayer.render();
            container.appendChild(playerElement);
        }
        
        return container;
    }
    
    async generateContactPage(data) {
        const container = createElement('div', { className: 'contact-page' });
        
        const content = createElement('div', { className: 'content-block' });
        content.innerHTML = `
            <h1>Contact</h1>
            <p>
                Let's connect and collaborate on experimental systems that push the boundaries 
                between art, technology, and human experience.
            </p>
            
            <div class="contact-info">
                <h2>Get in Touch</h2>
                <p>
                    Email: <a href="mailto:${window.portfolioData.siteConfig.email}">${window.portfolioData.siteConfig.email}</a>
                </p>
                
                <h3>Find me online</h3>
                <ul class="contact-links">
                    ${Object.entries(window.portfolioData.siteConfig.social)
                        .map(([platform, url]) => `
                            <li>
                                <a href="${url}" target="_blank" rel="noopener noreferrer">
                                    ${platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </a>
                            </li>
                        `).join('')}
                </ul>
                
                <h3>Collaboration</h3>
                <p>
                    I'm interested in collaborating on projects that explore:
                </p>
                <ul>
                    <li>Experimental sound and kinetic installations</li>
                    <li>Generative and interactive media systems</li>
                    <li>Critical investigations of surveillance and technology</li>
                    <li>Academic research in media arts and digital culture</li>
                </ul>
            </div>
        `;
        
        container.appendChild(content);
        
        return container;
    }
    
    async generate404Page() {
        const container = createElement('div', { className: 'error-404-page' });
        
        const content = createElement('div', { className: 'content-block' });
        content.innerHTML = `
            <h1>404 - System Not Found</h1>
            <p>
                The experimental system you're looking for seems to have glitched out of existence.
                Perhaps it's exploring parallel dimensions of the web.
            </p>
            <p>
                <button onclick="window.router.navigate('/')" class="btn-primary">
                    Return to Base Reality
                </button>
            </p>
        `;
        
        container.appendChild(content);
        
        return container;
    }
    
    async createProjectCard(project) {
        const card = createElement('article', {
            className: 'project-card',
            'data-project-id': project.id,
            tabindex: '0',
            role: 'button',
            'aria-label': `View project: ${project.title}`
        });
        
        // Project image
        if (project.featuredImage) {
            const image = createElement('img', {
                'data-src': project.featuredImage, // Lazy loading
                alt: project.title,
                className: 'lazy'
            });
            card.appendChild(image);
        }
        
        // Project content
        const content = createElement('div', { className: 'project-card-content' });
        
        const title = createElement('h3', {}, project.title);
        content.appendChild(title);
        
        if (project.subtitle) {
            const subtitle = createElement('p', {
                className: 'project-subtitle'
            }, project.subtitle);
            content.appendChild(subtitle);
        }
        
        const description = createElement('p', {
            className: 'project-description'
        }, project.description);
        content.appendChild(description);
        
        // Project tags
        if (project.tags && project.tags.length > 0) {
            const tagsContainer = createElement('div', { className: 'project-tags' });
            
            project.tags.forEach(tag => {
                const tagElement = createElement('span', {
                    className: 'project-tag'
                }, tag);
                tagsContainer.appendChild(tagElement);
            });
            
            content.appendChild(tagsContainer);
        }
        
        card.appendChild(content);
        
        // Click/keyboard navigation
        const navigateToProject = () => {
            window.router.navigate(`/project/${project.id}`);
        };
        
        card.addEventListener('click', navigateToProject);
        card.addEventListener('keydown', (e) => {
            if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault();
                navigateToProject();
            }
        });
        
        return card;
    }
    
    hasMultipleProjectTypes() {
        const mediums = new Set();
        window.portfolioData.projects.forEach(project => {
            if (project.medium) {
                project.medium.forEach(m => mediums.add(m));
            }
        });
        return mediums.size > 3;
    }
    
    createProjectFilters() {
        const filtersContainer = createElement('div', {
            className: 'project-filters content-block'
        });
        
        // Collect all mediums/tags
        const mediums = new Set(['all']);
        window.portfolioData.projects.forEach(project => {
            if (project.medium) {
                project.medium.forEach(m => mediums.add(m));
            }
        });
        
        const filtersList = createElement('ul', {
            className: 'filters-list',
            role: 'tablist'
        });
        
        Array.from(mediums).forEach(medium => {
            const listItem = createElement('li', { role: 'presentation' });
            const button = createElement('button', {
                className: medium === 'all' ? 'filter-btn active' : 'filter-btn',
                'data-filter': medium,
                role: 'tab',
                'aria-selected': medium === 'all' ? 'true' : 'false'
            }, medium === 'all' ? 'All' : medium);
            
            button.addEventListener('click', () => this.filterProjects(medium));
            
            listItem.appendChild(button);
            filtersList.appendChild(listItem);
        });
        
        filtersContainer.appendChild(filtersList);
        
        return filtersContainer;
    }
    
    filterProjects(filterValue) {
        const projectCards = document.querySelectorAll('.project-card');
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        // Update active filter button
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filterValue}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-selected', 'true');
        }
        
        // Filter projects
        projectCards.forEach(card => {
            const projectId = card.dataset.projectId;
            const project = window.portfolioData.projects.find(p => p.id === projectId);
            
            if (filterValue === 'all' || (project.medium && project.medium.includes(filterValue))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    postProcessPage() {
        // Initialize lazy loading
        if (window.lazyImageLoader) {
            window.lazyImageLoader.observeAll();
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update page title
        this.updatePageTitle();
        
        // Announce page change to screen readers
        this.announcePageChange();
    }
    
    updatePageTitle() {
        if (!this.currentPage) return;
        
        const baseTitle = window.portfolioData.siteConfig.title;
        let pageTitle = baseTitle;
        
        switch (this.currentPage.type) {
            case 'about':
                pageTitle = `About - ${baseTitle}`;
                break;
            case 'projects':
                pageTitle = `Projects - ${baseTitle}`;
                break;
            case 'project-detail':
                const project = window.portfolioData.projects.find(p => p.id === this.currentPage.data.projectId);
                if (project) {
                    pageTitle = `${project.title} - ${baseTitle}`;
                }
                break;
            case 'audio':
                pageTitle = `Audio - ${baseTitle}`;
                break;
            case 'contact':
                pageTitle = `Contact - ${baseTitle}`;
                break;
        }
        
        document.title = pageTitle;
    }
    
    announcePageChange() {
        // Create or update live region for screen readers
        let liveRegion = document.getElementById('page-change-announcer');
        if (!liveRegion) {
            liveRegion = createElement('div', {
                id: 'page-change-announcer',
                className: 'sr-only',
                'aria-live': 'polite',
                'aria-atomic': 'true'
            });
            document.body.appendChild(liveRegion);
        }
        
        const pageNames = {
            'home': 'Home page',
            'about': 'About page',
            'projects': 'Projects page',
            'project-detail': 'Project details page',
            'audio': 'Audio page',
            'contact': 'Contact page'
        };
        
        const pageName = pageNames[this.currentPage?.type] || 'Page';
        liveRegion.textContent = `${pageName} loaded`;
    }
}

// ===================================================================
// INITIALIZE PAGE GENERATOR
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    window.pageGenerator = new PageGenerator();
});