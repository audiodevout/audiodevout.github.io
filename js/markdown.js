// ===================================================================
// SIMPLE MARKDOWN PARSER
// Lightweight markdown-to-HTML conversion for content rendering
// ===================================================================

const MarkdownParser = {
    
    // Parse markdown text to HTML
    parse(markdown) {
        if (!markdown) return '';
        
        let html = markdown;
        
        // Process in order of precedence
        html = this.parseHeaders(html);
        html = this.parseCodeBlocks(html);
        html = this.parseInlineCode(html);
        html = this.parseLists(html);
        html = this.parseLinks(html);
        html = this.parseImages(html);
        html = this.parseEmphasis(html);
        html = this.parseLineBreaks(html);
        html = this.parseParagraphs(html);
        
        return html;
    },
    
    // Parse headers (# ## ### etc.)
    parseHeaders(text) {
        return text.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
            const level = hashes.length;
            const id = this.createSlug(content);
            return `<h${level} id="${id}">${content.trim()}</h${level}>`;
        });
    },
    
    // Parse code blocks (```)
    parseCodeBlocks(text) {
        return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
            const lang = language ? ` class="language-${language}"` : '';
            return `<pre><code${lang}>${this.escapeHtml(code.trim())}</code></pre>`;
        });
    },
    
    // Parse inline code (`)
    parseInlineCode(text) {
        return text.replace(/`([^`]+)`/g, '<code>$1</code>');
    },
    
    // Parse unordered lists (- or *)
    parseLists(text) {
        // Unordered lists
        text = text.replace(/^[\s]*[-*]\s+(.+)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Ordered lists
        text = text.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
        
        return text;
    },
    
    // Parse links ([text](url))
    parseLinks(text) {
        return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
            const isExternal = url.startsWith('http') || url.startsWith('//');
            const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${url}"${target}>${linkText}</a>`;
        });
    },
    
    // Parse images (![alt](src))
    parseImages(text) {
        return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
    },
    
    // Parse emphasis (**bold**, *italic*)
    parseEmphasis(text) {
        // Bold
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
        
        // Italic
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');
        
        return text;
    },
    
    // Parse line breaks
    parseLineBreaks(text) {
        // Two spaces at end of line = line break
        text = text.replace(/  \n/g, '<br>\n');
        return text;
    },
    
    // Parse paragraphs
    parseParagraphs(text) {
        // Split by double newlines to create paragraphs
        const paragraphs = text.split(/\n\s*\n/);
        
        return paragraphs.map(p => {
            const trimmed = p.trim();
            
            // Skip if already wrapped in HTML tags
            if (trimmed.match(/^<(h[1-6]|ul|ol|pre|blockquote)/)) {
                return trimmed;
            }
            
            // Skip empty paragraphs
            if (!trimmed) {
                return '';
            }
            
            return `<p>${trimmed}</p>`;
        }).join('\n\n');
    },
    
    // Create URL-friendly slug from text
    createSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    },
    
    // Escape HTML characters
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Parse table of contents from headers
    generateTOC(markdown) {
        const headers = [];
        const headerRegex = /^(#{1,6})\s+(.+)$/gm;
        let match;
        
        while ((match = headerRegex.exec(markdown)) !== null) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = this.createSlug(text);
            
            headers.push({ level, text, id });
        }
        
        if (headers.length === 0) return '';
        
        let toc = '<nav class="table-of-contents">\n<h3>Table of Contents</h3>\n<ul>\n';
        
        headers.forEach(header => {
            const indent = '  '.repeat(header.level - 1);
            toc += `${indent}<li><a href="#${header.id}">${header.text}</a></li>\n`;
        });
        
        toc += '</ul>\n</nav>';
        
        return toc;
    },
    
    // Extract first paragraph as excerpt
    getExcerpt(markdown, maxLength = 150) {
        // Remove markdown formatting
        let text = markdown
            .replace(/^#{1,6}\s+.+$/gm, '') // Remove headers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links to text only
            .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Remove images
            .replace(/`([^`]+)`/g, '$1') // Inline code to text
            .replace(/\*\*(.+?)\*\*/g, '$1') // Bold to text
            .replace(/\*(.+?)\*/g, '$1') // Italic to text
            .replace(/^\s*[-*]\s+/gm, '') // Remove list markers
            .trim();
        
        // Get first paragraph
        const firstParagraph = text.split('\n\n')[0];
        
        if (firstParagraph.length <= maxLength) {
            return firstParagraph;
        }
        
        // Truncate at word boundary
        const truncated = firstParagraph.substring(0, maxLength);
        const lastSpaceIndex = truncated.lastIndexOf(' ');
        
        return lastSpaceIndex > 0 ? 
            truncated.substring(0, lastSpaceIndex) + '...' : 
            truncated + '...';
    },
    
    // Count reading time (words per minute)
    getReadingTime(markdown, wordsPerMinute = 200) {
        const text = markdown
            .replace(/^#{1,6}\s+.+$/gm, '') // Remove headers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links to text only
            .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Remove images
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/`([^`]+)`/g, '$1') // Inline code to text
            .replace(/[*_#`\[\]()]/g, ''); // Remove markdown characters
        
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        return readingTime;
    },
    
    // Convert HTML back to markdown (basic)
    htmlToMarkdown(html) {
        let markdown = html;
        
        // Headers
        markdown = markdown.replace(/<h([1-6]).*?>(.*?)<\/h[1-6]>/gi, (match, level, text) => {
            return '#'.repeat(parseInt(level)) + ' ' + text + '\n\n';
        });
        
        // Paragraphs
        markdown = markdown.replace(/<p.*?>(.*?)<\/p>/gi, '$1\n\n');
        
        // Emphasis
        markdown = markdown.replace(/<strong.*?>(.*?)<\/strong>/gi, '**$1**');
        markdown = markdown.replace(/<em.*?>(.*?)<\/em>/gi, '*$1*');
        markdown = markdown.replace(/<code.*?>(.*?)<\/code>/gi, '`$1`');
        
        // Links
        markdown = markdown.replace(/<a.*?href="([^"]*)".*?>(.*?)<\/a>/gi, '[$2]($1)');
        
        // Images
        markdown = markdown.replace(/<img.*?src="([^"]*)".*?alt="([^"]*)".*?>/gi, '![$2]($1)');
        
        // Lists
        markdown = markdown.replace(/<li.*?>(.*?)<\/li>/gi, '- $1\n');
        markdown = markdown.replace(/<\/?[uo]l.*?>/gi, '');
        
        // Line breaks
        markdown = markdown.replace(/<br\s*\/?>/gi, '  \n');
        
        // Clean up extra whitespace
        markdown = markdown.replace(/\n{3,}/g, '\n\n');
        
        return markdown.trim();
    }
};

// Export for global access
window.MarkdownParser = MarkdownParser;