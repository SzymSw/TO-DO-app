import { test, expect } from '@playwright/test';

test('Tytuł strony powinien być poprawny', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/TaskMaster/);
  const header = page.locator('h1');
  await expect(header).toHaveText('TaskMaster');
});

test(' Po wpisaniu tekstu i kliknięciu "Dodaj" powinno dodać się nowe zadanie do listy', async ({ page }) => {
  await page.goto('/');
  await page.fill('#task-input', 'Zrobić projekt z testowania');
  await page.click('#add-btn');
  const list = page.locator('#task-list');
  await expect(list).toContainText('Zrobić projekt z testowania');
});

test('Powinno wyświetlić błąd przy próbie dodania pustego zadania', async ({ page }) => {
  await page.goto('/');
  await page.click('#add-btn');
  const errorDiv = page.locator('#error-msg');
  await expect(errorDiv).toHaveText('Tytuł zadania nie może być pusty');
});

test('Powinno wyczyścić pole input po poprawnym dodaniu zadania', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('#task-input');
  await input.fill('Zadanie testowe');
  await page.click('#add-btn');
  await expect(input).toHaveValue('');
});

test('Powinno usunąć zadanie z listy po kliknięciu przycisku Usuń', async ({ page }) => {
  await page.goto('/');
  const taskText = 'Zadanie do usunięcia';
  await page.fill('#task-input', taskText);
  await page.click('#add-btn');
  const list = page.locator('#task-list');
  await expect(list).toContainText(taskText);
  await page.click('.delete-btn');
  await expect(list).not.toContainText(taskText);
});

test('Powinno skreślić zadanie po kliknięciu "Zrób"', async ({ page }) => {
  await page.goto('/');
  await page.fill('#task-input', 'Wykonane zadanie');
  await page.click('#add-btn');
  const taskItem = page.locator('#task-list li').first();
  await taskItem.locator('button', { hasText: 'Zrób' }).click();
  await expect(taskItem).toHaveClass(/completed/);
});

test('Powinno poprawnie pokazywać sumę zadań', async ({ page }) => {
  await page.goto('/');
  await page.fill('#task-input', 'Zadanie nr 1');
  await page.click('#add-btn');
  await page.fill('#task-input', 'Zadanie nr 2');
  await page.click('#add-btn');
  const stats = page.locator('#stats');
  await expect(stats).toContainText('Razem: 2');
});

test('Powinno dodać zadanie z priorytetem high po wybraniu opcji Pilne', async ({ page }) => {
  await page.goto('/');
  await page.fill('#task-input', 'Mega ważne zadanie');
  await page.selectOption('#priority-select', 'high');
  await page.click('#add-btn');
  const list = page.locator('#task-list');
  await expect(list).toContainText('[high]');
});

test('Powinno wyświetlić czerwony alert przy próbie zapisu pustej listy', async ({ page }) => {
  await page.goto('/');
  await page.click('#save-btn');
  const errorDiv = page.locator('#error-msg');
  await expect(errorDiv).toHaveText('Brak zadań do zapisania');
});

test('Powinno wskazywać poprawny % postępu po oznaczeniu jakiegoś zadania jako wykonane', async ({ page }) => {
  await page.goto('/');
  const tasksToAdd = ['Zrobić projekt z testowania', 'Zrobić projekt z AWSa', 'Nauczyć się na FiB', 'Napisać 1-szy rozdział licencjatu'];
  
  for (const taskName of tasksToAdd) {
    await page.fill('#task-input', taskName);
    await page.click('#add-btn');
  }

  await expect(page.locator('#task-list li')).toHaveCount(4);
  await page.locator('#task-list li').first().locator('button', { hasText: 'Zrób' }).click();
  const stats = page.locator('#stats');
  await expect(stats).toContainText('25%');
});