// ===================================================================
// CUSTOM NEON AUDIO PLAYER
// Enhanced cyberpunk-themed audio player system
// ===================================================================

const AudioPlayer = {
    players: new Map(),
    currentlyPlaying: null,

    init() {
        this.bindGlobalEvents();
        console.log('✓ Audio player system initialized');
    },

    bindGlobalEvents() {
        // Pause all audio when visibility changes (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.currentlyPlaying) {
                this.currentlyPlaying.pause();
            }
        });

        // Handle space bar for play/pause of currently focused player
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && document.activeElement.classList.contains('play-button')) {
                e.preventDefault();
                const playerId = document.activeElement.closest('.audio-player').dataset.audioId;
                const player = this.players.get(playerId);
                if (player) {
                    player.togglePlay();
                }
            }
        });
    },

    createPlayers() {
        const container = Utils.$('#audio-players');
        if (!container || !portfolioData.audio) return;

        // Clear existing players
        container.innerHTML = '';
        this.players.clear();

        portfolioData.audio.forEach(audioItem => {
            if (audioItem.type === 'bandcamp') {
                const playerElement = this.createBandcampPlayer(audioItem);
                container.appendChild(playerElement);
            } else {
                // For future regular audio files
                const playerElement = this.createRegularPlayer(audioItem);
                container.appendChild(playerElement);
            }
        });

        // Initialize lightbox for any images in players
        if (typeof Lightbox !== 'undefined') {
            Lightbox.init();
        }

        console.log(`✓ Created ${portfolioData.audio.length} audio players`);
    },

    createBandcampPlayer(audioItem) {
        const playerDiv = Utils.createElement('div', {
            className: 'bandcamp-player',
            'data-audio-id': audioItem.id,
            'data-audio-type': 'bandcamp'
        });

        // Extract title from embed URL or use provided title
        const extractedTitle = this.extractBandcampTitle(audioItem.embedUrl) || audioItem.title;

        playerDiv.innerHTML = `
            <div class="bandcamp-embed">
                <div class="bandcamp-logo">
                    <i class="fab fa-bandcamp"></i>
                </div>
                <iframe style="border: 0; width: 100%; height: 450px;" 
                        src="${audioItem.embedUrl}" 
                        seamless
                        title="Bandcamp player for ${extractedTitle}"
                        loading="lazy">
                    <a href="${audioItem.bandcampUrl}">${extractedTitle}</a>
                </iframe>
            </div>

            <div class="minimal-audio-info">
                <h3 class="minimal-audio-title">${extractedTitle}</h3>
                <p class="minimal-audio-description">${audioItem.description}</p>
                <div class="minimal-audio-meta">
                    <span class="audio-year">${audioItem.year}</span>
                    ${audioItem.tags ? `
                        <div class="minimal-tags">
                            ${audioItem.tags.slice(0, 2).map(tag => `<span class="minimal-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        return playerDiv;
    },

    extractBandcampTitle(embedUrl) {
        // Try to extract title from Bandcamp embed URL
        try {
            const url = new URL(embedUrl);
            const pathParts = url.pathname.split('/');
            const albumIndex = pathParts.indexOf('album');
            if (albumIndex !== -1 && pathParts[albumIndex + 1]) {
                return pathParts[albumIndex + 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
        } catch (e) {
            console.warn('Could not extract title from Bandcamp URL:', embedUrl);
        }
        return null;
    },

    createRegularPlayer(audioItem) {
        const playerDiv = Utils.createElement('div', {
            className: 'audio-player regular-player',
            'data-audio-id': audioItem.id,
            'data-audio-type': 'regular'
        });

        const player = new RegularAudioPlayer(audioItem, playerDiv);
        this.players.set(audioItem.id, player);

        return playerDiv;
    },

    // Utility method to pause all players except one
    pauseAllExcept(exceptPlayerId) {
        this.players.forEach((player, playerId) => {
            if (playerId !== exceptPlayerId && player.isPlaying) {
                player.pause();
            }
        });

        // Also pause any bandcamp iframes (though we can't control them directly)
        document.querySelectorAll('.bandcamp-player').forEach(player => {
            if (player.dataset.audioId !== exceptPlayerId) {
                // We can't pause bandcamp embeds, but we can note that others are playing
                console.log('Note: Cannot pause Bandcamp embed, user should manually pause if needed');
            }
        });
    },

    // Get player by ID
    getPlayer(playerId) {
        return this.players.get(playerId);
    },

    // Destroy all players
    destroy() {
        this.players.forEach(player => {
            if (typeof player.destroy === 'function') {
                player.destroy();
            }
        });
        this.players.clear();
        this.currentlyPlaying = null;
    }
};

// ===================================================================
// REGULAR AUDIO PLAYER CLASS
// For standard audio files (MP3, WAV, etc.)
// ===================================================================

class RegularAudioPlayer {
    constructor(audioData, container) {
        this.audioData = audioData;
        this.container = container;
        this.audio = null;
        this.isPlaying = false;
        this.isLoading = false;
        this.duration = 0;
        this.currentTime = 0;
        this.volume = 0.8;

        this.elements = {};

        this.init();
    }

    init() {
        this.render();
        this.bindElements();
        this.bindEvents();
        this.setupAudio();
    }

    render() {
        this.container.innerHTML = `
            <div class="audio-header">
                <div class="audio-artwork">
                    <div class="audio-icon">
                        <i class="fas fa-music"></i>
                    </div>
                </div>
                <div class="audio-info">
                    <h3 class="audio-title">${this.audioData.title}</h3>
                    <p class="audio-description">${this.audioData.description}</p>
                    <div class="audio-meta">
                        ${this.audioData.duration ? `
                            <span class="audio-duration">
                                <i class="fas fa-clock"></i> ${this.audioData.duration}
                            </span>
                        ` : ''}
                        ${this.audioData.year ? `
                            <span class="audio-year">
                                <i class="fas fa-calendar"></i> ${this.audioData.year}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>

            <div class="audio-controls">
                <button class="play-button" aria-label="Play ${this.audioData.title}">
                    <i class="fas fa-play"></i>
                </button>

                <div class="audio-progress-container">
                    <input type="range" 
                           class="audio-progress" 
                           min="0" 
                           max="100" 
                           value="0" 
                           step="0.1"
                           aria-label="Audio progress">
                    <div class="audio-time">
                        <span class="current-time">0:00</span>
                        <span class="time-separator">/</span>
                        <span class="total-time">0:00</span>
                    </div>
                </div>

                <div class="volume-control">
                    <button class="volume-button" aria-label="Toggle mute">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <input type="range" 
                           class="volume-slider" 
                           min="0" 
                           max="1" 
                           step="0.1" 
                           value="0.8"
                           aria-label="Volume control">
                </div>
            </div>

            <audio preload="metadata" style="display: none;">
                <source src="${this.audioData.src}" type="audio/mpeg">
                <source src="${this.audioData.src}" type="audio/wav">
                <source src="${this.audioData.src}" type="audio/ogg">
                Your browser does not support the audio element.
            </audio>

            ${this.audioData.tags ? `
                <div class="audio-tags">
                    ${this.audioData.tags.map(tag => `<span class="audio-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        `;
    }

    bindElements() {
        this.elements = {
            playButton: this.container.querySelector('.play-button'),
            progress: this.container.querySelector('.audio-progress'),
            currentTimeDisplay: this.container.querySelector('.current-time'),
            totalTimeDisplay: this.container.querySelector('.total-time'),
            volumeButton: this.container.querySelector('.volume-button'),
            volumeSlider: this.container.querySelector('.volume-slider'),
            audio: this.container.querySelector('audio')
        };
    }

    bindEvents() {
        // Play/pause button
        this.elements.playButton.addEventListener('click', () => this.togglePlay());

        // Progress bar
        this.elements.progress.addEventListener('input', (e) => {
            const percentage = parseFloat(e.target.value);
            this.seek((percentage / 100) * this.duration);
        });

        // Volume controls
        this.elements.volumeButton.addEventListener('click', () => this.toggleMute());
        this.elements.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(parseFloat(e.target.value));
        });

        // Keyboard shortcuts
        this.container.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.seek(Math.max(0, this.currentTime - 10));
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.seek(Math.min(this.duration, this.currentTime + 10));
                    break;
            }
        });
    }

    setupAudio() {
        if (!this.elements.audio) return;

        // Audio event listeners
        this.elements.audio.addEventListener('loadstart', () => this.setLoading(true));
        this.elements.audio.addEventListener('canplay', () => this.setLoading(false));
        this.elements.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.elements.audio.duration;
            this.updateTimeDisplay();
        });
        this.elements.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.elements.audio.addEventListener('ended', () => this.handleEnded());
        this.elements.audio.addEventListener('error', (e) => this.handleError(e));

        // Set initial volume
        this.elements.audio.volume = this.volume;
    }

    async togglePlay() {
        if (this.isPlaying) {
            await this.pause();
        } else {
            await this.play();
        }
    }

    async play() {
        if (!this.elements.audio || this.isLoading) return;

        try {
            // Pause other players
            AudioPlayer.pauseAllExcept(this.audioData.id);

            this.setLoading(true);
            await this.elements.audio.play();
            this.setPlaying(true);
            this.setLoading(false);

            AudioPlayer.currentlyPlaying = this;

            // Emit event
            appEvents.emit('audioStarted', {
                player: this,
                audioData: this.audioData
            });

        } catch (error) {
            console.error('Failed to play audio:', error);
            this.handleError(error);
        }
    }

    async pause() {
        if (!this.elements.audio) return;

        this.elements.audio.pause();
        this.setPlaying(false);

        if (AudioPlayer.currentlyPlaying === this) {
            AudioPlayer.currentlyPlaying = null;
        }

        // Emit event
        appEvents.emit('audioPaused', {
            player: this,
            audioData: this.audioData
        });
    }

    seek(time) {
        if (!this.elements.audio || !this.duration) return;
        this.elements.audio.currentTime = Math.max(0, Math.min(time, this.duration));
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.elements.audio) {
            this.elements.audio.volume = this.volume;
        }
        this.elements.volumeSlider.value = this.volume;
        this.updateVolumeIcon();
    }

    toggleMute() {
        if (this.volume > 0) {
            this.previousVolume = this.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.previousVolume || 0.8);
        }
    }

    setPlaying(playing) {
        this.isPlaying = playing;
        this.updatePlayButton();

        if (playing) {
            this.container.classList.add('playing');
        } else {
            this.container.classList.remove('playing');
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.updatePlayButton();

        if (loading) {
            this.container.classList.add('loading');
        } else {
            this.container.classList.remove('loading');
        }
    }

    updatePlayButton() {
        if (!this.elements.playButton) return;

        const icon = this.elements.playButton.querySelector('i');

        if (this.isLoading) {
            icon.className = 'fas fa-spinner fa-spin';
            this.elements.playButton.setAttribute('aria-label', `Loading ${this.audioData.title}`);
        } else if (this.isPlaying) {
            icon.className = 'fas fa-pause';
            this.elements.playButton.setAttribute('aria-label', `Pause ${this.audioData.title}`);
        } else {
            icon.className = 'fas fa-play';
            this.elements.playButton.setAttribute('aria-label', `Play ${this.audioData.title}`);
        }
    }

    updateProgress() {
        if (!this.elements.audio) return;

        this.currentTime = this.elements.audio.currentTime;
        const progress = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;

        this.elements.progress.value = progress;
        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        if (!this.elements.currentTimeDisplay || !this.elements.totalTimeDisplay) return;

        this.elements.currentTimeDisplay.textContent = Utils.formatTime(this.currentTime);
        this.elements.totalTimeDisplay.textContent = Utils.formatTime(this.duration);
    }

    updateVolumeIcon() {
        if (!this.elements.volumeButton) return;

        const icon = this.elements.volumeButton.querySelector('i');

        if (this.volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (this.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    handleEnded() {
        this.setPlaying(false);
        this.seek(0);

        if (AudioPlayer.currentlyPlaying === this) {
            AudioPlayer.currentlyPlaying = null;
        }

        // Emit event
        appEvents.emit('audioEnded', {
            player: this,
            audioData: this.audioData
        });
    }

    handleError(error) {
        console.error('Audio error:', error);
        this.setLoading(false);
        this.setPlaying(false);

        this.container.classList.add('error');

        // Show error message
        const errorDiv = Utils.createElement('div', {
            className: 'audio-error-message',
            innerHTML: '<i class="fas fa-exclamation-triangle"></i> Unable to load audio file'
        });

        this.container.appendChild(errorDiv);

        // Emit event
        appEvents.emit('audioError', {
            player: this,
            audioData: this.audioData,
            error: error
        });
    }

    destroy() {
        if (this.elements.audio) {
            this.elements.audio.pause();
            this.elements.audio.src = '';
        }

        if (AudioPlayer.currentlyPlaying === this) {
            AudioPlayer.currentlyPlaying = null;
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AudioPlayer.init();
});

// Initialize when page generator creates audio content
appEvents.on('pageChange', (data) => {
    if (data.to === 'audio') {
        // Delay to ensure DOM is updated
        setTimeout(() => {
            AudioPlayer.createPlayers();
        }, 100);
    }
});

// Export for global access
window.AudioPlayer = AudioPlayer;