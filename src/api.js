export class APIService {
    constructor() {
        this.database = [];
    }

    // Symulacja zapisu do bazy danych (trwa 500ms)
    async saveTasks(tasks) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.database = tasks;
                console.log('Zapisano do bazy:', tasks);
                resolve(true);
            }, 500);
        });
    }

    // Symulacja pobierania danych
    async getTasks() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.database);
            }, 500);
        });
    }
}