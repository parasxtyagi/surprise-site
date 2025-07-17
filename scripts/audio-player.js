// Universal Music Player
class UniversalMusicPlayer {
  constructor() {
    this.currentTrack = 0;
    this.isPlaying = false;
    this.volume = 0.7;
    this.currentTime = 0;
    this.duration = 0;
    this.isCollapsed = false;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    
    this.playlist = [
      {
        title: "Love Story Theme",
        artist: "Romantic Melodies",
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        duration: "3:45"
      },
      {
        title: "Game Background",
        artist: "Playful Hearts",
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        duration: "2:30"
      },
      {
        title: "Surprise Celebration",
        artist: "Joyful Moments",
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        duration: "4:12"
      }
    ];
    
    this.audio = new Audio();
    this.init();
  }

  init() {
    this.createPlayer();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.loadTrack(this.currentTrack);
    this.setupDragAndDrop();
  }

  createPlayer() {
    const player = document.createElement('div');
    player.className = 'universal-music-player';
    player.innerHTML = `
      <div class="player-header">
        <h3 class="player-title">Music Player</h3>
        <div class="player-controls-header">
          <button class="header-btn collapse-btn" title="Collapse Player">−</button>
          <button class="header-btn close-btn" title="Close Player">×</button>
        </div>
      </div>
      
      <div class="mini-player">
        <span class="play-pause-mini">▶️</span>
      </div>
      
      <div class="player-content">
        <div class="audio-visualizer">
          ${Array.from({length: 8}, () => '<div class="visualizer-bar"></div>').join('')}
        </div>
        
        <div class="track-info">
          <h4 class="track-title">${this.playlist[0].title}</h4>
          <p class="track-artist">${this.playlist[0].artist}</p>
        </div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill">
              <div class="progress-handle"></div>
            </div>
          </div>
          <div class="time-display">
            <span class="current-time">0:00</span>
            <span class="total-time">0:00</span>
          </div>
        </div>
        
        <div class="main-controls">
          <button class="control-btn prev-next" title="Previous Track">⏮️</button>
          <button class="control-btn play-pause" title="Play/Pause">▶️</button>
          <button class="control-btn prev-next" title="Next Track">⏭️</button>
        </div>
        
        <div class="volume-container">
          <span class="volume-icon">🔊</span>
          <input type="range" class="volume-slider" min="0" max="100" value="70">
        </div>
        
        <div class="playlist-container">
          ${this.playlist.map((track, index) => `
            <div class="playlist-item ${index === 0 ? 'active' : ''}" data-index="${index}">
              <span class="playlist-item-icon">${index === 0 ? '▶️' : '🎵'}</span>
              <div class="playlist-item-info">
                <p class="playlist-item-title">${track.title}</p>
                <p class="playlist-item-duration">${track.duration}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(player);
    this.player = player;
  }

