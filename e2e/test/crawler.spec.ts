import { test, expect } from '@playwright/test';

// test.describe('Crawler API Tests', () => {
//   let accessToken: string;

//   test.beforeAll(async ({ request }) => {
//     const username = process.env['ADMIN_USERNAME'] || 'testuser';
//     const password = process.env['ADMIN_PASSWORD'] || 'testpass';

//     // 登入取得 token
//     const loginResponse = await request.post('http://flask-test:5000/api/login', {
//       data: { username, password }
//     });
    
//     const loginData = await loginResponse.json();
//     accessToken = loginData.access_token;
//   });

//   test('should get crawler schedule info with status 200', async ({ request }) => {
//     const response = await request.get('http://flask-test:5000/api/crawler/info', {
//       headers: { 'Authorization': `Bearer ${accessToken}` }
//     });

//     expect(response.status()).toBe(200);
//   });

//   test('should get news list with status 200', async ({ request }) => {
//     const response = await request.get('http://flask-test:5000/api/crawler/news', {
//       headers: { 'Authorization': `Bearer ${accessToken}` }
//     });

//     expect(response.status()).toBe(200);
//   });

//   test('should trigger manual crawler with status 200', async ({ request }) => {
//     const response = await request.post('http://flask-test:5000/api/crawler/fetch', {
//       headers: { 'Authorization': `Bearer ${accessToken}` }
//     });

//     expect(response.status()).toBe(200);
//     const data = await response.json();
//     expect(data.message).toBeDefined();
//     console.log('🔄 手動爬蟲結果：', data);
//   });

//   test('should get updated news after manual crawl', async ({ request }) => {
//     // 等待一下讓爬蟲完成
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     const response = await request.get('http://flask-test:5000/api/crawler/news', {
//       headers: { 'Authorization': `Bearer ${accessToken}` }
//     });

//     expect(response.status()).toBe(200);
//     const news = await response.json();
//     expect(Array.isArray(news)).toBe(true);
//     expect(news.length).toBeGreaterThan(0);
//   });
// });
test('page', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: '帳號' }).click();
  await page.getByRole('textbox', { name: '帳號' }).fill('Test');
  await page.getByRole('textbox', { name: '帳號' }).press('Tab');
  await page.getByRole('textbox', { name: '密碼' }).fill('123');
  await page.getByRole('button', { name: '登入' }).click();
  await page.getByRole('link', { name: 'Crawler' }).click();
  await expect(page.getByRole('heading', { name: '即時科技新聞' })).toBeVisible();
  await expect(page.getByRole('button', { name: '📥 抓取最新新聞' })).toBeVisible();
  await expect(page.getByRole('button', { name: '重新整理' })).toBeVisible();
  await expect(page.getByText('📌 上次爬蟲時間：')).toBeVisible();
  await expect(page.getByText('📅 下次預定爬蟲：')).toBeVisible();
});