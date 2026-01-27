import { TodoApp } from './todoLogic.js';
import { APIService } from './api.js';

const api = new APIService();
const app = new TodoApp(api);

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const list = document.getElementById('task-list');
const errorMsg = document.getElementById('error-msg');
const stats = document.getElementById('stats');

function render() {
    list.innerHTML = '';
    errorMsg.textContent = '';
    
    app.tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onclick = () => {
            app.toggleTask(task.id);
            render();
        };

        // Task text container
        const taskText = document.createElement('span');
        taskText.textContent = `${task.title} [${task.priority}]`;
        if (task.completed) taskText.classList.add('completed');

        // Delete button (X)
        const delBtn = document.createElement('button');
        delBtn.textContent = '×';
        delBtn.className = 'delete-btn';
        delBtn.onclick = () => {
            app.removeTask(task.id);
            render();
        };

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(delBtn);
        list.appendChild(li);
    });

    const s = app.getStats();
    stats.textContent = `Razem: ${s.total} | Ukończone: ${s.percent}%`;
}

addBtn.addEventListener('click', () => {
    try {
        app.addTask(input.value, document.getElementById('priority-select').value);
        input.value = '';
        render();
    } catch (e) {
        errorMsg.textContent = e.message;
    }
});

saveBtn.addEventListener('click', async () => {
    try {
        await app.saveAll();
        alert('Zapisano!');
    } catch (e) {
        errorMsg.textContent = e.message;
    }
});