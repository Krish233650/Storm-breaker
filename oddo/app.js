// TicketFlow - Frontend-only Ticket Management System
// Uses localStorage for data persistence

// Global State
let currentUser = null;
let currentView = 'auth';
let tickets = [];
let categories = [];
let users = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    initializeDefaultData();
    checkAuthentication();
    setupEventListeners();
}

// Initialize default data if not exists
function initializeDefaultData() {
    // Initialize default categories
    if (!localStorage.getItem('categories')) {
        const defaultCategories = [
            { id: '1', name: 'Technical Support', description: 'Technical issues and troubleshooting', color: '#3b82f6', isActive: true, createdAt: new Date().toISOString() },
            { id: '2', name: 'Bug Report', description: 'Software bugs and errors', color: '#ef4444', isActive: true, createdAt: new Date().toISOString() },
            { id: '3', name: 'Feature Request', description: 'New feature suggestions', color: '#10b981', isActive: true, createdAt: new Date().toISOString() },
            { id: '4', name: 'Account Issue', description: 'Account-related problems', color: '#f59e0b', isActive: true, createdAt: new Date().toISOString() },
            { id: '5', name: 'Billing', description: 'Billing and payment issues', color: '#8b5cf6', isActive: true, createdAt: new Date().toISOString() },
            { id: '6', name: 'General Inquiry', description: 'General questions and inquiries', color: '#6b7280', isActive: true, createdAt: new Date().toISOString() }
        ];
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }

    // Initialize demo users
    if (!localStorage.getItem('users')) {
        const demoUsers = [
            {
                id: 1,
                username: 'user',
                email: 'user@demo.com',
                password: 'password',
                role: 'user',
                profile: {
                    firstName: 'Alex',
                    lastName: 'Johnson',
                    phone: '+1-555-0123',
                    department: 'Marketing',
                    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=667eea&color=fff'
                },
                settings: {
                    notifications: true,
                    theme: 'light'
                },
                createdAt: new Date('2024-01-01').toISOString()
            },
            {
                id: 2,
                username: 'agent',
                email: 'agent@demo.com',
                password: 'password',
                role: 'agent',
                profile: {
                    firstName: 'Sarah',
                    lastName: 'Chen',
                    phone: '+1-555-0124',
                    department: 'IT Support',
                    avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff'
                },
                settings: {
                    notifications: true,
                    theme: 'light'
                },
                createdAt: new Date('2024-01-01').toISOString()
            },
            {
                id: 3,
                username: 'admin',
                email: 'admin@demo.com',
                password: 'password',
                role: 'admin',
                profile: {
                    firstName: 'Michael',
                    lastName: 'Rodriguez',
                    phone: '+1-555-0125',
                    department: 'System Administration',
                    avatar: 'https://ui-avatars.com/api/?name=Michael+Rodriguez&background=f59e0b&color=fff'
                },
                settings: {
                    notifications: true,
                    theme: 'light'
                },
                createdAt: new Date('2024-01-01').toISOString()
            },
            {
                id: 4,
                username: 'emma.wilson',
                email: 'emma.wilson@company.com',
                password: 'password',
                role: 'user',
                profile: {
                    firstName: 'Emma',
                    lastName: 'Wilson',
                    phone: '+1-555-0126',
                    department: 'Sales',
                    avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=ec4899&color=fff'
                },
                settings: {
                    notifications: true,
                    theme: 'light'
                },
                createdAt: new Date('2024-01-15').toISOString()
            },
            {
                id: 5,
                username: 'david.kim',
                email: 'david.kim@company.com',
                password: 'password',
                role: 'agent',
                profile: {
                    firstName: 'David',
                    lastName: 'Kim',
                    phone: '+1-555-0127',
                    department: 'Technical Support',
                    avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=8b5cf6&color=fff'
                },
                settings: {
                    notifications: true,
                    theme: 'light'
                },
                createdAt: new Date('2024-01-10').toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }

    // Initialize demo tickets with realistic data
    if (!localStorage.getItem('tickets')) {
        const demoTickets = [
            {
                id: 1,
                ticketNumber: 'TKT-000001',
                subject: 'Email Server Configuration Issues',
                description: 'Our email server has been experiencing intermittent connectivity issues since the recent update. Users are reporting delayed email delivery and some emails are bouncing back. This is affecting our customer communication and internal operations.',
                category: 'Technical',
                priority: 'high',
                status: 'in-progress',
                createdBy: 1,
                assignedTo: 2,
                attachments: [
                    { name: 'error-logs.txt', size: '2.3 KB', type: 'text/plain' },
                    { name: 'server-config.png', size: '156 KB', type: 'image/png' }
                ],
                comments: [
                    {
                        id: 1,
                        content: 'I\'ve identified the issue. The SMTP configuration was corrupted during the last update. Working on a fix now.',
                        author: 2,
                        authorName: 'Sarah Chen',
                        createdAt: new Date(Date.now() - 3600000).toISOString(),
                        isInternal: false
                    },
                    {
                        id: 2,
                        content: 'Internal note: Need to check with network team about firewall rules.',
                        author: 2,
                        authorName: 'Sarah Chen',
                        createdAt: new Date(Date.now() - 1800000).toISOString(),
                        isInternal: true
                    }
                ],
                createdAt: new Date(Date.now() - 7200000).toISOString(),
                updatedAt: new Date(Date.now() - 1800000).toISOString()
            },
            {
                id: 2,
                ticketNumber: 'TKT-000002',
                subject: 'Request for Dark Mode Implementation',
                description: 'Many users have requested a dark mode option for the application. This would improve user experience, especially for users working in low-light environments or those who prefer dark themes for accessibility reasons.',
                category: 'Feature Request',
                priority: 'medium',
                status: 'open',
                createdBy: 4,
                assignedTo: 5,
                attachments: [
                    { name: 'dark-mode-mockup.pdf', size: '1.2 MB', type: 'application/pdf' }
                ],
                comments: [
                    {
                        id: 3,
                        content: 'This is a great suggestion! I\'ll start working on the design specifications and implementation plan.',
                        author: 5,
                        authorName: 'David Kim',
                        createdAt: new Date(Date.now() - 86400000).toISOString(),
                        isInternal: false
                    }
                ],
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 3,
                ticketNumber: 'TKT-000003',
                subject: 'Critical: Database Performance Degradation',
                description: 'The main database is experiencing severe performance issues. Query response times have increased by 300% since yesterday. This is affecting all user operations and causing timeouts.',
                category: 'Critical Issue',
                priority: 'urgent',
                status: 'resolved',
                createdBy: 3,
                assignedTo: 2,
                attachments: [
                    { name: 'performance-report.xlsx', size: '890 KB', type: 'application/vnd.ms-excel' },
                    { name: 'db-analysis.sql', size: '15 KB', type: 'text/plain' }
                ],
                comments: [
                    {
                        id: 4,
                        content: 'Investigating the issue. Initial analysis shows high CPU usage on the database server.',
                        author: 2,
                        authorName: 'Sarah Chen',
                        createdAt: new Date(Date.now() - 259200000).toISOString(),
                        isInternal: false
                    },
                    {
                        id: 5,
                        content: 'Found the root cause: a runaway query was consuming resources. Query has been terminated and optimized.',
                        author: 2,
                        authorName: 'Sarah Chen',
                        createdAt: new Date(Date.now() - 172800000).toISOString(),
                        isInternal: false
                    },
                    {
                        id: 6,
                        content: 'Performance has been restored to normal levels. Implementing additional monitoring to prevent similar issues.',
                        author: 2,
                        authorName: 'Sarah Chen',
                        createdAt: new Date(Date.now() - 86400000).toISOString(),
                        isInternal: false
                    }
                ],
                createdAt: new Date(Date.now() - 345600000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 4,
                ticketNumber: 'TKT-000004',
                subject: 'Mobile App Crashes on iOS 17',
                description: 'Users with iOS 17 are reporting frequent crashes when trying to upload images through the mobile app. The crash occurs specifically during the image compression process.',
                category: 'Bug Report',
                priority: 'high',
                status: 'in-progress',
                createdBy: 4,
                assignedTo: 5,
                attachments: [
                    { name: 'crash-logs-ios17.txt', size: '45 KB', type: 'text/plain' },
                    { name: 'device-info.json', size: '3 KB', type: 'application/json' }
                ],
                comments: [
                    {
                        id: 7,
                        content: 'I can reproduce this issue on iPhone 14 Pro with iOS 17.1. Looking into the image compression library compatibility.',
                        author: 5,
                        authorName: 'David Kim',
                        createdAt: new Date(Date.now() - 43200000).toISOString(),
                        isInternal: false
                    }
                ],
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 43200000).toISOString()
            },
            {
                id: 5,
                ticketNumber: 'TKT-000005',
                subject: 'User Access Permission Review',
                description: 'Quarterly review of user access permissions as per security policy. Need to audit all user accounts and remove unnecessary permissions.',
                category: 'Security',
                priority: 'medium',
                status: 'open',
                createdBy: 3,
                assignedTo: 3,
                attachments: [
                    { name: 'user-audit-checklist.pdf', size: '234 KB', type: 'application/pdf' }
                ],
                comments: [],
                createdAt: new Date(Date.now() - 432000000).toISOString(),
                updatedAt: new Date(Date.now() - 432000000).toISOString()
            },
            {
                id: 6,
                ticketNumber: 'TKT-000006',
                subject: 'Integration with Slack for Notifications',
                description: 'Request to integrate our ticketing system with Slack so that team members can receive notifications about ticket updates directly in their Slack channels.',
                category: 'Integration',
                priority: 'low',
                status: 'closed',
                createdBy: 1,
                assignedTo: 5,
                attachments: [
                    { name: 'slack-api-docs.pdf', size: '567 KB', type: 'application/pdf' }
                ],
                comments: [
                    {
                        id: 8,
                        content: 'Integration completed successfully. Slack notifications are now active for all ticket updates.',
                        author: 5,
                        authorName: 'David Kim',
                        createdAt: new Date(Date.now() - 604800000).toISOString(),
                        isInternal: false
                    },
                    {
                        id: 9,
                        content: 'Tested and working perfectly. Closing this ticket.',
                        author: 1,
                        authorName: 'Alex Johnson',
                        createdAt: new Date(Date.now() - 518400000).toISOString(),
                        isInternal: false
                    }
                ],
                createdAt: new Date(Date.now() - 1209600000).toISOString(),
                updatedAt: new Date(Date.now() - 518400000).toISOString()
            },
            {
                id: 7,
                ticketNumber: 'TKT-000007',
                subject: 'Website Loading Speed Optimization',
                description: 'The company website is loading slowly, especially on mobile devices. Page load times are averaging 8-12 seconds, which is affecting user experience and SEO rankings.',
                category: 'Performance',
                priority: 'high',
                status: 'in-progress',
                createdBy: 4,
                assignedTo: 2,
                attachments: [
                    { name: 'pagespeed-report.pdf', size: '445 KB', type: 'application/pdf' },
                    { name: 'lighthouse-audit.json', size: '78 KB', type: 'application/json' }
                ],
                comments: [
                    {
                        id: 10,
                        content: 'Started optimization work. Compressing images and minifying CSS/JS files. Should see improvement soon.',
                        author: 2,
                        authorName: 'Sarah Chen',
                        createdAt: new Date(Date.now() - 21600000).toISOString(),
                        isInternal: false
                    }
                ],
                createdAt: new Date(Date.now() - 129600000).toISOString(),
                updatedAt: new Date(Date.now() - 21600000).toISOString()
            },
            {
                id: 8,
                ticketNumber: 'TKT-000008',
                subject: 'Two-Factor Authentication Implementation',
                description: 'Implement two-factor authentication (2FA) for enhanced security. This should be mandatory for admin accounts and optional for regular users.',
                category: 'Security',
                priority: 'high',
                status: 'open',
                createdBy: 3,
                assignedTo: null,
                attachments: [
                    { name: '2fa-requirements.docx', size: '123 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
                ],
                comments: [],
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        localStorage.setItem('tickets', JSON.stringify(demoTickets));
    }

    // Load data into memory
    categories = JSON.parse(localStorage.getItem('categories') || '[]');
    users = JSON.parse(localStorage.getItem('users') || '[]');
    tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
}

// Setup event listeners
function setupEventListeners() {
    document.addEventListener('click', function(event) {
        const userDropdown = document.getElementById('user-dropdown');
        const userMenu = document.querySelector('[onclick="toggleUserMenu()"]');
        
        if (userDropdown && !userMenu.contains(event.target)) {
            userDropdown.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Authentication Functions
function checkAuthentication() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showAuthSection();
    }
}

function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.email === email && u.password === password && u.isActive);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showToast('Login successful!', 'success');
        showMainApp();
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    
    if (users.find(u => u.email === email)) {
        showToast('User with this email already exists', 'error');
        return;
    }
    
    const newUser = {
        id: generateId(),
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
        isActive: true,
        settings: {
            emailNotifications: true,
            theme: 'light'
        }
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showToast('Account created successfully!', 'success');
    showMainApp();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully', 'info');
    showAuthSection();
}

// View Management Functions
function showAuthSection() {
    hideAllSections();
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('main-nav').style.display = 'none';
    currentView = 'auth';
}

function showMainApp() {
    hideAllSections();
    document.getElementById('main-nav').style.display = 'block';
    updateNavigation();
    showDashboard();
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showDashboard() {
    hideAllSections();
    document.getElementById('dashboard-section').style.display = 'block';
    updateActiveNavLink('dashboard');
    loadDashboard();
    currentView = 'dashboard';
}

function showCreateTicket() {
    hideAllSections();
    document.getElementById('create-ticket-section').style.display = 'block';
    updateActiveNavLink('create-ticket');
    loadCreateTicketForm();
    currentView = 'create-ticket';
}

function showProfile() {
    hideAllSections();
    document.getElementById('profile-section').style.display = 'block';
    updateActiveNavLink('profile');
    loadProfile();
    currentView = 'profile';
}

function showCategories() {
    hideAllSections();
    document.getElementById('categories-section').style.display = 'block';
    updateActiveNavLink('categories');
    loadCategories();
    currentView = 'categories';
}

function showTicketDetail(ticketId) {
    hideAllSections();
    document.getElementById('ticket-detail-section').style.display = 'block';
    updateActiveNavLink('');
    loadTicketDetail(ticketId);
    currentView = 'ticket-detail';
}

function showSettings() {
    hideAllSections();
    document.getElementById('settings-section').style.display = 'block';
    updateActiveNavLink('');
    loadSettings();
    currentView = 'settings';
}

function hideAllSections() {
    const sections = ['auth-section', 'dashboard-section', 'create-ticket-section', 'profile-section', 'categories-section', 'ticket-detail-section', 'settings-section'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) element.style.display = 'none';
    });
}

function updateNavigation() {
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
        
        const adminNav = document.getElementById('admin-nav');
        if (currentUser.role === 'admin') {
            adminNav.style.display = 'inline-flex';
        } else {
            adminNav.style.display = 'none';
        }
    }
}

function updateActiveNavLink(activeView) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (activeView) {
        const activeLink = document.querySelector(`[onclick="show${activeView.charAt(0).toUpperCase() + activeView.slice(1)}()"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('hidden');
}

// Continue with remaining functions in next file...
