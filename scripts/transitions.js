// Page Transition System
class PageTransitionManager {
  constructor() {
    this.isTransitioning = false;
    this.loadingProgress = 0;
    this.init();
  }

  init() {
    this.createTransitionOverlay();
    this.createLoadingProgress();
    this.setupPageTransitions();
    this.setupSmoothScrolling();
    this.setupLazyLoading();
    this.setupAnimationObserver();
    this.initPageLoad();
  }

  createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = `
      <div class="transition-content">
        <div class="transition-spinner"></div>
        <p class="transition-text">Loading...</p>
      </div>
    `;
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  createLoadingProgress() {
    const progress = document.createElement('div');
    progress.className = 'loading-progress';
    progress.innerHTML = '<div class="loading-progress-bar"></div>';
    document.body.appendChild(progress);
    this.progressBar = progress;
    this.progressFill = progress.querySelector('.loading-progress-bar');
  }

  setupPageTransitions() {
    // Intercept all internal links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && this.isInternalLink(link) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        this.navigateToPage(link.href);
      }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.navigateToPage(window.location.href, false);
      }
    });
  }

  isInternalLink(link) {
    return link.hostname === window.location.hostname && 
           !link.hasAttribute('download') &&
           !link.hasAttribute('target') &&
           link.href.indexOf('#') === -1;
  }

  async navigateToPage(url, pushState = true) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    // Show transition overlay
    this.showTransition();
    
    try {
      // Fetch new page content
      const response = await fetch(url);
      const html = await response.text();
      
      // Parse the new page
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, 'text/html');
      
      // Update page content
      await this.updatePageContent(newDoc);
      
      // Update browser history
      if (pushState) {
        history.pushState({ page: url }, '', url);
      }
      
      // Update page title
      document.title = newDoc.title;
      
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = url; // Fallback to normal navigation
    }
    
    this.hideTransition();
    this.isTransitioning = false;
  }

  showTransition() {
    this.overlay.classList.add('active');
    this.showLoadingProgress();
  }

  hideTransition() {
    setTimeout(() => {
      this.overlay.classList.remove('active');
      this.hideLoadingProgress();
    }, 300);
  }

  showLoadingProgress() {
    this.progressBar.classList.add('active');
    this.animateProgress();
  }

  hideLoadingProgress() {
    this.progressBar.classList.remove('active');
    this.progressFill.style.width = '0%';
  }

  animateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) progress = 90;
      
      this.progressFill.style.width = progress + '%';
      
      if (progress >= 90) {
        clearInterval(interval);
        // Complete progress when transition is done
        setTimeout(() => {
          this.progressFill.style.width = '100%';
        }, 200);
      }
    }, 100);
  }

  async updatePageContent(newDoc) {
    // Fade out current content
    const currentContent = document.querySelector('.main-content');
    if (currentContent) {
      currentContent.classList.remove('loaded');
    }

    await this.delay(300);

    // Update main content
    const newContent = newDoc.querySelector('.main-content');
    if (newContent && currentContent) {
      currentContent.innerHTML = newContent.innerHTML;
    }

    // Update any page-specific scripts
    this.updatePageScripts(newDoc);

    // Reinitialize page-specific functionality
    this.reinitializePage();

    // Fade in new content
    await this.delay(100);
    if (currentContent) {
      currentContent.classList.add('loaded');
    }
  }

  updatePageScripts(newDoc) {
    // Remove old page-specific scripts
    document.querySelectorAll('script[data-page-script]').forEach(script => {
      script.remove();
    });

    // Add new page-specific scripts
    const newScripts = newDoc.querySelectorAll('script[src]');
    newScripts.forEach(script => {
      if (script.src.includes('index.js') || 
          script.src.includes('story.js') || 
          script.src.includes('game.js') || 
          script.src.includes('surprise.js')) {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.setAttribute('data-page-script', 'true');
        document.head.appendChild(newScript);
      }
    });
  }

  reinitializePage() {
    // Reinitialize lazy loading
    this.setupLazyLoading();
    
    // Reinitialize animation observer
    this.setupAnimationObserver();
    
    // Trigger page-specific initialization
    const event = new CustomEvent('pageTransitioned');
    document.dispatchEvent(event);
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          this.smoothScrollTo(target);
        }
      }
    });
  }

  smoothScrollTo(element) {
    const targetPosition = element.offsetTop - 80; // Account for fixed header
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('lazy-image');
          
          img.onload = () => {
            img.classList.add('loaded');
          };
          
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  setupAnimationObserver() {
    const animatedElements = document.querySelectorAll('.animate-in');
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  }

  initPageLoad() {
    // Add initial page load animation
    const content = document.querySelector('.main-content');
    if (content) {
      content.classList.add('page-content');
      
      window.addEventListener('load', () => {
        setTimeout(() => {
          content.classList.add('loaded');
        }, 100);
      });
    }

    // Add ripple effect to buttons
    this.addRippleEffect();
  }

  addRippleEffect() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.btn, .control-btn, .option-btn');
      if (button && !button.classList.contains('ripple')) {
        button.classList.add('ripple');
      }
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Performance optimization utilities
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeAnimations();
    this.setupIntersectionObserver();
    this.preloadCriticalResources();
  }

  optimizeAnimations() {
    // Use requestAnimationFrame for smooth animations
    const animatedElements = document.querySelectorAll('.floating-heart, .visualizer-bar');
    
    animatedElements.forEach(element => {
      element.addEventListener('animationstart', () => {
        element.classList.add('animating');
      });
      
      element.addEventListener('animationend', () => {
        element.classList.remove('animating');
      });
    });
  }

  setupIntersectionObserver() {
    // Pause animations when elements are out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        if (entry.isIntersecting) {
          element.style.animationPlayState = 'running';
        } else {
          element.style.animationPlayState = 'paused';
        }
      });
    });

    document.querySelectorAll('.floating-heart, .visualizer-bar').forEach(el => {
      observer.observe(el);
    });
  }

  preloadCriticalResources() {
    // Preload critical images and audio
    const criticalResources = [
      'https://images.pexels.com/photos/1024994/pexels-photo-1024994.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
    ];

    criticalResources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = url.includes('.mp3') ? 'audio' : 'image';
      document.head.appendChild(link);
    });
  }
}

// Initialize systems
document.addEventListener('DOMContentLoaded', () => {
  window.transitionManager = new PageTransitionManager();
  window.performanceOptimizer = new PerformanceOptimizer();
});

// Export for use in other modules
window.PageTransitionManager = PageTransitionManager;
window.PerformanceOptimizer = PerformanceOptimizer;