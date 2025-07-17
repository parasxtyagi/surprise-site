// Story page functionality
class StoryPage {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.questions = [
      {
        number: "01",
        icon: "💭",
        title: "How did we meet first time?",
        image: "🎮",
        imageTitle: "Gaming Together",
        imageSubtitle: "Where our story began",
        options: [
          { text: "In Free Fire lobby", icon: "🎮", correct: true, type: "game" },
          { text: "At a coding bootcamp", icon: "🤓", correct: false, type: "coding" },
          { text: "In a math class", icon: "📐", correct: false, type: "math" }
        ],
        correctFeedback: "That's right! We met in the Free Fire lobby and it was love at first sight... well, first game! 💕",
        wrongFeedback: "Not quite! We actually met while playing Free Fire together. That's where our adventure began! 🎮"
      },
      {
        number: "02",
        icon: "💕",
        title: "What was our first conversation about?",
        image: "💬",
        imageTitle: "First Chat",
        imageSubtitle: "Those memorable words",
        options: [
          { text: "Game strategies", icon: "🎯", correct: true, type: "strategy" },
          { text: "Favorite movies", icon: "🎬", correct: false, type: "movies" },
          { text: "School subjects", icon: "📚", correct: false, type: "school" }
        ],
        correctFeedback: "Exactly! We talked about game strategies and you impressed me with your skills! 🎯",
        wrongFeedback: "Close, but we actually bonded over game strategies first! You were so good at explaining tactics! 🎮"
      },
      {
        number: "03",
        icon: "🌟",
        title: "What made me fall for you?",
        image: "💖",
        imageTitle: "Falling in Love",
        imageSubtitle: "That special moment",
        options: [
          { text: "Your kindness", icon: "💝", correct: true, type: "kindness" },
          { text: "Your gaming skills", icon: "🏆", correct: false, type: "skills" },
          { text: "Your sense of humor", icon: "😂", correct: false, type: "humor" }
        ],
        correctFeedback: "Yes! Your incredible kindness and caring nature stole my heart completely! 💝",
        wrongFeedback: "While those are amazing too, it was your beautiful kindness that made me fall for you! 💖"
      },
      {
        number: "04",
        icon: "🎉",
        title: "What's our favorite activity together?",
        image: "🎮",
        imageTitle: "Together Time",
        imageSubtitle: "Our special moments",
        options: [
          { text: "Gaming together", icon: "🎮", correct: true, type: "gaming" },
          { text: "Watching movies", icon: "🍿", correct: false, type: "movies" },
          { text: "Going for walks", icon: "🚶", correct: false, type: "walks" }
        ],
        correctFeedback: "Absolutely! Gaming together is our thing, and I love every moment of it! 🎮",
        wrongFeedback: "We do enjoy those too, but gaming together is definitely our favorite bonding activity! 🎮"
      },
      {
        number: "05",
        icon: "💫",
        title: "What do I love most about you?",
        image: "🌹",
        imageTitle: "What I Love",
        imageSubtitle: "You're perfect",
        options: [
          { text: "Everything about you", icon: "💕", correct: true, type: "everything" },
          { text: "Your intelligence", icon: "🧠", correct: false, type: "intelligence" },
          { text: "Your smile", icon: "😊", correct: false, type: "smile" }
        ],
        correctFeedback: "Perfect answer! I love absolutely everything about you - you're my world! 💕",
        wrongFeedback: "Those are wonderful too, but honestly, I love EVERYTHING about you! 💖"
      }
    ];
    
