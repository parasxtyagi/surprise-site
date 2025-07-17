// Index page specific functionality
class IndexPage {
  constructor() {
    this.init();
  }

  init() {
    this.setupHeroAnimations();
    this.setupFeatureCards();
    this.setupInteractiveElements();
  }

  setupHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroIllustration = document.querySelector('.hero-illustration');

    if (heroTitle) {
      // Animate title lines
      const titleLines = heroTitle.querySelectorAll('.title-line');
      titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
          line.style.transition = 'all 0.8s ease';
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
      });
    }

    if (heroSubtitle) {
      heroSubtitle.style.opacity = '0';
      heroSubtitle.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        heroSubtitle.style.transition = 'all 0.8s ease';
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.transform = 'translateY(0)';
      }, 900);
    }

    if (heroButtons) {
      heroButtons.style.opacity = '0';
      heroButtons.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        heroButtons.style.transition = 'all 0.8s ease';
        heroButtons.style.opacity = '1';
        heroButtons.style.transform = 'translateY(0)';
      }, 1100);
    }

    if (heroIllustration) {
      heroIllustration.style.opacity = '0';
      heroIllustration.style.transform = 'scale(0.8)';
      
      setTimeout(() => {
        heroIllustration.style.transition = 'all 1s ease';
        heroIllustration.style.opacity = '1';
        heroIllustration.style.transform = 'scale(1)';
      }, 1300);
    }
  }

  setupFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
      // Initial state
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
      
      // Animate on scroll
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              card.style.transition = 'all 0.8s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 200);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(card);

      // Add hover effects
      card.addEventListener('mouseenter', () => {
        this.createHoverEffect(card);
      });
    });
  }

  createHoverEffect(card) {
    const icon = card.querySelector('.feature-icon');
    if (icon) {
      // Create floating hearts around the icon
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const heart = document.createElement('span');
          heart.textContent = '💕';
          heart.style.position = 'absolute';
          heart.style.fontSize = '1rem';
          heart.style.pointerEvents = 'none';
          heart.style.opacity = '0';
          heart.style.zIndex = '100';
          
          const rect = icon.getBoundingClientRect();
          heart.style.left = (rect.left + Math.random() * rect.width) + 'px';
          heart.style.top = (rect.top + Math.random() * rect.height) + 'px';
          
          document.body.appendChild(heart);
          
          // Animate heart
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 1000;
            
            if (progress < 1) {
              heart.style.opacity = Math.max(0, 1 - progress);
              heart.style.transform = `translateY(${-progress * 50}px) scale(${1 + progress * 0.5})`;
              requestAnimationFrame(animate);
            } else {
              heart.remove();
            }
          };
          
          requestAnimationFrame(animate);
        }, i * 100);
      }
    }
  }

  setupInteractiveElements() {
    // Make the couple silhouette interactive
    const coupleSilhouette = document.querySelector('.couple-silhouette');
    if (coupleSilhouette) {
      coupleSilhouette.addEventListener('click', () => {
        this.triggerLoveAnimation();
      });
    }

    // Add breathing animation to hearts
    const floatingHearts = document.querySelectorAll('.floating-hearts .heart');
    floatingHearts.forEach((heart, index) => {
      heart.addEventListener('click', () => {
        this.heartClickEffect(heart);
      });
    });
  }

  triggerLoveAnimation() {
    const connectingHeart = document.querySelector('.connecting-heart');
    if (connectingHeart) {
      // Create explosion of hearts
      const rect = connectingHeart.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          const heart = document.createElement('div');
          heart.textContent = ['💖', '💕', '💗', '💝', '💘'][Math.floor(Math.random() * 5)];
          heart.style.position = 'fixed';
          heart.style.fontSize = '1.5rem';
          heart.style.pointerEvents = 'none';
          heart.style.zIndex = '1000';
          heart.style.left = centerX + 'px';
          heart.style.top = centerY + 'px';
          
          document.body.appendChild(heart);
          
          // Animate heart explosion
          const angle = (i / 12) * Math.PI * 2;
          const distance = 100 + Math.random() * 50;
          const targetX = centerX + Math.cos(angle) * distance;
          const targetY = centerY + Math.sin(angle) * distance;
          
          heart.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(1)`, opacity: 0 }
          ], {
            duration: 2000,
            easing: 'ease-out'
          }).onfinish = () => heart.remove();
        }, i * 50);
      }
    }

    App.showToast('Love is in the air! 💕');
  }

  heartClickEffect(heart) {
    const originalSize = heart.style.fontSize || '2rem';
    
    heart.style.transition = 'all 0.3s ease';
    heart.style.transform = 'scale(1.5)';
    heart.style.filter = 'brightness(1.5)';
    
    setTimeout(() => {
      heart.style.transform = 'scale(1)';
      heart.style.filter = 'brightness(1)';
    }, 300);

    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(233, 30, 99, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.marginLeft = '-50px';
    ripple.style.marginTop = '-50px';
    
    heart.style.position = 'relative';
    heart.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('index') || window.location.pathname === '/') {
    new IndexPage();
  }
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);