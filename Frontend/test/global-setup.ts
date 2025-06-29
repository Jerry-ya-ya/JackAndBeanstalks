import { chromium, FullConfig, request } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

async function globalSetup(config: FullConfig) {
  const apiContext = await request.newContext();

  // 1️⃣ 先清空資料庫
  await apiContext.post('http://flask-test:5000/api/test/clear-db');

  // 2️⃣ 呼叫後端的註冊 API
  const username = process.env['ADMIN_USERNAME'];
  const password = process.env['ADMIN_PASSWORD'];
  const email = process.env['ADMIN_EMAIL'];

  if (!username || !email || !password) {
    throw new Error('❌ ADMIN_USERNAME、ADMIN_EMAIL 或 ADMIN_PASSWORD 未設定於 .env');
  }

  console.log('🚀 直接呼叫後端 API 註冊...');
  const response = await apiContext.post('http://flask-test:5000/api/register', {
    data: {
      username: username,
      password: password,
      email: email,
    }
  });

  if (response.ok()) {
    console.log('✅ 註冊成功');
  } else {
    console.error('❌ 註冊失敗，請檢查後端 API，狀態碼：', response.status());
    const body = await response.text();
    console.error('後端回傳內容：', body);
    throw new Error('❌ 註冊失敗，請檢查 log');
  }

  // 3️⃣ 呼叫後端 API 把使用者 email_verified 改為 True
  await apiContext.post('http://flask-test:5000/api/test/verify-user', {
    data: { email: email }
  });

  console.log('✅ Email 驗證完成');

  // 4️⃣ 用瀏覽器登入一次 → 取得登入憑證
  // const browser = await chromium.launch();
  // const page = await browser.newPage();

  // await page.goto('http://localhost:4200/login');

  // await page.getByLabel('帳號：').fill(username);
  // await page.getByLabel('密碼：').fill(password);
  // await page.getByRole('button', { name: '登入' }).click();

  // await page.waitForURL('**/home');

  // await page.context().storageState({ path: 'test/storageState.json' });
  // await browser.close();
  await apiContext.dispose();

  // console.log('✅ 登入憑證已儲存 → test/storageState.json');
}

export default globalSetup;