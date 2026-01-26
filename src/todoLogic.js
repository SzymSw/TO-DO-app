export class TodoApp {
    constructor(apiService) {
        this.tasks = [];
        this.apiService = apiService; // Wstrzykiwanie zależności
    }

    addTask(title, priority = 'normal') {
        if (!title || title.trim() === '') {
            throw new Error('Tytuł zadania nie może być pusty');
        }
        if (title.length < 3) {
            throw new Error('Tytuł zadania jest za krótki (min. 3 znaki)');
        }

        const newTask = {
            id: Date.now(),
            title: title,
            completed: false,
            priority: priority,
            createdAt: new Date()
        };

        this.tasks.push(newTask);
        return newTask;
    }

    removeTask(id) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        
        if (this.tasks.length === initialLength) {
            throw new Error('Zadanie o podanym ID nie istnieje');
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) throw new Error('Nie znaleziono zadania');
        task.completed = !task.completed;
        return task.completed;
    }

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        // Zabezpieczenie przed dzieleniem przez zero
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

        return { total, completed, pending, percent };
    }

    // Metoda asynchroniczna używająca zewnętrznego API (do mockowania)
    async saveAll() {
        if (this.tasks.length === 0) {
            throw new Error('Brak zadań do zapisania');
        }
        return await this.apiService.saveTasks(this.tasks);
    }
}