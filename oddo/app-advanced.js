// Advanced features for TicketFlow - Part 3

// Ticket Detail Functions
function loadTicketDetail(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
        showToast('Ticket not found', 'error');
        showDashboard();
        return;
    }
    
    const creator = users.find(u => u.id === ticket.creatorId);
    const assignedTo = ticket.assignedToId ? users.find(u => u.id === ticket.assignedToId) : null;
    
    const ticketDetailSection = document.getElementById('ticket-detail-section');
    
    ticketDetailSection.innerHTML = `
        <div class="mb-6">
            <button onclick="showDashboard()" class="text-blue-600 hover:text-blue-800 mb-2">
                <i class="fas fa-arrow-left mr-2"></i>Back to Dashboard
            </button>
            <h1 class="text-3xl font-bold text-gray-900">${ticket.subject}</h1>
            <p class="text-gray-600">${ticket.ticketNumber}</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Ticket Details -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <span class="px-3 py-1 text-sm font-medium rounded-full status-${ticket.status.toLowerCase().replace(' ', '-')}">
                            ${ticket.status}
                        </span>
                        <span class="px-3 py-1 text-sm font-medium rounded-full priority-${ticket.priority.toLowerCase()}">
                            ${ticket.priority}
                        </span>
                        <span class="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                            ${ticket.category}
                        </span>
                    </div>
                    
                    <div class="prose max-w-none">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                        <p class="text-gray-700 whitespace-pre-wrap">${ticket.description}</p>
                    </div>
                </div>
                
                <!-- Comments Section -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                        <i class="fas fa-comments text-blue-600 mr-2"></i>
                        Comments (${ticket.comments.length})
                    </h3>
                    
                    <!-- Add Comment Form -->
                    <form onsubmit="addComment(event, '${ticket.id}')" class="mb-6">
                        <div class="space-y-4">
                            <textarea id="comment-content" required rows="3" 
                                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder="Add a comment..."></textarea>
                            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                <i class="fas fa-paper-plane mr-2"></i>Add Comment
                            </button>
                        </div>
                    </form>
                    
                    <!-- Comments List -->
                    <div class="space-y-4" id="comments-list">
                        ${ticket.comments.length === 0 ? `
                            <p class="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                        ` : ticket.comments.map(comment => {
                            const author = users.find(u => u.id === comment.authorId);
                            return `
                                <div class="border-l-4 border-blue-400 bg-blue-50 pl-4 py-3">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="font-medium text-gray-900">${author?.name || 'Unknown'}</span>
                                        <span class="text-sm text-gray-500">${formatDate(comment.createdAt)}</span>
                                    </div>
                                    <p class="text-gray-700 whitespace-pre-wrap">${comment.content}</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Ticket Info -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
                    <div class="space-y-3">
                        <div>
                            <label class="text-sm font-medium text-gray-600">Created by</label>
                            <p class="text-gray-900">${creator?.name || 'Unknown'}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Created</label>
                            <p class="text-gray-900">${formatDate(ticket.createdAt)}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Last Updated</label>
                            <p class="text-gray-900">${formatDate(ticket.updatedAt)}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Actions for Agents -->
                ${(currentUser.role === 'agent' || currentUser.role === 'admin') ? `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div class="space-y-3">
                            <button onclick="updateTicketStatus('${ticket.id}', 'In Progress')" 
                                    class="w-full text-left px-3 py-2 text-sm bg-yellow-50 text-yellow-800 rounded-lg hover:bg-yellow-100">
                                <i class="fas fa-play mr-2"></i>Mark In Progress
                            </button>
                            <button onclick="updateTicketStatus('${ticket.id}', 'Resolved')" 
                                    class="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100">
                                <i class="fas fa-check mr-2"></i>Mark Resolved
                            </button>
                            <button onclick="updateTicketStatus('${ticket.id}', 'Closed')" 
                                    class="w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-800 rounded-lg hover:bg-gray-100">
                                <i class="fas fa-archive mr-2"></i>Close Ticket
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function addComment(event, ticketId) {
    event.preventDefault();
    
    const content = document.getElementById('comment-content').value;
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const newComment = {
        id: generateId(),
        authorId: currentUser.id,
        content,
        isInternal: false,
        createdAt: new Date().toISOString()
    };
    
    ticket.comments.push(newComment);
    ticket.updatedAt = new Date().toISOString();
    
    localStorage.setItem('tickets', JSON.stringify(tickets));
    
    showToast('Comment added successfully!', 'success');
    loadTicketDetail(ticketId);
}

function updateTicketStatus(ticketId, newStatus) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    ticket.status = newStatus;
    ticket.updatedAt = new Date().toISOString();
    
    localStorage.setItem('tickets', JSON.stringify(tickets));
    
    showToast(`Ticket status updated to ${newStatus}`, 'success');
    loadTicketDetail(ticketId);
}

