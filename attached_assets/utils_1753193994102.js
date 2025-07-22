// ===================================================================
// UTILITY FUNCTIONS
// Common helper functions for the portfolio site
// ===================================================================

const Utils = {
    // DOM utilities
    $: (selector) => document.querySelector(selector),
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

    // Format time from seconds to mm:ss
    formatTime: (seconds) => {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    // Generate random ID
    randomId: (prefix = 'id') => {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Sanitize HTML to prevent XSS
    sanitizeHTML: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    scrollTo: (element, offset = 0) => {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // Check if device is touch-enabled
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    // Check if user prefers reduced motion
    prefersReducedMotion: () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Get random item from array
    randomFromArray: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },

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

    // Get mouse position relative to element
    getMousePos: (event, element) => {
        const rect = element.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    },

    // Convert hex to HSL
    hexToHsl: (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

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
    },

    // Local storage helpers with error handling
    storage: {
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

    // Cookie helpers
    cookie: {
        set: (name, value, days = 7) => {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        },

        get: (name) => {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },

        remove: (name) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    },

    // URL helpers
    url: {
        getParams: () => {
            const params = {};
            const urlParams = new URLSearchParams(window.location.search);
            for (const [key, value] of urlParams) {
                params[key] = value;
            }
            return params;
        },

        setParam: (key, value) => {
            const url = new URL(window.location);
            url.searchParams.set(key, value);
            window.history.replaceState({}, '', url);
        },

        removeParam: (key) => {
            const url = new URL(window.location);
            url.searchParams.delete(key);
            window.history.replaceState({}, '', url);
        },

        getHash: () => {
            return window.location.hash.slice(1);
        },

        setHash: (hash) => {
            window.location.hash = hash;
        }
    },

    // Event helpers
    events: {
        on: (element, event, handler, options = false) => {
            element.addEventListener(event, handler, options);
        },

        off: (element, event, handler, options = false) => {
            element.removeEventListener(event, handler, options);
        },

        once: (element, event, handler, options = false) => {
            const wrapper = (e) => {
                handler(e);
                element.removeEventListener(event, wrapper, options);
            };
            element.addEventListener(event, wrapper, options);
        },

        trigger: (element, eventType, detail = null) => {
            const event = new CustomEvent(eventType, { detail });
            element.dispatchEvent(event);
        }
    },

    // Animation helpers
    animation: {
        easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeIn: (t) => t * t,
        easeOut: (t) => t * (2 - t),
        linear: (t) => t,

        animate: (duration, callback, easing = Utils.animation.linear) => {
            const start = performance.now();
            
            function frame(time) {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easing(progress);
                
                callback(easedProgress);
                
                if (progress < 1) {
                    requestAnimationFrame(frame);
                }
            }
            
            requestAnimationFrame(frame);
        }
    },

    // Validation helpers
    validate: {
        email: (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        url: (url) => {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        notEmpty: (value) => {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        }
    },

    // Loading helpers
    loading: {
        show: (message = 'Loading...') => {
            const loading = Utils.$('#loading-state');
            if (loading) {
                loading.querySelector('.glitch-text').textContent = message;
                loading.classList.remove('hidden');
            }
        },

        hide: () => {
            const loading = Utils.$('#loading-state');
            if (loading) {
                loading.classList.add('hidden');
            }
        }
    },

    // Error handling
    error: {
        show: (message, container = document.body) => {
            const errorDiv = Utils.createElement('div', {
                className: 'error-message',
                innerHTML: `<i class="fas fa-exclamation-triangle"></i> ${message}`
            });
            
            container.appendChild(errorDiv);
            
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        },

        log: (error, context = '') => {
            console.error(`Portfolio Site Error ${context}:`, error);
            
            // In production, you might want to send errors to an analytics service
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exception', {
                    description: `${context}: ${error.message || error}`,
                    fatal: false
                });
            }
        }
    },

    // Performance helpers
    performance: {
        mark: (name) => {
            if (performance.mark) {
                performance.mark(name);
            }
        },

        measure: (name, start, end) => {
            if (performance.measure) {
                performance.measure(name, start, end);
            }
        },

        getEntries: () => {
            return performance.getEntries ? performance.getEntries() : [];
        }
    }
};

// Make Utils available globally
window.Utils = Utils;