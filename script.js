// Get DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const categorySelect = document.getElementById('categorySelect');
const prioritySelect = document.getElementById('prioritySelect');
const dueDateInput = document.getElementById('dueDateInput');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const filterButtons = document.querySelectorAll('.filter-btn');
const categoryTabs = document.querySelectorAll('.category-tab');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const exportBtn = document.getElementById('exportBtn');

// Modal Elements
const editModal = document.getElementById('editModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveEditBtn = document.getElementById('saveEditBtn');
const editTaskInput = document.getElementById('editTaskInput');
const editCategorySelect = document.getElementById('editCategorySelect');
const editPrioritySelect = document.getElementById('editPrioritySelect');
const editDueDateInput = document.getElementById('editDueDateInput');

// State Variables
let tasks = [];
let currentFilter = 'tous';
let currentCategory = 'tous';
let searchTerm = '';
let editingTaskId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadTheme();
    renderTasks();
    updateStats();
    addEventListeners();
});

// Event Listeners
function addEventListeners() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());
    searchInput.addEventListener('input', handleSearch);
    themeToggle.addEventListener('click', toggleTheme);
    filterButtons.forEach(btn => btn.addEventListener('click', handleFilter));
    categoryTabs.forEach(tab => tab.addEventListener('click', handleCategoryTab));
    clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn.addEventListener('click', clearAllTasks);
    exportBtn.addEventListener('click', exportTasks);
    closeModalBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);
    saveEditBtn.addEventListener('click', saveEdit);
    modalOverlay.addEventListener('click', closeModal);
}

// Add Task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        showNotification('Veuillez entrer une tâche');
        return;
    }

    const task = {
        id: Date.now(),
        text,
        category: categorySelect.value,
        priority: prioritySelect.value,
        dueDate: dueDateInput.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    clearInputs();
    showNotification('Tâche ajoutée avec succès!');
}

// Delete Task
function deleteTask(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
        showNotification('Tâche supprimée');
    }
}

// Toggle Task Completion
function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Open Edit Modal
function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        editingTaskId = id;
        editTaskInput.value = task.text;
        editCategorySelect.value = task.category;
        editPrioritySelect.value = task.priority;
        editDueDateInput.value = task.dueDate;
        editModal.classList.add('show');
        modalOverlay.classList.add('show');
    }
}

// Close Modal
function closeModal() {
    editModal.classList.remove('show');
    modalOverlay.classList.remove('show');
    editingTaskId = null;
}

// Save Edit
function saveEdit() {
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        const newText = editTaskInput.value.trim();
        if (newText === '') {
            showNotification('Veuillez entrer un texte');
            return;
        }
        task.text = newText;
        task.category = editCategorySelect.value;
        task.priority = editPrioritySelect.value;
        task.dueDate = editDueDateInput.value;
        saveTasks();
        renderTasks();
        updateStats();
        closeModal();
        showNotification('Tâche mise à jour');
    }
}

// Render Tasks
function renderTasks() {
    let filteredTasks = filterTasks();

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Aucune tâche trouvée</p>
                <small>Ajoutez une tâche ou modifiez vos filtres</small>
            </div>
        `;
        return;
    }

    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''} ${task.priority}-priority">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTaskCompletion(${task.id})"
            >
            <div class="task-content">
                <div class="task-header">
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <span class="task-badge badge-priority ${task.priority === 'basse' ? 'low' : task.priority === 'moyenne' ? 'medium' : ''}">
                        ${getPriorityIcon(task.priority)} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span class="task-badge badge-category">${getCategoryIcon(task.category)} ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
                </div>
                ${task.dueDate ? `<div class="task-details-info">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(task.dueDate)}</span>
                </div>` : ''}
            </div>
            <div class="task-actions">
                <button class="btn-action btn-edit" onclick="openEditModal(${task.id})" title="Éditer">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteTask(${task.id})" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Tasks
function filterTasks() {
    return tasks.filter(task => {
        // Status filter
        if (currentFilter === 'complete' && !task.completed) return false;
        if (currentFilter === 'incomplete' && task.completed) return false;

        // Category filter
        if (currentCategory !== 'tous' && task.category !== currentCategory) return false;

        // Search filter
        if (searchTerm && !task.text.toLowerCase().includes(searchTerm.toLowerCase())) return false;

        return true;
    });
}

// Handle Filter
function handleFilter(e) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.closest('.filter-btn').classList.add('active');
    currentFilter = e.target.closest('.filter-btn').dataset.filter;
    renderTasks();
}

// Handle Category Tab
function handleCategoryTab(e) {
    categoryTabs.forEach(tab => tab.classList.remove('active'));
    e.target.closest('.category-tab').classList.add('active');
    currentCategory = e.target.closest('.category-tab').dataset.category;
    renderTasks();
}

// Handle Search
function handleSearch(e) {
    searchTerm = e.target.value;
    renderTasks();
}

// Clear Completed Tasks
function clearCompleted() {
    if (tasks.some(t => t.completed)) {
        if (confirm('Êtes-vous sûr de vouloir supprimer toutes les tâches complétées ?')) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            renderTasks();
            updateStats();
            showNotification('Tâches complétées supprimées');
        }
    } else {
        showNotification('Aucune tâche complétée à supprimer');
    }
}

// Clear All Tasks
function clearAllTasks() {
    if (tasks.length > 0) {
        if (confirm('Êtes-vous VRAIMENT sûr de vouloir supprimer TOUTES les tâches ? Cette action est irréversible.')) {
            if (confirm('Dernière confirmation ?')) {
                tasks = [];
                saveTasks();
                renderTasks();
                updateStats();
                currentFilter = 'tous';
                currentCategory = 'tous';
                searchTerm = '';
                filterButtons.forEach(btn => btn.classList.remove('active'));
                filterButtons[0].classList.add('active');
                categoryTabs.forEach(tab => tab.classList.remove('active'));
                categoryTabs[0].classList.add('active');
                showNotification('Toutes les tâches ont été supprimées');
            }
        }
    } else {
        showNotification('Aucune tâche à supprimer');
    }
}

// Export Tasks
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('Tâches exportées');
}

// Update Stats
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(t => t.priority === 'haute' && !t.completed).length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('highPriorityTasks').textContent = highPriority;

    // Update category counts
    categoryTabs.forEach(tab => {
        const category = tab.dataset.category;
        let count = 0;
        if (category === 'tous') {
            count = tasks.length;
        } else {
            count = tasks.filter(t => t.category === category).length;
        }
        tab.textContent = tab.textContent.replace(/\(\d+\)/, `(${count})`);
    });
}

// Theme Management
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('tasks');
    tasks = saved ? JSON.parse(saved) : [];
}

// Utility Functions
function clearInputs() {
    taskInput.value = '';
    categorySelect.value = 'travail';
    prioritySelect.value = 'moyenne';
    dueDateInput.value = '';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getPriorityIcon(priority) {
    switch(priority) {
        case 'haute': return '🔴';
        case 'moyenne': return '🟡';
        case 'basse': return '🟢';
        default: return '•';
    }
}

function getCategoryIcon(category) {
    const icons = {
        'travail': '💼',
        'personnel': '👤',
        'courses': '🛒',
        'sante': '❤️',
        'autre': '📌'
    };
    return icons[category] || '📌';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);