// ===================================================================
// SIMPLE MARKDOWN PARSER
// ===================================================================

class MarkdownParser {
    constructor() {
        this.rules = [
            // Headers
            { pattern: /^### (.*$)/gm, replacement: '<h3>$1</h3>' },
            { pattern: /^## (.*$)/gm, replacement: '<h2>$1</h2>' },
            { pattern: /^# (.*$)/gm, replacement: '<h1>$1</h1>' },
            
            // Bold and Italic
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
            { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
            
            // Links
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>' },
            
            // Code blocks
            { pattern: /```([\s\S]*?)```/g, replacement: '<pre><code>$1</code></pre>' },
            { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' },
            
            // Lists
            { pattern: /^\* (.+)$/gm, replacement: '<li>$1</li>' },
            { pattern: /^\d+\. (.+)$/gm, replacement: '<li>$1</li>' },
            
            // Line breaks and paragraphs
            { pattern: /\n\n/g, replacement: '</p><p>' },
            { pattern: /\n/g, replacement: '<br>' }
        ];
    }
    
    parse(markdown) {
        if (!markdown) return '';
        
        let html = markdown.trim();
        
        // Apply all transformation rules
        this.rules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replacement);
        });
        
        // Wrap in paragraphs if not already wrapped
        if (!html.startsWith('<h') && !html.startsWith('<p') && !html.startsWith('<ul') && !html.startsWith('<ol')) {
            html = '<p>' + html + '</p>';
        }
        
        // Fix list wrapping
        html = html.replace(/(<li>.*<\/li>)/g, function(match) {
            return '<ul>' + match + '</ul>';
        });
        
        // Clean up multiple paragraph tags
        html = html.replace(/<\/p><p>/g, '</p>\n<p>');
        
        return html;
    }
    
    // Enhanced parser with more features
    parseEnhanced(markdown) {
        if (!markdown) return '';
        
        let html = markdown.trim();
        
        // Process code blocks first (to prevent other rules from affecting them)
        html = this.processCodeBlocks(html);
        
        // Process headers
        html = this.processHeaders(html);
        
        // Process lists
        html = this.processLists(html);
        
        // Process inline formatting
        html = this.processInlineFormatting(html);
        
        // Process links
        html = this.processLinks(html);
        
        // Process paragraphs last
        html = this.processParagraphs(html);
        
        return html;
    }
    
    processCodeBlocks(text) {
        // Fenced code blocks
        text = text.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
            const language = lang ? ` class="language-${lang}"` : '';
            return `<pre><code${language}>${this.escapeHtml(code.trim())}</code></pre>`;
        });
        
        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        return text;
    }
    
