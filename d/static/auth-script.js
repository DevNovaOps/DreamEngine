class CareerNavigatorAuth {
    constructor() {
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
    }

    setupLanguageSelector() {
        const languageBtn = document.getElementById("languageBtn");
        const languageDropdown = document.getElementById("languageDropdown");
        const currentLang = document.querySelector(".current-lang");
        const langOptions = document.querySelectorAll(".lang-option");

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

        // Language select
        langOptions.forEach(option => {
            option.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.currentLanguage = option.dataset.lang;
                this.currentLanguageData = this.allLanguageData[this.currentLanguage];
                currentLang.textContent = option.textContent;

                // Close dropdown
                this.dropdownOpen = false;
                languageDropdown.classList.remove("show");
                languageBtn.setAttribute("aria-expanded", "false");

                this.updateTextContent();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                this.dropdownOpen = false;
                languageDropdown.classList.remove("show");
                languageBtn.setAttribute("aria-expanded", "false");
            }
        });

        // Prevent dropdown clicks from closing it
        languageDropdown.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    updateTextContent() {
        const data = this.currentLanguageData;
        if (!data) return;

        // Update browser tab title
        document.title = data.pageTitle || document.title;

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
        };

        for (const [id, text] of Object.entries(textMap)) {
            const element = document.getElementById(id);
            if (element && text) element.textContent = text;
        }

        // Switch text (safe split on '?')
        if (data.switchToSignup) {
            const [before, after] = data.switchToSignup.split("?");
            document.getElementById('switchToSignupText').innerHTML =
                `${before}? <button type="button" class="switch-btn" id="switchToSignup">${after?.trim() || 'Sign up'}</button>`;
        }

        if (data.switchToLogin) {
            const [before, after] = data.switchToLogin.split("?");
            document.getElementById('switchToLoginText').innerHTML =
                `${before}? <button type="button" class="switch-btn" id="switchToLogin">${after?.trim() || 'Login'}</button>`;
        }

        // Re-setup form switching after innerHTML changes
        this.setupFormSwitching();
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
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit('login');
        });
        document.getElementById('signupFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit('signup');
        });
    }

    handleFormSubmit(type) {
        const form = document.getElementById(
            type === 'login' ? 'loginFormElement' : 'signupFormElement'
        );
        const formData = new FormData(form);

        // Ensure correct action flag
        formData.append("action", type);

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
                alert(data.message || "An error occurred.");
            }
        })
        .catch(error => {
            this.hideLoading();
            console.error("Form Submit Error:", error);
            alert(`An error occurred: ${error.message}`);
        });
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    }

    showSuccessTransition(role) {
        document.getElementById('successTransition').classList.add('show');

        setTimeout(() => {
            if (role === 'admin') {
                window.location.href = '/de/admin-dashboard/';
            } else if (role === 'learner') {
                window.location.href = '/de/learner-dashboard/';
            }
        }, 2000);
    }
}

const authApp = new CareerNavigatorAuth();
authApp.init();