export class APIService {
    constructor() {
        this.apiUrl = 'https://goepo29ilj.execute-api.eu-north-1.amazonaws.com/default/TodoBackend';
    }

    async saveTasks(tasks) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tasks)
            });

            if (!response.ok) {
                throw new Error('Błąd zapisu do chmury');
            }
            
            console.log('Zapisano do AWS!');
            return true;
        } catch (error) {
            console.error('Błąd API:', error);
            throw error;
        }
    }

    async getTasks() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Błąd pobierania z chmury');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd API:', error);
            return [];
        }
    }
}
