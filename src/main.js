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
        li.textContent = `${task.title} [${task.priority}] `;
        if (task.completed) li.classList.add('completed');

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = task.completed ? 'Cofnij' : 'Zrób';
        toggleBtn.onclick = () => {
            app.toggleTask(task.id);
            render();
        };

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Usuń';
        delBtn.className = 'delete-btn'; // klasa dla testów E2E
        delBtn.onclick = () => {
            app.removeTask(task.id);
            render();
        };

        li.appendChild(toggleBtn);
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