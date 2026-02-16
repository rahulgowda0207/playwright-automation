// ============================================================
// Day 4: Advanced POM - LoginPage with method chaining,
//        dynamic locators, and page-specific validations
// ============================================================

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // --- Static locators ---
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginLogo = page.locator('.login_logo');
  }

  // --- Day 4: Method chaining - login actions return 'this' ---

  async enterUsername(username: string): Promise<this> {
    await this.fill(this.usernameInput, username);
    return this;
  }

  async enterPassword(password: string): Promise<this> {
    await this.fill(this.passwordInput, password);
    return this;
  }

  async clickLogin(): Promise<this> {
    await this.click(this.loginButton);
    return this;
  }

  // Chained login: allows fluent usage
  async login(username: string, password: string): Promise<this> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
    return this;
  }

  // --- Day 4: Page-specific validations ---

  async validateLoginPageLoaded(): Promise<this> {
    await this.validateElementVisible(this.loginLogo);
    await this.validateElementVisible(this.usernameInput);
    await this.validateElementVisible(this.loginButton);
    return this;
  }

  async validateErrorMessage(expectedMessage: string): Promise<this> {
    await this.validateElementVisible(this.errorMessage);
    await expect(this.errorMessage).toContainText(expectedMessage);
    return this;
  }

  async validateNoErrorMessage(): Promise<this> {
    await expect(this.errorMessage).not.toBeVisible();
    return this;
  }

  // --- Day 4: Dynamic locator - select a specific user from accepted usernames list ---
  getUsernameByText(username: string): Locator {
    return this.dynamicLocator('#login_credentials:has-text("{{value}}")', username);
  }
}
