// ===================================================================
// CLIENT-SIDE ROUTER
// ===================================================================

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.isNavigating = false;
        
        this.initializeRoutes();
        this.bindEvents();
    }
    
    initializeRoutes() {
        // Define route patterns and their handlers
        this.routes.set('/', () => this.handleHome());
        this.routes.set('/about', () => this.handleAbout());
        this.routes.set('/projects', () => this.handleProjects());
        this.routes.set('/project/:id', (params) => this.handleProjectDetail(params));
        this.routes.set('/audio', () => this.handleAudio());
        this.routes.set('/contact', () => this.handleContact());
    }
    
    bindEvents() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname, false);
        });
        
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.isInternalLink(link)) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });
        
        // Initial route
        this.handleRoute(window.location.pathname, false);
    }
    
    isInternalLink(link) {
        const href = link.getAttribute('href');
        return href && 
               href.startsWith('/') && 
               !href.startsWith('//') &&
               !link.hasAttribute('target') &&
               !link.hasAttribute('download');
    }
    
    async navigate(path, addToHistory = true) {
        if (this.isNavigating) return;
        
        // Trigger glitch transition
        if (window.glitchTransition) {
            this.isNavigating = true;
            
            window.glitchTransition.trigger(() => {
                this.handleRoute(path, addToHistory);
                this.isNavigating = false;
            });
        } else {
            this.handleRoute(path, addToHistory);
        }
    }
    
    async handleRoute(path, addToHistory = true) {
        // Update browser history
        if (addToHistory && path !== window.location.pathname) {
            window.history.pushState({}, '', path);
        }
        
        // Update navigation active states
        this.updateNavigation(path);
        
        // Find matching route
        const { handler, params } = this.matchRoute(path);
        
        if (handler) {
            this.currentRoute = path;
            await handler(params);
            window.appEvents.emit('routeChanged', { path, params });
        } else {
            // 404 - route not found
            await this.handle404();
        }
    }
    
    matchRoute(path) {
        for (const [pattern, handler] of this.routes) {
            const params = this.matchPattern(pattern, path);
            if (params !== null) {
                return { handler, params };
            }
        }
        return { handler: null, params: {} };
    }
    
    matchPattern(pattern, path) {
        // Convert pattern to regex
        const paramNames = [];
        const regexPattern = pattern.replace(/:([^/]+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });
        
        const regex = new RegExp('^' + regexPattern + '$');
        const match = path.match(regex);
        
        if (!match) return null;
        
        // Extract parameters
        const params = {};
        paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
        });
        
        return params;
    }
    
    updateNavigation(path) {
        // Update main navigation
        const navLinks = document.querySelectorAll('.nav-menu a, .nav-menu button');
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href) {
                if ((href === '/' && path === '/') || 
                    (href !== '/' && path.startsWith(href))) {
                    link.classList.add('active');
                }
            }
        });
        
        // Update navigation aria-current
        const activeLink = document.querySelector('.nav-menu .active');
        document.querySelectorAll('.nav-menu a, .nav-menu button').forEach(link => {
            link.removeAttribute('aria-current');
        });
        if (activeLink) {
            activeLink.setAttribute('aria-current', 'page');
        }
    }
    
    // Route handlers
    async handleHome() {
        await window.pageGenerator.generatePage('home');
    }
    
    async handleAbout() {
        await window.pageGenerator.generatePage('about');
    }
    
    async handleProjects() {
        await window.pageGenerator.generatePage('projects');
    }
    
    async handleProjectDetail(params) {
        await window.pageGenerator.generatePage('project-detail', {
            projectId: params.id
        });
    }
    
    async handleAudio() {
        await window.pageGenerator.generatePage('audio');
    }
    
    async handleContact() {
        await window.pageGenerator.generatePage('contact');
    }
    
    async handle404() {
        await window.pageGenerator.generatePage('404');
    }
    
    // Utility methods
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    goBack() {
        window.history.back();
    }
    
    goForward() {
        window.history.forward();
    }
    
    replace(path) {
        window.history.replaceState({}, '', path);
        this.handleRoute(path, false);
    }
}

// ===================================================================
// NAVIGATION GENERATOR
// ===================================================================

class NavigationGenerator {
    constructor() {
        this.navMenu = document.getElementById('nav-menu');
        this.socialMenu = document.getElementById('social-menu');
        
        if (this.navMenu) {
            this.generateMainNavigation();
        }
        
        if (this.socialMenu) {
            this.generateSocialNavigation();
        }
    }
    
    generateMainNavigation() {
        const navigation = window.portfolioData.navigation;
        
        navigation.forEach(item => {
            const listItem = createElement('li');
            
            if (item.path.startsWith('/')) {
                // Internal link
                const link = createElement('a', {
                    href: item.path,
                    role: 'menuitem'
                }, item.title);
                
                listItem.appendChild(link);
            } else {
                // External link or button
                const button = createElement('button', {
                    type: 'button',
                    role: 'menuitem'
                }, item.title);
                
                if (item.action) {
                    button.addEventListener('click', item.action);
                }
                
                listItem.appendChild(button);
            }
            
            this.navMenu.appendChild(listItem);
        });
    }
    
