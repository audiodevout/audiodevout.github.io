// ===================================================================
// AUDIO PLAYER SYSTEM
// Custom neon-themed audio players with streaming support
// ===================================================================

const AudioPlayer = {
    players: new Map(),
    currentlyPlaying: null,
    
    init() {
        this.bindEvents();
        this.createPlayers();
        
        Utils.performance.mark('audio-player-init');
        console.log('✓ Audio player system initialized');
    },
    
    bindEvents() {
        // Page change events to refresh players
        appEvents.on('pageChange', (data) => {
            if (data.to === 'audio') {
                this.refreshPlayers();
            }
        });
        
        // Global audio controls
        Utils.events.on(document, 'keydown', (e) => {
            if (e.code === 'Space' && this.currentlyPlaying && !this.isInputFocused()) {
                e.preventDefault();
                this.toggleCurrentPlayer();
            }
        });
    },
    
    createPlayers() {
        const audioContainer = Utils.$('#audio-players');
        if (!audioContainer || typeof portfolioData === 'undefined') return;
        
        // Generate audio player HTML
        audioContainer.innerHTML = portfolioData.audio.map(item => 
            this.generatePlayerHTML(item)
        ).join('');
        
        // Initialize each player
        portfolioData.audio.forEach(item => {
            this.initializePlayer(item.id);
        });
    },
    
    generatePlayerHTML(audioItem) {
        return `
            <div class="audio-player" data-audio-id="${audioItem.id}">
                <div class="audio-header">
                    <div class="audio-artwork">
                        ${audioItem.artwork ? 
                            `<img src="${audioItem.artwork}" alt="${audioItem.title} artwork" loading="lazy">` : 
                            '<i class="fas fa-music"></i>'
                        }
                    </div>
                    <div class="audio-info">
                        <h2 class="audio-title">${audioItem.title}</h2>
                        <p class="audio-description">${audioItem.description}</p>
                        <div class="audio-meta">
                            <span class="audio-duration">
                                <i class="fas fa-clock"></i> ${audioItem.duration}
                            </span>
                            <span class="audio-year">
                                <i class="fas fa-calendar"></i> ${audioItem.year}
                            </span>
                            ${audioItem.tags ? `
                                <span class="audio-tags">
                                    ${audioItem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="audio-controls">
                    <button class="play-button" data-state="paused" aria-label="Play ${audioItem.title}">
                        <i class="fas fa-play"></i>
                    </button>
                    
                    <div class="audio-progress-container">
                        <div class="progress-wrapper">
                            <input type="range" class="audio-progress" min="0" max="100" value="0" 
                                   aria-label="Audio progress" aria-valuetext="0% played">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="audio-time">
                            <span class="current-time">0:00</span>
                            <span class="time-separator">/</span>
                            <span class="total-time">${audioItem.duration}</span>
                        </div>
                    </div>
                    
                    <div class="volume-control">
                        <button class="volume-button" aria-label="Mute">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <input type="range" class="volume-slider" min="0" max="100" value="75" 
                               aria-label="Volume control">
                    </div>
                </div>
                
                <audio preload="metadata" crossorigin="anonymous">
                    <source src="${audioItem.file}" type="audio/mpeg">
                    <p>Your browser does not support the audio element. 
                       <a href="${audioItem.file}">Download the audio file</a>.</p>
                </audio>
                
                <div class="waveform-placeholder">
                    <div class="waveform-message">
                        <i class="fas fa-wave-square"></i>
                        <span>Audio waveform visualization</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    initializePlayer(audioId) {
        const playerContainer = Utils.$(`[data-audio-id="${audioId}"]`);
        if (!playerContainer) return;
        
        const audioElement = playerContainer.querySelector('audio');
        const playButton = playerContainer.querySelector('.play-button');
        const progressBar = playerContainer.querySelector('.audio-progress');
        const progressFill = playerContainer.querySelector('.progress-fill');
        const currentTimeSpan = playerContainer.querySelector('.current-time');
        const volumeButton = playerContainer.querySelector('.volume-button');
        const volumeSlider = playerContainer.querySelector('.volume-slider');
        
        if (!audioElement) return;
        
        // Create player state object
        const player = {
            id: audioId,
            element: audioElement,
            container: playerContainer,
            isPlaying: false,
            isLoaded: false,
            duration: 0,
            currentTime: 0,
            volume: 0.75,
            isMuted: false,
            isLoading: false
        };
        
        // Store player reference
        this.players.set(audioId, player);
        
        // Bind audio element events
        this.bindAudioEvents(player);
        
        // Bind control events
        this.bindControlEvents(player, {
            playButton,
            progressBar,
            progressFill,
            currentTimeSpan,
            volumeButton,
            volumeSlider
        });
        
        // Set initial volume
        audioElement.volume = player.volume;
        volumeSlider.value = player.volume * 100;
    },
    
    bindAudioEvents(player) {
        const { element, container } = player;
        
        // Loading events
        Utils.events.on(element, 'loadstart', () => {
            this.setPlayerState(player, 'loading');
        });
        
        Utils.events.on(element, 'loadedmetadata', () => {
            player.duration = element.duration;
            player.isLoaded = true;
            this.updateTimeDisplay(player);
            this.setPlayerState(player, 'loaded');
        });
        
        Utils.events.on(element, 'canplay', () => {
            if (player.isLoading) {
                this.setPlayerState(player, 'ready');
            }
        });
        
        // Playback events
        Utils.events.on(element, 'play', () => {
            player.isPlaying = true;
            this.setCurrentlyPlaying(player);
            this.updatePlayButton(player, 'playing');
            container.classList.add('playing');
            
            // Analytics
            Utils.analytics.track('audio_play', {
                audio_id: player.id,
                title: portfolioData.getAudioById(player.id)?.title
            });
        });
        
        Utils.events.on(element, 'pause', () => {
            player.isPlaying = false;
            this.updatePlayButton(player, 'paused');
            container.classList.remove('playing');
            
            if (this.currentlyPlaying === player) {
                this.currentlyPlaying = null;
            }
        });
        
        Utils.events.on(element, 'ended', () => {
            player.isPlaying = false;
            this.updatePlayButton(player, 'paused');
            container.classList.remove('playing');
            this.currentlyPlaying = null;
            
            // Reset progress
            element.currentTime = 0;
            this.updateProgress(player);
        });
        
        // Progress events
        Utils.events.on(element, 'timeupdate', () => {
            player.currentTime = element.currentTime;
            this.updateProgress(player);
            this.updateTimeDisplay(player);
        });
        
        // Error handling
        Utils.events.on(element, 'error', (e) => {
            console.error(`Audio error for ${player.id}:`, e);
            this.setPlayerState(player, 'error');
            Utils.error.show(`Failed to load audio: ${portfolioData.getAudioById(player.id)?.title}`);
        });
        
        // Volume events
        Utils.events.on(element, 'volumechange', () => {
            player.volume = element.volume;
            player.isMuted = element.muted;
            this.updateVolumeDisplay(player);
        });
    },
    
    bindControlEvents(player, controls) {
        const { playButton, progressBar, volumeButton, volumeSlider } = controls;
        
        // Play/pause button
        Utils.events.on(playButton, 'click', () => {
            this.togglePlayer(player);
        });
        
        // Progress bar
        Utils.events.on(progressBar, 'input', (e) => {
            if (player.isLoaded) {
                const seekTime = (e.target.value / 100) * player.duration;
                player.element.currentTime = seekTime;
            }
        });
        
        // Volume button (mute/unmute)
        Utils.events.on(volumeButton, 'click', () => {
            this.toggleMute(player);
        });
        
        // Volume slider
        Utils.events.on(volumeSlider, 'input', (e) => {
            const volume = e.target.value / 100;
            this.setVolume(player, volume);
        });
        
        // Keyboard accessibility
        Utils.events.on(player.container, 'keydown', (e) => {
            this.handlePlayerKeyboard(e, player);
        });
    },
    
    togglePlayer(player) {
        if (player.isPlaying) {
            this.pausePlayer(player);
        } else {
            this.playPlayer(player);
        }
    },
    
    playPlayer(player) {
        // Pause any other playing audio
        if (this.currentlyPlaying && this.currentlyPlaying !== player) {
            this.pausePlayer(this.currentlyPlaying);
        }
        
        const playPromise = player.element.play();
        
        if (playPromise !== undefined) {
            this.setPlayerState(player, 'loading');
            
            playPromise
                .then(() => {
                    this.setPlayerState(player, 'playing');
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                    this.setPlayerState(player, 'error');
                    Utils.error.show('Playback failed. Please try again.');
                });
        }
    },
    
    pausePlayer(player) {
        player.element.pause();
    },
    
    toggleCurrentPlayer() {
        if (this.currentlyPlaying) {
            this.togglePlayer(this.currentlyPlaying);
        }
    },
    
    setCurrentlyPlaying(player) {
        // Pause previous player
        if (this.currentlyPlaying && this.currentlyPlaying !== player) {
            this.pausePlayer(this.currentlyPlaying);
        }
        
        this.currentlyPlaying = player;
    },
    
    setVolume(player, volume) {
        player.volume = Utils.clamp(volume, 0, 1);
        player.element.volume = player.volume;
        player.element.muted = false;
        player.isMuted = false;
    },
    
    toggleMute(player) {
        player.element.muted = !player.element.muted;
        player.isMuted = player.element.muted;
    },
    
    updatePlayButton(player, state) {
        const playButton = player.container.querySelector('.play-button');
        const icon = playButton.querySelector('i');
        
        playButton.setAttribute('data-state', state);
        
        switch (state) {
            case 'playing':
                icon.className = 'fas fa-pause';
                playButton.setAttribute('aria-label', 'Pause');
                break;
            case 'paused':
                icon.className = 'fas fa-play';
                playButton.setAttribute('aria-label', 'Play');
                break;
            case 'loading':
                icon.className = 'fas fa-spinner fa-spin';
                playButton.setAttribute('aria-label', 'Loading');
                break;
        }
    },
    
    updateProgress(player) {
        const progressBar = player.container.querySelector('.audio-progress');
        const progressFill = player.container.querySelector('.progress-fill');
        
        if (player.duration > 0) {
            const progressPercent = (player.currentTime / player.duration) * 100;
            progressBar.value = progressPercent;
            
            if (progressFill) {
                progressFill.style.width = `${progressPercent}%`;
            }
            
            // Update aria attributes
            progressBar.setAttribute('aria-valuetext', `${Math.round(progressPercent)}% played`);
        }
    },
    
    updateTimeDisplay(player) {
        const currentTimeSpan = player.container.querySelector('.current-time');
        const totalTimeSpan = player.container.querySelector('.total-time');
        
        if (currentTimeSpan) {
            currentTimeSpan.textContent = Utils.formatTime(player.currentTime);
        }
        
        if (totalTimeSpan && player.duration) {
            totalTimeSpan.textContent = Utils.formatTime(player.duration);
        }
    },
    
    updateVolumeDisplay(player) {
        const volumeButton = player.container.querySelector('.volume-button');
        const volumeSlider = player.container.querySelector('.volume-slider');
        const icon = volumeButton.querySelector('i');
        
        if (player.isMuted || player.volume === 0) {
            icon.className = 'fas fa-volume-mute';
            volumeButton.setAttribute('aria-label', 'Unmute');
        } else if (player.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
            volumeButton.setAttribute('aria-label', 'Mute');
        } else {
            icon.className = 'fas fa-volume-up';
            volumeButton.setAttribute('aria-label', 'Mute');
        }
        
        volumeSlider.value = player.isMuted ? 0 : player.volume * 100;
    },
    
    setPlayerState(player, state) {
        player.container.classList.remove('loading', 'loaded', 'playing', 'paused', 'error');
        player.container.classList.add(state);
        
        switch (state) {
            case 'loading':
                player.isLoading = true;
                break;
            case 'loaded':
            case 'ready':
                player.isLoading = false;
                break;
            case 'error':
                player.isLoading = false;
                player.isPlaying = false;
                break;
        }
    },
    
    handlePlayerKeyboard(e, player) {
        switch (e.code) {
            case 'Space':
                if (!this.isInputFocused()) {
                    e.preventDefault();
                    this.togglePlayer(player);
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.seekPlayer(player, -10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.seekPlayer(player, 10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.adjustVolume(player, 0.1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.adjustVolume(player, -0.1);
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute(player);
                break;
        }
    },
    
    seekPlayer(player, seconds) {
        if (player.isLoaded) {
            const newTime = Utils.clamp(
                player.currentTime + seconds,
                0,
                player.duration
            );
            player.element.currentTime = newTime;
        }
    },
    
    adjustVolume(player, delta) {
        const newVolume = Utils.clamp(player.volume + delta, 0, 1);
        this.setVolume(player, newVolume);
        
        // Update slider
        const volumeSlider = player.container.querySelector('.volume-slider');
        volumeSlider.value = newVolume * 100;
    },
    
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );
    },
    
    refreshPlayers() {
        // Recreate players when page is shown
        const audioContainer = Utils.$('#audio-players');
        if (audioContainer && audioContainer.children.length === 0) {
            this.createPlayers();
        }
    },
    
    pauseAll() {
        this.players.forEach(player => {
            if (player.isPlaying) {
                this.pausePlayer(player);
            }
        });
    },
    
    getPlayerById(id) {
        return this.players.get(id);
    },
    
    getCurrentlyPlaying() {
        return this.currentlyPlaying;
    },
    
    destroy() {
        // Pause all players
        this.pauseAll();
        
        // Clear players map
        this.players.clear();
        this.currentlyPlaying = null;
        
        // Clear audio container
        const audioContainer = Utils.$('#audio-players');
        if (audioContainer) {
            audioContainer.innerHTML = '';
        }
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    AudioPlayer.init();
});

// Export for global access
window.AudioPlayer = AudioPlayer;