import { test, expect } from '../base/BaseTest';
import { LoginPage } from '../../pages/LoginPage';

test('E-commerce login using reusable BasePage methods', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('https://www.saucedemo.com/');

  await loginPage.login('standard_user', 'secret_sauce');

  await loginPage.takeScreenshot('login-success');

  expect(page.url()).toContain('inventory');
});