    generateSocialNavigation() {
        const social = window.portfolioData.siteConfig.social;
        const email = window.portfolioData.siteConfig.email;
        
        // Add email first
        if (email) {
            this.addSocialLink('envelope', `mailto:${email}`, 'Send email');
        }
        
        // Add social platforms
        const socialIcons = {
            'instagram': 'fab fa-instagram',
            'youtube': 'fab fa-youtube',
            'bandcamp': 'fab fa-bandcamp',
            'linkedin': 'fab fa-linkedin'
        };
        
        Object.entries(social).forEach(([platform, url]) => {
            const iconClass = socialIcons[platform] || 'fas fa-external-link-alt';
            const label = `Visit ${platform.charAt(0).toUpperCase() + platform.slice(1)} profile`;
            
            this.addSocialLink(iconClass, url, label);
        });
    }
    
    addSocialLink(iconClass, href, label) {
        const listItem = createElement('li');
        
        const link = createElement('a', {
            href: href,
            'aria-label': label,
            target: href.startsWith('mailto:') ? '_self' : '_blank',
            rel: href.startsWith('mailto:') ? '' : 'noopener noreferrer'
        });
        
        const icon = createElement('i', {
            className: iconClass,
            'aria-hidden': 'true'
        });
        
        link.appendChild(icon);
        listItem.appendChild(link);
        this.socialMenu.appendChild(listItem);
    }
}

// ===================================================================
// BREADCRUMB NAVIGATION
// ===================================================================

class BreadcrumbNavigation {
    constructor() {
        this.container = null;
        this.createContainer();
        this.bindEvents();
    }
    
    createContainer() {
        // Create breadcrumb container if it doesn't exist
        const existingContainer = document.querySelector('.breadcrumb-nav');
        if (existingContainer) {
            this.container = existingContainer;
            return;
        }
        
        this.container = createElement('nav', {
            className: 'breadcrumb-nav',
            'aria-label': 'Breadcrumb'
        });
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(this.container, mainContent.firstChild);
        }
    }
    
    bindEvents() {
        window.appEvents.on('routeChanged', ({ path }) => {
            this.updateBreadcrumbs(path);
        });
    }
    
    updateBreadcrumbs(path) {
        if (!this.container) return;
        
        const breadcrumbs = this.generateBreadcrumbs(path);
        
        if (breadcrumbs.length <= 1) {
            this.container.style.display = 'none';
            return;
        }
        
        this.container.style.display = 'block';
        this.container.innerHTML = '';
        
        const list = createElement('ol', { className: 'breadcrumb-list' });
        
        breadcrumbs.forEach((crumb, index) => {
            const listItem = createElement('li', { className: 'breadcrumb-item' });
            
            if (index === breadcrumbs.length - 1) {
                // Current page (no link)
                listItem.textContent = crumb.title;
                listItem.setAttribute('aria-current', 'page');
            } else {
                // Linked breadcrumb
                const link = createElement('a', {
                    href: crumb.path
                }, crumb.title);
                listItem.appendChild(link);
            }
            
            list.appendChild(listItem);
        });
        
        this.container.appendChild(list);
    }
    
    generateBreadcrumbs(path) {
        const breadcrumbs = [{ title: 'Home', path: '/' }];
        
        if (path === '/') return breadcrumbs;
        
        const segments = path.split('/').filter(Boolean);
        let currentPath = '';
        
        segments.forEach(segment => {
            currentPath += '/' + segment;
            
            let title = segment.charAt(0).toUpperCase() + segment.slice(1);
            
            // Handle special cases
            if (segment.startsWith('project') && segments.length > 1) {
                // Project detail page
                const projectId = segments[segments.indexOf('project') + 1];
                const project = window.portfolioData.projects.find(p => p.id === projectId);
                if (project) {
                    title = project.title;
                }
            }
            
            breadcrumbs.push({ title, path: currentPath });
        });
        
        return breadcrumbs;
    }
}

// ===================================================================
// SEARCH FUNCTIONALITY
// ===================================================================

class SearchSystem {
    constructor() {
        this.searchIndex = [];
        this.searchInput = null;
        this.searchResults = null;
        this.isSearchOpen = false;
        
        this.buildSearchIndex();
        this.createSearchInterface();
        this.bindSearchEvents();
    }
    
    buildSearchIndex() {
        // Index projects
        window.portfolioData.projects.forEach(project => {
            this.searchIndex.push({
                type: 'project',
                id: project.id,
                title: project.title,
                subtitle: project.subtitle,
                description: project.description,
                tags: project.tags,
                url: `/project/${project.id}`,
                content: [project.title, project.subtitle, project.description, ...(project.tags || [])].join(' ')
            });
        });
        
        // Index audio
        window.portfolioData.audioProjects.forEach(audio => {
            this.searchIndex.push({
                type: 'audio',
                id: audio.id,
                title: audio.title,
                description: audio.description,
                tags: audio.tags,
                url: '/audio',
                content: [audio.title, audio.description, ...(audio.tags || [])].join(' ')
            });
        });
        
        // Index text content
        window.portfolioData.textProjects.forEach(text => {
            this.searchIndex.push({
                type: 'content',
                id: text.id,
                title: text.title,
                category: text.category,
                url: text.category === 'about' ? '/about' : '/',
                content: text.title
            });
        });
    }
    
