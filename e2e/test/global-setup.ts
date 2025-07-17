import { chromium, FullConfig, request } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

async function globalSetup(config: FullConfig) {
  const apiContext = await request.newContext();

  await apiContext.post('http://localhost:5000/api/test/clear-db');

  const username = process.env['TEST_USERNAME'];
  const password = process.env['TEST_PASSWORD'];
  const email = process.env['TEST_EMAIL'];

  if (!username || !email || !password) {
    throw new Error('❌ TEST_USERNAME、TEST_EMAIL 或 TEST_PASSWORD 未設定於 .env');
  }

  console.log('🚀 註冊...');
  const response = await apiContext.post('http://localhost:5000/api/register', {
    data: { username, password, email },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`❌ 註冊失敗：${body}`);
  }

  await apiContext.post('http://localhost:5000/api/test/verify-user', { data: { email } });

  console.log('✅ 已驗證 Email');

  console.log('🚀 登入...');
  const loginResponse = await apiContext.post('http://localhost:5000/api/login', {
    data: { username, password },
  });

  if (!loginResponse.ok()) {
    const body = await loginResponse.text();
    throw new Error(`❌ 登入失敗：${body}`);
  }

  const loginData = await loginResponse.json();
  const accessToken = loginData.access_token;

  console.log('✅ 取得 access_token');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:4200');
  await page.evaluate(({ token, username }: { token: string; username: string }) => {
    localStorage.setItem('token', token); // 名稱要跟 interceptor 對！
    localStorage.setItem('username', username); // 加入 username
  }, { token: accessToken, username });

  await page.context().storageState({ path: './test/storageState.json' });

  await browser.close();
  await apiContext.dispose();

  console.log('✅ 已寫入 storageState.json');
}

export default globalSetup;