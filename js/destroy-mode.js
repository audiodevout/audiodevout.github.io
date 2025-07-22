
// ===================================================================
// DESTROY MODE SYSTEM
// Comic book style destruction with gun cursor
// ===================================================================

const DestroyMode = {
    // State
    isActive: false,
    isDestroyMode: false,
    popup: null,
    destroyedElements: [],
    originalCursor: null,
    particles: [],
    animationId: null,

    // Settings
    gunEmoji: '🔫',
    explosionEmojis: ['💥', '💢', '💦', '🔥', '⚡'],
    
    // Audio contexts for sound effects
    audioContext: null,
    
    // Particle settings
    particleCount: 20,
    
    init() {
        this.initAudio();
        this.createPopup();
        this.bindEvents();
        this.showPopup();
        this.startParticleSystem();
        console.log('✓ Destroy mode initialized');
    },

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    },

    createPopup() {
        // Create the comic book style popup balloon
        this.popup = document.createElement('div');
        this.popup.className = 'destroy-popup';
        this.popup.innerHTML = `
            <div class="popup-balloon">
                <div class="popup-tail"></div>
                <div class="popup-content">
                    <div class="popup-text">DESTROY ME!</div>
                    <div class="popup-subtext">Click to activate destruction mode</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.popup);
        
        // Position popup randomly
        this.positionPopup();
        
        // Auto-reposition every few seconds
        setInterval(() => {
            if (!this.isDestroyMode) {
                this.positionPopup();
            }
        }, 8000);
    },

    positionPopup() {
        if (!this.popup) return;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Random position but keep it visible
        const x = Math.random() * (viewportWidth - 200) + 50;
        const y = Math.random() * (viewportHeight - 200) + 100;
        
        this.popup.style.left = `${x}px`;
        this.popup.style.top = `${y}px`;
    },

    bindEvents() {
        // Click on popup to activate destroy mode
        Utils.events.on(this.popup, 'click', () => {
            this.activateDestroyMode();
        });

        // Global keydown to exit destroy mode
        Utils.events.on(document, 'keydown', (e) => {
            if (this.isDestroyMode) {
                this.deactivateDestroyMode();
            }
        });

        // Handle destroy clicks
        Utils.events.on(document, 'click', (e) => {
            if (this.isDestroyMode && e.target !== this.popup) {
                e.preventDefault();
                e.stopPropagation();
                this.destroyElement(e.target, e.clientX, e.clientY);
            }
        });
    },

    showPopup() {
        if (this.popup) {
            this.popup.classList.add('visible');
        }
    },

    hidePopup() {
        if (this.popup) {
            this.popup.classList.remove('visible');
        }
    },

    activateDestroyMode() {
        console.log('🔫 Destroy mode activated!');
        
        this.isDestroyMode = true;
        this.hidePopup();
        
        // Change cursor to gun emoji
        document.body.style.cursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size: 24px;'><text y='24'>${this.gunEmoji}</text></svg>") 16 16, crosshair`;
        
        // Add destroy mode class to body
        document.body.classList.add('destroy-mode');
        
        // Show instructions
        this.showInstructions();
        
        // Disable normal cursor system
        if (window.CursorSystem && window.CursorSystem.hide) {
            window.CursorSystem.hide();
        }
    },

    deactivateDestroyMode() {
        console.log('✨ Normal browsing restored');
        
        this.isDestroyMode = false;
        
        // Restore normal cursor
        document.body.style.cursor = '';
        document.body.classList.remove('destroy-mode');
        
        // Hide instructions
        this.hideInstructions();
        
        // Restore elements
        this.restoreElements();
        
        // Show popup again
        this.showPopup();
        
        // Re-enable cursor system
        if (window.CursorSystem && window.CursorSystem.show) {
            window.CursorSystem.show();
        }
    },

    destroyElement(element, clickX, clickY) {
        // Don't destroy the html or body
        if (element === document.body || element === document.documentElement) {
            return;
        }
        
        // Play gunshot sound
        this.playGunshotSound();
        
        // Create screen shake
        this.createScreenShake();
        
        // Create explosion effect
        this.createExplosion(clickX, clickY);
        
        // Create gunshot sound effect (visual)
        this.createGunshotEffect(clickX, clickY);
        
        // Create particle burst
        this.createParticleBurst(clickX, clickY);
        
        // Play explosion sound after slight delay
        setTimeout(() => this.playExplosionSound(), 100);
        
        // Store original element data for restoration
        this.destroyedElements.push({
            element: element,
            originalStyle: element.style.cssText,
            originalDisplay: getComputedStyle(element).display
        });
        
        // Apply element-specific destruction animation
        this.applyDestructionAnimation(element);
        
        // Completely hide after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.style.display = 'none';
            }
        }, 600);
    },

    createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'destroy-explosion';
        explosion.textContent = this.explosionEmojis[Math.floor(Math.random() * this.explosionEmojis.length)];
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        
        document.body.appendChild(explosion);
        
        // Remove after animation
        setTimeout(() => {
            if (explosion.parentNode) {
                explosion.parentNode.removeChild(explosion);
            }
        }, 1000);
    },

    createGunshotEffect(x, y) {
        // Create multiple small particles for gunshot effect
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'gunshot-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.transform = `rotate(${i * 45}deg)`;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 500);
        }
    },

    showInstructions() {
        const instructions = document.createElement('div');
        instructions.className = 'destroy-instructions';
        instructions.innerHTML = `
            <div class="instruction-text">
                🔫 DESTROY MODE ACTIVE 🔫<br>
                Click to destroy elements<br>
                Press any key to return to normal
            </div>
        `;
        
        document.body.appendChild(instructions);
        this.instructionsEl = instructions;
    },

    hideInstructions() {
        if (this.instructionsEl && this.instructionsEl.parentNode) {
            this.instructionsEl.parentNode.removeChild(this.instructionsEl);
        }
    },

    restoreElements() {
        // Restore all destroyed elements
        this.destroyedElements.forEach(data => {
            if (data.element && data.element.parentNode) {
                data.element.style.cssText = data.originalStyle;
                data.element.style.display = data.originalDisplay;
                data.element.style.transition = '';
                data.element.style.transform = '';
                data.element.style.opacity = '';
                data.element.style.filter = '';
            }
        });
        
        // Clear the destroyed elements array
        this.destroyedElements = [];
    },

    // ===================================================================
    // SOUND EFFECTS
    // ===================================================================
    
    playGunshotSound() {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Create gunshot sound (sharp burst of white noise)
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            console.warn('Could not play gunshot sound');
        }
    },
    
    playExplosionSound() {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Create explosion sound (low rumble)
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (e) {
            console.warn('Could not play explosion sound');
        }
    },

    // ===================================================================
    // SCREEN SHAKE EFFECT
    // ===================================================================
    
    createScreenShake() {
        const body = document.body;
        const intensity = 10;
        const duration = 300;
        let startTime = Date.now();
        
        const shake = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const x = (Math.random() - 0.5) * intensity * (1 - progress);
                const y = (Math.random() - 0.5) * intensity * (1 - progress);
                
                body.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(shake);
            } else {
                body.style.transform = '';
            }
        };
        
        shake();
    },

    // ===================================================================
    // ADVANCED PARTICLE SYSTEM
    // ===================================================================
    
    startParticleSystem() {
        this.updateParticles();
    },
    
    createParticleBurst(x, y) {
        // Create multiple particles for dramatic effect
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                size: 2 + Math.random() * 4,
                color: this.getRandomParticleColor(),
                type: Math.random() > 0.5 ? 'circle' : 'square'
            });
        }
    },
    
    getRandomParticleColor() {
        const colors = ['#ff6600', '#ffff00', '#ff0000', '#ffffff', '#ffa500'];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    updateParticles() {
        // Create particle canvas if it doesn't exist
        if (!this.particleCanvas) {
            this.createParticleCanvas();
        }
        
        if (!this.particleCtx) return;
        
        // Clear canvas
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // Gravity
            particle.life -= particle.decay;
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Draw particle
            this.particleCtx.save();
            this.particleCtx.globalAlpha = particle.life;
            this.particleCtx.fillStyle = particle.color;
            
            if (particle.type === 'circle') {
                this.particleCtx.beginPath();
                this.particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.particleCtx.fill();
            } else {
                this.particleCtx.fillRect(
                    particle.x - particle.size/2, 
                    particle.y - particle.size/2, 
                    particle.size, 
                    particle.size
                );
            }
            
            this.particleCtx.restore();
        }
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.updateParticles());
    },
    
    createParticleCanvas() {
        this.particleCanvas = document.createElement('canvas');
        this.particleCanvas.className = 'particle-canvas';
        this.particleCanvas.style.position = 'fixed';
        this.particleCanvas.style.top = '0';
        this.particleCanvas.style.left = '0';
        this.particleCanvas.style.width = '100%';
        this.particleCanvas.style.height = '100%';
        this.particleCanvas.style.pointerEvents = 'none';
        this.particleCanvas.style.zIndex = '9998';
        
        this.particleCanvas.width = window.innerWidth;
        this.particleCanvas.height = window.innerHeight;
        
        this.particleCtx = this.particleCanvas.getContext('2d');
        document.body.appendChild(this.particleCanvas);
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.particleCanvas.width = window.innerWidth;
            this.particleCanvas.height = window.innerHeight;
        });
    },

    // ===================================================================
    // ELEMENT-SPECIFIC DESTRUCTION ANIMATIONS
    // ===================================================================
    
    applyDestructionAnimation(element) {
        const tagName = element.tagName.toLowerCase();
        const elementType = this.getElementType(element);
        
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        switch (elementType) {
            case 'text':
                this.animateTextDestruction(element);
                break;
            case 'image':
                this.animateImageDestruction(element);
                break;
            case 'button':
                this.animateButtonDestruction(element);
                break;
            case 'container':
                this.animateContainerDestruction(element);
                break;
            default:
                this.animateGenericDestruction(element);
        }
    },
    
    getElementType(element) {
        const tagName = element.tagName.toLowerCase();
        
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a'].includes(tagName)) {
            return 'text';
        } else if (['img', 'svg'].includes(tagName)) {
            return 'image';
        } else if (['button', 'input[type="button"]'].includes(tagName) || element.classList.contains('btn')) {
            return 'button';
        } else if (['div', 'section', 'article', 'aside', 'header', 'footer', 'nav'].includes(tagName)) {
            return 'container';
        }
        
        return 'generic';
    },
    
    animateTextDestruction(element) {
        element.style.transform = `scale(0) rotateX(90deg)`;
        element.style.opacity = '0';
        element.style.filter = 'blur(10px)';
        element.style.textShadow = '0 0 20px #ff6600';
    },
    
    animateImageDestruction(element) {
        element.style.transform = `scale(0) rotate(${360 + Math.random() * 720}deg)`;
        element.style.opacity = '0';
        element.style.filter = 'brightness(3) blur(15px) hue-rotate(180deg)';
    },
    
    animateButtonDestruction(element) {
        element.style.transform = `scale(0) rotateY(180deg) translateZ(-100px)`;
        element.style.opacity = '0';
        element.style.filter = 'blur(8px)';
        element.style.boxShadow = '0 0 30px #ff0000';
    },
    
    animateContainerDestruction(element) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        element.style.transform = `scale(0.8) skewX(${direction * 45}deg) translateX(${direction * 100}px)`;
        element.style.opacity = '0';
        element.style.filter = 'blur(12px) contrast(2)';
    },
    
    animateGenericDestruction(element) {
        element.style.transform = `scale(0) rotate(${Math.random() * 360}deg)`;
        element.style.opacity = '0';
        element.style.filter = 'blur(5px)';
    },

    destroy() {
        this.deactivateDestroyMode();
        
        if (this.popup && this.popup.parentNode) {
            this.popup.parentNode.removeChild(this.popup);
        }
        
        // Clean up particles
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.particleCanvas && this.particleCanvas.parentNode) {
            this.particleCanvas.parentNode.removeChild(this.particleCanvas);
        }
        
        this.particles = [];
        
        // Remove all destroy effects
        document.querySelectorAll('.destroy-explosion, .gunshot-particle').forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        // Close audio context
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit before showing the popup
    setTimeout(() => {
        DestroyMode.init();
    }, 3000);
});

// Export for global access
window.DestroyMode = DestroyMode;
