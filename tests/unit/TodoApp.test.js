import { describe, it, expect, vi } from 'vitest';
import { TodoApp } from '../../src/todoLogic.js';

describe('TodoApp - logika dodawania', () => {

    it('1. addTask dodaje zadanie do tablicy', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });

        app.addTask('Nowe zadanie');

        expect(app.tasks.length).toBe(1);
    });

    it('2. nowe zadanie ma completed = false', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });

        const task = app.addTask('Task');

        expect(task.completed).toBe(false);
    });

    it('3. addTask rzuca błąd, gdy tytuł jest pusty', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });

        expect(() => app.addTask('')).toThrow();
    });

    it('4. addTask rzuca błąd, gdy tytuł ma mniej niż 3 znaki', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });

        expect(() => app.addTask('ab')).toThrow();
    });

    it('5. addTask poprawnie ustawia priorytet', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });

        const task = app.addTask('Ważne', 'high');

        expect(task.priority).toBe('high');
    });
});

describe('TodoApp - usuwanie i toggle', () => {

    it('6. removeTask usuwa zadanie', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });
        const task = app.addTask('Do usunięcia');

        app.removeTask(task.id);

        expect(app.tasks.length).toBe(0);
    });

    it('7. removeTask rzuca błąd dla nieistniejącego ID', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });

        expect(() => app.removeTask(123)).toThrow();
    });

    it('8. toggleTask zmienia status na true', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });
        const task = app.addTask('Toggle');

        app.toggleTask(task.id);

        expect(task.completed).toBe(true);
    });

    it('9. toggleTask zmienia status z true na false', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });
        const task = app.addTask('Toggle');

        app.toggleTask(task.id);
        app.toggleTask(task.id);

        expect(task.completed).toBe(false);
    });

    it('10. toggleTask rzuca błąd dla złego ID', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });

        expect(() => app.toggleTask(999)).toThrow();
    });
});

describe('TodoApp - statystyki', () => {

    it('11. getStats zwraca total = 0 dla pustej listy', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });

        const stats = app.getStats();

        expect(stats.total).toBe(0);
    });

    it('12. getStats poprawnie liczy ukończone', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });
        const task = app.addTask('To-Do task A');
        app.addTask('To-Do task B');

        app.toggleTask(task.id);

        expect(app.getStats().completed).toBe(1);
    });

    it('13. getStats poprawnie liczy pending', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });
        const task = app.addTask('To-Do task A');
        app.addTask('To-Do task B');

        app.toggleTask(task.id);

        expect(app.getStats().pending).toBe(1);
    });

    it('14. getStats poprawnie liczy procent (50%)', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });
        const task = app.addTask('To-Do task A');
        app.addTask('To-Do task B');

        app.toggleTask(task.id);

        expect(app.getStats().percent).toBe(50);
    });

    it('15. getStats zwraca 0%, gdy lista jest pusta', () => {
        const app = new TodoApp({ saveTasks: vi.fn() });

        expect(app.getStats().percent).toBe(0);
    });
});

describe('TodoApp - mockowanie API', () => {

    it('16. saveAll wywołuje apiService.saveTasks', async () => {
        const mockApi = { saveTasks: vi.fn().mockResolvedValue(true) };
        const app = new TodoApp(mockApi);

        app.addTask('Zapis');

        await app.saveAll();

        expect(mockApi.saveTasks).toHaveBeenCalled();
    });

    it('17. saveAll przekazuje listę zadań do API', async () => {
        const mockApi = { saveTasks: vi.fn().mockResolvedValue(true) };
        const app = new TodoApp(mockApi);

        app.addTask('Task');

        await app.saveAll();

        expect(mockApi.saveTasks).toHaveBeenCalledWith(app.tasks);
    });

    it('18. saveAll rzuca błąd, gdy lista jest pusta', async () => {
        const mockApi = { saveTasks: vi.fn() };
        const app = new TodoApp(mockApi);

        await expect(app.saveAll()).rejects.toThrow();
    });

    it('19. saveAll zwraca Promise', () => {
        const mockApi = { saveTasks: vi.fn().mockResolvedValue(true) };
        const app = new TodoApp(mockApi);

        app.addTask('Async');

        const result = app.saveAll();

        expect(result).toBeInstanceOf(Promise);
    });

    it('20. obsługa błędu API', async () => {
        const mockApi = {
            saveTasks: vi.fn().mockRejectedValue(new Error('API error'))
        };
        const app = new TodoApp(mockApi);

        app.addTask('Błąd');

        await expect(app.saveAll()).rejects.toThrow('API error');
    });
});
