describe('Test konfiguracji', () => {
    it('powinien wiedzieć, że 2 + 2 to 4', () => {
        expect(2 + 2).toBe(4);
    });

    it('powinien mieć dostęp do obiektu document (jsdom)', () => {
        const div = document.createElement('div');
        expect(div).toBeDefined();
    });
});