    createSearchInterface() {
        // Create search button in header
        const header = document.querySelector('.site-header');
        if (!header) return;
        
        const searchButton = createElement('button', {
            className: 'search-toggle',
            'aria-label': 'Open search',
            title: 'Search'
        });
        
        searchButton.innerHTML = '<i class="fas fa-search" aria-hidden="true"></i>';
        searchButton.addEventListener('click', () => this.toggleSearch());
        
        header.appendChild(searchButton);
        
        // Create search overlay
        this.createSearchOverlay();
    }
    
    createSearchOverlay() {
        const overlay = createElement('div', {
            className: 'search-overlay',
            'aria-hidden': 'true'
        });
        
        overlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <input type="search" 
                           class="search-input" 
                           placeholder="Search projects, audio, content..."
                           aria-label="Search">
                    <button class="search-close" aria-label="Close search">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="search-results" role="listbox" aria-label="Search results"></div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        this.searchInput = overlay.querySelector('.search-input');
        this.searchResults = overlay.querySelector('.search-results');
        
        overlay.querySelector('.search-close').addEventListener('click', () => this.closeSearch());
    }
    
    bindSearchEvents() {
        // Keyboard shortcut to open search (Ctrl+K or Cmd+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            if (e.key === 'Escape' && this.isSearchOpen) {
                this.closeSearch();
            }
        });
        
        // Search input events
        if (this.searchInput) {
            this.searchInput.addEventListener('input', debounce((e) => {
                this.performSearch(e.target.value);
            }, 300));
            
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.focusFirstResult();
                }
            });
        }
    }
    
    toggleSearch() {
        if (this.isSearchOpen) {
            this.closeSearch();
        } else {
            this.openSearch();
        }
    }
    
    openSearch() {
        const overlay = document.querySelector('.search-overlay');
        if (!overlay) return;
        
        this.isSearchOpen = true;
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        
        // Focus search input
        setTimeout(() => {
            this.searchInput?.focus();
        }, 100);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeSearch() {
        const overlay = document.querySelector('.search-overlay');
        if (!overlay) return;
        
        this.isSearchOpen = false;
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        
        // Clear search
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        if (this.searchResults) {
            this.searchResults.innerHTML = '';
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    performSearch(query) {
        if (!query || query.length < 2) {
            this.searchResults.innerHTML = '';
            return;
        }
        
        const results = this.searchIndex.filter(item => {
            return item.content.toLowerCase().includes(query.toLowerCase());
        }).slice(0, 10); // Limit results
        
        this.displayResults(results, query);
    }
    
    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            return;
        }
        
        this.searchResults.innerHTML = '';
        
        results.forEach((result, index) => {
            const resultElement = this.createResultElement(result, query, index);
            this.searchResults.appendChild(resultElement);
        });
    }
    
    createResultElement(result, query, index) {
        const element = createElement('div', {
            className: 'search-result',
            role: 'option',
            tabindex: '0',
            'aria-selected': 'false'
        });
        
        const typeIcon = this.getTypeIcon(result.type);
        
        element.innerHTML = `
            <div class="search-result-icon">
                <i class="${typeIcon}" aria-hidden="true"></i>
            </div>
            <div class="search-result-content">
                <div class="search-result-title">${this.highlightQuery(result.title, query)}</div>
                ${result.subtitle ? `<div class="search-result-subtitle">${this.highlightQuery(result.subtitle, query)}</div>` : ''}
                ${result.description ? `<div class="search-result-description">${this.highlightQuery(result.description, query)}</div>` : ''}
            </div>
        `;
        
        element.addEventListener('click', () => {
            this.closeSearch();
            window.router.navigate(result.url);
        });
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.closeSearch();
                window.router.navigate(result.url);
            }
        });
        
        return element;
    }
    
    getTypeIcon(type) {
        const icons = {
            'project': 'fas fa-cube',
            'audio': 'fas fa-music',
            'content': 'fas fa-file-text'
        };
        return icons[type] || 'fas fa-file';
    }
    
    highlightQuery(text, query) {
        if (!text || !query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    focusFirstResult() {
        const firstResult = this.searchResults?.querySelector('.search-result');
        if (firstResult) {
            firstResult.focus();
        }
    }
}

// ===================================================================
// INITIALIZE ROUTER SYSTEM
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize router first
    window.router = new Router();
    
    // Then initialize navigation
    window.navigationGenerator = new NavigationGenerator();
    
    // Initialize breadcrumbs
    window.breadcrumbNavigation = new BreadcrumbNavigation();
    
    // Initialize search
    window.searchSystem = new SearchSystem();
    
    // Update current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});