    this.init();
  }

  init() {
    this.updateProgressBar();
    this.setupEventListeners();
    this.showQuestion();
  }

  setupEventListeners() {
    // Close feedback on click outside
    document.addEventListener('click', (e) => {
      const feedbackOverlay = document.getElementById('feedbackOverlay');
      if (e.target === feedbackOverlay) {
        this.closeModal();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  showQuestion() {
    const question = this.questions[this.currentQuestion];
    
    // Update question elements
    document.getElementById('questionNumber').textContent = question.number;
    document.getElementById('questionIcon').textContent = question.icon;
    document.getElementById('questionTitle').textContent = question.title;
    
    // Update memory illustration
    const memoryIcon = document.querySelector('.memory-icon');
    const memoryTitle = document.querySelector('.memory-details h3');
    const memorySubtitle = document.querySelector('.memory-details p');
    
    if (memoryIcon) memoryIcon.textContent = question.image;
    if (memoryTitle) memoryTitle.textContent = question.imageTitle;
    if (memorySubtitle) memorySubtitle.textContent = question.imageSubtitle;
    
    // Update options
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option-btn';
      button.onclick = () => this.selectAnswer(option.correct, option.type);
      
      button.innerHTML = `
        <span class="option-icon">${option.icon}</span>
        <span class="option-text">${option.text}</span>
        <span class="option-check">✓</span>
      `;
      
      optionsContainer.appendChild(button);
      
      // Add entrance animation
      setTimeout(() => {
        button.style.transform = 'translateX(0)';
        button.style.opacity = '1';
      }, index * 100);
    });
    
    // Animate card entrance
    const storyCard = document.getElementById('storyCard');
    storyCard.style.transform = 'translateY(20px)';
    storyCard.style.opacity = '0.8';
    
    setTimeout(() => {
      storyCard.style.transition = 'all 0.5s ease';
      storyCard.style.transform = 'translateY(0)';
      storyCard.style.opacity = '1';
    }, 100);
  }

  selectAnswer(isCorrect, type) {
    const question = this.questions[this.currentQuestion];
    
    // Disable all buttons
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
    });
    
    // Find the clicked button and mark it
    const clickedButton = event.target.closest('.option-btn');
    if (clickedButton) {
      clickedButton.classList.add('selected');
      
      setTimeout(() => {
        // Show correct/wrong state
        buttons.forEach(btn => {
          const isCorrectOption = btn.onclick.toString().includes('true');
          if (isCorrectOption) {
            btn.classList.add('correct');
          } else if (btn === clickedButton && !isCorrect) {
            btn.classList.add('wrong');
          }
        });
        
        // Show feedback after animation
        setTimeout(() => {
          this.showFeedback(isCorrect, question);
        }, 500);
      }, 300);
    }
  }

  showFeedback(isCorrect, question) {
    const feedbackOverlay = document.getElementById('feedbackOverlay');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackText = document.getElementById('feedbackText');
    
    if (isCorrect) {
      this.score++;
      feedbackIcon.textContent = '🎉';
      feedbackTitle.textContent = 'Correct!';
      feedbackText.textContent = question.correctFeedback;
      
      // Create celebration effect
      this.createCelebrationEffect();
    } else {
      feedbackIcon.textContent = '💔';
      feedbackTitle.textContent = 'Not quite!';
      feedbackText.textContent = question.wrongFeedback;
    }
    
    feedbackOverlay.classList.add('active');
    
    // Play sound effect
    this.playFeedbackSound(isCorrect);
  }

  createCelebrationEffect() {
    const feedbackCard = document.querySelector('.feedback-card');
    if (feedbackCard) {
      const rect = feedbackCard.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Create heart explosion
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const heart = document.createElement('div');
          heart.textContent = ['💖', '💕', '💗', '💝'][Math.floor(Math.random() * 4)];
          heart.style.position = 'fixed';
          heart.style.fontSize = '2rem';
          heart.style.pointerEvents = 'none';
          heart.style.zIndex = '1001';
          heart.style.left = centerX + 'px';
          heart.style.top = centerY + 'px';
          
          document.body.appendChild(heart);
          
          const angle = (i / 8) * Math.PI * 2;
          const distance = 100;
          const targetX = centerX + Math.cos(angle) * distance;
          const targetY = centerY + Math.sin(angle) * distance;
          
          heart.animate([
            { 
              transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', 
              opacity: 1 
            },
            { 
              transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(1) rotate(360deg)`, 
              opacity: 0 
            }
          ], {
            duration: 1500,
            easing: 'ease-out'
          }).onfinish = () => heart.remove();
        }, i * 100);
      }
    }
  }

  playFeedbackSound(isCorrect) {
    // Create audio feedback
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (isCorrect) {
      // Happy sound
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    } else {
      // Sad sound
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.2); // F4
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  nextQuestion() {
    this.closeModal();
    
    this.currentQuestion++;
    this.updateProgressBar();
    
    if (this.currentQuestion < this.questions.length) {
      // Add transition effect
      const storyCard = document.getElementById('storyCard');
      storyCard.style.transform = 'translateX(-100%)';
      storyCard.style.opacity = '0';
      
      setTimeout(() => {
        this.showQuestion();
        storyCard.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
          storyCard.style.transition = 'all 0.5s ease';
          storyCard.style.transform = 'translateX(0)';
          storyCard.style.opacity = '1';
        }, 50);
      }, 300);
    } else {
      this.showCompletion();
    }
  }

  updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
      const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
      progressFill.style.width = progress + '%';
      progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
    }
  }

  showCompletion() {
    const completionModal = document.getElementById('completionModal');
    const finalScore = document.getElementById('finalScore');
    
    if (completionModal && finalScore) {
      finalScore.textContent = this.score;
      completionModal.classList.add('active');
      
      // Animate score counter
      let currentScore = 0;
      const scoreInterval = setInterval(() => {
        finalScore.textContent = currentScore;
        currentScore++;
        if (currentScore > this.score) {
          clearInterval(scoreInterval);
          finalScore.textContent = this.score;
        }
      }, 200);
      
      // Create completion celebration
      this.createCompletionCelebration();
    }
  }

  createCompletionCelebration() {
    // Create fireworks effect
    const modal = document.querySelector('.completion-modal .modal-content');
    if (modal) {
      const rect = modal.getBoundingClientRect();
      
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const firework = document.createElement('div');
          firework.textContent = ['✨', '🎉', '🎊', '💫'][Math.floor(Math.random() * 4)];
          firework.style.position = 'fixed';
          firework.style.fontSize = '1.5rem';
          firework.style.pointerEvents = 'none';
          firework.style.zIndex = '2001';
          firework.style.left = (rect.left + Math.random() * rect.width) + 'px';
          firework.style.top = (rect.top + Math.random() * rect.height) + 'px';
          
          document.body.appendChild(firework);
          
          firework.animate([
            { transform: 'scale(0) rotate(0deg)', opacity: 1 },
            { transform: 'scale(1.5) rotate(360deg)', opacity: 0 }
          ], {
            duration: 2000,
            easing: 'ease-out'
          }).onfinish = () => firework.remove();
        }, i * 100);
      }
    }
  }

  closeModal() {
    const feedbackOverlay = document.getElementById('feedbackOverlay');
    if (feedbackOverlay) {
      feedbackOverlay.classList.remove('active');
    }
  }
}

// Global functions for HTML onclick handlers
function selectAnswer(isCorrect, type) {
  if (window.storyPage) {
    window.storyPage.selectAnswer(isCorrect === 'correct', type);
  }
}

function nextQuestion() {
  if (window.storyPage) {
    window.storyPage.nextQuestion();
  }
}

// Initialize story page
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('story')) {
    window.storyPage = new StoryPage();
  }
});