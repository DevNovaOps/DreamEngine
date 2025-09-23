// Career Explorer - Interactive JavaScript
class CareerExplorer {
    constructor() {
        this.currentLanguage = 'en';
        this.currentLanguageData = null;
        this.allItems = [];
        this.filteredItems = [];
        this.currentFilters = {
            type: 'all',
            levels: [],
            sectors: []
        };
        
        this.init();
    }

    init() {
        this.setupLanguageSelector();
        this.setupSearchFunctionality();
        this.setupFilterFunctionality();
        this.setupCardInteractions();
        this.setupAccessibility();
        this.setupHeaderActions();
        this.loadLanguageData();
        this.generateSampleData();
        this.displayItems();
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
        
        // Regenerate and display items with new language
        this.displayItems();
    }

    updateTextContent(textData) {
        const elements = {
            pageTitle: document.title,
            navBrand: document.getElementById('navBrand'),
            languageBtn: document.getElementById('languageBtn'),
            careerExplorerTitle: document.getElementById('careerExplorerTitle'),
            exploreCareersSubtitle: document.getElementById('exploreCareersSubtitle'),
            searchInput: document.getElementById('searchInput'),
            filterByTitle: document.getElementById('filterByTitle'),
            allText: document.getElementById('allText'),
            coursesText: document.getElementById('coursesText'),
            jobsText: document.getElementById('jobsText'),
            typeLabel: document.getElementById('typeLabel'),
            levelLabel: document.getElementById('levelLabel'),
            sectorLabel: document.getElementById('sectorLabel'),
            level1Text: document.getElementById('level1Text'),
            level2Text: document.getElementById('level2Text'),
            level3Text: document.getElementById('level3Text'),
            level4Text: document.getElementById('level4Text'),
            level5Text: document.getElementById('level5Text'),
            level6Text: document.getElementById('level6Text'),
            sector1Text: document.getElementById('sector1Text'),
            sector2Text: document.getElementById('sector2Text'),
            sector3Text: document.getElementById('sector3Text'),
            sector4Text: document.getElementById('sector4Text'),
            resultsTitle: document.getElementById('resultsTitle'),
            loadingText: document.getElementById('loadingText'),
            noResultsTitle: document.getElementById('noResultsTitle'),
            noResultsMessage: document.getElementById('noResultsMessage')
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
            if (elements.careerExplorerTitle) elements.careerExplorerTitle.textContent = textData.careerExplorer;
            if (elements.exploreCareersSubtitle) elements.exploreCareersSubtitle.textContent = textData.exploreCareers;
            
            // Update search placeholder
            if (elements.searchInput) elements.searchInput.placeholder = textData.searchPlaceholder;
            
            // Update filter labels
            if (elements.filterByTitle) elements.filterByTitle.textContent = textData.filterBy;
            if (elements.allText) elements.allText.textContent = textData.all;
            if (elements.coursesText) elements.coursesText.textContent = textData.courses;
            if (elements.jobsText) elements.jobsText.textContent = textData.jobs;
            if (elements.typeLabel) elements.typeLabel.textContent = textData.filterBy;
            if (elements.levelLabel) elements.levelLabel.textContent = textData.level;
            if (elements.sectorLabel) elements.sectorLabel.textContent = textData.sector;
            
            // Update level texts
            if (elements.level1Text) elements.level1Text.textContent = textData.level1;
            if (elements.level2Text) elements.level2Text.textContent = textData.level2;
            if (elements.level3Text) elements.level3Text.textContent = textData.level3;
            if (elements.level4Text) elements.level4Text.textContent = textData.level4;
            if (elements.level5Text) elements.level5Text.textContent = textData.level5;
            if (elements.level6Text) elements.level6Text.textContent = textData.level6;
            
            // Update sector texts
            if (elements.sector1Text) elements.sector1Text.textContent = textData.sector1;
            if (elements.sector2Text) elements.sector2Text.textContent = textData.sector2;
            if (elements.sector3Text) elements.sector3Text.textContent = textData.sector3;
            if (elements.sector4Text) elements.sector4Text.textContent = textData.sector4;
            
            // Update results section
            if (elements.resultsTitle) elements.resultsTitle.textContent = textData.courses;
            if (elements.loadingText) elements.loadingText.textContent = textData.loading;
            if (elements.noResultsTitle) elements.noResultsTitle.textContent = textData.noResults;
            if (elements.noResultsMessage) elements.noResultsMessage.textContent = textData.tryDifferentSearch;

            // Fade in effect
            Object.values(elements).forEach(element => {
                if (element) {
                    element.style.opacity = '1';
                }
            });
        }, 300);
    }

    // Search Functionality
    setupSearchFunctionality() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        searchBtn.addEventListener('click', () => {
            this.handleSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(e.target.value);
            }
        });
    }

    handleSearch(query) {
        this.showLoading();
        
        setTimeout(() => {
            this.filterItems(query);
            this.displayItems();
        }, 500);
    }

    // Filter Functionality
    setupFilterFunctionality() {
        // Type filters
        const filterAll = document.getElementById('filterAll');
        const filterCourses = document.getElementById('filterCourses');
        const filterJobs = document.getElementById('filterJobs');

        filterAll.addEventListener('change', () => {
            if (filterAll.checked) {
                filterCourses.checked = false;
                filterJobs.checked = false;
                this.currentFilters.type = 'all';
            }
            this.applyFilters();
        });

        filterCourses.addEventListener('change', () => {
            if (filterCourses.checked) {
                filterAll.checked = false;
                this.currentFilters.type = 'courses';
            }
            this.applyFilters();
        });

        filterJobs.addEventListener('change', () => {
            if (filterJobs.checked) {
                filterAll.checked = false;
                this.currentFilters.type = 'jobs';
            }
            this.applyFilters();
        });

        // Level filters
        const levelCheckboxes = document.querySelectorAll('input[id^="level"]');
        levelCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateLevelFilters();
                this.applyFilters();
            });
        });

        // Sector filters
        const sectorCheckboxes = document.querySelectorAll('input[id^="sector"]');
        sectorCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSectorFilters();
                this.applyFilters();
            });
        });
    }

    updateLevelFilters() {
        this.currentFilters.levels = [];
        const levelCheckboxes = document.querySelectorAll('input[id^="level"]:checked');
        levelCheckboxes.forEach(checkbox => {
            this.currentFilters.levels.push(checkbox.value);
        });
    }

    updateSectorFilters() {
        this.currentFilters.sectors = [];
        const sectorCheckboxes = document.querySelectorAll('input[id^="sector"]:checked');
        sectorCheckboxes.forEach(checkbox => {
            this.currentFilters.sectors.push(checkbox.value);
        });
    }

    applyFilters() {
        this.showLoading();
        
        setTimeout(() => {
            this.filterItems();
            this.displayItems();
        }, 300);
    }

    filterItems(searchQuery = '') {
        this.filteredItems = this.allItems.filter(item => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch = item.title.toLowerCase().includes(query) ||
                                    item.description.toLowerCase().includes(query) ||
                                    item.skills.some(skill => skill.toLowerCase().includes(query));
                if (!matchesSearch) return false;
            }

            // Type filter
            if (this.currentFilters.type !== 'all') {
                if (this.currentFilters.type === 'courses' && item.type !== 'course') return false;
                if (this.currentFilters.type === 'jobs' && item.type !== 'job') return false;
            }

            // Level filter
            if (this.currentFilters.levels.length > 0) {
                if (!this.currentFilters.levels.includes(item.level.toString())) return false;
            }

            // Sector filter
            if (this.currentFilters.sectors.length > 0) {
                if (!this.currentFilters.sectors.includes(item.sector)) return false;
            }

            return true;
        });
    }

    // Card Interactions
    setupCardInteractions() {
        // This will be called after cards are created
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

    // Data Generation
    generateSampleData() {
        this.allItems = [
            {
                id: 1,
                type: 'course',
                title: 'Software Development',
                description: 'Learn modern software development practices',
                level: 4,
                sector: 'IT',
                duration: '6 months',
                skills: ['Programming', 'Web Development', 'Database'],
                certification: 'NSQF Level 4',
                icon: '💻'
            },
            {
                id: 2,
                type: 'job',
                title: 'Software Engineer',
                description: 'Develop and maintain software applications',
                level: 5,
                sector: 'IT',
                salary: '₹5-8 LPA',
                requirements: 'Bachelor degree',
                skills: ['Programming', 'Problem Solving', 'Teamwork'],
                icon: '👨‍💻'
            },
            {
                id: 3,
                type: 'course',
                title: 'Data Analytics',
                description: 'Master data analysis and visualization',
                level: 5,
                sector: 'IT',
                duration: '1 year',
                skills: ['Data Analysis', 'Statistics', 'Visualization'],
                certification: 'NSQF Level 5',
                icon: '📊'
            },
            {
                id: 4,
                type: 'job',
                title: 'Data Scientist',
                description: 'Analyze complex data to drive business decisions',
                level: 6,
                sector: 'IT',
                salary: '₹8-12 LPA',
                requirements: 'Master degree',
                skills: ['Machine Learning', 'Statistics', 'Python'],
                icon: '🔬'
            },
            {
                id: 5,
                type: 'course',
                title: 'Digital Marketing',
                description: 'Learn digital marketing strategies and tools',
                level: 3,
                sector: 'IT',
                duration: '3 months',
                skills: ['SEO', 'Social Media', 'Content Marketing'],
                certification: 'NSQF Level 3',
                icon: '📱'
            },
            {
                id: 6,
                type: 'job',
                title: 'Digital Marketer',
                description: 'Create and execute digital marketing campaigns',
                level: 4,
                sector: 'IT',
                salary: '₹3-5 LPA',
                requirements: 'High school diploma',
                skills: ['Marketing', 'Analytics', 'Creativity'],
                icon: '📈'
            },
            {
                id: 7,
                type: 'course',
                title: 'Cybersecurity',
                description: 'Protect systems and networks from cyber threats',
                level: 6,
                sector: 'IT',
                duration: '1 year',
                skills: ['Security', 'Networking', 'Ethical Hacking'],
                certification: 'NSQF Level 6',
                icon: '🔒'
            },
            {
                id: 8,
                type: 'job',
                title: 'Cybersecurity Analyst',
                description: 'Monitor and protect against security threats',
                level: 7,
                sector: 'IT',
                salary: '₹12-20 LPA',
                requirements: 'Professional experience',
                skills: ['Security Analysis', 'Risk Assessment', 'Incident Response'],
                icon: '🛡️'
            },
            {
                id: 9,
                type: 'course',
                title: 'Cloud Computing',
                description: 'Master cloud platforms and services',
                level: 5,
                sector: 'IT',
                duration: '6 months',
                skills: ['AWS', 'Azure', 'DevOps'],
                certification: 'NSQF Level 5',
                icon: '☁️'
            },
            {
                id: 10,
                type: 'job',
                title: 'Cloud Architect',
                description: 'Design and implement cloud solutions',
                level: 8,
                sector: 'IT',
                salary: '₹20+ LPA',
                requirements: 'Master degree',
                skills: ['Cloud Architecture', 'System Design', 'Leadership'],
                icon: '🏗️'
            },
            {
                id: 11,
                type: 'course',
                title: 'AI & Machine Learning',
                description: 'Build intelligent systems and algorithms',
                level: 7,
                sector: 'IT',
                duration: '2 years',
                skills: ['Machine Learning', 'Deep Learning', 'Python'],
                certification: 'NSQF Level 7',
                icon: '🤖'
            },
            {
                id: 12,
                type: 'job',
                title: 'AI Engineer',
                description: 'Develop AI solutions and machine learning models',
                level: 9,
                sector: 'IT',
                salary: '₹20+ LPA',
                requirements: 'PhD preferred',
                skills: ['AI Research', 'Model Development', 'Algorithm Design'],
                icon: '🧠'
            }
        ];

        this.filteredItems = [...this.allItems];
    }

    // Display Items
    displayItems() {
        const cardsGrid = document.getElementById('cardsGrid');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const noResults = document.getElementById('noResults');
        const resultsCount = document.getElementById('resultsCount');

        // Hide loading
        loadingIndicator.classList.remove('show');

        if (this.filteredItems.length === 0) {
            cardsGrid.classList.remove('show');
            noResults.classList.add('show');
            resultsCount.textContent = '0 results';
        } else {
            noResults.classList.remove('show');
            resultsCount.textContent = `${this.filteredItems.length} results`;
            
            // Generate cards
            cardsGrid.innerHTML = '';
            this.filteredItems.forEach(item => {
                const card = this.createCard(item);
                cardsGrid.appendChild(card);
            });
            
            cardsGrid.classList.add('show');
        }
    }

    createCard(item) {
        const card = document.createElement('div');
        card.className = 'flip-card';
        card.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="card-type">${item.type === 'course' ? (this.currentLanguageData ? this.currentLanguageData.courses : 'Course') : (this.currentLanguageData ? this.currentLanguageData.jobs : 'Job')}</div>
                    <div class="card-icon">${item.icon}</div>
                    <h3 class="card-title">${this.getTranslatedTitle(item)}</h3>
                    <p class="card-subtitle">${item.description}</p>
                    <div class="card-level">${this.currentLanguageData ? this.currentLanguageData[`level${item.level}`] : `Level ${item.level}`}</div>
                </div>
                <div class="flip-card-back">
                    <div class="card-details">
                        <div class="card-detail-item">
                            <span class="card-detail-label">${this.currentLanguageData ? this.currentLanguageData.sector : 'Sector'}:</span>
                            <span class="card-detail-value">${this.getTranslatedSector(item.sector)}</span>
                        </div>
                        ${item.duration ? `
                        <div class="card-detail-item">
                            <span class="card-detail-label">${this.currentLanguageData ? this.currentLanguageData.duration : 'Duration'}:</span>
                            <span class="card-detail-value">${this.getTranslatedDuration(item.duration)}</span>
                        </div>
                        ` : ''}
                        ${item.salary ? `
                        <div class="card-detail-item">
                            <span class="card-detail-label">${this.currentLanguageData ? this.currentLanguageData.salary : 'Salary'}:</span>
                            <span class="card-detail-value">${item.salary}</span>
                        </div>
                        ` : ''}
                        ${item.requirements ? `
                        <div class="card-detail-item">
                            <span class="card-detail-label">${this.currentLanguageData ? this.currentLanguageData.requirements : 'Requirements'}:</span>
                            <span class="card-detail-value">${this.getTranslatedRequirements(item.requirements)}</span>
                        </div>
                        ` : ''}
                        ${item.certification ? `
                        <div class="card-detail-item">
                            <span class="card-detail-label">${this.currentLanguageData ? this.currentLanguageData.certification : 'Certification'}:</span>
                            <span class="card-detail-value">${this.getTranslatedCertification(item.certification)}</span>
                        </div>
                        ` : ''}
                        <div class="card-skills">
                            <div class="card-skills-title">${this.currentLanguageData ? this.currentLanguageData.skills : 'Skills'}:</div>
                            <div class="card-skills-list">
                                ${item.skills.map(skill => `<span class="card-skill-tag">${this.getTranslatedSkill(skill)}</span>`).join('')}
                            </div>
                        </div>
                        <div class="card-actions">
                            <button class="card-btn card-btn-primary ripple" onclick="careerExplorer.handleApply('${item.id}')">
                                ${this.currentLanguageData ? this.currentLanguageData.applyNow : 'Apply Now'}
                            </button>
                            <button class="card-btn card-btn-secondary ripple" onclick="careerExplorer.handleLearnMore('${item.id}')">
                                ${this.currentLanguageData ? this.currentLanguageData.learnMore : 'Learn More'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add click event for ripple effect
        card.addEventListener('click', (e) => {
            this.createRippleEffect(e, card);
        });

        return card;
    }

    getTranslatedTitle(item) {
        if (!this.currentLanguageData) return item.title;
        
        const titleKey = `${item.type}${item.id}`;
        return this.currentLanguageData[titleKey] || item.title;
    }

    getTranslatedSector(sector) {
        if (!this.currentLanguageData) return sector;
        
        const sectorMap = {
            'IT': this.currentLanguageData.sector1,
            'Healthcare': this.currentLanguageData.sector2,
            'Finance': this.currentLanguageData.sector3,
            'Manufacturing': this.currentLanguageData.sector4
        };
        
        return sectorMap[sector] || sector;
    }

    getTranslatedDuration(duration) {
        if (!this.currentLanguageData) return duration;
        
        const durationMap = {
            '3 months': this.currentLanguageData.duration1,
            '6 months': this.currentLanguageData.duration2,
            '1 year': this.currentLanguageData.duration3,
            '2 years': this.currentLanguageData.duration4
        };
        
        return durationMap[duration] || duration;
    }

    getTranslatedRequirements(requirements) {
        if (!this.currentLanguageData) return requirements;
        
        const requirementsMap = {
            'Basic computer knowledge': this.currentLanguageData.requirements1,
            'High school diploma': this.currentLanguageData.requirements2,
            'Bachelor degree': this.currentLanguageData.requirements3,
            'Master degree': this.currentLanguageData.requirements4,
            'Professional experience': this.currentLanguageData.requirements5
        };
        
        return requirementsMap[requirements] || requirements;
    }

    getTranslatedCertification(certification) {
        if (!this.currentLanguageData) return certification;
        
        const certMap = {
            'NSQF Level 3': this.currentLanguageData.certification1,
            'NSQF Level 4': this.currentLanguageData.certification2,
            'NSQF Level 5': this.currentLanguageData.certification3,
            'NSQF Level 6': this.currentLanguageData.certification4,
            'NSQF Level 7': this.currentLanguageData.certification5,
            'NSQF Level 8': this.currentLanguageData.certification6
        };
        
        return certMap[certification] || certification;
    }

    getTranslatedSkill(skill) {
        if (!this.currentLanguageData) return skill;
        
        const skillMap = {
            'Programming': this.currentLanguageData.skills1,
            'Data Analysis': this.currentLanguageData.skills2,
            'Marketing': this.currentLanguageData.skills3,
            'Security': this.currentLanguageData.skills4,
            'Cloud Computing': this.currentLanguageData.skills5,
            'Machine Learning': this.currentLanguageData.skills6
        };
        
        return skillMap[skill] || skill;
    }

    // Card Actions
    handleApply(itemId) {
        const item = this.allItems.find(i => i.id == itemId);
        if (item) {
            this.showNotification(`${this.currentLanguageData ? this.currentLanguageData.applyNow : 'Apply Now'} for ${item.title}`, 'success');
        }
    }

    handleLearnMore(itemId) {
        const item = this.allItems.find(i => i.id == itemId);
        if (item) {
            this.showNotification(`${this.currentLanguageData ? this.currentLanguageData.viewDetails : 'View Details'} for ${item.title}`, 'info');
        }
    }

    // Utility Functions
    showLoading() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const cardsGrid = document.getElementById('cardsGrid');
        const noResults = document.getElementById('noResults');
        
        loadingIndicator.classList.add('show');
        cardsGrid.classList.remove('show');
        noResults.classList.remove('show');
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
        skipLink.href = '#explorer-container';
        skipLink.textContent = 'Skip to career explorer content';
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
let careerExplorer;
document.addEventListener('DOMContentLoaded', () => {
    careerExplorer = new CareerExplorer();
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
