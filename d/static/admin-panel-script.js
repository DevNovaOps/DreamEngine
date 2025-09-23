// Admin Panel - Interactive JavaScript
class AdminPanel {
    constructor() {
        this.currentLanguage = 'en';
        this.currentLanguageData = null;
        this.currentSection = 'dashboard';
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLanguageSelector();
        this.setupNavigation();
        this.setupMobileMenuToggle();
        this.setupCharts();
        this.setupTableSorting();
        this.loadLanguageData();
        this.populateTableData();
        this.startAnimations();
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('adminSidebar');
        
        sidebarToggle.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Language selector
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        const langOptions = document.querySelectorAll('.lang-option');

        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLanguageDropdown(languageDropdown);
        });

        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedLang = option.dataset.lang;
                const textData = JSON.parse(option.dataset.text);
                this.changeLanguage(selectedLang, textData);
                this.closeLanguageDropdown(languageDropdown);
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                this.closeLanguageDropdown(languageDropdown);
            }
        });

        // Table refresh
        const refreshBtn = document.getElementById('refreshTableBtn');
        refreshBtn.addEventListener('click', () => {
            this.refreshTable();
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    setupLanguageSelector() {
        // Language selector functionality is handled in setupEventListeners
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

    changeLanguage(lang, textData) {
        this.currentLanguage = lang;
        this.currentLanguageData = textData;
        this.updateLanguageContent(textData);
    }

    updateLanguageContent(textData) {
        // Update page title
        document.title = `Career Navigator - ${textData.pageTitle}`;
        
        // Update navigation elements
        const elements = {
            navDashboard: document.getElementById('navDashboard'),
            navLearners: document.getElementById('navLearners'),
            navCourses: document.getElementById('navCourses'),
            navAnalytics: document.getElementById('navAnalytics'),
            navSkills: document.getElementById('navSkills'),
            navReports: document.getElementById('navReports'),
            navSettings: document.getElementById('navSettings'),
            adminName: document.getElementById('adminName'),
            adminRole: document.getElementById('adminRole'),
            logoutText: document.getElementById('logoutText'),
            breadcrumbHome: document.getElementById('breadcrumbHome'),
            breadcrumbCurrent: document.getElementById('breadcrumbCurrent'),
            pageTitle: document.getElementById('pageTitle'),
            totalLearnersLabel: document.getElementById('totalLearnersLabel'),
            totalCoursesLabel: document.getElementById('totalCoursesLabel'),
            completionRateLabel: document.getElementById('completionRateLabel'),
            avgRatingLabel: document.getElementById('avgRatingLabel'),
            learnerGrowthTitle: document.getElementById('learnerGrowthTitle'),
            skillDemandTitle: document.getElementById('skillDemandTitle'),
            courseCompletionTitle: document.getElementById('courseCompletionTitle'),
            recentActivityTitle: document.getElementById('recentActivityTitle'),
            refreshText: document.getElementById('refreshText'),
            userColumn: document.getElementById('userColumn'),
            actionColumn: document.getElementById('actionColumn'),
            courseColumn: document.getElementById('courseColumn'),
            timeColumn: document.getElementById('timeColumn'),
            statusColumn: document.getElementById('statusColumn'),
            learnersPlaceholder: document.getElementById('learnersPlaceholder'),
            learnersPlaceholderText: document.getElementById('learnersPlaceholderText'),
            coursesPlaceholder: document.getElementById('coursesPlaceholder'),
            coursesPlaceholderText: document.getElementById('coursesPlaceholderText'),
            analyticsPlaceholder: document.getElementById('analyticsPlaceholder'),
            analyticsPlaceholderText: document.getElementById('analyticsPlaceholderText'),
            skillsPlaceholder: document.getElementById('skillsPlaceholder'),
            skillsPlaceholderText: document.getElementById('skillsPlaceholderText'),
            reportsPlaceholder: document.getElementById('reportsPlaceholder'),
            reportsPlaceholderText: document.getElementById('reportsPlaceholderText'),
            settingsPlaceholder: document.getElementById('settingsPlaceholder'),
            settingsPlaceholderText: document.getElementById('settingsPlaceholderText')
        };

        // Update all elements with fade effect
        Object.keys(elements).forEach(key => {
            if (elements[key] && textData[key]) {
                elements[key].style.transition = 'opacity 0.3s ease';
                elements[key].style.opacity = '0';
                
                setTimeout(() => {
                    elements[key].textContent = textData[key];
                    elements[key].style.opacity = '1';
                }, 150);
            }
        });

        // Update current language display
        const currentLangElement = document.querySelector('.current-lang');
        const langNames = {
            'en': 'English',
            'hi': 'हिन्दी',
            'ta': 'தமிழ்',
            'bn': 'বাংলা',
            'gu': 'ગુજરાતી'
        };
        if (currentLangElement) {
            currentLangElement.textContent = langNames[this.currentLanguage];
            currentLangElement.setAttribute('data-lang', this.currentLanguage);
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateToSection(section);
                // Close mobile menu if open
                this.closeMobileMenu();
            });
        });
    }

    setupMobileMenuToggle() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('adminSidebar');
        
        if (mobileMenuToggle && sidebar) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                mobileMenuToggle.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('adminSidebar');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (sidebar) {
            sidebar.classList.remove('open');
        }
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
    }

    navigateToSection(section) {
        // Update active nav item
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.dataset.section === section) {
                link.parentElement.classList.add('active');
            }
        });

        // Update content sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === `${section}Section`) {
                sec.classList.add('active');
            }
        });

        // Update breadcrumb
        this.updateBreadcrumb(section);

        this.currentSection = section;
    }

    updateBreadcrumb(section) {
        const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
        const sectionNames = {
            'dashboard': 'Dashboard',
            'learners': 'Learners',
            'courses': 'Courses',
            'analytics': 'Analytics',
            'skills': 'Skills',
            'reports': 'Reports',
            'settings': 'Settings'
        };

        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = sectionNames[section] || section;
        }
    }

    setupCharts() {
        // Initialize charts when DOM is ready
        setTimeout(() => {
            this.initLearnerGrowthChart();
            this.initSkillDemandChart();
            this.initCourseCompletionChart();
        }, 500);
    }

    initLearnerGrowthChart() {
        const canvas = document.getElementById('learnerGrowthChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Sample data for learner growth
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Learners',
                data: [120, 150, 180, 220, 280, 320],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        };

        this.charts.learnerGrowth = this.createLineChart(ctx, data);
    }

    initSkillDemandChart() {
        const canvas = document.getElementById('skillDemandChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Sample data for skill demand
        const data = {
            labels: ['JavaScript', 'Python', 'React', 'Node.js', 'Data Science'],
            datasets: [{
                data: [35, 28, 22, 18, 15],
                backgroundColor: [
                    '#00d4ff',
                    '#00ff88',
                    '#8b5cf6',
                    '#ff6b9d',
                    '#ff8c42'
                ],
                borderWidth: 0
            }]
        };

        this.charts.skillDemand = this.createPieChart(ctx, data);
    }

    initCourseCompletionChart() {
        const canvas = document.getElementById('courseCompletionChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Sample data for course completion
        const data = {
            labels: ['Completed', 'In Progress', 'Not Started'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                    '#00ff88',
                    '#00d4ff',
                    '#ff6b9d'
                ],
                borderWidth: 0
            }]
        };

        this.charts.courseCompletion = this.createDoughnutChart(ctx, data);
    }

    createLineChart(ctx, data) {
        // Simple line chart implementation
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid
        this.drawGrid(ctx, padding, chartWidth, chartHeight);

        // Draw data
        this.drawLineData(ctx, data, padding, chartWidth, chartHeight);

        // Draw labels
        this.drawLabels(ctx, data.labels, padding, chartWidth, chartHeight);

        return { ctx, data };
    }

    createPieChart(ctx, data) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw pie chart
        let currentAngle = 0;
        data.datasets[0].data.forEach((value, index) => {
            const sliceAngle = (value / 100) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = data.datasets[0].backgroundColor[index];
            ctx.fill();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(data.labels[index], labelX, labelY);

            currentAngle += sliceAngle;
        });

        return { ctx, data };
    }

    createDoughnutChart(ctx, data) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = Math.min(width, height) / 2 - 20;
        const innerRadius = outerRadius * 0.6;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw doughnut chart
        let currentAngle = 0;
        data.datasets[0].data.forEach((value, index) => {
            const sliceAngle = (value / 100) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            ctx.fillStyle = data.datasets[0].backgroundColor[index];
            ctx.fill();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (outerRadius + 30);
            const labelY = centerY + Math.sin(labelAngle) * (outerRadius + 30);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${data.labels[index]} (${value}%)`, labelX, labelY);

            currentAngle += sliceAngle;
        });

        return { ctx, data };
    }

    drawGrid(ctx, padding, width, height) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let i = 0; i <= 5; i++) {
            const x = padding + (width / 5) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= 4; i++) {
            const y = padding + (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + width, y);
            ctx.stroke();
        }
    }

    drawLineData(ctx, data, padding, width, height) {
        const dataset = data.datasets[0];
        const maxValue = Math.max(...dataset.data);
        const minValue = Math.min(...dataset.data);
        const valueRange = maxValue - minValue;

        ctx.strokeStyle = dataset.borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();

        dataset.data.forEach((value, index) => {
            const x = padding + (width / (dataset.data.length - 1)) * index;
            const y = padding + height - ((value - minValue) / valueRange) * height;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        ctx.fillStyle = dataset.borderColor;
        dataset.data.forEach((value, index) => {
            const x = padding + (width / (dataset.data.length - 1)) * index;
            const y = padding + height - ((value - minValue) / valueRange) * height;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    drawLabels(ctx, labels, padding, width, height) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';

        labels.forEach((label, index) => {
            const x = padding + (width / (labels.length - 1)) * index;
            const y = padding + height + 20;
            ctx.fillText(label, x, y);
        });
    }

    setupTableSorting() {
        const sortableHeaders = document.querySelectorAll('.sortable');
        
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                this.sortTable(column);
            });
        });
    }

    sortTable(column) {
        const table = document.getElementById('recentActivityTable');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        // Determine sort direction
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortDirection = 'asc';
        }

        this.sortColumn = column;

        // Update sort indicators
        const headers = document.querySelectorAll('.sortable');
        headers.forEach(header => {
            header.classList.remove('asc', 'desc');
            if (header.dataset.column === column) {
                header.classList.add(this.sortDirection);
            }
        });

        // Sort rows
        rows.sort((a, b) => {
            const aValue = a.querySelector(`[data-column="${column}"]`)?.textContent || '';
            const bValue = b.querySelector(`[data-column="${column}"]`)?.textContent || '';

            if (this.sortDirection === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

        // Re-append sorted rows with animation
        rows.forEach((row, index) => {
            row.style.animation = 'none';
            row.style.transform = 'translateX(-20px)';
            row.style.opacity = '0';
            
            setTimeout(() => {
                tbody.appendChild(row);
                row.style.animation = 'fadeInUp 0.3s ease-out';
                row.style.transform = 'translateX(0)';
                row.style.opacity = '1';
            }, index * 50);
        });
    }

    populateTableData() {
        const tableBody = document.getElementById('activityTableBody');
        if (!tableBody) return;

        const sampleData = [
            { user: 'John Doe', action: 'Completed Course', course: 'JavaScript Fundamentals', time: '2 hours ago', status: 'Success' },
            { user: 'Jane Smith', action: 'Started Course', course: 'Python for Data Science', time: '1 hour ago', status: 'In Progress' },
            { user: 'Mike Johnson', action: 'Achieved Badge', course: 'React Mastery', time: '3 hours ago', status: 'Success' },
            { user: 'Sarah Wilson', action: 'Completed Assessment', course: 'Machine Learning Basics', time: '4 hours ago', status: 'Success' },
            { user: 'David Brown', action: 'Started Course', course: 'Web Development', time: '5 hours ago', status: 'In Progress' },
            { user: 'Lisa Davis', action: 'Completed Course', course: 'UI/UX Design', time: '6 hours ago', status: 'Success' },
            { user: 'Tom Anderson', action: 'Failed Assessment', course: 'Advanced JavaScript', time: '7 hours ago', status: 'Failed' },
            { user: 'Emma Taylor', action: 'Started Course', course: 'Data Analysis', time: '8 hours ago', status: 'In Progress' }
        ];

        tableBody.innerHTML = '';

        sampleData.forEach((rowData, index) => {
            const row = document.createElement('tr');
            row.style.animationDelay = `${index * 0.1}s`;
            row.innerHTML = `
                <td data-column="user">${rowData.user}</td>
                <td data-column="action">${rowData.action}</td>
                <td data-column="course">${rowData.course}</td>
                <td data-column="time">${rowData.time}</td>
                <td data-column="status">
                    <span class="status-badge ${rowData.status.toLowerCase().replace(' ', '-')}">${rowData.status}</span>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    refreshTable() {
        const refreshBtn = document.getElementById('refreshTableBtn');
        const icon = refreshBtn.querySelector('.btn-icon');
        
        // Add spinning animation
        icon.style.animation = 'spin 1s linear infinite';
        
        setTimeout(() => {
            this.populateTableData();
            icon.style.animation = '';
            this.showNotification('Table refreshed successfully!', 'success');
        }, 1000);
    }

    toggleSidebar() {
        const sidebar = document.getElementById('adminSidebar');
        const toggle = document.getElementById('sidebarToggle');
        
        sidebar.classList.toggle('collapsed');
        toggle.classList.toggle('active');
    }

    handleLogout() {
        this.showNotification('Logging out...', 'info');
        setTimeout(() => {
            // Redirect to login page
            window.location.href = 'auth.html';
        }, 1500);
    }

    loadLanguageData() {
        // Initialize with English language data
        const englishOption = document.querySelector('.lang-option[data-lang="en"]');
        if (englishOption) {
            this.currentLanguageData = JSON.parse(englishOption.dataset.text);
            this.updateLanguageContent(this.currentLanguageData);
        }
    }

    startAnimations() {
        // Animate stat numbers
        this.animateStatNumbers();
        
        // Start chart animations
        setTimeout(() => {
            this.animateCharts();
        }, 1000);
    }

    animateStatNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const isPercentage = finalValue.includes('%');
            const isDecimal = finalValue.includes('.');
            const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
            
            let currentValue = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(currentValue);
                if (isDecimal) {
                    displayValue = currentValue.toFixed(1);
                }
                if (isPercentage) {
                    displayValue += '%';
                }
                
                stat.textContent = displayValue;
            }, 30);
        });
    }

    animateCharts() {
        // Add animation classes to chart containers
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.style.animation = 'fadeInUp 0.5s ease-out';
        });
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
const adminCSS = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.success {
    background: rgba(0, 255, 136, 0.2);
    color: var(--neon-green);
    border: 1px solid rgba(0, 255, 136, 0.3);
}

.status-badge.in-progress {
    background: rgba(0, 212, 255, 0.2);
    color: var(--neon-blue);
    border: 1px solid rgba(0, 212, 255, 0.3);
}

.status-badge.failed {
    background: rgba(255, 107, 157, 0.2);
    color: var(--neon-pink);
    border: 1px solid rgba(255, 107, 157, 0.3);
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    animation: slideInRight 0.3s ease;
}

.notification-success {
    background: var(--neon-green);
    color: var(--background-black);
}

.notification-error {
    background: var(--neon-pink);
    color: var(--background-black);
}

.notification-info {
    background: var(--neon-blue);
    color: var(--background-black);
}
`;

// Inject admin CSS
const adminStyleSheet = document.createElement('style');
adminStyleSheet.textContent = adminCSS;
document.head.appendChild(adminStyleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
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
