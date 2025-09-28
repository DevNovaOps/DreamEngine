// Chatbot Assistant - Interactive JavaScript
class ChatbotAssistant {
    constructor() {
        this.isOpen = false;
        this.currentLanguage = 'en';
        this.messageHistory = [];
        this.isTyping = false;
        this.languageData = {
            en: {
                welcomeText: "Hello! I'm your AI Career Assistant. How can I help you today?",
                placeholder: "Type your message here...",
                viewCareerPath: "View Career Path",
                exploreCourses: "Explore Courses",
                skillAssessment: "Skill Assessment",
                assistantTitle: "AI Career Assistant"
            },
            hi: {
                welcomeText: "नमस्ते! मैं आपका AI करियर असिस्टेंट हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
                placeholder: "अपना संदेश यहाँ टाइप करें...",
                viewCareerPath: "करियर पथ देखें",
                exploreCourses: "कोर्स एक्सप्लोर करें",
                skillAssessment: "स्किल असेसमेंट",
                assistantTitle: "AI करियर असिस्टेंट"
            },
            ta: {
                welcomeText: "வணக்கம்! நான் உங்கள் AI தொழில் உதவியாளர். இன்று உங்களுக்கு எப்படி உதவ முடியும்?",
                placeholder: "உங்கள் செய்தியை இங்கே தட்டச்சு செய்யுங்கள்...",
                viewCareerPath: "தொழில் பாதை பார்க்க",
                exploreCourses: "படிப்புகளை ஆராயுங்கள்",
                skillAssessment: "திறன் மதிப்பீடு",
                assistantTitle: "AI தொழில் உதவியாளர்"
            },
            bn: {
                welcomeText: "হ্যালো! আমি আপনার AI ক্যারিয়ার সহায়ক। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
                placeholder: "এখানে আপনার বার্তা টাইপ করুন...",
                viewCareerPath: "ক্যারিয়ার পথ দেখুন",
                exploreCourses: "কোর্স অন্বেষণ করুন",
                skillAssessment: "দক্ষতা মূল্যায়ন",
                assistantTitle: "AI ক্যারিয়ার সহায়ক"
            },
            gu: {
                welcomeText: "નમસ્તે! હું તમારો AI કારિયર સહાયક છું. આજે હું તમારી કેવી રીતે મદદ કરી શકું?",
                placeholder: "તમારો સંદેશ અહીં ટાઇપ કરો...",
                viewCareerPath: "કારિયર પથ જુઓ",
                exploreCourses: "કોર્સ એક્સપ્લોર કરો",
                skillAssessment: "સ્કિલ અસેસમેન્ટ",
                assistantTitle: "AI કારિયર સહાયક"
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLanguageSelector();
        this.loadLanguageData();
        this.setupQuickActions();
        this.setupTypingIndicator();
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('chatbotToggle');
        const minimizeBtn = document.getElementById('minimizeBtn');
        const sendBtn = document.getElementById('sendBtn');
        const input = document.getElementById('chatbotInput');

        // Toggle chatbot window
        toggleBtn.addEventListener('click', () => {
            this.toggleChatbot();
        });

        // Minimize chatbot
        minimizeBtn.addEventListener('click', () => {
            this.closeChatbot();
        });

        // Send message
        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize input
        input.addEventListener('input', () => {
            this.autoResizeInput(input);
        });

        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            const chatbotContainer = document.getElementById('chatbotContainer');
            if (!chatbotContainer.contains(e.target) && this.isOpen) {
                this.closeChatbot();
            }
        });
    }

