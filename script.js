const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const fabBtn = document.getElementById('fab-btn');
const modalOverlay = document.getElementById('modal-overlay');
const cancelBtn = document.getElementById('cancel-btn');
const applyBtn = document.getElementById('apply-btn');
const newNoteInput = document.getElementById('new-note-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<img id="theme-icon" src="/assets/sun.svg" alt="Toggle Light Theme">' : '<img id="theme-icon" src="/assets/moon.svg" alt="Toggle Dark Theme">';
});

fabBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('hidden');
    newNoteInput.focus();
});

function closeModal() {
    modalOverlay.classList.add('hidden');
    newNoteInput.value = '';
}

cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

applyBtn.addEventListener('click', () => {
    const text = newNoteInput.value.trim();
    if (text) {
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        todos.push(newTodo);
        saveAndRender();
        closeModal();
    }
});

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveAndRender();
}

function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    render();
}

function render() {
    todoList.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();

    const filteredTodos = todos.filter(todo => {
        let matchFilter = true;
        if (filterSelect.value === 'completed') matchFilter = todo.completed;
        if (filterSelect.value === 'incomplete') matchFilter = !todo.completed;

        const matchSearch = todo.text.toLowerCase().includes(searchTerm);
        
        return matchFilter && matchSearch;
    });

    if (filteredTodos.length === 0) {
        if(searchTerm === '' && filterSelect.value === 'all' && todos.length === 0){
             emptyState.classList.add('visible');
             todoList.style.display = 'none';
        } else {
             emptyState.classList.remove('visible');
             todoList.style.display = 'block';
             todoList.innerHTML = '<li style="text-align:center; padding:20px; opacity:0.5;">No matches found.</li>';
        }
    } else {
        emptyState.classList.remove('visible');
        todoList.style.display = 'block';

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="todo-left">
                    <div class="custom-checkbox" onclick="toggleComplete(${todo.id})">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <span class="todo-text">${todo.text}</span>
                </div>
                <div class="todo-actions">
                    <i class="fa-solid fa-pen" title="Edit (Coming Soon)"></i>
                    <i class="fa-solid fa-trash" onclick="deleteTodo(${todo.id})"></i>
                </div>
            `;
            todoList.appendChild(li);
        });
    }
}

searchInput.addEventListener('input', render);
filterSelect.addEventListener('change', render);

initTheme();
render();