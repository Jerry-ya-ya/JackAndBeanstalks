// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.getByRole('link', { name: 'Todo' }).click();
//   await expect(page.getByRole('heading', { name: 'Todo List' })).toBeVisible();
//   await expect(page.getByRole('textbox', { name: 'Add new todo' })).toBeVisible();
//   await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
//   await expect(page.getByRole('textbox', { name: 'Add new todo' })).toBeVisible();
//   await page.getByRole('textbox', { name: 'Add new todo' }).click();
//   await page.getByRole('textbox', { name: 'Add new todo' }).fill('Angular');
//   await page.getByRole('button', { name: 'Add' }).click();
//   await page.getByRole('checkbox').check();
//   await page.getByRole('checkbox').uncheck();
//   await expect(page.getByText('Angular')).toBeVisible();
//   await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
//   await page.getByRole('button', { name: 'Delete' }).click();
// });