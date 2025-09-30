class CareerNavigatorAuth {
    constructor() {
        // Use in-memory storage instead of localStorage (not supported in artifacts)
        this.currentLanguage = 'en';
        this.allLanguageData = JSON.parse(document.getElementById('language-data').textContent);
        this.currentLanguageData = this.allLanguageData[this.currentLanguage];
        this.isFlipped = false;
        this.dropdownOpen = false;
    }

    init() {
        this.setupLanguageSelector();
        this.setupFormSwitching();
        this.setupFormValidation();
        this.updateTextContent();
        this.initializeLanguageDisplay();
    }

    initializeLanguageDisplay() {
        // Set the initial language display
        const currentLang = document.querySelector(".current-lang");
        const langOptions = document.querySelectorAll(".lang-option");
        
        langOptions.forEach(option => {
            if (option.dataset.lang === this.currentLanguage) {
                currentLang.textContent = option.textContent;
            }
        });
    }

    setupLanguageSelector() {
    const languageBtn = document.getElementById("languageBtn");
    const languageDropdown = document.getElementById("languageDropdown");
    const currentLang = document.querySelector(".current-lang");
    const langOptions = document.querySelectorAll(".lang-option");

    if (!languageBtn || !languageDropdown || !currentLang) {
        console.error("Language selector elements not found");
        return;
    }

    // Prevent any default button behavior
    languageBtn.type = "button";

    // Toggle dropdown visibility
    languageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        this.dropdownOpen = !this.dropdownOpen;
        
        if (this.dropdownOpen) {
            languageDropdown.classList.add("show");
            languageBtn.setAttribute("aria-expanded", "true");
        } else {
            languageDropdown.classList.remove("show");
            languageBtn.setAttribute("aria-expanded", "false");
        }
    });

    // Language select - use mousedown instead of click for better reliability
    langOptions.forEach(option => {
        // Set button type explicitly
        option.type = "button";
        
        option.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.currentLanguage = option.dataset.lang;
            this.currentLanguageData = this.allLanguageData[this.currentLanguage];
            currentLang.textContent = option.textContent;

            // Close dropdown
            this.dropdownOpen = false;
            languageDropdown.classList.remove("show");
            languageBtn.setAttribute("aria-expanded", "false");

            // Update all text content
            this.updateTextContent();

            // Add visual feedback
            this.showLanguageChangeNotification(option.textContent);
        });
        
        // Also add click handler for accessibility (keyboard users)
        option.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener("mousedown", (e) => {
        if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
            if (this.dropdownOpen) {
                this.dropdownOpen = false;
                languageDropdown.classList.remove("show");
                languageBtn.setAttribute("aria-expanded", "false");
            }
        }
    });
}

    showLanguageChangeNotification(languageName) {
        // Create a small notification to show language changed
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.textContent = `Language changed to ${languageName}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    updateTextContent() {
        const data = this.currentLanguageData;
        if (!data) {
            console.error("Language data not found for:", this.currentLanguage);
            return;
        }

        console.log("Updating text content for language:", this.currentLanguage);

        // Update browser tab title
        document.title = data.pageTitle || document.title;

        // Update all text elements
        const textMap = {
            navBrand: data.navBrand,
            loginTitle: data.loginTitle,
            loginSubtitle: data.loginSubtitle,
            emailLabel: data.email,
            passwordLabel: data.password,
            rememberMeText: data.rememberMe,
            forgotPassword: data.forgotPassword,
            loginBtnText: data.loginBtn,
            signupTitle: data.signupTitle,
            signupSubtitle: data.signupSubtitle,
            fullNameLabel: data.fullName,
            signupEmailLabel: data.email,
            signupPasswordLabel: data.password,
            confirmPasswordLabel: data.confirmPassword,
            roleLabel: data.role,
            learnerOption: data.learner,
            adminOption: data.admin,
            signupBtnText: data.signupBtn,
            loadingText: data.loading || 'Loading...',
            successTitle: data.successTitle || 'Success!',
            successMessage: data.successMessage || 'Redirecting...'
        };

        for (const [id, text] of Object.entries(textMap)) {
            const element = document.getElementById(id);
            if (element && text) {
                element.textContent = text;
            }
        }

        // Update placeholder for role select
        const roleSelect = document.getElementById('userRole');
        if (roleSelect && data.role) {
            roleSelect.options[0].textContent = data.role;
        }

        // Update input placeholders
        this.updateInputPlaceholders(data);

        // Switch text (safe split on '?')
        if (data.switchToSignup) {
            const parts = data.switchToSignup.split("?");
            const before = parts[0];
            const after = parts[1] ? parts[1].trim() : 'Sign up';
            document.getElementById('switchToSignupText').innerHTML =
                `${before}? <button type="button" class="switch-btn" id="switchToSignup">${after}</button>`;
        }

        if (data.switchToLogin) {
            const parts = data.switchToLogin.split("?");
            const before = parts[0];
            const after = parts[1] ? parts[1].trim() : 'Login';
            document.getElementById('switchToLoginText').innerHTML =
                `${before}? <button type="button" class="switch-btn" id="switchToLogin">${after}</button>`;
        }

        // Re-setup form switching after innerHTML changes
        this.setupFormSwitching();
    }

    updateInputPlaceholders(data) {
        // Update input placeholders for better UX
        const placeholderMap = {
            'loginEmail': data.email,
            'loginPassword': data.password,
            'signupName': data.fullName,
            'signupEmail': data.email,
            'signupPassword': data.password,
            'confirmPassword': data.confirmPassword
        };

        for (const [id, placeholder] of Object.entries(placeholderMap)) {
            const input = document.getElementById(id);
            if (input && placeholder) {
                input.setAttribute('placeholder', placeholder);
            }
        }
    }

    setupFormSwitching() {
        const authCard = document.getElementById('authCard');
        const switchToSignup = document.getElementById('switchToSignup');
        const switchToLogin = document.getElementById('switchToLogin');

        if (switchToSignup) {
            const newSwitchToSignup = switchToSignup.cloneNode(true);
            switchToSignup.parentNode.replaceChild(newSwitchToSignup, switchToSignup);
            newSwitchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                authCard.classList.add('flipped');
            });
        }
        if (switchToLogin) {
            const newSwitchToLogin = switchToLogin.cloneNode(true);
            switchToLogin.parentNode.replaceChild(newSwitchToLogin, switchToLogin);
            newSwitchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                authCard.classList.remove('flipped');
            });
        }
    }

    setupFormValidation() {
        const loginForm = document.getElementById('loginFormElement');
        const signupForm = document.getElementById('signupFormElement');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit('login');
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Validate password match for signup
                const password = document.getElementById('signupPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (password !== confirmPassword) {
                    this.showError(this.getTranslation('passwordMismatch', 'Passwords do not match'));
                    return;
                }
                
                this.handleFormSubmit('signup');
            });
        }
    }

    getTranslation(key, defaultValue) {
        return this.currentLanguageData[key] || defaultValue;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(244, 67, 54, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    handleFormSubmit(type) {
        const form = document.getElementById(
            type === 'login' ? 'loginFormElement' : 'signupFormElement'
        );
        
        if (!form) {
            console.error("Form not found:", type);
            return;
        }

        const formData = new FormData(form);

        // Ensure correct action flag
        formData.set("action", type);

        const actionUrl = form.getAttribute("action");

        this.showLoading();

        fetch(actionUrl, {
            method: "POST",
            body: formData,
            headers: { "X-CSRFToken": formData.get("csrfmiddlewaretoken") },
        })
        .then(async response => {
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                return response.json();
            } else {
                const text = await response.text();
                throw new Error("Server returned HTML instead of JSON:\n" + text.slice(0, 200));
            }
        })
        .then(data => {
            this.hideLoading();
            if (data.status === "success") {
                this.showSuccessTransition(data.role);
            } else {
                this.showError(data.message || this.getTranslation('errorOccurred', 'An error occurred'));
            }
        })
        .catch(error => {
            this.hideLoading();
            console.error("Form Submit Error:", error);
            this.showError(this.getTranslation('errorOccurred', 'An error occurred: ') + error.message);
        });
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
            
            // Update loading text
            const loadingText = document.getElementById('loadingText');
            if (loadingText) {
                loadingText.textContent = this.getTranslation('loading', 'Loading...');
            }
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    showSuccessTransition(role) {
        const successTransition = document.getElementById('successTransition');
        if (!successTransition) return;

        successTransition.classList.add('show');

        // Update success messages
        const successTitle = document.getElementById('successTitle');
        const successMessage = document.getElementById('successMessage');
        
        if (successTitle) {
            successTitle.textContent = this.getTranslation('successTitle', 'Success!');
        }
        if (successMessage) {
            successMessage.textContent = this.getTranslation('successMessage', 'Redirecting...');
        }

        setTimeout(() => {
            if (role === 'admin') {
                window.location.href = '/de/admin-dashboard/';
            } else if (role === 'learner') {
                window.location.href = '/de/learner-dashboard/';
            }
        }, 2000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const authApp = new CareerNavigatorAuth();
        authApp.init();
    });
} else {
    const authApp = new CareerNavigatorAuth();
    authApp.init();
}