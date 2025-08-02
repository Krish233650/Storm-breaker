// Additional functions for TicketFlow - Part 2

// Dashboard Functions
function loadDashboard() {
    const dashboardSection = document.getElementById('dashboard-section');
    
    let userTickets = tickets;
    if (currentUser.role === 'user') {
        userTickets = tickets.filter(ticket => ticket.creatorId === currentUser.id);
    }
    
    const stats = {
        total: userTickets.length,
        open: userTickets.filter(t => t.status === 'Open').length,
        inProgress: userTickets.filter(t => t.status === 'In Progress').length,
        resolved: userTickets.filter(t => t.status === 'Resolved').length,
        closed: userTickets.filter(t => t.status === 'Closed').length
    };
    
    dashboardSection.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
                <i class="fas fa-tachometer-alt text-blue-600 mr-3"></i>Dashboard
            </h1>
            <p class="text-gray-600">Welcome back, ${currentUser.name}! Here's your ticket overview.</p>
        </div>
        
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-ticket-alt text-blue-500 text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Tickets</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.total}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-folder-open text-green-500 text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Open</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.open}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-clock text-yellow-500 text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">In Progress</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.inProgress}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-check-circle text-blue-500 text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Resolved</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.resolved}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-500">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-archive text-gray-500 text-2xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Closed</p>
                        <p class="text-2xl font-bold text-gray-900">${stats.closed}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Filters and Search -->
        <div class="bg-white rounded-lg shadow-md mb-6 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-filter text-blue-600 mr-2"></i>Filter & Search Tickets
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input type="text" id="search-input" placeholder="Search tickets..." 
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 search-input">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select id="status-filter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select id="category-filter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Categories</option>
                        ${categories.filter(c => c.isActive).map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select id="sort-filter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="updatedAt">Recently Modified</option>
                        <option value="mostReplied">Most Replied</option>
                        <option value="createdAt">Created Date</option>
                        <option value="subject">Subject</option>
                        <option value="status">Status</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>
            </div>
            <div class="mt-4 flex space-x-3">
                <button onclick="applyFilters()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                    <i class="fas fa-search mr-2"></i>Apply Filters
                </button>
                <button onclick="clearFilters()" class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200">
                    <i class="fas fa-times mr-2"></i>Clear
                </button>
            </div>
        </div>
        
        <!-- Tickets List -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">
                    <i class="fas fa-list text-blue-600 mr-2"></i>
                    ${currentUser.role === 'user' ? 'Your Tickets' : 'All Tickets'}
                </h3>
            </div>
            <div id="tickets-list" class="divide-y divide-gray-200">
                <!-- Tickets will be loaded here -->
            </div>
        </div>
    `;
    
    loadTicketsList();
    
    // Add event listeners
    document.getElementById('search-input').addEventListener('input', debounce(applyFilters, 300));
    document.getElementById('status-filter').addEventListener('change', applyFilters);
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('sort-filter').addEventListener('change', applyFilters);
}

function loadTicketsList(filteredTickets = null) {
    const ticketsList = document.getElementById('tickets-list');
    
    let displayTickets = filteredTickets || tickets;
    
    if (currentUser.role === 'user') {
        displayTickets = displayTickets.filter(ticket => ticket.creatorId === currentUser.id);
    }
    
    if (displayTickets.length === 0) {
        ticketsList.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-ticket-alt text-gray-400 text-6xl mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p class="text-gray-500 mb-6">
                    ${currentUser.role === 'user' ? "You haven't created any tickets yet." : "No tickets match your current filters."}
                </p>
                ${currentUser.role === 'user' ? `
                    <button onclick="showCreateTicket()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Create Your First Ticket
                    </button>
                ` : ''}
            </div>
        `;
        return;
    }
    
    ticketsList.innerHTML = displayTickets.map(ticket => {
        const creator = users.find(u => u.id === ticket.creatorId);
        const assignedTo = ticket.assignedToId ? users.find(u => u.id === ticket.assignedToId) : null;
        
        return `
            <div class="p-6 hover:bg-gray-50 cursor-pointer transition duration-200 card-hover" onclick="showTicketDetail('${ticket.id}')">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <span class="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">${ticket.ticketNumber}</span>
                            <span class="px-3 py-1 text-xs font-medium rounded-full status-${ticket.status.toLowerCase().replace(' ', '-')}">
                                ${ticket.status}
                            </span>
                            <span class="px-3 py-1 text-xs font-medium rounded-full priority-${ticket.priority.toLowerCase()}">
                                ${ticket.priority}
                            </span>
                            <span class="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                ${ticket.category}
                            </span>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">${ticket.subject}</h4>
                        <p class="text-gray-600 mb-3 line-clamp-2">${ticket.description.substring(0, 150)}${ticket.description.length > 150 ? '...' : ''}</p>
                        <div class="flex items-center text-sm text-gray-500 space-x-4">
                            <span><i class="fas fa-user mr-1"></i>Created by ${creator?.name || 'Unknown'}</span>
                            ${assignedTo ? `<span><i class="fas fa-user-tie mr-1"></i>Assigned to ${assignedTo.name}</span>` : ''}
                            <span><i class="fas fa-clock mr-1"></i>Updated ${formatDate(ticket.updatedAt)}</span>
                            ${ticket.comments.length > 0 ? `<span><i class="fas fa-comments mr-1"></i>${ticket.comments.length} comments</span>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center ml-4">
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Create Ticket Functions
function loadCreateTicketForm() {
    const createTicketSection = document.getElementById('create-ticket-section');
    
    createTicketSection.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
                <i class="fas fa-plus text-blue-600 mr-3"></i>Create New Ticket
            </h1>
            <p class="text-gray-600">Describe your issue and we'll help you resolve it quickly.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-8">
            <form onsubmit="createTicket(event)">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="lg:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                        <input type="text" id="ticket-subject" required maxlength="200" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                               placeholder="Brief description of your issue">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select id="ticket-category" required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select a category</option>
                            ${categories.filter(c => c.isActive).map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select id="ticket-priority" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="Low">Low</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    
                    <div class="lg:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea id="ticket-description" required maxlength="2000" rows="6"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Please provide detailed information about your issue..."></textarea>
                        <p class="mt-2 text-sm text-gray-500">Be as specific as possible to help us resolve your issue quickly.</p>
                    </div>
                    
                    <div class="lg:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
                        <div class="file-upload-area border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input type="file" id="ticket-attachments" multiple accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt" class="hidden">
                            <i class="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                            <p class="text-gray-600 mb-2">Click to upload files or drag and drop</p>
                            <p class="text-sm text-gray-500">Supported formats: images, PDF, Word documents, text files (max 10MB each)</p>
                            <button type="button" onclick="document.getElementById('ticket-attachments').click()" 
                                    class="mt-3 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200">
                                Choose Files
                            </button>
                        </div>
                        <div id="selected-files" class="mt-3"></div>
                    </div>
                </div>
                
                <div class="mt-8 flex justify-end space-x-4">
                    <button type="button" onclick="showDashboard()" 
                            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                        <i class="fas fa-times mr-2"></i>Cancel
                    </button>
                    <button type="submit" 
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-paper-plane mr-2"></i>Create Ticket
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Add file upload handling
    const fileInput = document.getElementById('ticket-attachments');
    fileInput.addEventListener('change', handleFileSelection);
}

function handleFileSelection(event) {
    const files = event.target.files;
    const selectedFilesDiv = document.getElementById('selected-files');
    
    if (files.length === 0) {
        selectedFilesDiv.innerHTML = '';
        return;
    }
    
    const fileList = Array.from(files).map(file => `
        <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div class="flex items-center">
                <i class="fas fa-file text-gray-500 mr-2"></i>
                <span class="text-sm text-gray-700">${file.name}</span>
                <span class="text-xs text-gray-500 ml-2">(${formatFileSize(file.size)})</span>
            </div>
        </div>
    `).join('');
    
    selectedFilesDiv.innerHTML = `
        <div class="space-y-2">
            <p class="text-sm font-medium text-gray-700">Selected Files:</p>
            ${fileList}
        </div>
    `;
}

function createTicket(event) {
    event.preventDefault();
    
    const subject = document.getElementById('ticket-subject').value;
    const category = document.getElementById('ticket-category').value;
    const priority = document.getElementById('ticket-priority').value;
    const description = document.getElementById('ticket-description').value;
    const files = document.getElementById('ticket-attachments').files;
    
    const newTicket = {
        id: generateId(),
        ticketNumber: generateTicketNumber(),
        subject,
        category,
        priority,
        description,
        status: 'Open',
        creatorId: currentUser.id,
        assignedToId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        attachments: Array.from(files).map(file => ({
            id: generateId(),
            name: file.name,
            size: file.size,
            type: file.type
        }))
    };
    
    tickets.push(newTicket);
    localStorage.setItem('tickets', JSON.stringify(tickets));
    
    showToast('Ticket created successfully!', 'success');
    showTicketDetail(newTicket.id);
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateTicketNumber() {
    const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const nextNumber = existingTickets.length + 1;
    return `TKT-${String(nextNumber).padStart(6, '0')}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.className = `${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg mb-2 flex items-center space-x-3 toast-enter`;
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }
    }, duration);
}

function showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = show ? 'flex' : 'none';
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(modal => modal.remove());
}

// Filter and Search Functions
function applyFilters() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const categoryFilter = document.getElementById('category-filter')?.value || '';
    const sortBy = document.getElementById('sort-filter')?.value || 'updatedAt';
    
    let filteredTickets = [...tickets];
    
    if (searchTerm) {
        filteredTickets = filteredTickets.filter(ticket =>
            ticket.subject.toLowerCase().includes(searchTerm) ||
            ticket.description.toLowerCase().includes(searchTerm) ||
            ticket.ticketNumber.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === statusFilter);
    }
    
    if (categoryFilter) {
        filteredTickets = filteredTickets.filter(ticket => ticket.category === categoryFilter);
    }
    
    filteredTickets.sort((a, b) => {
        switch (sortBy) {
            case 'mostReplied':
                return b.comments.length - a.comments.length;
            case 'createdAt':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'updatedAt':
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            case 'subject':
                return a.subject.localeCompare(b.subject);
            case 'status':
                return a.status.localeCompare(b.status);
            case 'priority':
                const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            default:
                return new Date(b.updatedAt) - new Date(a.updatedAt);
        }
    });
    
    loadTicketsList(filteredTickets);
}

function clearFilters() {
    if (document.getElementById('search-input')) document.getElementById('search-input').value = '';
    if (document.getElementById('status-filter')) document.getElementById('status-filter').value = '';
    if (document.getElementById('category-filter')) document.getElementById('category-filter').value = '';
    if (document.getElementById('sort-filter')) document.getElementById('sort-filter').value = 'updatedAt';
    
    loadTicketsList();
}
