class LearnerDashboard {
    constructor() {
        this.currentLanguage = 'en';
        this.currentLanguageData = null;
        this.currentQuoteIndex = 0;
        this.quotes = [];
        
        this.init();
    }

    init() {
        this.setupLanguageSelector();
        this.setupProgressRings();
        this.setupActionCards();
        this.setupMotivationalQuotes();
        this.setupProfileCard();
        this.setupAccessibility();
        this.loadLanguageData();
        this.startAnimations();
    }

    // Language Management
    setupLanguageSelector() {
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        const langOptions = document.querySelectorAll('.lang-option');

        // Toggle dropdown
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(languageDropdown, languageBtn);
        });

        // Handle language selection
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedLang = option.dataset.lang;
                const textData = JSON.parse(option.dataset.text);
                
                this.changeLanguage(selectedLang, textData);
                this.closeDropdown(languageDropdown, languageBtn);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                this.closeDropdown(languageDropdown, languageBtn);
            }
        });

        // Keyboard navigation
        languageBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleDropdown(languageDropdown, languageBtn);
            }
        });
    }

    toggleDropdown(dropdown, button) {
        const isOpen = dropdown.classList.contains('show');
        
        if (isOpen) {
            this.closeDropdown(dropdown, button);
        } else {
            this.openDropdown(dropdown, button);
        }
    }

    openDropdown(dropdown, button) {
        dropdown.classList.add('show');
        button.setAttribute('aria-expanded', 'true');
        button.focus();
    }

    closeDropdown(dropdown, button) {
        dropdown.classList.remove('show');
        button.setAttribute('aria-expanded', 'false');
    }

    changeLanguage(lang, textData) {
        this.currentLanguage = lang;
        this.currentLanguageData = textData;
        
        // Update current language display
        const currentLangElement = document.querySelector('.current-lang');
        const langNames = {
            'en': 'English',
            'hi': 'हिन्दी',
            'ta': 'தமிழ்',
            'bn': 'বাংলা',
            'gu': 'ગુજરાતી'
        };
        currentLangElement.textContent = langNames[lang];
        currentLangElement.setAttribute('data-lang', lang);

        // Update text content with smooth fade transition
        this.updateTextContent(textData);
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    updateTextContent(textData) {
        const elements = {
            pageTitle: document.title,
            navBrand: document.getElementById('navBrand'),
            languageBtn: document.getElementById('languageBtn'),
            welcomeTitle: document.getElementById('welcomeTitle'),
            profileCardTitle: document.getElementById('profileCardTitle'),
            learningProgressTitle: document.getElementById('learningProgressTitle'),
            quickActionsTitle: document.getElementById('quickActionsTitle'),
            motivationalQuoteTitle: document.getElementById('motivationalQuoteTitle'),
            currentLevel: document.getElementById('currentLevel'),
            skillsLearned: document.getElementById('skillsLearned'),
            coursesCompleted: document.getElementById('coursesCompleted'),
            hoursSpent: document.getElementById('hoursSpent'),
            achievements: document.getElementById('achievements'),
            profileBuilderTitle: document.getElementById('profileBuilderTitle'),
            buildProfileDesc: document.getElementById('buildProfileDesc'),
            careerExplorerTitle: document.getElementById('careerExplorerTitle'),
            exploreCareersDesc: document.getElementById('exploreCareersDesc'),
            recommendationViewerTitle: document.getElementById('recommendationViewerTitle'),
            viewRecommendationsDesc: document.getElementById('viewRecommendationsDesc')
        };

        // Add fade out effect
        Object.values(elements).forEach(element => {
            if (element) {
                element.style.transition = 'opacity 0.3s ease';
                element.style.opacity = '0';
            }
        });

        // Update content after fade out
        setTimeout(() => {
            // Update page title and meta description
            document.title = textData.pageTitle;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', textData.pageDescription);
            }

            // Update navigation brand
            if (elements.navBrand) {
                elements.navBrand.textContent = textData.navBrand;
            }
            
            // Update language button aria-label
            if (elements.languageBtn) {
                elements.languageBtn.setAttribute('aria-label', textData.selectLanguage);
            }
            
            // Update section titles
            if (elements.welcomeTitle) elements.welcomeTitle.textContent = textData.welcome;
            if (elements.profileCardTitle) elements.profileCardTitle.textContent = textData.profileCard;
            if (elements.learningProgressTitle) elements.learningProgressTitle.textContent = textData.learningProgress;
            if (elements.quickActionsTitle) elements.quickActionsTitle.textContent = textData.quickActions;
            if (elements.motivationalQuoteTitle) elements.motivationalQuoteTitle.textContent = textData.motivationalQuote;
            
            // Update labels
            if (elements.currentLevel) elements.currentLevel.textContent = textData.currentLevel;
            if (elements.skillsLearned) elements.skillsLearned.textContent = textData.skillsLearned;
            if (elements.coursesCompleted) elements.coursesCompleted.textContent = textData.coursesCompleted;
            if (elements.hoursSpent) elements.hoursSpent.textContent = textData.hoursSpent;
            if (elements.achievements) elements.achievements.textContent = textData.achievements;
            
            // Update action cards
            if (elements.profileBuilderTitle) elements.profileBuilderTitle.textContent = textData.profileBuilder;
            if (elements.buildProfileDesc) elements.buildProfileDesc.textContent = textData.buildProfile;
            if (elements.careerExplorerTitle) elements.careerExplorerTitle.textContent = textData.careerExplorer;
            if (elements.exploreCareersDesc) elements.exploreCareersDesc.textContent = textData.exploreCareers;
            if (elements.recommendationViewerTitle) elements.recommendationViewerTitle.textContent = textData.recommendationViewer;
            if (elements.viewRecommendationsDesc) elements.viewRecommendationsDesc.textContent = textData.viewRecommendations;

            // Update quotes
            this.updateQuotes(textData);

            // Fade in effect
            Object.values(elements).forEach(element => {
                if (element) {
                    element.style.opacity = '1';
                }
            });
        }, 300);
    }

    // Progress Rings Animation
    setupProgressRings() {
        const progressBars = document.querySelectorAll('.progress-bar');
        const progressNumbers = document.querySelectorAll('.progress-number');
        
        // Animate progress rings on load
        setTimeout(() => {
            this.animateProgressRing(progressBars[0], 75, progressNumbers[0]);
            this.animateProgressRing(progressBars[1], 80, progressNumbers[1]);
            this.animateProgressRing(progressBars[2], 65, progressNumbers[2]);
        }, 1000);
    }

    animateProgressRing(progressBar, percentage, progressNumber) {
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (percentage / 100) * circumference;
        
        progressBar.style.strokeDashoffset = offset;
        progressBar.classList.add('animate');
        
        // Animate number counting
        this.animateNumber(progressNumber, percentage, 2000);
    }

    animateNumber(element, targetValue, duration) {
        const startValue = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue + (targetValue > 10 ? '' : '%');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Action Cards
    setupActionCards() {
        const actionCards = document.querySelectorAll('.action-card');
        
        actionCards.forEach(card => {
            // Ripple effect
            card.addEventListener('click', (e) => {
                this.createRippleEffect(e, card);
                this.handleCardClick(card);
            });

            // Glow effect on hover
            card.addEventListener('mouseenter', () => {
                this.addGlowEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeGlowEffect(card);
            });

            // Keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    handleCardClick(card) {
    const cardId = card.id;

    switch(cardId) {
        case 'profileBuilderCard':
            this.showNotification('Opening Profile Builder...', 'info');
            setTimeout(() => {
                window.location.href = '/de/learner-dashboard/profile-builder/'; 
            }, 1000);
            break;

        case 'careerExplorerCard':
            this.showNotification('Opening Career Explorer...', 'info');
            setTimeout(() => {
                window.location.href = '/de/career-explorer/'; 
            }, 1000);
            break;

        case 'recommendationViewerCard':  // fixed typo
            this.showNotification('Opening Recommendation Viewer...', 'info');
            setTimeout(() => {
                window.location.href = '/de/recommendation-viewer/'; 
            }, 1000);
            break;
    }
}


    createRippleEffect(e, card) {
        const ripple = document.createElement('span');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        card.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addGlowEffect(card) {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.5)';
    }

    removeGlowEffect(card) {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
    }

    // Motivational Quotes
    setupMotivationalQuotes() {
        this.quotes = [
            { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
            { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
            { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
            { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
            { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' }
        ];

        // Start quote rotation
        this.startQuoteRotation();
    }

    startQuoteRotation() {
        setInterval(() => {
            this.nextQuote();
        }, 5000); // Change quote every 5 seconds
    }

    nextQuote() {
        this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
        this.updateQuoteDisplay();
    }

    updateQuoteDisplay() {
        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');
        
        if (quoteText && quoteAuthor) {
            // Fade out
            quoteText.style.transition = 'opacity 0.5s ease';
            quoteAuthor.style.transition = 'opacity 0.5s ease';
            quoteText.style.opacity = '0';
            quoteAuthor.style.opacity = '0';
            
            // Update content and fade in
            setTimeout(() => {
                quoteText.textContent = this.quotes[this.currentQuoteIndex].text;
                quoteAuthor.textContent = `- ${this.quotes[this.currentQuoteIndex].author}`;
                quoteText.style.opacity = '1';
                quoteAuthor.style.opacity = '1';
            }, 500);
        }
    }

    updateQuotes(textData) {
        // Update quotes with translated versions if available
        if (textData.quote1) {
            this.quotes = [
                { text: textData.quote1, author: 'Winston Churchill' },
                { text: textData.quote2, author: 'Eleanor Roosevelt' },
                { text: textData.quote3, author: 'Nelson Mandela' },
                { text: textData.quote4, author: 'Steve Jobs' },
                { text: textData.quote5, author: 'Steve Jobs' }
            ];
            this.updateQuoteDisplay();
        }
    }

    // Profile Card 3D Tilt
    setupProfileCard() {
        const profileCard = document.getElementById('profileCard');
        
        if (profileCard) {
            profileCard.addEventListener('mousemove', (e) => {
                this.handleCardTilt(e, profileCard);
            });
            
            profileCard.addEventListener('mouseleave', () => {
                this.resetCardTilt(profileCard);
            });
        }
    }

    handleCardTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }

    resetCardTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }

    // Accessibility Features
    setupAccessibility() {
        // Skip to main content link
        this.createSkipLink();
        
        // Focus management
        this.setupFocusManagement();
        
        // Screen reader announcements
        this.setupScreenReaderSupport();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#dashboard-container';
        skipLink.textContent = 'Skip to dashboard content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--neon-blue);
            color: var(--background-black);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupFocusManagement() {
        // Trap focus in dropdown when open
        document.addEventListener('keydown', (e) => {
            const dropdown = document.getElementById('languageDropdown');
            if (dropdown.classList.contains('show')) {
                this.trapFocusInDropdown(e, dropdown);
            }
        });
    }

    trapFocusInDropdown(e, dropdown) {
        const focusableElements = dropdown.querySelectorAll('button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }

        if (e.key === 'Escape') {
            this.closeDropdown(dropdown, document.getElementById('languageBtn'));
        }
    }

    setupScreenReaderSupport() {
        // Announce language changes
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(announcer);

        this.announcer = announcer;
    }

    announceToScreenReader(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
        }
    }

    setupKeyboardNavigation() {
        // Arrow key navigation for language dropdown
        document.addEventListener('keydown', (e) => {
            const dropdown = document.getElementById('languageDropdown');
            if (dropdown.classList.contains('show')) {
                const options = dropdown.querySelectorAll('.lang-option');
                const currentIndex = Array.from(options).indexOf(document.activeElement);

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % options.length;
                    options[nextIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
                    options[prevIndex].focus();
                }
            }
        });
    }

    // Utility Functions
    loadLanguageData() {
        // Initialize with English language data
        const englishOption = document.querySelector('.lang-option[data-lang="en"]');
        if (englishOption) {
            this.currentLanguageData = JSON.parse(englishOption.dataset.text);
            // Initialize the page with English text
            this.updateTextContent(this.currentLanguageData);
        }
        console.log('Language data loaded');
    }

    startAnimations() {
        // Start progress ring animations
        setTimeout(() => {
            this.setupProgressRings();
        }, 1000);
        
        // Start quote rotation
        setTimeout(() => {
            this.startQuoteRotation();
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--neon-green)' : 'var(--neon-blue)'};
            color: var(--background-black);
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-glow);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// CSS for animations (injected dynamically)
const animationCSS = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject animation CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LearnerDashboard();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page is visible
        document.body.style.animationPlayState = 'running';
    }
});

// Performance optimization: Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-normal', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}
