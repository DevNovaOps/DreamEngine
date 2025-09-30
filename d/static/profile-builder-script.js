// Profile Builder - Interactive JavaScript
class ProfileBuilder {
    constructor() {
        this.currentLanguage = 'en';
        this.currentLanguageData = null;
        this.currentStep = 1;
        this.totalSteps = 5;
        this.formData = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            location: '',
            education: '',
            skills: [],
            experience: '',
            preferences: ''
        };
        this.autoSaveTimeout = null;
        
        this.init();
    }

    init() {
        this.setupLanguageSelector();
        this.setupFormValidation();
        this.setupStepNavigation();
        this.setupSkillsManagement();
        this.setupAutoSave();
        this.setupAccessibility();
        this.setupHeaderActions();
        this.loadLanguageData();
        this.updateProgress();
        this.loadProfile();
    }
    changeLanguage(lang, textData) {
    this.currentLanguage = lang;
    this.currentLanguageData = textData;
    
    // Save language preference to backend
    this.saveLanguagePreference(lang);
    
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
    
    // Announce language change to screen reader
    this.announceToScreenReader(`Language changed to ${langNames[lang]}`);
}

// Add this new method to save language preference
saveLanguagePreference(lang) {
    fetch('/api/set-language/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRF_TOKEN
        },
        body: JSON.stringify({ language: lang })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Language preference saved:', lang);
    })
    .catch(err => {
        console.error('Error saving language preference:', err);
    });
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
            navBrand: document.getElementById('navBrand'),
            languageBtn: document.getElementById('languageBtn'),
            profileBuilderTitle: document.getElementById('profileBuilderTitle'),
            buildProfileSubtitle: document.getElementById('buildProfileSubtitle'),
            step1Title: document.getElementById('step1Title'),
            step2Title: document.getElementById('step2Title'),
            step3Title: document.getElementById('step3Title'),
            step4Title: document.getElementById('step4Title'),
            step5Title: document.getElementById('step5Title'),
            firstNameLabel: document.getElementById('firstNameLabel'),
            lastNameLabel: document.getElementById('lastNameLabel'),
            emailLabel: document.getElementById('emailLabel'),
            phoneLabel: document.getElementById('phoneLabel'),
            locationLabel: document.getElementById('locationLabel'),
            educationLabel: document.getElementById('educationLabel'),
            skillsLabel: document.getElementById('skillsLabel'),
            experienceLabel: document.getElementById('experienceLabel'),
            preferencesLabel: document.getElementById('preferencesLabel'),
            addSkillText: document.getElementById('addSkillText'),
            nextText: document.getElementById('nextText'),
            previousText: document.getElementById('previousText'),
            saveText: document.getElementById('saveText'),
            saveTextIndicator: document.getElementById('saveText'),
            successTitle: document.getElementById('successTitle'),
            successMessage: document.getElementById('successMessage'),
            continueText: document.getElementById('continueText')
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
            
            // Update main titles
            if (elements.profileBuilderTitle) elements.profileBuilderTitle.textContent = textData.profileBuilder;
            if (elements.buildProfileSubtitle) elements.buildProfileSubtitle.textContent = textData.buildProfile;
            
            // Update step titles
            if (elements.step1Title) elements.step1Title.textContent = textData.step1;
            if (elements.step2Title) elements.step2Title.textContent = textData.step2;
            if (elements.step3Title) elements.step3Title.textContent = textData.step3;
            if (elements.step4Title) elements.step4Title.textContent = textData.step4;
            if (elements.step5Title) elements.step5Title.textContent = textData.step5;
            
            // Update form labels
            if (elements.firstNameLabel) elements.firstNameLabel.textContent = textData.firstName;
            if (elements.lastNameLabel) elements.lastNameLabel.textContent = textData.lastName;
            if (elements.emailLabel) elements.emailLabel.textContent = textData.email;
            if (elements.phoneLabel) elements.phoneLabel.textContent = textData.phone;
            if (elements.locationLabel) elements.locationLabel.textContent = textData.location;
            if (elements.educationLabel) elements.educationLabel.textContent = textData.education;
            if (elements.skillsLabel) elements.skillsLabel.textContent = textData.skills;
            if (elements.experienceLabel) elements.experienceLabel.textContent = textData.experience;
            if (elements.preferencesLabel) elements.preferencesLabel.textContent = textData.preferences;
            
            // Update buttons
            if (elements.addSkillText) elements.addSkillText.textContent = textData.addSkill;
            if (elements.nextText) elements.nextText.textContent = textData.next;
            if (elements.previousText) elements.previousText.textContent = textData.previous;
            if (elements.saveText) elements.saveText.textContent = textData.save;
            if (elements.saveTextIndicator) elements.saveTextIndicator.textContent = textData.autoSave;
            
            // Update success modal
            if (elements.successTitle) elements.successTitle.textContent = textData.profileComplete;
            if (elements.successMessage) elements.successMessage.textContent = textData.profileSaved;
            if (elements.continueText) elements.continueText.textContent = textData.continueLearning;

            // Update placeholders
            this.updatePlaceholders(textData);

            // Fade in effect
            Object.values(elements).forEach(element => {
                if (element) {
                    element.style.opacity = '1';
                }
            });
        }, 300);
    }

    updatePlaceholders(textData) {
        const skillInput = document.getElementById('skillInput');
        const experienceTextarea = document.getElementById('experience');
        const preferencesTextarea = document.getElementById('preferences');
        
        if (skillInput) skillInput.placeholder = textData.skillPlaceholder;
        if (experienceTextarea) experienceTextarea.placeholder = textData.experiencePlaceholder;
        if (preferencesTextarea) preferencesTextarea.placeholder = textData.preferencesPlaceholder;
    }

    // Form Validation
    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
                this.triggerAutoSave();
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (!value) {
            isValid = false;
            switch(fieldId) {
                case 'firstName':
                    errorMessage = this.currentLanguageData ? this.currentLanguageData.firstNameRequired : 'First name is required';
                    break;
                case 'lastName':
                    errorMessage = this.currentLanguageData ? this.currentLanguageData.lastNameRequired : 'Last name is required';
                    break;
                case 'email':
                    errorMessage = this.currentLanguageData ? this.currentLanguageData.emailRequired : 'Email is required';
                    break;
                case 'phone':
                    errorMessage = this.currentLanguageData ? this.currentLanguageData.phoneRequired : 'Phone number is required';
                    break;
                case 'location':
                    errorMessage = this.currentLanguageData ? this.currentLanguageData.locationRequired : 'Location is required';
                    break;
                case 'education':
                    errorMessage = this.currentLanguageData ? this.currentLanguageData.educationRequired : 'Education level is required';
                    break;
                case 'experience':
                    errorMessage = this.currentLanguageData ? this.currentLanguageData.experienceRequired : 'Work experience is required';
                    break;
                case 'preferences':
                    errorMessage = this.currentLanguageData ? this.currentLanguageData.preferencesRequired : 'Career preferences are required';
                    break;
            }
        }

        // Email validation
        if (fieldId === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = this.currentLanguageData ? this.currentLanguageData.invalidEmail : 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (fieldId === 'phone' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = this.currentLanguageData ? this.currentLanguageData.invalidPhone : 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff6b9d;
            font-size: 0.75rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease;
        `;
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = '#ff6b9d';
    }

    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }

    // Step Navigation
    setupStepNavigation() {
        const nextBtn = document.getElementById('nextBtn');
        const previousBtn = document.getElementById('previousBtn');
        const saveBtn = document.getElementById('saveBtn');

        nextBtn.addEventListener('click', () => {
            this.nextStep();
        });

        previousBtn.addEventListener('click', () => {
            this.previousStep();
        });

        saveBtn.addEventListener('click', () => {
            this.saveProfile();
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                this.updateProgress();
                this.updateNavigationButtons();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        const inputs = currentStepElement.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        let allValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        // Special validation for skills
        if (this.currentStep === 2) {
            if (this.formData.skills.length === 0) {
                allValid = false;
                const skillsSection = document.querySelector('.skills-section');
                if (skillsSection) {
                    const errorElement = document.createElement('div');
                    errorElement.className = 'field-error';
                    errorElement.textContent = this.currentLanguageData ? this.currentLanguageData.skillsRequired : 'Please add at least one skill';
                    errorElement.style.cssText = `
                        color: #ff6b9d;
                        font-size: 0.75rem;
                        margin-top: 0.25rem;
                        animation: fadeIn 0.3s ease;
                    `;
                    skillsSection.appendChild(errorElement);
                }
            }
        }

        return allValid;
    }

    saveCurrentStepData() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        const inputs = currentStepElement.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        inputs.forEach(input => {
            this.formData[input.id] = input.value.trim();
        });
    }

    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'prev');
        });

        // Show current step
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        currentStepElement.classList.add('active');

        // Show previous step with prev class for animation
        if (this.currentStep > 1) {
            const prevStepElement = document.getElementById(`step${this.currentStep - 1}`);
            prevStepElement.classList.add('prev');
        }

        // Load data into current step
        this.loadStepData();
    }

    loadStepData() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        const inputs = currentStepElement.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        inputs.forEach(input => {
            if (this.formData[input.id] !== undefined) {
                input.value = this.formData[input.id];
            }
        });

        // Special handling for skills
        if (this.currentStep === 2) {
            this.updateSkillsDisplay();
        }

        // Special handling for review step
        if (this.currentStep === 5) {
            this.updateReviewContent();
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const percentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
        
        if (progressText) {
            progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    }

    updateNavigationButtons() {
        const nextBtn = document.getElementById('nextBtn');
        const previousBtn = document.getElementById('previousBtn');
        const saveBtn = document.getElementById('saveBtn');

        // Update previous button
        previousBtn.disabled = this.currentStep === 1;

        // Update next/save button
        if (this.currentStep === this.totalSteps) {
            nextBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
        }
    }

    // Skills Management
    setupSkillsManagement() {
        const addSkillBtn = document.getElementById('addSkillBtn');
        const skillInput = document.getElementById('skillInput');

        addSkillBtn.addEventListener('click', () => {
            this.addSkill();
        });

        skillInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addSkill();
            }
        });
    }

    addSkill() {
        const skillInput = document.getElementById('skillInput');
        const skill = skillInput.value.trim();
        
        if (skill && !this.formData.skills.includes(skill)) {
            this.formData.skills.push(skill);
            skillInput.value = '';
            this.updateSkillsDisplay();
            this.triggerAutoSave();
        }
    }

    removeSkill(skill) {
        this.formData.skills = this.formData.skills.filter(s => s !== skill);
        this.updateSkillsDisplay();
        this.triggerAutoSave();
    }

    updateSkillsDisplay() {
        const skillsList = document.getElementById('skillsList');
        if (!skillsList) return;

        skillsList.innerHTML = '';
        
        this.formData.skills.forEach(skill => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                <span>${skill}</span>
                <button class="remove-skill-btn" onclick="profileBuilder.removeSkill('${skill}')">
                    ×
                </button>
            `;
            skillsList.appendChild(skillTag);
        });
    }

    // Auto-save
    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            this.autoSave();
        }, 30000);
    }

    triggerAutoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.autoSave();
        }, 2000);
    }

