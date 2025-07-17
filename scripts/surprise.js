// Surprise page functionality
class SurprisePage {
  constructor() {
    this.swiper = null;
    this.confettiSystem = null;
    this.init();
  }

  init() {
    this.setupSwiper();
    this.setupConfetti();
    this.setupAnimations();
    this.setupInteractions();
  }

  setupSwiper() {
    // Initialize Swiper
    this.swiper = new Swiper('.mySwiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      loop: true,
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });

    // Add slide change effects
    this.swiper.on('slideChange', () => {
      this.createSlideChangeEffect();
    });
  }

  setupConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    if (confettiContainer) {
      this.confettiSystem = new ConfettiSystem(confettiContainer);
      
      // Start confetti after page loads
      setTimeout(() => {
        this.confettiSystem.start();
      }, 1500);
    }
  }

  setupAnimations() {
    // Animate birthday cake
    const cake = document.querySelector('.cake');
    if (cake) {
      cake.addEventListener('click', () => {
        this.blowCandles();
      });
    }

    // Animate floating balloons
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach((balloon, index) => {
      balloon.addEventListener('click', () => {
        this.popBalloon(balloon);
      });
    });

    // Animate love letter
    const loveLetter = document.querySelector('.love-letter');
    if (loveLetter) {
      this.setupLetterAnimation(loveLetter);
    }

    // Animate final message
    const finalCard = document.querySelector('.final-card');
    if (finalCard) {
      this.setupFinalAnimation(finalCard);
    }
  }

  setupInteractions() {
    // Memory card hover effects
    const memoryCards = document.querySelectorAll('.memory-card');
    memoryCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.createHoverEffect(card);
      });
    });

    // Wish card interactions
    const wishCards = document.querySelectorAll('.wish-card');
    wishCards.forEach(card => {
      card.addEventListener('click', () => {
        this.activateWish(card);
      });
    });

    // Heart burst click
    const heartBurst = document.querySelector('.heart-burst');
    if (heartBurst) {
      heartBurst.addEventListener('click', () => {
        this.createHeartExplosion();
      });
    }
  }

  createSlideChangeEffect() {
    const activeSlide = document.querySelector('.swiper-slide-active');
    if (activeSlide) {
      const memoryCard = activeSlide.querySelector('.memory-card');
      if (memoryCard) {
        // Create sparkle effect
        this.createSparkleEffect(memoryCard);
      }
    }
  }

  createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.fontSize = '1.5rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '100';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(sparkle);
        
        sparkle.animate([
          { transform: 'scale(0) rotate(0deg)', opacity: 1 },
          { transform: 'scale(1.5) rotate(360deg)', opacity: 0 }
        ], {
          duration: 2000,
          easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
      }, i * 200);
    }
  }

  blowCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach((candle, index) => {
      setTimeout(() => {
        candle.style.transition = 'all 0.5s ease';
        candle.style.transform = 'scale(0)';
        candle.style.opacity = '0';
        
        // Create smoke effect
        const smoke = document.createElement('div');
        smoke.textContent = '💨';
        smoke.style.position = 'absolute';
        smoke.style.fontSize = '2rem';
        smoke.style.left = '50%';
        smoke.style.top = '50%';
        smoke.style.transform = 'translate(-50%, -50%)';
        smoke.style.pointerEvents = 'none';
        
        candle.style.position = 'relative';
        candle.appendChild(smoke);
        
        smoke.animate([
          { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
          { transform: 'translate(-50%, -200%) scale(1)', opacity: 0 }
        ], {
          duration: 1500,
          easing: 'ease-out'
        }).onfinish = () => smoke.remove();
      }, index * 200);
    });
    
    // Show celebration message
    setTimeout(() => {
      App.showToast('Make a wish! 🌟');
      this.showVirtualGift();
    }, 1000);
  }

  popBalloon(balloon) {
    balloon.style.transition = 'all 0.3s ease';
    balloon.style.transform = 'scale(0)';
    balloon.style.opacity = '0';
    
    // Create pop effect
    const pop = document.createElement('div');
    pop.textContent = '💥';
    pop.style.position = 'absolute';
    pop.style.fontSize = '3rem';
    pop.style.left = balloon.style.left;
    pop.style.top = balloon.style.top;
    pop.style.pointerEvents = 'none';
    pop.style.zIndex = '10';
    
    balloon.parentElement.appendChild(pop);
    
    pop.animate([
      { transform: 'scale(0)', opacity: 1 },
      { transform: 'scale(2)', opacity: 0 }
    ], {
      duration: 800,
      easing: 'ease-out'
    }).onfinish = () => pop.remove();
    
    // Regenerate balloon after some time
    setTimeout(() => {
      balloon.style.transform = 'scale(1)';
      balloon.style.opacity = '1';
    }, 3000);
  }

  setupLetterAnimation(letter) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateLetter(letter);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(letter);
  }

  animateLetter(letter) {
    const letterText = letter.querySelector('.letter-text');
    const paragraphs = letterText.querySelectorAll('p');
    
    paragraphs.forEach((p, index) => {
      p.style.opacity = '0';
      p.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        p.style.transition = 'all 0.8s ease';
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, index * 300);
    });
  }

  setupFinalAnimation(finalCard) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateFinalCard(finalCard);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(finalCard);
  }

  animateFinalCard(card) {
    const title = card.querySelector('.final-title');
    const text = card.querySelector('.final-text');
    const buttons = card.querySelector('.final-buttons');
    
    [title, text, buttons].forEach((element, index) => {
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
          element.style.transition = 'all 1s ease';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * 500);
      }
    });
  }

  createHoverEffect(card) {
    const rect = card.getBoundingClientRect();
    
    // Create floating hearts
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = ['💕', '💖', '💗'][i];
        heart.style.position = 'fixed';
        heart.style.fontSize = '1.5rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '100';
        heart.style.left = (rect.left + Math.random() * rect.width) + 'px';
        heart.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(heart);
        
        heart.animate([
          { transform: 'scale(0) translateY(0px)', opacity: 1 },
          { transform: 'scale(1) translateY(-50px)', opacity: 0 }
        ], {
          duration: 2000,
          easing: 'ease-out'
        }).onfinish = () => heart.remove();
      }, i * 150);
    }
  }

  activateWish(card) {
    const icon = card.querySelector('.wish-icon');
    const title = card.querySelector('h3');
    
    // Create wish fulfillment animation
    icon.style.transition = 'all 0.5s ease';
    icon.style.transform = 'scale(1.5)';
    icon.style.filter = 'brightness(1.5)';
    
    setTimeout(() => {
      icon.style.transform = 'scale(1)';
      icon.style.filter = 'brightness(1)';
    }, 500);
    
    // Create magical sparkles
    const rect = card.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.fontSize = '1rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '100';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(sparkle);
        
        sparkle.animate([
          { transform: 'scale(0) rotate(0deg)', opacity: 1 },
          { transform: 'scale(1.5) rotate(360deg)', opacity: 0 }
        ], {
          duration: 1500,
          easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
      }, i * 100);
    }
    
    App.showToast(`Wish granted: ${title.textContent}! 🌟`);
  }

  createHeartExplosion() {
    const heartBurst = document.querySelector('.heart-burst');
    const rect = heartBurst.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create massive heart explosion
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = ['💖', '💕', '💗', '💝', '💘'][Math.floor(Math.random() * 5)];
        heart.style.position = 'fixed';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '100';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        
        document.body.appendChild(heart);
        
        const angle = (i / 20) * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;
        
        heart.animate([
          { 
            transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', 
            opacity: 1 
          },
          { 
            transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(1.5) rotate(360deg)`, 
            opacity: 0 
          }
        ], {
          duration: 3000,
          easing: 'ease-out'
        }).onfinish = () => heart.remove();
      }, i * 50);
    }
  }

  showVirtualGift() {
    const modal = document.getElementById('virtualGiftModal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeVirtualGift() {
    const modal = document.getElementById('virtualGiftModal');
    if (modal) {
      modal.classList.remove('active');
    }
  }
}

// Global functions for HTML onclick handlers
function celebrateAgain() {
  window.location.reload();
}

function closeVirtualGift() {
  if (window.surprisePage) {
    window.surprisePage.closeVirtualGift();
  }
}

function shareSuprise() {
  if (navigator.share) {
    navigator.share({
      title: 'Happy Birthday! 🎉',
      text: 'Someone special created a beautiful birthday surprise for you!',
      url: window.location.href
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      App.showToast('Link copied to clipboard! 📋');
    });
  }
}

// Initialize surprise page
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('surprise')) {
    window.surprisePage = new SurprisePage();
  }
});