// Category Management Functions
function loadCategories() {
    const categoriesSection = document.getElementById('categories-section');
    
    categoriesSection.innerHTML = `
        <div class="mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">
                        <i class="fas fa-tags text-blue-600 mr-3"></i>Category Management
                    </h1>
                    <p class="text-gray-600">Manage ticket categories for better organization.</p>
                </div>
                <button onclick="showCreateCategoryModal()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    <i class="fas fa-plus mr-2"></i>Add Category
                </button>
            </div>
        </div>
        
        <!-- Categories Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${categories.map(category => {
                const ticketCount = tickets.filter(t => t.category === category.name).length;
                return `
                    <div class="bg-white rounded-lg shadow-md p-6 card-hover">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <div class="w-4 h-4 rounded-full mr-3" style="background-color: ${category.color}"></div>
                                <h3 class="text-lg font-semibold text-gray-900">${category.name}</h3>
                            </div>
                            <button onclick="deleteCategory('${category.id}')" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        
                        <p class="text-gray-600 mb-4">${category.description || 'No description'}</p>
                        
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-500">${ticketCount} tickets</span>
                            <span class="px-2 py-1 text-xs rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                ${category.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function showCreateCategoryModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md modal-content">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Create New Category</h3>
                <button onclick="closeAllModals()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form onsubmit="createCategory(event)">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <input type="text" id="category-name" required maxlength="50"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea id="category-description" maxlength="200" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <input type="color" id="category-color" value="#3b82f6"
                               class="w-full h-10 border border-gray-300 rounded-lg">
                    </div>
                </div>
                
                <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" onclick="closeAllModals()" 
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Create Category
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('modals-container').appendChild(modal);
}

function createCategory(event) {
    event.preventDefault();
    
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;
    const color = document.getElementById('category-color').value;
    
    if (categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
        showToast('Category with this name already exists', 'error');
        return;
    }
    
    const newCategory = {
        id: generateId(),
        name,
        description,
        color,
        isActive: true,
        createdAt: new Date().toISOString()
    };
    
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    
    closeAllModals();
    showToast('Category created successfully!', 'success');
    loadCategories();
}

function deleteCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const ticketCount = tickets.filter(t => t.category === category.name).length;
    if (ticketCount > 0) {
        showToast(`Cannot delete category. ${ticketCount} tickets are using this category.`, 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
        categories = categories.filter(c => c.id !== categoryId);
        localStorage.setItem('categories', JSON.stringify(categories));
        
        showToast('Category deleted successfully!', 'success');
        loadCategories();
    }
}

// Profile Management Functions
function loadProfile() {
    const profileSection = document.getElementById('profile-section');
    
    profileSection.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
                <i class="fas fa-user text-blue-600 mr-3"></i>Profile Settings
            </h1>
            <p class="text-gray-600">Manage your account information and preferences.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            
            <form onsubmit="updateProfile(event)">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" id="profile-name" value="${currentUser.name}" required
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" id="profile-email" value="${currentUser.email}" required
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input type="text" value="${currentUser.role}" disabled
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                        <input type="text" value="${formatDate(currentUser.createdAt)}" disabled
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    </div>
                </div>
                
                <button type="submit" class="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    <i class="fas fa-save mr-2"></i>Update Profile
                </button>
            </form>
        </div>
    `;
}

function updateProfile(event) {
    event.preventDefault();
    
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    
    const existingUser = users.find(u => u.email === email && u.id !== currentUser.id);
    if (existingUser) {
        showToast('Email address is already taken', 'error');
        return;
    }
    
    currentUser.name = name;
    currentUser.email = email;
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    showToast('Profile updated successfully!', 'success');
    updateNavigation();
}

// Settings Functions
function loadSettings() {
    const settingsSection = document.getElementById('settings-section');
    
    settingsSection.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
                <i class="fas fa-cog text-blue-600 mr-3"></i>Settings
            </h1>
            <p class="text-gray-600">Application settings and data management.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onclick="exportData()" class="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 text-center">
                    <i class="fas fa-download text-2xl mb-2"></i>
                    <p class="font-medium">Export Data</p>
                    <p class="text-sm opacity-90">Download all your data</p>
                </button>
                
                <button onclick="clearAllData()" class="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 text-center">
                    <i class="fas fa-trash text-2xl mb-2"></i>
                    <p class="font-medium">Clear All Data</p>
                    <p class="text-sm opacity-90">Reset application</p>
                </button>
            </div>
        </div>
    `;
}

function exportData() {
    const data = {
        users: users,
        tickets: tickets,
        categories: categories,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ticketflow-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('Data exported successfully!', 'success');
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        localStorage.clear();
        showToast('All data cleared successfully!', 'success');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}