autoSave() {
    this.showAutoSaveIndicator();
    
   
    const saveData = {
        ...this.formData,
        language: this.currentLanguage
    };

    fetch(SAVE_PROFILE_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRF_TOKEN
        },
        body: JSON.stringify(saveData)
    })
    .then(res => res.json())
    .then(data => {
        this.hideAutoSaveIndicator();
        if (data.status === 'success') {
            console.log('Profile auto-saved:', this.formData);
        } else {
            console.error('Auto-save failed:', data.message);
        }
    })
    .catch(err => {
        console.error('Auto-save error:', err);
        this.hideAutoSaveIndicator();
    });
}

    showAutoSaveIndicator() {
        const indicator = document.getElementById('autoSaveIndicator');
        indicator.classList.add('show');
    }

    hideAutoSaveIndicator() {
        const indicator = document.getElementById('autoSaveIndicator');
        indicator.classList.remove('show');
    }

   async saveProfile() {
    try {
        const saveData = {
            ...this.formData,
            language: this.currentLanguage
        };
        
        const response = await fetch(SAVE_PROFILE_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': CSRF_TOKEN
            },
            body: JSON.stringify(saveData)
        });
        const data = await response.json();

        if (data.status === "success") {
            this.showSuccessModal();
        } else {
            this.showErrorModal(data.message || 'Error saving profile');
        }
    } catch (error) {
        console.error('Save profile error:', error);
        const errorMsg = this.currentLanguageData?.saveFailed || 'Unable to save profile. Try again.';
        this.showErrorModal(errorMsg);
    }
}
async loadProfile() {
    try {
        const response = await fetch(LOAD_PROFILE_URL, {
            method: 'GET',
            headers: { 'X-CSRFToken': CSRF_TOKEN },
        });

        const data = await response.json();
        console.log('Loaded profile data:', data);

        if (data.status === "empty") {
            console.log('No profile found yet, starting fresh.');
            // Set language if provided
            if (data.language) {
                this.setLanguageFromBackend(data.language);
            }
            return;
        }

        if (data.status === "error") {
            console.error('Error loading profile:', data.message);
            return;
        }

        // Set language preference if provided
        if (data.language && data.language !== this.currentLanguage) {
            this.setLanguageFromBackend(data.language);
        }

        // Normalize skills to array
        let skills = data.skills || [];
        if (!Array.isArray(skills)) {
            try {
                skills = JSON.parse(skills);
            } catch (e) {
                skills = [];
            }
        }

        // Populate formData with loaded profile
        this.formData = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            education: data.education || '',
            skills: skills,
            experience: data.experience || '',
            preferences: data.preferences || ''
        };

        // Set to first step
        this.currentStep = 1;

        // Update all steps on UI
        this.updateStepDisplay();
        this.updateSkillsDisplay();
        this.updateNavigationButtons();

        console.log('Profile successfully loaded.');
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}
setLanguageFromBackend(lang) {
    // Find the language option element
    const langOption = document.querySelector(`.lang-option[data-lang="${lang}"]`);
    if (langOption) {
        const textData = JSON.parse(langOption.dataset.text);
        this.changeLanguage(lang, textData);
    }
}

