// Career Navigator - Interactive JavaScript
class CareerNavigator {
    constructor() {
        this.currentLanguage = 'en';
        this.currentLanguageData = null;
        this.typewriterText = '';
        this.typewriterIndex = 0;
        this.isDeleting = false;
        this.typewriterSpeed = 100;
        this.typewriterDelay = 2000;
        
        this.init();
    }

    init() {
        this.setupLanguageSelector();
        this.setupTypewriterEffect();
        this.setupButtonAnimations();
        this.setupAccessibility();
        this.loadLanguageData();
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
        
        // Restart typewriter effect with new text
        this.restartTypewriter(textData.headline);
    }

    updateTextContent(textData) {
        const elements = {
            headline: document.getElementById('headline'),
            subtitle: document.getElementById('subtitle'),
            loginBtn: document.getElementById('loginBtn'),
            signupBtn: document.getElementById('signupBtn'),
            feature1: document.getElementById('feature1'),
            feature2: document.getElementById('feature2'),
            feature3: document.getElementById('feature3'),
            footer: document.getElementById('footer'),
            navBrand: document.getElementById('navBrand'),
            languageBtn: document.getElementById('languageBtn')
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
            // Update subtitle
            if (elements.subtitle) {
                elements.subtitle.textContent = textData.subtitle;
            }
            
            // Update buttons
            if (elements.loginBtn) {
                elements.loginBtn.querySelector('.btn-text').textContent = textData.login;
                elements.loginBtn.setAttribute('aria-label', textData.loginAria);
            }
            if (elements.signupBtn) {
                elements.signupBtn.querySelector('.btn-text').textContent = textData.signup;
                elements.signupBtn.setAttribute('aria-label', textData.signupAria);
            }
            
            // Update feature texts
            if (elements.feature1) {
                elements.feature1.textContent = textData.feature1;
            }
            if (elements.feature2) {
                elements.feature2.textContent = textData.feature2;
            }
            if (elements.feature3) {
                elements.feature3.textContent = textData.feature3;
            }
            
            // Update footer
            if (elements.footer) {
                elements.footer.textContent = textData.footer;
            }
            
            // Update navigation brand
            if (elements.navBrand) {
                elements.navBrand.textContent = textData.navBrand;
            }
            
            // Update language button aria-label
            if (elements.languageBtn) {
                elements.languageBtn.setAttribute('aria-label', textData.selectLanguage);
            }
            
            // Update page title and meta description
            document.title = textData.pageTitle;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', textData.pageDescription);
            }
            
            // Update HTML lang attribute
            document.documentElement.lang = this.currentLanguage;

            // Fade in effect
            Object.values(elements).forEach(element => {
                if (element) {
                    element.style.opacity = '1';
                }
            });
        }, 300);
    }

    // Typewriter Effect
    setupTypewriterEffect() {
        const headlineElement = document.querySelector('.typewriter-text');
        if (!headlineElement) return;

        this.typewriterText = headlineElement.textContent;
        headlineElement.textContent = '';
        this.startTypewriter();
    }

    startTypewriter() {
        const headlineElement = document.querySelector('.typewriter-text');
        if (!headlineElement) return;

        const currentText = headlineElement.textContent;
        const targetText = this.typewriterText;

        if (!this.isDeleting && currentText === targetText) {
            // Pause before deleting
            setTimeout(() => {
                this.isDeleting = true;
                this.typewriterSpeed = 50;
                this.typewriter();
            }, this.typewriterDelay);
        } else if (this.isDeleting && currentText === '') {
            // Start typing again
            this.isDeleting = false;
            this.typewriterSpeed = 100;
            this.typewriter();
        } else {
            // Continue current operation
            this.typewriter();
        }
    }

    typewriter() {
        const headlineElement = document.querySelector('.typewriter-text');
        if (!headlineElement) return;

        const currentText = headlineElement.textContent;
        const targetText = this.typewriterText;

        if (this.isDeleting) {
            headlineElement.textContent = targetText.substring(0, currentText.length - 1);
        } else {
            headlineElement.textContent = targetText.substring(0, currentText.length + 1);
        }

        setTimeout(() => this.startTypewriter(), this.typewriterSpeed);
    }

    restartTypewriter(newText) {
        this.typewriterText = newText;
        this.isDeleting = false;
        this.typewriterSpeed = 100;
        
        const headlineElement = document.querySelector('.typewriter-text');
        if (headlineElement) {
            headlineElement.textContent = '';
            setTimeout(() => this.startTypewriter(), 500);
        }
    }

    // Button Animations and Interactions
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Ripple effect
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });

            // Glow effect on hover
            button.addEventListener('mouseenter', () => {
                this.addGlowEffect(button);
            });

            button.addEventListener('mouseleave', () => {
                this.removeGlowEffect(button);
            });

            // Keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });

        // Login button functionality
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.handleLogin();
            });
        }

        // Sign up button functionality
        const signupBtn = document.getElementById('signupBtn');
        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                this.handleSignUp();
            });
        }
    }

    createRippleEffect(e, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addGlowEffect(button) {
        button.style.transform = 'translateY(-3px)';
        button.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.5)';
    }

    removeGlowEffect(button) {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '';
    }

    handleLogin() {
        // Add loading state
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        btnText.textContent = this.currentLanguageData ? this.currentLanguageData.loginLoading : 'Loading...';
        loginBtn.disabled = true;

        // Navigate to auth page after brief loading
        setTimeout(() => {
            btnText.textContent = originalText;
            loginBtn.disabled = false;
            
            // Navigate to auth page
            window.location.href = 'auth.html';
        }, 1000);
    }

    handleSignUp() {
        // Add loading state
        const signupBtn = document.getElementById('signupBtn');
        const btnText = signupBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        btnText.textContent = this.currentLanguageData ? this.currentLanguageData.signupLoading : 'Creating...';
        signupBtn.disabled = true;

        // Navigate to auth page after brief loading
        setTimeout(() => {
            btnText.textContent = originalText;
            signupBtn.disabled = false;
            
            // Navigate to auth page
            window.location.href = 'auth.html';
        }, 1000);
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
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
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
    new CareerNavigator();
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
