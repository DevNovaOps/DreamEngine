// Recommendation Viewer - Interactive JavaScript
class RecommendationViewer {
    constructor() {
        this.currentLanguage = 'en';
        this.currentLanguageData = null;
        this.skills = [];
        this.milestones = [];
        this.achievements = [];
        this.nextSteps = [];
        
        this.init();
    }

    init() {
        this.setupLanguageSelector();
        this.setupModalHandlers();
        this.setupAccessibility();
        this.setupHeaderActions();
        this.loadLanguageData();
        this.generateSampleData();
        this.renderAll();
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
        
        // Re-render all content with new language
        this.renderAll();
    }

    updateTextContent(textData) {
        const elements = {
            pageTitle: document.title,
            navBrand: document.getElementById('navBrand'),
            languageBtn: document.getElementById('languageBtn'),
            recommendationViewerTitle: document.getElementById('recommendationViewerTitle'),
            viewRecommendationsSubtitle: document.getElementById('viewRecommendationsSubtitle'),
            yourPathwayTitle: document.getElementById('yourPathwayTitle'),
            milestonesTitle: document.getElementById('milestonesTitle'),
            achievementsTitle: document.getElementById('achievementsTitle'),
            progressTitle: document.getElementById('progressTitle'),
            recommendedSkillsTitle: document.getElementById('recommendedSkillsTitle'),
            milestonesTimelineTitle: document.getElementById('milestonesTimelineTitle'),
            achievementsGalleryTitle: document.getElementById('achievementsGalleryTitle'),
            nextStepsTitle: document.getElementById('nextStepsTitle'),
            skillLevelTitle: document.getElementById('skillLevelTitle'),
            estimatedTimeTitle: document.getElementById('estimatedTimeTitle'),
            prerequisitesTitle: document.getElementById('prerequisitesTitle'),
            resourcesTitle: document.getElementById('resourcesTitle'),
            startLearningText: document.getElementById('startLearningText'),
            markCompleteText: document.getElementById('markCompleteText'),
            successTitle: document.getElementById('successTitle'),
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
            if (elements.recommendationViewerTitle) elements.recommendationViewerTitle.textContent = textData.recommendationViewer;
            if (elements.viewRecommendationsSubtitle) elements.viewRecommendationsSubtitle.textContent = textData.viewRecommendations;
            
            // Update section titles
            if (elements.yourPathwayTitle) elements.yourPathwayTitle.textContent = textData.yourPathway;
            if (elements.milestonesTitle) elements.milestonesTitle.textContent = textData.milestones;
            if (elements.achievementsTitle) elements.achievementsTitle.textContent = textData.achievements;
            if (elements.progressTitle) elements.progressTitle.textContent = textData.progress;
            if (elements.recommendedSkillsTitle) elements.recommendedSkillsTitle.textContent = textData.recommendedSkills;
            if (elements.milestonesTimelineTitle) elements.milestonesTimelineTitle.textContent = textData.milestones;
            if (elements.achievementsGalleryTitle) elements.achievementsGalleryTitle.textContent = textData.achievements;
            if (elements.nextStepsTitle) elements.nextStepsTitle.textContent = textData.nextSteps;
            
            // Update modal content
            if (elements.skillLevelTitle) elements.skillLevelTitle.textContent = textData.skillLevel;
            if (elements.estimatedTimeTitle) elements.estimatedTimeTitle.textContent = textData.estimatedTime;
            if (elements.prerequisitesTitle) elements.prerequisitesTitle.textContent = textData.prerequisites;
            if (elements.resourcesTitle) elements.resourcesTitle.textContent = textData.resources;
            if (elements.startLearningText) elements.startLearningText.textContent = textData.startLearning;
            if (elements.markCompleteText) elements.markCompleteText.textContent = textData.markComplete;
            
            // Update success modal
            if (elements.successTitle) elements.successTitle.textContent = textData.congratulations;
            if (elements.continueText) elements.continueText.textContent = textData.continueJourney;

            // Fade in effect
            Object.values(elements).forEach(element => {
                if (element) {
                    element.style.opacity = '1';
                }
            });
        }, 300);
    }

    // Modal Handlers
    setupModalHandlers() {
        const modalClose = document.getElementById('modalClose');
        const startLearningBtn = document.getElementById('startLearningBtn');
        const markCompleteBtn = document.getElementById('markCompleteBtn');
        const continueBtn = document.getElementById('continueBtn');

        modalClose.addEventListener('click', () => {
            this.closeSkillModal();
        });

        startLearningBtn.addEventListener('click', () => {
            this.handleStartLearning();
        });

        markCompleteBtn.addEventListener('click', () => {
            this.handleMarkComplete();
        });

        continueBtn.addEventListener('click', () => {
            this.closeSuccessModal();
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            const skillModal = document.getElementById('skillModal');
            const successModal = document.getElementById('successModal');
            
            if (e.target === skillModal) {
                this.closeSkillModal();
            }
            if (e.target === successModal) {
                this.closeSuccessModal();
            }
        });
    }

    // Data Generation
    generateSampleData() {
        this.skills = [
            {
                id: 1,
                title: 'Programming Fundamentals',
                icon: '💻',
                level: 'Beginner',
                time: '2 weeks',
                prerequisites: 'Basic computer knowledge',
                resources: 'Online tutorials',
                progress: 100,
                completed: true,
                current: false
            },
            {
                id: 2,
                title: 'Data Structures & Algorithms',
                icon: '📊',
                level: 'Intermediate',
                time: '1 month',
                prerequisites: 'Programming fundamentals',
                resources: 'Coding bootcamp',
                progress: 80,
                completed: false,
                current: true
            },
            {
                id: 3,
                title: 'Web Development',
                icon: '🌐',
                level: 'Intermediate',
                time: '2 months',
                prerequisites: 'Web development basics',
                resources: 'Project practice',
                progress: 60,
                completed: false,
                current: false
            },
            {
                id: 4,
                title: 'Database Management',
                icon: '🗄️',
                level: 'Intermediate',
                time: '1 month',
                prerequisites: 'Database concepts',
                resources: 'Database courses',
                progress: 40,
                completed: false,
                current: false
            },
            {
                id: 5,
                title: 'API Development',
                icon: '🔌',
                level: 'Advanced',
                time: '2 months',
                prerequisites: 'API understanding',
                resources: 'API documentation',
                progress: 20,
                completed: false,
                current: false
            },
            {
                id: 6,
                title: 'Cloud Computing',
                icon: '☁️',
                level: 'Advanced',
                time: '3 months',
                prerequisites: 'Cloud basics',
                resources: 'Cloud platforms',
                progress: 0,
                completed: false,
                current: false
            },
            {
                id: 7,
                title: 'DevOps',
                icon: '⚙️',
                level: 'Expert',
                time: '3 months',
                prerequisites: 'System administration',
                resources: 'DevOps tools',
                progress: 0,
                completed: false,
                current: false
            },
            {
                id: 8,
                title: 'Machine Learning',
                icon: '🤖',
                level: 'Expert',
                time: '6 months',
                prerequisites: 'Statistics knowledge',
                resources: 'ML frameworks',
                progress: 0,
                completed: false,
                current: false
            }
        ];

        this.milestones = [
            {
                id: 1,
                title: 'Complete Basic Programming',
                icon: '🎯',
                description: 'Master fundamental programming concepts',
                progress: 100,
                completed: true,
                current: false
            },
            {
                id: 2,
                title: 'Build First Web App',
                icon: '🚀',
                description: 'Create a complete web application',
                progress: 60,
                completed: false,
                current: true
            },
            {
                id: 3,
                title: 'Deploy to Cloud',
                icon: '☁️',
                description: 'Deploy applications to cloud platforms',
                progress: 20,
                completed: false,
                current: false
            },
            {
                id: 4,
                title: 'Master Full Stack',
                icon: '🏗️',
                description: 'Become proficient in full-stack development',
                progress: 0,
                completed: false,
                current: false
            },
            {
                id: 5,
                title: 'Become Senior Developer',
                icon: '👑',
                description: 'Lead development teams and projects',
                progress: 0,
                completed: false,
                current: false
            }
        ];

        this.achievements = [
            {
                id: 1,
                title: 'Code Warrior',
                icon: '⚔️',
                description: 'Complete 100 coding challenges',
                unlocked: true
            },
            {
                id: 2,
                title: 'Web Wizard',
                icon: '🧙‍♂️',
                description: 'Build 5 web applications',
                unlocked: true
            },
            {
                id: 3,
                title: 'Cloud Master',
                icon: '☁️',
                description: 'Deploy 3 applications to cloud',
                unlocked: false
            },
            {
                id: 4,
                title: 'Full Stack Hero',
                icon: '🦸‍♂️',
                description: 'Master both frontend and backend',
                unlocked: false
            },
            {
                id: 5,
                title: 'Tech Leader',
                icon: '👑',
                description: 'Lead a development team',
                unlocked: false
            }
        ];

        this.nextSteps = [
            {
                id: 1,
                title: 'Complete Data Structures Course',
                icon: '📚',
                description: 'Finish the current data structures and algorithms course',
                action: 'Continue Learning'
            },
            {
                id: 2,
                title: 'Build Portfolio Project',
                icon: '💼',
                description: 'Create a comprehensive portfolio project',
                action: 'Start Project'
            },
            {
                id: 3,
                title: 'Join Developer Community',
                icon: '👥',
                description: 'Connect with other developers and mentors',
                action: 'Join Now'
            }
        ];
    }

    // Rendering Functions
    renderAll() {
        this.renderSkills();
        this.renderMilestones();
        this.renderAchievements();
        this.renderNextSteps();
    }

    renderSkills() {
        const roadmapPath = document.querySelector('.roadmap-path');
        if (!roadmapPath) return;

        roadmapPath.innerHTML = '';
        
        this.skills.forEach((skill, index) => {
            const skillNode = this.createSkillNode(skill, index);
            roadmapPath.appendChild(skillNode);
            
            // Add connection line (except for last item)
            if (index < this.skills.length - 1) {
                const connection = this.createConnectionLine();
                roadmapPath.appendChild(connection);
            }
        });
    }

    createSkillNode(skill, index) {
        const skillNode = document.createElement('div');
        skillNode.className = `skill-node ${skill.completed ? 'completed' : ''} ${skill.current ? 'current' : ''}`;
        skillNode.innerHTML = `
            <div class="skill-circle">
                <div class="skill-progress"></div>
                <span class="skill-icon">${skill.icon}</span>
            </div>
            <div class="skill-label">${this.getTranslatedSkillTitle(skill.title)}</div>
        `;

        // Add click event
        skillNode.addEventListener('click', () => {
            this.openSkillModal(skill);
        });

        // Add hover effect
        skillNode.addEventListener('mouseenter', () => {
            this.createRippleEffect(skillNode);
        });

        return skillNode;
    }

    createConnectionLine() {
        const connection = document.createElement('div');
        connection.className = 'skill-connection active';
        return connection;
    }

    renderMilestones() {
        const timelinePath = document.querySelector('.timeline-path');
        if (!timelinePath) return;

        timelinePath.innerHTML = '';
        
        this.milestones.forEach(milestone => {
            const timelineItem = this.createTimelineItem(milestone);
            timelinePath.appendChild(timelineItem);
        });
    }

    createTimelineItem(milestone) {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${milestone.completed ? 'completed' : ''} ${milestone.current ? 'current' : ''}`;
        timelineItem.innerHTML = `
            <div class="timeline-marker">${milestone.icon}</div>
            <div class="timeline-content">
                <h4 class="timeline-title">${this.getTranslatedMilestoneTitle(milestone.title)}</h4>
                <p class="timeline-description">${milestone.description}</p>
                <div class="timeline-progress">
                    <div class="timeline-progress-fill" style="width: ${milestone.progress}%"></div>
                </div>
            </div>
        `;

        // Add click event
        timelineItem.addEventListener('click', () => {
            this.showMilestoneDetails(milestone);
        });

        return timelineItem;
    }

    renderAchievements() {
        const achievementsGrid = document.querySelector('.achievements-grid');
        if (!achievementsGrid) return;

        achievementsGrid.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const achievementCard = this.createAchievementCard(achievement);
            achievementsGrid.appendChild(achievementCard);
        });
    }

    createAchievementCard(achievement) {
        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
        achievementCard.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <h4 class="achievement-title">${this.getTranslatedAchievementTitle(achievement.title)}</h4>
            <p class="achievement-description">${achievement.description}</p>
            ${achievement.unlocked ? '<div class="achievement-badge">Unlocked</div>' : ''}
        `;

        // Add click event
        achievementCard.addEventListener('click', () => {
            this.showAchievementDetails(achievement);
        });

        return achievementCard;
    }

    renderNextSteps() {
        const stepsContainer = document.querySelector('.steps-container');
        if (!stepsContainer) return;

        stepsContainer.innerHTML = '';
        
        this.nextSteps.forEach(step => {
            const stepCard = this.createStepCard(step);
            stepsContainer.appendChild(stepCard);
        });
    }

    createStepCard(step) {
        const stepCard = document.createElement('div');
        stepCard.className = 'step-card';
        stepCard.innerHTML = `
            <div class="step-icon">${step.icon}</div>
            <h4 class="step-title">${this.getTranslatedStepTitle(step.title)}</h4>
            <p class="step-description">${step.description}</p>
            <div class="step-actions">
                <button class="step-btn step-btn-primary ripple" onclick="recommendationViewer.handleStepAction('${step.id}')">
                    ${this.getTranslatedActionText(step.action)}
                </button>
            </div>
        `;

        return stepCard;
    }

    // Modal Functions
    openSkillModal(skill) {
        const modal = document.getElementById('skillModal');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalSkillLevel = document.getElementById('modalSkillLevel');
        const modalEstimatedTime = document.getElementById('modalEstimatedTime');
        const modalPrerequisites = document.getElementById('modalPrerequisites');
        const modalResources = document.getElementById('modalResources');

        modalIcon.textContent = skill.icon;
        modalTitle.textContent = this.getTranslatedSkillTitle(skill.title);
        modalSkillLevel.textContent = this.getTranslatedLevel(skill.level);
        modalEstimatedTime.textContent = this.getTranslatedTime(skill.time);
        modalPrerequisites.textContent = this.getTranslatedPrerequisites(skill.prerequisites);
        modalResources.textContent = this.getTranslatedResources(skill.resources);

        modal.classList.add('show');
    }

    closeSkillModal() {
        const modal = document.getElementById('skillModal');
        modal.classList.remove('show');
    }

    showSuccessModal(title, message) {
        const modal = document.getElementById('successModal');
        const successTitle = document.getElementById('successTitle');
        const successMessage = document.getElementById('successMessage');

        successTitle.textContent = title;
        successMessage.textContent = message;

        modal.classList.add('show');
    }

    closeSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('show');
    }

    // Action Handlers
    handleStartLearning() {
        this.showNotification(this.currentLanguageData ? this.currentLanguageData.startLearning : 'Start Learning', 'success');
        this.closeSkillModal();
    }

    handleMarkComplete() {
        this.showNotification(this.currentLanguageData ? this.currentLanguageData.skillMastered : 'Skill Mastered', 'success');
        this.closeSkillModal();
        this.showSuccessModal(
            this.currentLanguageData ? this.currentLanguageData.congratulations : 'Congratulations!',
            this.currentLanguageData ? this.currentLanguageData.skillMastered : 'Skill Mastered'
        );
    }

    handleStepAction(stepId) {
        const step = this.nextSteps.find(s => s.id == stepId);
        if (step) {
            this.showNotification(step.action, 'info');
        }
    }

    showMilestoneDetails(milestone) {
        this.showNotification(milestone.title, 'info');
    }

    showAchievementDetails(achievement) {
        this.showNotification(achievement.title, 'info');
    }

    // Translation Functions
    getTranslatedSkillTitle(title) {
        if (!this.currentLanguageData) return title;
        
        const skillMap = {
            'Programming Fundamentals': this.currentLanguageData.skill1,
            'Data Structures & Algorithms': this.currentLanguageData.skill2,
            'Web Development': this.currentLanguageData.skill3,
            'Database Management': this.currentLanguageData.skill4,
            'API Development': this.currentLanguageData.skill5,
            'Cloud Computing': this.currentLanguageData.skill6,
            'DevOps': this.currentLanguageData.skill7,
            'Machine Learning': this.currentLanguageData.skill8
        };
        
        return skillMap[title] || title;
    }

    getTranslatedMilestoneTitle(title) {
        if (!this.currentLanguageData) return title;
        
        const milestoneMap = {
            'Complete Basic Programming': this.currentLanguageData.milestone1,
            'Build First Web App': this.currentLanguageData.milestone2,
            'Deploy to Cloud': this.currentLanguageData.milestone3,
            'Master Full Stack': this.currentLanguageData.milestone4,
            'Become Senior Developer': this.currentLanguageData.milestone5
        };
        
        return milestoneMap[title] || title;
    }

    getTranslatedAchievementTitle(title) {
        if (!this.currentLanguageData) return title;
        
        const achievementMap = {
            'Code Warrior': this.currentLanguageData.achievement1,
            'Web Wizard': this.currentLanguageData.achievement2,
            'Cloud Master': this.currentLanguageData.achievement3,
            'Full Stack Hero': this.currentLanguageData.achievement4,
            'Tech Leader': this.currentLanguageData.achievement5
        };
        
        return achievementMap[title] || title;
    }

    getTranslatedStepTitle(title) {
        // For next steps, we'll use the title as is for now
        return title;
    }

    getTranslatedLevel(level) {
        if (!this.currentLanguageData) return level;
        
        const levelMap = {
            'Beginner': this.currentLanguageData.level1,
            'Intermediate': this.currentLanguageData.level2,
            'Advanced': this.currentLanguageData.level3,
            'Expert': this.currentLanguageData.level4
        };
        
        return levelMap[level] || level;
    }

    getTranslatedTime(time) {
        if (!this.currentLanguageData) return time;
        
        const timeMap = {
            '2 weeks': this.currentLanguageData.time1,
            '1 month': this.currentLanguageData.time2,
            '2 months': this.currentLanguageData.time3,
            '3 months': this.currentLanguageData.time4,
            '6 months': this.currentLanguageData.time5
        };
        
        return timeMap[time] || time;
    }

    getTranslatedPrerequisites(prereq) {
        if (!this.currentLanguageData) return prereq;
        
        const prereqMap = {
            'Basic computer knowledge': this.currentLanguageData.prereq1,
            'Programming fundamentals': this.currentLanguageData.prereq2,
            'Web development basics': this.currentLanguageData.prereq3,
            'Database concepts': this.currentLanguageData.prereq4,
            'API understanding': this.currentLanguageData.prereq5,
            'Cloud basics': this.currentLanguageData.prereq6,
            'System administration': this.currentLanguageData.prereq7,
            'Statistics knowledge': this.currentLanguageData.prereq8
        };
        
        return prereqMap[prereq] || prereq;
    }

    getTranslatedResources(resource) {
        if (!this.currentLanguageData) return resource;
        
        const resourceMap = {
            'Online tutorials': this.currentLanguageData.resource1,
            'Coding bootcamp': this.currentLanguageData.resource2,
            'Project practice': this.currentLanguageData.resource3,
            'Database courses': this.currentLanguageData.resource4,
            'API documentation': this.currentLanguageData.resource5,
            'Cloud platforms': this.currentLanguageData.resource6,
            'DevOps tools': this.currentLanguageData.resource7,
            'ML frameworks': this.currentLanguageData.resource8
        };
        
        return resourceMap[resource] || resource;
    }

    getTranslatedActionText(action) {
        if (!this.currentLanguageData) return action;
        
        const actionMap = {
            'Continue Learning': this.currentLanguageData.startLearning,
            'Start Project': this.currentLanguageData.startLearning,
            'Join Now': this.currentLanguageData.startLearning
        };
        
        return actionMap[action] || action;
    }

    // Utility Functions
    createRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.left + rect.width / 2 - size / 2;
        const y = rect.top + rect.height / 2 - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
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
        skipLink.href = '#viewer-container';
        skipLink.textContent = 'Skip to recommendation viewer content';
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
        // Show confirmation dialog
        const confirmLogout = confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            // Clear any stored user data
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            sessionStorage.clear();
            
            // Show logout notification
            this.showNotification('Logging out...', 'info');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'auth.html';
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
let recommendationViewer;
document.addEventListener('DOMContentLoaded', () => {
    recommendationViewer = new RecommendationViewer();
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