// Add error modal method
showErrorModal(message) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('errorModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'errorModal';
        modal.className = 'success-modal'; // Reuse same styling
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-icon" style="background: #ff6b9d;">✗</div>
                <h3 class="success-title" id="errorTitle">Error</h3>
                <p class="success-message" id="errorMessage"></p>
                <button class="continue-btn ripple" id="errorCloseBtn">
                    <span>Close</span>
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('errorCloseBtn').addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    // Update message and show
    document.getElementById('errorMessage').textContent = message;
    modal.classList.add('show');
}

  showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.add('show');
        
        const continueBtn = document.getElementById('continueBtn');
        continueBtn.addEventListener('click', () => {
             window.location.href = "/de/learner-dashboard/";
        });
    }

    // Review Content
    updateReviewContent() {
        const reviewContent = document.getElementById('reviewContent');
        if (!reviewContent) return;

        reviewContent.innerHTML = `
            <div class="review-section">
                <h4 class="review-section-title">Personal Information</h4>
                <div class="review-item">
                    <span class="review-label">Name:</span>
                    <span class="review-value">${this.formData.firstName} ${this.formData.lastName}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Email:</span>
                    <span class="review-value">${this.formData.email}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Phone:</span>
                    <span class="review-value">${this.formData.phone}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Location:</span>
                    <span class="review-value">${this.formData.location}</span>
                </div>
            </div>
            
            <div class="review-section">
                <h4 class="review-section-title">Education & Skills</h4>
                <div class="review-item">
                    <span class="review-label">Education:</span>
                    <span class="review-value">${this.formData.education}</span>
                </div>
                <div class="review-item">
                    <span class="review-label">Skills:</span>
                    <span class="review-value">${this.formData.skills.join(', ')}</span>
                </div>
            </div>
            
            <div class="review-section">
                <h4 class="review-section-title">Experience</h4>
                <div class="review-item">
                    <span class="review-label">Work Experience:</span>
                    <span class="review-value">${this.formData.experience}</span>
                </div>
            </div>
            
            <div class="review-section">
                <h4 class="review-section-title">Preferences</h4>
                <div class="review-item">
                    <span class="review-label">Career Preferences:</span>
                    <span class="review-value">${this.formData.preferences}</span>
                </div>
            </div>
        `;
    }
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
        skipLink.href = '#profile-builder-container';
        skipLink.textContent = 'Skip to profile builder content';
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

    // Header Actions
    setupHeaderActions() {
        const backBtn = document.getElementById('backBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        // Back button functionality
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.handleBackButton();
            });
        }

        // Logout button functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }

    handleBackButton() {
        // Check if there's a previous page in history
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // If no history, go to dashboard
            window.location.href = 'learner-dashboard.html';
        }
    }

handleLogout() {
    const confirmMsg = this.currentLanguageData?.logoutConfirm || 'Are you sure you want to logout?';
    const confirmLogout = confirm(confirmMsg);
    
    if (confirmLogout) {
        // Clear any stored user data
        sessionStorage.clear();
        
        // Show logout notification
        const logoutMsg = this.currentLanguageData?.loggingOut || 'Logging out...';
        this.showNotification(logoutMsg, 'info');
        
        // Redirect to logout URL
        setTimeout(() => {
            window.location.href = '/logout/';
        }, 1500);
    }
}
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--neon-green)' : type === 'error' ? 'var(--neon-pink)' : 'var(--neon-blue)'};
            color: var(--background-black);
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-glow);
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

// CSS for animations (injected dynamically)
const animationCSS = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
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
let profileBuilder;
document.addEventListener('DOMContentLoaded', () => {
    profileBuilder = new ProfileBuilder();
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
