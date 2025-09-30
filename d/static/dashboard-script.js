class LearnerDashboard {
    constructor() {
        this.currentLanguage = document.documentElement.getAttribute('data-current-lang') || 'en';
        this.allTranslations = this.loadTranslationsFromDOM();
        this.currentLanguageData = this.allTranslations[this.currentLanguage];
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
        this.startAnimations();
        
        // Apply initial language
        this.applyLanguage(this.currentLanguage);
    }
loadTranslationsFromDOM() {
        // Load translations from a script tag in the template
        const translationsElement = document.getElementById('translations-data');
        if (translationsElement && translationsElement.textContent.trim()) {
            const content = translationsElement.textContent.trim();
            
            // Check if content is "undefined" string or empty
            if (content === 'undefined' || content === '') {
                console.log('Translation data is undefined, using fallback');
                return this.getFallbackTranslations();
            }
            
            try {
                const parsed = JSON.parse(content);
                console.log('Translations loaded from backend:', Object.keys(parsed));
                return parsed;
            } catch (e) {
                console.warn('Failed to parse translations from backend:', e);
                console.log('Content was:', content);
            }
        }
        
        console.log('Using fallback translations');
        // Fallback translations if not provided by backend
        return this.getFallbackTranslations();
    }
    getFallbackTranslations() {
        return {
            'en': {
                pageTitle: 'Career Navigator - Learner Dashboard',
                pageDescription: 'Your personalized learning dashboard for career development',
                navBrand: 'CareerNav',
                selectLanguage: 'Select language',
                welcome: 'Welcome back',
                welcomeSubtitle: 'Ready to continue your learning journey?',
                profileCard: 'Profile Card',
                learningProgress: 'Learning Progress',
                quickActions: 'Quick Actions',
                motivationalQuote: 'Motivational Quote',
                currentLevel: 'Current Level',
                skillsLearned: 'Skills Learned',
                coursesCompleted: 'Courses Completed',
                hoursSpent: 'Hours Spent',
                achievements: 'Achievements',
                profileBuilder: 'Profile Builder',
                buildProfile: 'Build Your Profile',
                careerExplorer: 'Career Explorer',
                exploreCareers: 'Explore Careers',
                recommendationViewer: 'Recommendation Viewer',
                viewRecommendations: 'View Recommendations',
                aiAssistant: 'AI Career Assistant',
                typePlaceholder: 'Type your message here...',
                aiWelcome: 'Hello! I\'m your AI Career Assistant. How can I help you today?',
                quote1: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
                quote2: 'The future belongs to those who believe in the beauty of their dreams.',
                quote3: 'Education is the most powerful weapon which you can use to change the world.',
                quote4: 'The only way to do great work is to love what you do.',
                quote5: 'Innovation distinguishes between a leader and a follower.',
            },
            'hi': {
                pageTitle: 'करियर नेविगेटर - लर्नर डैशबोर्ड',
                pageDescription: 'करियर विकास के लिए आपका व्यक्तिगत शिक्षण डैशबोर्ड',
                navBrand: 'करियरनव',
                selectLanguage: 'भाषा चुनें',
                welcome: 'वापस स्वागत है',
                welcomeSubtitle: 'अपनी सीखने की यात्रा जारी रखने के लिए तैयार हैं?',
                profileCard: 'प्रोफाइल कार्ड',
                learningProgress: 'सीखने की प्रगति',
                quickActions: 'त्वरित कार्य',
                motivationalQuote: 'प्रेरणादायक उद्धरण',
                currentLevel: 'वर्तमान स्तर',
                skillsLearned: 'सीखे गए कौशल',
                coursesCompleted: 'पूर्ण किए गए पाठ्यक्रम',
                hoursSpent: 'बिताए गए घंटे',
                achievements: 'उपलब्धियां',
                profileBuilder: 'प्रोफाइल बिल्डर',
                buildProfile: 'अपना प्रोफाइल बनाएं',
                careerExplorer: 'करियर एक्सप्लोरर',
                exploreCareers: 'करियर का अन्वेषण करें',
                recommendationViewer: 'सिफारिश व्यूअर',
                viewRecommendations: 'सिफारिशें देखें',
                aiAssistant: 'एआई करियर सहायक',
                typePlaceholder: 'अपना संदेश यहां लिखें...',
                aiWelcome: 'नमस्ते! मैं आपका एआई करियर सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
                quote1: 'सफलता अंतिम नहीं है, असफलता घातक नहीं है: जारी रखने का साहस ही मायने रखता है।',
                quote2: 'भविष्य उनका है जो अपने सपनों की सुंदरता में विश्वास करते हैं।',
                quote3: 'शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।',
                quote4: 'महान काम करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे प्यार करें।',
                quote5: 'नवाचार एक नेता और अनुयायी के बीच अंतर करता है।',
            }
        };
    }

    setupLanguageSelector() {
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        const langOptions = document.querySelectorAll('.lang-option');

        if (!languageBtn || !languageDropdown) return;

        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(languageDropdown, languageBtn);
        });

        langOptions.forEach(option => {
            option.addEventListener('click', async (e) => {
                e.preventDefault();
                const selectedLang = option.dataset.lang;
                
                // Check if data-text exists (old format) - ignore it, we use backend translations
                if (selectedLang) {
                    await this.changeLanguage(selectedLang);
                    this.closeDropdown(languageDropdown, languageBtn);
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                this.closeDropdown(languageDropdown, languageBtn);
            }
        });

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
    }

    closeDropdown(dropdown, button) {
        dropdown.classList.remove('show');
        button.setAttribute('aria-expanded', 'false');
    }

    async changeLanguage(lang) {
        try {
            // Send language change to backend
            const response = await fetch('/de/change-language/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({ language: lang })
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                this.currentLanguage = lang;
                this.currentLanguageData = this.allTranslations[lang] || this.allTranslations['en'];
                
                this.applyLanguage(lang);
                this.announceToScreenReader(`Language changed to ${this.getLangName(lang)}`);
                this.showNotification(`Language changed to ${this.getLangName(lang)}`, 'success');
            } else {
                this.showNotification('Failed to change language', 'error');
            }
        } catch (error) {
            console.error('Language change error:', error);
            // Still apply frontend changes even if backend fails
            this.currentLanguage = lang;
            this.currentLanguageData = this.allTranslations[lang] || this.allTranslations['en'];
            this.applyLanguage(lang);
        }
    }

    applyLanguage(lang) {
        const textData = this.allTranslations[lang] || this.allTranslations['en'];
        
        // Update current language display
        const currentLangElement = document.querySelector('.current-lang');
        if (currentLangElement) {
            currentLangElement.textContent = this.getLangName(lang);
            currentLangElement.setAttribute('data-lang', lang);
        }

        // Update text content with fade transition
        this.updateTextContent(textData);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        document.documentElement.setAttribute('data-current-lang', lang);
        
        // Update chatbot language if exists
        this.updateChatbotLanguage(lang);
    }

    getLangName(lang) {
        const langNames = {
            'en': 'English',
            'hi': 'हिन्दी',
            'ta': 'தமிழ்',
            'bn': 'বাংলা',
            'gu': 'ગુજરાતી'
        };
        return langNames[lang] || 'English';
    }

    updateTextContent(textData) {
        const elements = {
            // Page metadata
            pageTitle: { type: 'title', selector: null },
            
            // Navigation
            navBrand: { id: 'navBrand' },
            languageBtn: { id: 'languageBtn', attr: 'aria-label', key: 'selectLanguage' },
            
            // Welcome section
            welcomeTitle: { id: 'welcomeTitle' },
            welcomeSubtitle: { id: 'welcomeSubtitle' },
            
            // Section titles
            profileCardTitle: { id: 'profileCardTitle' },
            learningProgressTitle: { id: 'learningProgressTitle' },
            quickActionsTitle: { id: 'quickActionsTitle' },
            motivationalQuoteTitle: { id: 'motivationalQuoteTitle' },
            
            // Progress labels
            currentLevel: { id: 'currentLevel' },
            skillsLearned: { id: 'skillsLearned' },
            coursesCompleted: { id: 'coursesCompleted' },
            hoursSpent: { id: 'hoursSpent' },
            achievements: { id: 'achievements' },
            
            // Action cards
            profileBuilderTitle: { id: 'profileBuilderTitle' },
            buildProfileDesc: { id: 'buildProfileDesc' },
            careerExplorerTitle: { id: 'careerExplorerTitle' },
            exploreCareersDesc: { id: 'exploreCareersDesc' },
            recommendationViewerTitle: { id: 'recommendationViewerTitle' },
            viewRecommendationsDesc: { id: 'viewRecommendationsDesc' },
            
            // Chatbot
            assistantTitle: { id: 'assistantTitle' },
            chatbotInput: { id: 'chatbotInput', attr: 'placeholder', key: 'typePlaceholder' },
            welcomeText: { id: 'welcomeText' }
        };

        // Add fade out effect
        Object.keys(elements).forEach(key => {
            const config = elements[key];
            let element;
            
            if (config.type === 'title') {
                element = document.querySelector('title');
            } else if (config.id) {
                element = document.getElementById(config.id);
            }
            
            if (element && !config.attr) {
                element.style.transition = 'opacity 0.3s ease';
                element.style.opacity = '0';
            }
        });

        // Update content after fade out
        setTimeout(() => {
            // Update page title
            document.title = textData.pageTitle || textData.pageTitle;
            
            // Update meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription && textData.pageDescription) {
                metaDescription.setAttribute('content', textData.pageDescription);
            }

            // Update all text elements
            Object.keys(elements).forEach(key => {
                const config = elements[key];
                let element;
                
                if (config.id) {
                    element = document.getElementById(config.id);
                }
                
                if (element) {
                    if (config.attr) {
                        // Update attribute (like aria-label or placeholder)
                        const textKey = config.key || key;
                        if (textData[textKey]) {
                            element.setAttribute(config.attr, textData[textKey]);
                        }
                    } else {
                        // Update text content
                        if (textData[key]) {
                            element.textContent = textData[key];
                        }
                    }
                }
            });

            // Update quotes
            this.updateQuotes(textData);

            // Fade in effect
            Object.keys(elements).forEach(key => {
                const config = elements[key];
                let element;
                
                if (config.id) {
                    element = document.getElementById(config.id);
                }
                
                if (element && !config.attr) {
                    element.style.opacity = '1';
                }
            });
        }, 300);
    }

    updateChatbotLanguage(lang) {
        // Update chatbot language indicator if it exists
        const chatbotLangBtn = document.getElementById('chatbotLangBtn');
        if (chatbotLangBtn) {
            const currentLang = chatbotLangBtn.querySelector('.current-lang');
            if (currentLang) {
                currentLang.textContent = lang.toUpperCase();
                currentLang.setAttribute('data-lang', lang);
            }
        }
    }

    getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    }

    setupProgressRings() {
        const progressBars = document.querySelectorAll('.progress-bar');
        const progressNumbers = document.querySelectorAll('.progress-number');
        
        if (progressBars.length >= 3) {
            setTimeout(() => {
                this.animateProgressRing(progressBars[0], 75, progressNumbers[0]);
                this.animateProgressRing(progressBars[1], 80, progressNumbers[1]);
                this.animateProgressRing(progressBars[2], 65, progressNumbers[2]);
            }, 1000);
        }
    }

    animateProgressRing(progressBar, percentage, progressNumber) {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (percentage / 100) * circumference;
        
        progressBar.style.strokeDashoffset = offset;
        progressBar.classList.add('animate');
        
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

    setupActionCards() {
        const actionCards = document.querySelectorAll('.action-card');
        
        actionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.createRippleEffect(e, card);
                this.handleCardClick(card);
            });

            card.addEventListener('mouseenter', () => {
                this.addGlowEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeGlowEffect(card);
            });

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

            case 'recommendationViewerCard':
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

    setupMotivationalQuotes() {
        this.updateQuotesFromLanguage(this.currentLanguageData);
        this.startQuoteRotation();
    }

    updateQuotesFromLanguage(textData) {
        this.quotes = [
            { text: textData.quote1 || 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
            { text: textData.quote2 || 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
            { text: textData.quote3 || 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
            { text: textData.quote4 || 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
            { text: textData.quote5 || 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' }
        ];
    }

    startQuoteRotation() {
        setInterval(() => {
            this.nextQuote();
        }, 8000);
    }

    nextQuote() {
        this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
        this.updateQuoteDisplay();
    }

    updateQuoteDisplay() {
        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');
        
        if (quoteText && quoteAuthor && this.quotes.length > 0) {
            quoteText.style.transition = 'opacity 0.5s ease';
            quoteAuthor.style.transition = 'opacity 0.5s ease';
            quoteText.style.opacity = '0';
            quoteAuthor.style.opacity = '0';
            
            setTimeout(() => {
                quoteText.textContent = this.quotes[this.currentQuoteIndex].text;
                quoteAuthor.textContent = `- ${this.quotes[this.currentQuoteIndex].author}`;
                quoteText.style.opacity = '1';
                quoteAuthor.style.opacity = '1';
            }, 500);
        }
    }

    updateQuotes(textData) {
        this.updateQuotesFromLanguage(textData);
        this.updateQuoteDisplay();
    }

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

    setupAccessibility() {
        this.createSkipLink();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
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
            background: var(--neon-blue, #00d4ff);
            color: var(--background-black, #000);
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
        document.addEventListener('keydown', (e) => {
            const dropdown = document.getElementById('languageDropdown');
            if (dropdown && dropdown.classList.contains('show')) {
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
        document.addEventListener('keydown', (e) => {
            const dropdown = document.getElementById('languageDropdown');
            if (dropdown && dropdown.classList.contains('show')) {
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

    startAnimations() {
        setTimeout(() => {
            this.setupProgressRings();
        }, 1000);
        
        setTimeout(() => {
            this.startQuoteRotation();
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            'success': '#00ff88',
            'info': '#00d4ff',
            'error': '#ff4444'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: #000;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.5);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// CSS animations
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

const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LearnerDashboard();
});

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

// Reduced motion support
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-normal', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}