    processHeaders(text) {
        text = text.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
            const level = hashes.length;
            const id = content.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
            return `<h${level} id="${id}">${content}</h${level}>`;
        });
        
        return text;
    }
    
    processLists(text) {
        // Unordered lists
        text = text.replace(/^(\* .+(?:\n\* .+)*)/gm, (match) => {
            const items = match.split('\n').map(line => 
                line.replace(/^\* (.+)$/, '<li>$1</li>')
            ).join('\n');
            return `<ul>\n${items}\n</ul>`;
        });
        
        // Ordered lists
        text = text.replace(/^(\d+\. .+(?:\n\d+\. .+)*)/gm, (match) => {
            const items = match.split('\n').map(line => 
                line.replace(/^\d+\. (.+)$/, '<li>$1</li>')
            ).join('\n');
            return `<ol>\n${items}\n</ol>`;
        });
        
        return text;
    }
    
    processInlineFormatting(text) {
        // Bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
        
        // Italic
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.*?)_/g, '<em>$1</em>');
        
        // Strikethrough
        text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
        
        return text;
    }
    
    processLinks(text) {
        // Links with title
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\s+"([^"]+)"\)/g, 
            '<a href="$2" title="$3" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Regular links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
            '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Auto-links
        text = text.replace(/(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        
        return text;
    }
    
    processParagraphs(text) {
        // Split by double line breaks and wrap in paragraphs
        const paragraphs = text.split(/\n\s*\n/);
        
        return paragraphs.map(para => {
            para = para.trim();
            if (!para) return '';
            
            // Don't wrap block elements in paragraphs
            if (para.startsWith('<h') || para.startsWith('<ul') || 
                para.startsWith('<ol') || para.startsWith('<pre') ||
                para.startsWith('<blockquote')) {
                return para;
            }
            
            return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }).join('\n\n');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ===================================================================
// MARKDOWN CONTENT LOADER
// ===================================================================

class MarkdownLoader {
    constructor() {
        this.parser = new MarkdownParser();
        this.cache = new Map();
    }
    
    async loadFile(url) {
        // Check cache first
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.status}`);
            }
            
            const markdown = await response.text();
            const html = this.parser.parseEnhanced(markdown);
            
            // Cache the result
            this.cache.set(url, html);
            
            return html;
        } catch (error) {
            console.error('Error loading markdown file:', error);
            return `<p class="error">Error loading content: ${error.message}</p>`;
        }
    }
    
    // Load and render markdown content into a container
    async renderInto(container, url) {
        container.innerHTML = '<div class="loading-spinner"></div><p>Loading content...</p>';
        
        try {
            const html = await this.loadFile(url);
            container.innerHTML = html;
            
            // Trigger any necessary post-processing
            this.postProcess(container);
            
            window.appEvents.emit('markdownLoaded', { url, container });
        } catch (error) {
            container.innerHTML = `<p class="error">Failed to load content</p>`;
        }
    }
    
    postProcess(container) {
        // Add accessibility attributes to links
        const links = container.querySelectorAll('a[target="_blank"]');
        links.forEach(link => {
            if (!link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', `${link.textContent} (opens in new tab)`);
            }
        });
        
        // Add copy buttons to code blocks
        const codeBlocks = container.querySelectorAll('pre code');
        codeBlocks.forEach(code => {
            this.addCopyButton(code);
        });
        
        // Make tables responsive
        const tables = container.querySelectorAll('table');
        tables.forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }
    
    addCopyButton(codeElement) {
        const pre = codeElement.parentElement;
        if (!pre || pre.tagName !== 'PRE') return;
        
        const button = createElement('button', {
            className: 'copy-code-btn',
            'aria-label': 'Copy code to clipboard',
            title: 'Copy code'
        });
        
        button.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i>';
        
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeElement.textContent);
                button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
                button.setAttribute('aria-label', 'Code copied');
                
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i>';
                    button.setAttribute('aria-label', 'Copy code to clipboard');
                }, 2000);
            } catch (error) {
                console.error('Failed to copy code:', error);
            }
        });
        
        pre.style.position = 'relative';
        pre.appendChild(button);
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    getCacheSize() {
        return this.cache.size;
    }
}

// ===================================================================
// TEXT CONTENT COMPONENT
// ===================================================================

class TextContent {
    constructor(textData) {
        this.textData = textData;
        this.container = null;
        this.id = generateId();
    }
    
    async render() {
        this.container = createElement('div', {
            className: 'text-content content-block',
            'data-text-id': this.id
        });
        
        if (this.textData.file) {
            // Load from markdown file
            await window.markdownLoader.renderInto(this.container, this.textData.file);
        } else if (this.textData.content) {
            // Direct content
            const html = window.markdownLoader.parser.parseEnhanced(this.textData.content);
            this.container.innerHTML = html;
        } else {
            this.container.innerHTML = '<p>No content available</p>';
        }
        
        return this.container;
    }
    
    async update(newTextData) {
        this.textData = newTextData;
        if (this.container) {
            await this.render();
        }
    }
    
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// ===================================================================
// INITIALIZE MARKDOWN SYSTEM
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    window.markdownParser = new MarkdownParser();
    window.markdownLoader = new MarkdownLoader();
    
    // Export classes for use by page generator
    window.TextContent = TextContent;
    
    // Clear cache when theme changes (in case we want to re-process content)
    window.appEvents.on('themeChanged', () => {
        // Could clear cache here if needed
        // window.markdownLoader.clearCache();
    });
});