    setupLanguageSelector() {
        const langBtn = document.getElementById('chatbotLangBtn');
        const langDropdown = document.getElementById('chatbotLangDropdown');
        const langOptions = document.querySelectorAll('#chatbotLangDropdown .lang-option');

        // Toggle language dropdown
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLanguageDropdown(langDropdown);
        });

        // Handle language selection
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedLang = option.dataset.lang;
                this.changeLanguage(selectedLang);
                this.closeLanguageDropdown(langDropdown);
            });
        });
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                this.closeLanguageDropdown(langDropdown);
            }
        });
    }

    toggleLanguageDropdown(dropdown) {
        const isOpen = dropdown.classList.contains('show');
        
        if (isOpen) {
            this.closeLanguageDropdown(dropdown);
        } else {
            this.openLanguageDropdown(dropdown);
        }
    }

    openLanguageDropdown(dropdown) {
        dropdown.classList.add('show');
    }

    closeLanguageDropdown(dropdown) {
        dropdown.classList.remove('show');
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.updateLanguageContent();
    }

    updateLanguageContent() {
        const data = this.languageData[this.currentLanguage];
        
        // Update welcome text
        const welcomeText = document.getElementById('welcomeText');
        if (welcomeText) {
            welcomeText.textContent = data.welcomeText;
        }

        // Update placeholder
        const input = document.getElementById('chatbotInput');
        if (input) {
            input.placeholder = data.placeholder;
        }

        // Update quick action buttons
        const viewCareerPath = document.getElementById('viewCareerPath');
        const exploreCourses = document.getElementById('exploreCourses');
        const skillAssessment = document.getElementById('skillAssessment');

        if (viewCareerPath) viewCareerPath.textContent = data.viewCareerPath;
        if (exploreCourses) exploreCourses.textContent = data.exploreCourses;
        if (skillAssessment) skillAssessment.textContent = data.skillAssessment;

        // Update assistant title
        const assistantTitle = document.getElementById('assistantTitle');
        if (assistantTitle) {
            assistantTitle.textContent = data.assistantTitle;
        }

        // Update current language display
        const currentLang = document.querySelector('#chatbotLangBtn .current-lang');
if (currentLang) {
    const langCodes = {
        'en': 'EN',
        'hi': 'हि',
        'ta': 'த',
        'bn': 'ব',
        'gu': 'ગુ'
    };
    const code = langCodes[this.currentLanguage] || 'EN';
    currentLang.textContent = code;
    currentLang.setAttribute('data-lang', this.currentLanguage);
}

    }

    loadLanguageData() {
        // Initialize with English
        this.updateLanguageContent();
    }

    setupQuickActions() {
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });

            // Add ripple effect
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(e, btn);
            });
        });
    }

    handleQuickAction(action) {
        const messages = document.getElementById('chatbotMessages');
        
        switch(action) {
            case 'career-path':
                this.addBotMessage("I'd be happy to help you explore career paths! Let me show you some options based on your interests and skills.");
                this.showCareerPathSuggestions();
                break;
            case 'explore-courses':
                this.addBotMessage("Great! Let me help you find relevant courses. What specific skills or topics are you interested in learning?");
                break;
            case 'skill-assessment':
                this.addBotMessage("I can help you assess your current skills! Let's start with a quick evaluation. What field are you most interested in?");
                break;
        }
    }

    showCareerPathSuggestions() {
        setTimeout(() => {
            const suggestions = [
                "Software Development",
                "Data Science & Analytics", 
                "Digital Marketing",
                "UI/UX Design",
                "Project Management"
            ];

            const suggestionHTML = suggestions.map(suggestion => 
                `<button class="suggestion-btn" data-suggestion="${suggestion}">${suggestion}</button>`
            ).join('');

            this.addBotMessage(`Here are some popular career paths: ${suggestionHTML}`, true);
        }, 1000);
    }

    setupTypingIndicator() {
        // This will be used to show typing indicator
    }

    toggleChatbot() {
        const chatbotWindow = document.getElementById('chatbotWindow');
        const toggleBtn = document.getElementById('chatbotToggle');
        
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const chatbotWindow = document.getElementById('chatbotWindow');
        const toggleBtn = document.getElementById('chatbotToggle');
        
        chatbotWindow.classList.add('open');
        toggleBtn.style.transform = 'scale(0.9)';
        this.isOpen = true;
        
        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('chatbotInput');
            input.focus();
        }, 300);
    }

    closeChatbot() {
        const chatbotWindow = document.getElementById('chatbotWindow');
        const toggleBtn = document.getElementById('chatbotToggle');
        
        chatbotWindow.classList.remove('open');
        toggleBtn.style.transform = 'scale(1)';
        this.isOpen = false;
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (message) {
            this.addUserMessage(message);
            input.value = '';
            this.autoResizeInput(input);
            
            // Simulate bot response
            setTimeout(() => {
                this.simulateBotResponse(message);
            }, 1000);
        }
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageElement = this.createMessageElement(message, 'user');
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Store in history
        this.messageHistory.push({ type: 'user', content: message, timestamp: new Date() });
    }

    addBotMessage(message, isHTML = false) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageElement = this.createMessageElement(message, 'bot', isHTML);
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Store in history
        this.messageHistory.push({ type: 'bot', content: message, timestamp: new Date() });
    }

    createMessageElement(message, type, isHTML = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'bot' ? '🤖' : '👤';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        if (isHTML) {
            content.innerHTML = message;
            
            // Add event listeners to suggestion buttons
            const suggestionBtns = content.querySelectorAll('.suggestion-btn');
            suggestionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const suggestion = btn.dataset.suggestion;
                    this.addUserMessage(suggestion);
                    setTimeout(() => {
                        this.addBotMessage(`Great choice! ${suggestion} is an excellent career path. Let me provide you with more detailed information about this field.`);
                    }, 1000);
                });
            });
        } else {
            const p = document.createElement('p');
            p.textContent = message;
            content.appendChild(p);
        }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        return messageDiv;
    }

    simulateBotResponse(userMessage) {
        // Show typing indicator
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateBotResponse(userMessage);
        }, 1500 + Math.random() * 1000);
    }

    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatbotMessages');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
        this.isTyping = false;
    }
generateBotResponse(userMessage) {
    fetch("/de/chatbot-response/?message=" + 
          encodeURIComponent(userMessage) + 
          "&lang=" + encodeURIComponent(this.currentLanguage))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            this.addBotMessage(data.response || "⚠️ No response found.");
        })
        .catch(err => {
            this.addBotMessage("❌ Server error, please try again later.");
            console.error("Chatbot error:", err);
        });
}

    createRippleEffect(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    autoResizeInput(input) {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Utility method to add predefined responses
    addPredefinedResponse(trigger, response) {
        // This can be extended to add more sophisticated response logic
    }

    // Method to clear chat history
    clearChatHistory() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        
        // Clear all messages except welcome
        const messages = messagesContainer.querySelectorAll('.message:not(.welcome-message)');
        messages.forEach(message => message.remove());
        
        this.messageHistory = [];
    }

    // Method to export chat history
    exportChatHistory() {
        const history = this.messageHistory.map(msg => ({
            type: msg.type,
            content: msg.content,
            timestamp: msg.timestamp.toISOString()
        }));
        
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `chatbot-history-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// CSS for ripple effect and additional animations
const chatbotCSS = `
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

.suggestion-btn {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid var(--neon-blue);
    border-radius: 15px;
    padding: 8px 12px;
    margin: 4px;
    color: var(--text-white);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: var(--font-size-xs);
    display: inline-block;
}

.suggestion-btn:hover {
    background: rgba(0, 212, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
}

.typing-message {
    animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject chatbot CSS
const chatbotStyleSheet = document.createElement('style');
chatbotStyleSheet.textContent = chatbotCSS;
document.head.appendChild(chatbotStyleSheet);

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotAssistant = new ChatbotAssistant();
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
