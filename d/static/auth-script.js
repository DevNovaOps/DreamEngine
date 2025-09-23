class CareerNavigatorAuth {
    constructor() {
        this.currentLanguage = 'en';
        this.allLanguageData = JSON.parse(document.getElementById('language-data').textContent);
        this.currentLanguageData = this.allLanguageData[this.currentLanguage];
        this.isFlipped = false;
    }

    init() 
    {
        this.setupLanguageSelector();
        this.setupFormSwitching();
        this.setupFormValidation();
        this.updateTextContent();
    }
    setupLanguageSelector() 
    {
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentLanguage = option.dataset.lang;
                this.currentLanguageData = this.allLanguageData[this.currentLanguage];
                document.querySelector('.current-lang').textContent = option.textContent;
                this.updateTextContent();
            });
        });
    }

updateTextContent() {
    const data = this.currentLanguageData;
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
        if (element && text) element.textContent = text; // Check if text exists
    }
    
    // Check if the signup switch text exists before splitting it
    if (data.switchToSignup) {
        const signupSwitch = data.switchToSignup.split('? ');
        document.getElementById('switchToSignupText').innerHTML = `${signupSwitch[0]}? <button type="button" class="switch-btn" id="switchToSignup">${signupSwitch[1] || 'Sign up'}</button>`;
    }
    
    // Check if the login switch text exists before splitting it
    if (data.switchToLogin) {
        const loginSwitch = data.switchToLogin.split('? ');
        document.getElementById('switchToLoginText').innerHTML = `${loginSwitch[0]}? <button type="button" class="switch-btn" id="switchToLogin">${loginSwitch[1] || 'Login'}</button>`;
    }

    this.setupFormSwitching();
}

setupFormSwitching() {
    const authCard = document.getElementById('authCard');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');

        if (switchToSignup) switchToSignup.addEventListener('click', () => authCard.classList.add('flipped'));
        if (switchToLogin) switchToLogin.addEventListener('click', () => authCard.classList.remove('flipped'));
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

    // ensure correct action flag
    formData.append("action", type);

    const actionUrl = form.getAttribute("action");  // always /auth/

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
            // dump HTML for debugging
            const text = await response.text();
            throw new Error("Server returned HTML instead of JSON:\n" + text.slice(0, 200));
        }
    })
    .then(data => {
    this.hideLoading();
    if (data.status === "success") {
        this.showSuccessTransition(data.role); // works for both login & signup
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
        if(role === 'admin'){
            window.location.href = '/de/admin-dashboard/';
        } else if(role === 'learner'){
            window.location.href = '/de/learner-dashboard/';
        }
    }, 2000);
}
}
const authApp = new CareerNavigatorAuth();
authApp.init();