  setupEventListeners() {
    // Audio events
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      this.updateTimeDisplay();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.updateProgress();
      this.updateTimeDisplay();
    });

    this.audio.addEventListener('ended', () => {
      this.nextTrack();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error:', e);
      this.nextTrack();
    });

    // Player controls
    const playPauseBtn = this.player.querySelector('.play-pause');
    const prevBtn = this.player.querySelector('.control-btn:first-child');
    const nextBtn = this.player.querySelector('.control-btn:last-child');
    const volumeSlider = this.player.querySelector('.volume-slider');
    const progressBar = this.player.querySelector('.progress-bar');
    const collapseBtn = this.player.querySelector('.collapse-btn');
    const closeBtn = this.player.querySelector('.close-btn');
    const miniPlayer = this.player.querySelector('.mini-player');

    playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    prevBtn.addEventListener('click', () => this.previousTrack());
    nextBtn.addEventListener('click', () => this.nextTrack());
    volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
    progressBar.addEventListener('click', (e) => this.seekTo(e));
    collapseBtn.addEventListener('click', () => this.toggleCollapse());
    closeBtn.addEventListener('click', () => this.hide());
    miniPlayer.addEventListener('click', () => this.toggleCollapse());

    // Playlist items
    this.player.querySelectorAll('.playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.loadTrack(index);
        this.play();
      });
    });

    // Volume icon toggle
    const volumeIcon = this.player.querySelector('.volume-icon');
    volumeIcon.addEventListener('click', () => this.toggleMute());
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Only trigger if no input is focused
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.code) {
        case 'Space':
          e.preventDefault();
          this.togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.previousTrack();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextTrack();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.setVolume(Math.min(1, this.volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.setVolume(Math.max(0, this.volume - 0.1));
          break;
        case 'KeyM':
          e.preventDefault();
          this.toggleMute();
          break;
      }
    });
  }

  setupDragAndDrop() {
    const header = this.player.querySelector('.player-header');
    const miniPlayer = this.player.querySelector('.mini-player');

    [header, miniPlayer].forEach(element => {
      element.addEventListener('mousedown', (e) => this.startDrag(e));
    });

    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.stopDrag());

    // Touch events for mobile
    [header, miniPlayer].forEach(element => {
      element.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
    });

    document.addEventListener('touchmove', (e) => this.drag(e.touches[0]));
    document.addEventListener('touchend', () => this.stopDrag());
  }

  startDrag(e) {
    this.isDragging = true;
    this.player.classList.add('dragging');
    
    const rect = this.player.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;
  }

  drag(e) {
    if (!this.isDragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    // Keep player within viewport
    const maxX = window.innerWidth - this.player.offsetWidth;
    const maxY = window.innerHeight - this.player.offsetHeight;

    const constrainedX = Math.max(0, Math.min(x, maxX));
    const constrainedY = Math.max(0, Math.min(y, maxY));

    this.player.style.left = constrainedX + 'px';
    this.player.style.top = constrainedY + 'px';
    this.player.style.right = 'auto';
    this.player.style.bottom = 'auto';
  }

  stopDrag() {
    this.isDragging = false;
    this.player.classList.remove('dragging');
  }

  loadTrack(index) {
    if (index < 0 || index >= this.playlist.length) return;

    this.currentTrack = index;
    const track = this.playlist[index];
    
    this.audio.src = track.src;
    this.audio.load();

    // Update UI
    this.player.querySelector('.track-title').textContent = track.title;
    this.player.querySelector('.track-artist').textContent = track.artist;
    this.player.querySelector('.total-time').textContent = track.duration;

    // Update playlist active state
    this.player.querySelectorAll('.playlist-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
      const icon = item.querySelector('.playlist-item-icon');
      icon.textContent = i === index ? (this.isPlaying ? '⏸️' : '▶️') : '🎵';
    });
  }

  play() {
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updatePlayButton();
      this.startVisualizer();
    }).catch(e => {
      console.warn('Playback failed:', e);
    });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
    this.stopVisualizer();
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  previousTrack() {
    const newIndex = this.currentTrack > 0 ? this.currentTrack - 1 : this.playlist.length - 1;
    this.loadTrack(newIndex);
    if (this.isPlaying) this.play();
  }

  nextTrack() {
    const newIndex = this.currentTrack < this.playlist.length - 1 ? this.currentTrack + 1 : 0;
    this.loadTrack(newIndex);
    if (this.isPlaying) this.play();
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = this.volume;
    
    const volumeSlider = this.player.querySelector('.volume-slider');
    volumeSlider.value = this.volume * 100;
    
    // Update volume icon
    const volumeIcon = this.player.querySelector('.volume-icon');
    if (this.volume === 0) {
      volumeIcon.textContent = '🔇';
    } else if (this.volume < 0.5) {
      volumeIcon.textContent = '🔉';
    } else {
      volumeIcon.textContent = '🔊';
    }
  }

  toggleMute() {
    if (this.volume > 0) {
      this.previousVolume = this.volume;
      this.setVolume(0);
    } else {
      this.setVolume(this.previousVolume || 0.7);
    }
  }

  seekTo(e) {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * this.duration;
    
    this.audio.currentTime = seekTime;
  }

  updateProgress() {
    if (this.duration > 0) {
      const percent = (this.currentTime / this.duration) * 100;
      this.player.querySelector('.progress-fill').style.width = percent + '%';
    }
  }

  updateTimeDisplay() {
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    this.player.querySelector('.current-time').textContent = formatTime(this.currentTime);
    if (this.duration) {
      this.player.querySelector('.total-time').textContent = formatTime(this.duration);
    }
  }

  updatePlayButton() {
    const playBtn = this.player.querySelector('.play-pause');
    const miniPlayBtn = this.player.querySelector('.play-pause-mini');
    const icon = this.isPlaying ? '⏸️' : '▶️';
    
    playBtn.textContent = icon;
    miniPlayBtn.textContent = icon;

    // Update playlist icons
    const activeItem = this.player.querySelector('.playlist-item.active .playlist-item-icon');
    if (activeItem) {
      activeItem.textContent = icon;
    }
  }

  startVisualizer() {
    const bars = this.player.querySelectorAll('.visualizer-bar');
    bars.forEach(bar => {
      bar.style.animationPlayState = 'running';
    });
  }

  stopVisualizer() {
    const bars = this.player.querySelectorAll('.visualizer-bar');
    bars.forEach(bar => {
      bar.style.animationPlayState = 'paused';
    });
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.player.classList.toggle('collapsed', this.isCollapsed);
    
    const collapseBtn = this.player.querySelector('.collapse-btn');
    collapseBtn.textContent = this.isCollapsed ? '+' : '−';
  }

  hide() {
    this.player.style.display = 'none';
    this.pause();
  }

  show() {
    this.player.style.display = 'block';
  }

  // Persist state across page navigation
  saveState() {
    const state = {
      currentTrack: this.currentTrack,
      isPlaying: this.isPlaying,
      volume: this.volume,
      currentTime: this.currentTime,
      isCollapsed: this.isCollapsed
    };
    localStorage.setItem('musicPlayerState', JSON.stringify(state));
  }

  loadState() {
    const savedState = localStorage.getItem('musicPlayerState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.currentTrack = state.currentTrack || 0;
      this.volume = state.volume || 0.7;
      this.isCollapsed = state.isCollapsed || false;
      
      this.loadTrack(this.currentTrack);
      this.setVolume(this.volume);
      
      if (this.isCollapsed) {
        this.toggleCollapse();
      }
      
      if (state.isPlaying && state.currentTime) {
        this.audio.currentTime = state.currentTime;
        this.play();
      }
    }
  }
}

// Initialize music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.musicPlayer = new UniversalMusicPlayer();
  window.musicPlayer.loadState();
});

// Save state before page unload
window.addEventListener('beforeunload', () => {
  if (window.musicPlayer) {
    window.musicPlayer.saveState();
  }
});