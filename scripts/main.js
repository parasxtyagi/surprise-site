// Main JavaScript utility functions
class App {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.audioContext = null;
    this.soundEffects = new Map();
    this.init();
  }

  init() {
    this.setupPageLoader();
    this.setupAudioSystem();
    this.setupAccessibility();
    this.setupResponsive();
    this.setupAnimations();
    this.setupPerformanceOptimizations();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '');
  }

  setupPageLoader() {
    const loader = document.getElementById('pageLoader');
    const mainContent = document.querySelector('.main-content');
    
    // Force show content immediately for debugging
    if (mainContent) {
      mainContent.style.opacity = '1';
      mainContent.style.display = 'block';
      mainContent.style.visibility = 'visible';
      mainContent.classList.add('loaded');
    }
    
    // Force show hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons, .floating-hearts .heart');
    heroElements.forEach(element => {
      if (element) {
        element.style.opacity = '1';
        element.style.display = element.classList.contains('hero-buttons') ? 'flex' : 'block';
        element.style.visibility = 'visible';
      }
    });
    
    // Force show buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      if (button) {
        button.style.opacity = '1';
        button.style.display = 'inline-flex';
        button.style.visibility = 'visible';
      }
    });
    
    if (loader) {
      // Hide loader after page is loaded
      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.classList.add('hidden');
          
          // Show main content
          if (mainContent) {
            mainContent.classList.add('loaded');
            mainContent.style.opacity = '1';
            mainContent.style.display = 'block';
            mainContent.style.visibility = 'visible';
          }
          
          setTimeout(() => {
            loader.style.display = 'none';
          }, 500);
        }, 800);
      });
    } else if (mainContent) {
      // If no loader, show content immediately
      setTimeout(() => {
        mainContent.classList.add('loaded');
        mainContent.style.opacity = '1';
        mainContent.style.display = 'block';
        mainContent.style.visibility = 'visible';
      }, 100);
    }
  }

  setupAudioSystem() {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.volume = 0.3;
      
      // Handle autoplay issues
      const playAudio = () => {
        audio.play().catch(e => {
          console.log('Audio autoplay prevented:', e);
        });
      };

      // Try to play after user interaction
      document.addEventListener('click', playAudio, { once: true });
      document.addEventListener('touchstart', playAudio, { once: true });
    });
    
    // Initialize Web Audio API for sound effects
    this.initializeAudioContext();
  }
  
  initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.loadSoundEffects();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }
  
  loadSoundEffects() {
    const sounds = {
      click: this.generateTone(800, 0.1, 'sine'),
      success: this.generateTone(1000, 0.2, 'sine'),
      error: this.generateTone(400, 0.3, 'sawtooth')
    };
    
    Object.entries(sounds).forEach(([name, buffer]) => {
      this.soundEffects.set(name, buffer);
    });
  }
  
  generateTone(frequency, duration, type = 'sine') {
    if (!this.audioContext) return null;
    
    const sampleRate = this.audioContext.sampleRate;
    const numSamples = duration * sampleRate;
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
      }
      
      // Apply envelope
      const envelope = Math.exp(-t * 3);
      data[i] = sample * envelope * 0.1;
    }
    
    return buffer;
  }
  
  playSound(soundName) {
    if (!this.audioContext || !this.soundEffects.has(soundName)) return;
    
    const buffer = this.soundEffects.get(soundName);
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  setupAccessibility() {
    // Add focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
      
      // Close mobile menu with Escape key
      if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Add skip link functionality if it doesn't exist
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      skipLink.className = 'skip-link';
      document.body.prepend(skipLink);
    }
  }

  setupResponsive() {
    // Handle responsive navigation
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
      
      // Close menu when clicking on a link
      const navLinks = navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
      const navMenu = document.getElementById('navMenu');
      const navToggle = document.getElementById('navToggle');
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    
    // Recalculate any size-dependent features
    const gameArea = document.getElementById('gameArea');
    if (gameArea && window.gameInstance) {
      window.gameInstance.handleResize();
    }
  }

  setupAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('[data-aos]').forEach(el => {
      observer.observe(el);
    });
  }

  setupPerformanceOptimizations() {
    // Optimize animations for 60fps
    this.setupRAFThrottling();
    
    // Preload critical resources
    this.preloadResources();
    
    // Setup intersection observer for performance
    this.setupPerformanceObserver();
  }
  
  setupRAFThrottling() {
    let ticking = false;
    
    const updateAnimations = () => {
      // Update any continuous animations here
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
      }
    };
    
    // Use for scroll-based animations
    window.addEventListener('scroll', requestTick);
  }
  
  preloadResources() {
    const criticalImages = [
      'https://images.pexels.com/photos/1024994/pexels-photo-1024994.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
  
  setupPerformanceObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('gpu-accelerated');
          } else {
            entry.target.classList.remove('gpu-accelerated');
          }
        });
      });
      
      document.querySelectorAll('.animate-in, .floating-heart').forEach(el => {
        observer.observe(el);
      });
    }
  }

  // Utility methods
  static createParticle(x, y, emoji = '✨') {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emoji;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }

  static showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    `;
    
    document.body.appendChild(toast);
    
    // Play sound effect
    if (window.app) {
      window.app.playSound(type === 'error' ? 'error' : 'success');
    }
    
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  static lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  static randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static saveToLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  static loadFromLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
      return defaultValue;
    }
  }
}

// Page navigation functions
function startJourney() {
  App.showToast('Starting our beautiful journey! 💕');
  setTimeout(() => {
    window.location.href = 'story.html';
  }, 500);
}

function skipToSurprise() {
  App.showToast('Skipping to the surprise! 🎁');
  setTimeout(() => {
    window.location.href = 'surprise.html';
  }, 500);
}

function goToGame() {
  App.showToast('Time to play! 🎮');
  setTimeout(() => {
    window.location.href = 'game.html';
  }, 500);
}

function goToSurprise() {
  App.showToast('Your surprise awaits! 🎁');
  setTimeout(() => {
    window.location.href = 'surprise.html';
  }, 500);
}

function goHome() {
  App.showToast('Going back to the beginning 🏠');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

// Audio control functions
function toggleMusic() {
  const audio = document.querySelector('audio');
  const btn = document.getElementById('musicBtn') || document.getElementById('muteBtn');
  
  if (audio) {
    if (audio.paused) {
      audio.play();
      if (btn) {
        btn.querySelector('.control-icon').textContent = '🔊';
        btn.querySelector('.control-text').textContent = 'Mute';
      }
    } else {
      audio.pause();
      if (btn) {
        btn.querySelector('.control-icon').textContent = '🔇';
        btn.querySelector('.control-text').textContent = 'Music';
      }
    }
  }
}

function toggleMute() {
  toggleMusic();
}

// Confetti system
class ConfettiSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.isActive = false;
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.createConfetti();
    this.animate();
  }

  stop() {
    this.isActive = false;
  }

  createConfetti() {
    const colors = ['#e91e63', '#ff6b9d', '#ff8fab', '#4caf50', '#ff9800'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      
      this.container.appendChild(confetti);
      this.particles.push(confetti);
    }
  }

  animate() {
    if (!this.isActive) return;
    
    // Clean up old particles
    this.particles = this.particles.filter(particle => {
      if (particle.offsetTop > window.innerHeight) {
        particle.remove();
        return false;
      }
      return true;
    });

    // Add new particles occasionally
    if (Math.random() < 0.1) {
      this.createConfetti();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  
  // Start confetti on surprise page
  if (window.location.pathname.includes('surprise')) {
    const confettiContainer = document.getElementById('confettiContainer');
    if (confettiContainer) {
      window.confettiSystem = new ConfettiSystem(confettiContainer);
      setTimeout(() => {
        window.confettiSystem.start();
      }, 1000);
    }
  }
});

// Export for other modules
window.App = App;