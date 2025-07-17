// Game page functionality
class HeartGame {
  constructor() {
    this.gameArea = document.getElementById('gameArea');
    this.heartsCollected = 0;
    this.targetHearts = 5;
    this.score = 0;
    this.gameTime = 0;
    this.gameTimer = null;
    this.spawnTimer = null;
    this.fallingHearts = [];
    this.isGameActive = false;
    this.isPaused = false;
    this.gameStartTime = 0;
    this.combo = 0;
    this.maxCombo = 0;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupGameCursor();
    this.updateUI();
  }

  setupEventListeners() {
    // Game area click handler
    this.gameArea.addEventListener('click', (e) => {
      if (!this.isGameActive || this.isPaused) return;
      
      const rect = this.gameArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.createClickEffect(x, y);
    });

    // Game cursor movement
    this.gameArea.addEventListener('mousemove', (e) => {
      if (!this.isGameActive || this.isPaused) return;
      
      const cursor = document.getElementById('gameCursor');
      const rect = this.gameArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.isGameActive) {
        e.preventDefault();
        this.togglePause();
      } else if (e.code === 'Escape') {
        this.pauseGame();
      }
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  setupGameCursor() {
    const cursor = document.getElementById('gameCursor');
    if (cursor) {
      cursor.style.display = 'none';
      
      this.gameArea.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
      });
      
      this.gameArea.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
      });
    }
  }

  startGame() {
    this.isGameActive = true;
    this.gameStartTime = Date.now();
    this.heartsCollected = 0;
    this.score = 0;
    this.gameTime = 0;
    this.combo = 0;
    this.maxCombo = 0;
    
    // Hide instructions
    const instructions = document.getElementById('gameInstructions');
    if (instructions) {
      instructions.style.display = 'none';
    }
    
    // Start game timers
    this.gameTimer = setInterval(() => {
      if (!this.isPaused) {
        this.gameTime++;
        this.updateUI();
      }
    }, 1000);
    
    this.spawnTimer = setInterval(() => {
      if (!this.isPaused) {
        this.spawnHeart();
      }
    }, 1500);
    
    this.updateUI();
    App.showToast('Game started! Catch the hearts! 💖');
  }

  spawnHeart() {
    if (!this.isGameActive || this.isPaused) return;
    
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = ['💖', '💕', '💗', '💝', '💘'][Math.floor(Math.random() * 5)];
    
    const gameAreaRect = this.gameArea.getBoundingClientRect();
    const heartSize = 50;
    const maxX = gameAreaRect.width - heartSize;
    const x = Math.random() * maxX;
    
    heart.style.left = x + 'px';
    heart.style.top = '-50px';
    heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
    
    this.gameArea.appendChild(heart);
    this.fallingHearts.push({
      element: heart,
      x: x,
      y: -50,
      speed: Math.random() * 2 + 1
    });
    
    // Heart click handler
    heart.addEventListener('click', (e) => {
      e.stopPropagation();
      this.catchHeart(heart);
    });
    
    // Remove heart when it reaches bottom
    heart.addEventListener('animationend', () => {
      this.removeHeart(heart);
    });
  }

  catchHeart(heartElement) {
    if (!this.isGameActive || this.isPaused) return;
    
    const heartData = this.fallingHearts.find(h => h.element === heartElement);
    if (!heartData) return;
    
    // Update game state
    this.heartsCollected++;
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    
    // Calculate score with combo multiplier
    const baseScore = 100;
    const comboBonus = Math.floor(this.combo / 3) * 50;
    const scoreGain = baseScore + comboBonus;
    this.score += scoreGain;
    
    // Create collection effect
    this.createCollectionEffect(heartElement);
    
    // Show combo if applicable
    if (this.combo >= 3) {
      this.showCombo();
    }
    
    // Remove heart
    this.removeHeart(heartElement);
    
    // Update UI
    this.updateUI();
    
    // Check win condition
    if (this.heartsCollected >= this.targetHearts) {
      this.winGame();
    }
  }

  createCollectionEffect(heartElement) {
    const rect = heartElement.getBoundingClientRect();
    const gameAreaRect = this.gameArea.getBoundingClientRect();
    const x = rect.left - gameAreaRect.left + rect.width / 2;
    const y = rect.top - gameAreaRect.top + rect.height / 2;
    
    // Create particle explosion
    const particleSystem = document.getElementById('particleSystem');
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.textContent = ['✨', '💫', '⭐', '💥'][Math.floor(Math.random() * 4)];
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      particleSystem.appendChild(particle);
      
      const angle = (i / 8) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;
      
      particle.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: `translate(${targetX - x}px, ${targetY - y}px) scale(1)`, opacity: 0 }
      ], {
        duration: 800,
        easing: 'ease-out'
      }).onfinish = () => particle.remove();
    }
    
    // Heart collection animation
    heartElement.classList.add('collected');
    heartElement.style.transform = 'scale(2)';
    heartElement.style.opacity = '0';
  }

  createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.textContent = '💕';
    effect.style.position = 'absolute';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.fontSize = '1.5rem';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '10';
    effect.style.transform = 'translate(-50%, -50%)';
    
    this.gameArea.appendChild(effect);
    
    effect.animate([
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 }
    ], {
      duration: 600,
      easing: 'ease-out'
    }).onfinish = () => effect.remove();
  }

  showCombo() {
    const comboDisplay = document.getElementById('comboDisplay');
    const comboText = comboDisplay.querySelector('.combo-text');
    const comboMultiplier = comboDisplay.querySelector('.combo-multiplier');
    
    const comboMessages = ['Nice!', 'Great!', 'Awesome!', 'Perfect!', 'Amazing!'];
    const messageIndex = Math.min(Math.floor(this.combo / 3) - 1, comboMessages.length - 1);
    
    comboText.textContent = comboMessages[messageIndex];
    comboMultiplier.textContent = `x${Math.floor(this.combo / 3)}`;
    
    comboDisplay.classList.add('active');
    
    setTimeout(() => {
      comboDisplay.classList.remove('active');
    }, 2000);
  }

  removeHeart(heartElement) {
    const index = this.fallingHearts.findIndex(h => h.element === heartElement);
    if (index > -1) {
      this.fallingHearts.splice(index, 1);
      heartElement.remove();
    }
  }

  updateUI() {
    const heartsCollectedEl = document.getElementById('heartsCollected');
    const gameTimeEl = document.getElementById('gameTime');
    const gameScoreEl = document.getElementById('gameScore');
    
    if (heartsCollectedEl) {
      heartsCollectedEl.textContent = this.heartsCollected;
    }
    
    if (gameTimeEl) {
      const minutes = Math.floor(this.gameTime / 60);
      const seconds = this.gameTime % 60;
      gameTimeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (gameScoreEl) {
      gameScoreEl.textContent = this.score;
    }
  }

  togglePause() {
    if (this.isPaused) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
  }

  pauseGame() {
    if (!this.isGameActive || this.isPaused) return;
    
    this.isPaused = true;
    
    // Pause all hearts
    this.fallingHearts.forEach(heart => {
      heart.element.style.animationPlayState = 'paused';
    });
    
    // Update pause button
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
      pauseBtn.querySelector('.control-icon').textContent = '▶️';
      pauseBtn.querySelector('.control-text').textContent = 'Resume';
    }
    
    // Show pause modal
    const pauseModal = document.getElementById('pauseModal');
    if (pauseModal) {
      pauseModal.classList.add('active');
    }
  }

  resumeGame() {
    if (!this.isGameActive || !this.isPaused) return;
    
    this.isPaused = false;
    
    // Resume all hearts
    this.fallingHearts.forEach(heart => {
      heart.element.style.animationPlayState = 'running';
    });
    
    // Update pause button
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
      pauseBtn.querySelector('.control-icon').textContent = '⏸️';
      pauseBtn.querySelector('.control-text').textContent = 'Pause';
    }
    
    // Hide pause modal
    const pauseModal = document.getElementById('pauseModal');
    if (pauseModal) {
      pauseModal.classList.remove('active');
    }
  }

  restartGame() {
    this.endGame();
    setTimeout(() => {
      this.startGame();
    }, 100);
  }

  winGame() {
    this.endGame();
    
    const gameOverModal = document.getElementById('gameOverModal');
    const finalHearts = document.getElementById('finalHearts');
    const finalTime = document.getElementById('finalTime');
    const finalScore = document.getElementById('finalScore');
    
    if (gameOverModal) {
      gameOverModal.classList.add('active');
    }
    
    if (finalHearts) {
      finalHearts.textContent = `${this.heartsCollected}/${this.targetHearts}`;
    }
    
    if (finalTime) {
      const minutes = Math.floor(this.gameTime / 60);
      const seconds = this.gameTime % 60;
      finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (finalScore) {
      finalScore.textContent = this.score;
    }
    
    // Create victory celebration
    this.createVictoryCelebration();
    
    // Save high score
    this.saveHighScore();
  }

  createVictoryCelebration() {
    const modal = document.querySelector('.game-over-modal .modal-content');
    if (!modal) return;
    
    const rect = modal.getBoundingClientRect();
    
    // Create fireworks
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const firework = document.createElement('div');
        firework.textContent = ['🎉', '🎊', '✨', '💫', '🎆'][Math.floor(Math.random() * 5)];
        firework.style.position = 'fixed';
        firework.style.fontSize = '2rem';
        firework.style.pointerEvents = 'none';
        firework.style.zIndex = '2001';
        firework.style.left = (rect.left + Math.random() * rect.width) + 'px';
        firework.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(firework);
        
        firework.animate([
          { 
            transform: 'scale(0) rotate(0deg)', 
            opacity: 1 
          },
          { 
            transform: 'scale(2) rotate(360deg)', 
            opacity: 0 
          }
        ], {
          duration: 3000,
          easing: 'ease-out'
        }).onfinish = () => firework.remove();
      }, i * 100);
    }
  }

  saveHighScore() {
    const currentHighScore = App.loadFromLocalStorage('heartGameHighScore', 0);
    if (this.score > currentHighScore) {
      App.saveToLocalStorage('heartGameHighScore', this.score);
      App.showToast('New high score! 🏆');
    }
  }

  endGame() {
    this.isGameActive = false;
    this.isPaused = false;
    
    // Clear timers
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
    
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
    
    // Clear falling hearts
    this.fallingHearts.forEach(heart => {
      heart.element.remove();
    });
    this.fallingHearts = [];
    
    // Reset combo
    this.combo = 0;
  }

  handleResize() {
    // Adjust game area for mobile
    const gameArea = this.gameArea;
    if (window.innerWidth <= 768) {
      gameArea.style.height = '400px';
    } else {
      gameArea.style.height = '500px';
    }
  }
}

// Global functions for HTML onclick handlers
function startGame() {
  if (window.gameInstance) {
    window.gameInstance.startGame();
  }
}

function togglePause() {
  if (window.gameInstance) {
    window.gameInstance.togglePause();
  }
}

function resumeGame() {
  if (window.gameInstance) {
    window.gameInstance.resumeGame();
  }
}

function restartGame() {
  if (window.gameInstance) {
    window.gameInstance.restartGame();
  }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('game')) {
    window.gameInstance = new HeartGame();
  }
});