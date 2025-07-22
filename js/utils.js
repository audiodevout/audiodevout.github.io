// ===================================================================
// UTILITY FUNCTIONS
// Common helper functions for the portfolio site
// ===================================================================

const Utils = {
    // ===================================================================
    // DOM UTILITIES
    // ===================================================================
    
    // Select single element
    $: (selector) => document.querySelector(selector),
    
    // Select multiple elements
    $$: (selector) => document.querySelectorAll(selector),
    
    // Create element with attributes and children
    createElement: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else if (key === 'textContent') {
                element.textContent = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },

    // ===================================================================
    // EVENT UTILITIES
    // ===================================================================
    
    events: {
        // Add event listener with cleanup tracking
        on: (element, event, handler, options = {}) => {
            element.addEventListener(event, handler, options);
            return () => element.removeEventListener(event, handler, options);
        },

        // Remove event listener
        off: (element, event, handler, options = {}) => {
            element.removeEventListener(event, handler, options);
        },

        // Trigger custom event
        trigger: (element, eventName, detail = {}) => {
            const event = new CustomEvent(eventName, { detail });
            element.dispatchEvent(event);
        },

        // Delegate event handling
        delegate: (parent, selector, event, handler) => {
            return Utils.events.on(parent, event, (e) => {
                if (e.target.matches(selector)) {
                    handler.call(e.target, e);
                }
            });
        }
    },

    // ===================================================================
    // PERFORMANCE UTILITIES
    // ===================================================================
    
    performance: {
        marks: new Map(),
        
        mark: (name) => {
            Utils.performance.marks.set(name, performance.now());
            if (performance.mark) {
                performance.mark(name);
            }
        },
        
        measure: (name, startMark, endMark) => {
            const start = Utils.performance.marks.get(startMark);
            const end = Utils.performance.marks.get(endMark);
            
            if (start && end) {
                console.log(`${name}: ${(end - start).toFixed(2)}ms`);
            }
            
            if (performance.measure) {
                performance.measure(name, startMark, endMark);
            }
        }
    },

    // ===================================================================
    // TIMING UTILITIES
    // ===================================================================
    
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Delay execution
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // ===================================================================
    // ANIMATION UTILITIES
    // ===================================================================
    
    // Request animation frame with fallback
    raf: (callback) => {
        return (window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame || 
                ((cb) => setTimeout(cb, 16)))(callback);
    },

    // Cancel animation frame
    cancelRaf: (id) => {
        return (window.cancelAnimationFrame || 
                window.webkitCancelAnimationFrame || 
                window.mozCancelAnimationFrame || 
                clearTimeout)(id);
    },

    // ===================================================================
    // FORMAT UTILITIES
    // ===================================================================
    
    // Format time from seconds to mm:ss
    formatTime: (seconds) => {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    // Format file size
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Format date
    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // ===================================================================
    // VALIDATION UTILITIES
    // ===================================================================
    
    // Sanitize HTML to prevent XSS
    sanitizeHTML: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // Validate email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate URL
    isValidUrl: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    // ===================================================================
    // RANDOM UTILITIES
    // ===================================================================
    
    // Generate random ID
    randomId: (prefix = 'id') => {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Get random item from array
    randomFromArray: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Shuffle array
    shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // ===================================================================
    // MATH UTILITIES
    // ===================================================================
    
    // Clamp number between min and max
    clamp: (num, min, max) => {
        return Math.min(Math.max(num, min), max);
    },

    // Linear interpolation
    lerp: (start, end, factor) => {
        return start + (end - start) * factor;
    },

    // Map value from one range to another
    map: (value, start1, stop1, start2, stop2) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    },

    // Distance between two points
    distance: (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    // Normalize value to 0-1 range
    normalize: (value, min, max) => {
        return (value - min) / (max - min);
    },

    // ===================================================================
    // GEOMETRY UTILITIES
    // ===================================================================
    
    // Get mouse position relative to element
    getMousePos: (element, event) => {
        const rect = element.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    },

    // Check if point is inside rectangle
    pointInRect: (x, y, rect) => {
        return x >= rect.left && x <= rect.right && 
               y >= rect.top && y <= rect.bottom;
    },

    // Get element center position
    getElementCenter: (element) => {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    },

    // ===================================================================
    // VIEWPORT UTILITIES
    // ===================================================================
    
    // Check if element is in viewport
    isInViewport: (element, threshold = 0) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    },

    // Get viewport dimensions
    getViewportSize: () => {
        return {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight
        };
    },

    // Smooth scroll to element
    scrollTo: (element, offset = 0) => {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // ===================================================================
    // DEVICE DETECTION
    // ===================================================================
    
    // Check if device is touch-enabled
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    // Check if user prefers reduced motion
    prefersReducedMotion: () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Check if user prefers dark mode
    prefersDarkMode: () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    // Get device pixel ratio
    getPixelRatio: () => {
        return window.devicePixelRatio || 1;
    },

    // ===================================================================
    // URL UTILITIES
    // ===================================================================
    
    url: {
        // Get current hash without #
        getHash: () => {
            return window.location.hash.slice(1);
        },

        // Set hash
        setHash: (hash) => {
            window.location.hash = hash;
        },

        // Get URL parameters
        getParams: () => {
            const params = new URLSearchParams(window.location.search);
            const result = {};
            for (const [key, value] of params) {
                result[key] = value;
            }
            return result;
        },

        // Set URL parameter
        setParam: (key, value) => {
            const url = new URL(window.location);
            url.searchParams.set(key, value);
            window.history.replaceState({}, '', url);
        }
    },

    // ===================================================================
    // STORAGE UTILITIES
    // ===================================================================
    
    storage: {
        // Local storage with JSON support
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Failed to save to localStorage:', e);
                return false;
            }
        },

        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Failed to read from localStorage:', e);
                return defaultValue;
            }
        },

        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Failed to remove from localStorage:', e);
                return false;
            }
        },

        clear: () => {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.warn('Failed to clear localStorage:', e);
                return false;
            }
        }
    },

    // ===================================================================
    // LOADING UTILITIES
    // ===================================================================
    
    loading: {
        show: (message = 'Loading...') => {
            const loader = Utils.$('#loading-state');
            if (loader) {
                const text = loader.querySelector('.glitch-text');
                if (text) {
                    text.textContent = message;
                    text.setAttribute('data-text', message);
                }
                loader.classList.remove('hidden');
            }
        },

        hide: () => {
            const loader = Utils.$('#loading-state');
            if (loader) {
                loader.classList.add('hidden');
            }
        }
    },

    // ===================================================================
    // ERROR HANDLING
    // ===================================================================
    
    error: {
        log: (error, context = '') => {
            console.error(`Error${context ? ` in ${context}` : ''}:`, error);
            
            // Send to error tracking service if available
            if (window.errorTracker) {
                window.errorTracker.captureException(error, { context });
            }
        },

        show: (message, duration = 5000) => {
            // Create error notification
            const notification = Utils.createElement('div', {
                className: 'error-notification',
                innerHTML: `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${Utils.sanitizeHTML(message)}</span>
                    <button class="close-btn" aria-label="Close">&times;</button>
                `
            });

            // Add to page
            document.body.appendChild(notification);

            // Auto remove after duration
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, duration);

            // Manual close
            const closeBtn = notification.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                });
            }
        }
    },

    // ===================================================================
    // COLOR UTILITIES
    // ===================================================================
    
    color: {
        // Convert hex to RGB
        hexToRgb: (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        // Convert RGB to hex
        rgbToHex: (r, g, b) => {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        // Convert hex to HSL
        hexToHsl: (hex) => {
            const rgb = Utils.color.hexToRgb(hex);
            if (!rgb) return null;
            
            const r = rgb.r / 255;
            const g = rgb.g / 255;
            const b = rgb.b / 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            
            return {
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                l: Math.round(l * 100)
            };
        }
    },

    // ===================================================================
    // ASSET LOADING
    // ===================================================================
    
    // Load image with promise
    loadImage: (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    // Preload multiple images
    preloadImages: (sources) => {
        return Promise.all(sources.map(src => Utils.loadImage(src)));
    },

    // Load script dynamically
    loadScript: (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.onload = resolve;
            script.onerror = reject;
            script.src = src;
            document.head.appendChild(script);
        });
    },

    // ===================================================================
    // ANALYTICS
    // ===================================================================
    
    analytics: {
        track: (event, properties = {}) => {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', event, properties);
            }
            
            // Console log for development
            if (window.location.hostname === 'localhost') {
                console.log('Analytics:', event, properties);
            }
        },

        page: (path) => {
            if (typeof gtag !== 'undefined') {
                gtag('config', 'GA_MEASUREMENT_ID', {
                    page_path: path
                });
            }
        }
    }
};

// Global event emitter
const AppEvents = {
    events: {},
    
    on: (event, callback) => {
        if (!AppEvents.events[event]) {
            AppEvents.events[event] = [];
        }
        AppEvents.events[event].push(callback);
    },
    
    off: (event, callback) => {
        if (AppEvents.events[event]) {
            AppEvents.events[event] = AppEvents.events[event].filter(cb => cb !== callback);
        }
    },
    
    emit: (event, data) => {
        if (AppEvents.events[event]) {
            AppEvents.events[event].forEach(callback => callback(data));
        }
    }
};

// Make globally available
window.Utils = Utils;
window.appEvents = AppEvents;