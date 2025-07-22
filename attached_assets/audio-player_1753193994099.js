// ===================================================================
// AUDIO PLAYER SYSTEM
// ===================================================================

class AudioPlayer {
    constructor(audioData) {
        this.audioData = audioData;
        this.audio = null;
        this.isPlaying = false;
        this.isLoading = false;
        this.duration = 0;
        this.currentTime = 0;
        this.progress = 0;
        this.error = null;
        
        this.container = null;
        this.playBtn = null;
        this.progressBar = null;
        this.timeDisplay = null;
        
        this.id = generateId();
    }
    
    render() {
        this.container = createElement('div', {
            className: 'audio-player',
            'data-audio-id': this.id
        });
        
        this.container.innerHTML = `
            <h3>${sanitizeHTML(this.audioData.title)}</h3>
            ${this.audioData.description ? `<p class="audio-description">${sanitizeHTML(this.audioData.description)}</p>` : ''}
            
            <div class="audio-controls">
                <button class="audio-play-btn" aria-label="Play ${sanitizeHTML(this.audioData.title)}">
                    <i class="fas fa-play" aria-hidden="true"></i>
                </button>
                
                <div class="audio-progress-container">
                    <input type="range" 
                           class="audio-progress" 
                           value="0" 
                           min="0" 
                           max="100" 
                           step="0.1"
                           aria-label="Audio progress">
                    <div class="audio-time">0:00 / 0:00</div>
                </div>
            </div>
            
            <audio preload="metadata" style="display: none;">
                <source src="${this.audioData.file}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        
        this.bindElements();
        this.bindEvents();
        this.initializeAudio();
        
        return this.container;
    }
    
    bindElements() {
        this.playBtn = this.container.querySelector('.audio-play-btn');
        this.progressBar = this.container.querySelector('.audio-progress');
        this.timeDisplay = this.container.querySelector('.audio-time');
        this.audio = this.container.querySelector('audio');
    }
    
    bindEvents() {
        // Play/pause button
        this.playBtn.addEventListener('click', () => this.toggle());
        
        // Progress bar
        this.progressBar.addEventListener('input', (e) => {
            this.seek((e.target.value / 100) * this.duration);
        });
        
        // Keyboard controls
        this.container.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    initializeAudio() {
        if (!this.audio) return;
        
        // Audio event listeners
        this.audio.addEventListener('loadstart', () => this.setLoading(true));
        this.audio.addEventListener('canplay', () => this.setLoading(false));
        this.audio.addEventListener('loadedmetadata', () => this.setDuration(this.audio.duration));
        this.audio.addEventListener('timeupdate', () => this.updateTime());
        this.audio.addEventListener('ended', () => this.handleEnded());
        this.audio.addEventListener('error', (e) => this.handleError(e));
        
        // Volume control
        this.audio.volume = 0.8;
    }
    
    async play() {
        if (!this.audio || this.isLoading) return;
        
        try {
            // Stop other playing audio
            this.pauseOthers();
            
            this.setLoading(true);
            await this.audio.play();
            this.setPlaying(true);
            this.setLoading(false);
            
            window.appEvents.emit('audioStarted', this.audioData);
        } catch (error) {
            console.error('Audio play failed:', error);
            this.handleError(error);
        }
    }
    
    pause() {
        if (!this.audio) return;
        
        this.audio.pause();
        this.setPlaying(false);
        
        window.appEvents.emit('audioPaused', this.audioData);
    }
    
    async toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
    }
    
    seek(time) {
        if (!this.audio || !this.duration) return;
        
        this.audio.currentTime = Math.max(0, Math.min(time, this.duration));
    }
    
    setPlaying(playing) {
        this.isPlaying = playing;
        this.updatePlayButton();
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        this.updatePlayButton();
    }
    
    setDuration(duration) {
        this.duration = duration || 0;
        this.updateTimeDisplay();
    }
    
    updateTime() {
        if (!this.audio) return;
        
        this.currentTime = this.audio.currentTime;
        this.progress = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
        
        this.updateProgressBar();
        this.updateTimeDisplay();
    }
    
    updatePlayButton() {
        if (!this.playBtn) return;
        
        const icon = this.playBtn.querySelector('i');
        
        if (this.isLoading) {
            icon.className = 'fas fa-spinner fa-spin';
            this.playBtn.setAttribute('aria-label', `Loading ${this.audioData.title}`);
        } else if (this.isPlaying) {
            icon.className = 'fas fa-pause';
            this.playBtn.setAttribute('aria-label', `Pause ${this.audioData.title}`);
        } else {
            icon.className = 'fas fa-play';
            this.playBtn.setAttribute('aria-label', `Play ${this.audioData.title}`);
        }
    }
    
    updateProgressBar() {
        if (!this.progressBar) return;
        this.progressBar.value = this.progress;
    }
    
    updateTimeDisplay() {
        if (!this.timeDisplay) return;
        
        const current = formatTime(this.currentTime);
        const total = formatTime(this.duration);
        this.timeDisplay.textContent = `${current} / ${total}`;
    }
    
    handleEnded() {
        this.setPlaying(false);
        this.currentTime = 0;
        this.progress = 0;
        this.updateProgressBar();
        this.updateTimeDisplay();
        
        window.appEvents.emit('audioEnded', this.audioData);
    }
    
    handleError(error) {
        this.error = 'Error loading audio';
        this.setLoading(false);
        this.setPlaying(false);
        
        console.error('Audio error:', error);
        
        // Show error message to user
        const errorMsg = createElement('div', {
            className: 'audio-error',
            innerHTML: '<i class="fas fa-exclamation-triangle"></i> Unable to load audio'
        });
        
        this.container.appendChild(errorMsg);
        
        window.appEvents.emit('audioError', { audioData: this.audioData, error });
    }
    
    pauseOthers() {
        // Pause all other audio players
        document.querySelectorAll('.audio-player').forEach(container => {
            if (container !== this.container) {
                const audio = container.querySelector('audio');
                if (audio && !audio.paused) {
                    audio.pause();
                }
            }
        });
    }
    
    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
        }
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// ===================================================================
// GLOBAL AUDIO CONTROLS
// ===================================================================

class GlobalAudioControls {
    constructor() {
        this.currentPlayer = null;
        this.bindGlobalEvents();
    }
    
    bindGlobalEvents() {
        // Global keyboard controls
        document.addEventListener('keydown', (e) => {
            // Escape key to stop all audio
            if (e.code === 'Escape') {
                this.stopAll();
            }
            
            // Space bar to toggle current audio (when not in input)
            if (e.code === 'Space' && !this.isInputFocused()) {
                e.preventDefault();
                if (this.currentPlayer) {
                    this.currentPlayer.toggle();
                }
            }
        });
        
        // Listen for audio events
        window.appEvents.on('audioStarted', (audioData) => {
            this.setCurrentPlayer(audioData);
        });
        
        window.appEvents.on('audioPaused', () => {
            this.currentPlayer = null;
        });
        
        window.appEvents.on('audioEnded', () => {
            this.currentPlayer = null;
        });
        
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAll();
            }
        });
    }
    
    setCurrentPlayer(audioData) {
        // Find the audio player for this data
        const container = document.querySelector(`[data-audio-id]`);
        // This is a simplified approach - in a full implementation,
        // we'd maintain a registry of audio players
        this.currentPlayer = container ? { audioData } : null;
    }
    
    stopAll() {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        this.currentPlayer = null;
        window.appEvents.emit('allAudioStopped');
    }
    
    pauseAll() {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            if (!audio.paused) {
                audio.pause();
            }
        });
    }
    
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );
    }
}

// ===================================================================
// AUDIO VISUALIZER (Optional Enhancement)
// ===================================================================

class AudioVisualizer {
    constructor(audioElement, canvas) {
        this.audioElement = audioElement;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.animationId = null;
        
        if (window.AudioContext || window.webkitAudioContext) {
            this.init();
        }
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            
            const source = this.audioContext.createMediaElementSource(this.audioElement);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }
    
    start() {
        if (!this.analyser) return;
        this.animate();
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const barWidth = this.canvas.width / this.dataArray.length;
        let x = 0;
        
        for (let i = 0; i < this.dataArray.length; i++) {
            const barHeight = (this.dataArray[i] / 255) * this.canvas.height * 0.8;
            
            const hue = (i / this.dataArray.length) * 360;
            this.ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            
            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }
    }
}

// ===================================================================
// INITIALIZE AUDIO SYSTEM
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    window.globalAudioControls = new GlobalAudioControls();
    
    // Export AudioPlayer class for use by page generator
    window.AudioPlayer = AudioPlayer;
    window.AudioVisualizer = AudioVisualizer;
});