// ============================================================
// Day 4: Advanced POM - BasePage with method chaining support,
//        dynamic locators, and reusable page validations
// ============================================================

import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Day 4: Method chaining - all actions return 'this' for fluent API ---

  async waitForElement(locator: Locator, timeout = 5000): Promise<this> {
    await locator.waitFor({ state: 'visible', timeout });
    return this;
  }

  async click(locator: Locator): Promise<this> {
    await this.waitForElement(locator);
    await locator.click();
    return this;
  }

  async fill(locator: Locator, value: string): Promise<this> {
    await this.waitForElement(locator);
    await locator.fill(value);
    return this;
  }

  async scrollTo(locator: Locator): Promise<this> {
    await locator.scrollIntoViewIfNeeded();
    return this;
  }

  async takeScreenshot(name: string): Promise<this> {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
    return this;
  }

  // --- Day 4: Dynamic locator helpers - locate elements by dynamic text/attributes ---

  dynamicLocator(selector: string, dynamicValue: string): Locator {
    return this.page.locator(selector.replace('{{value}}', dynamicValue));
  }

  getByTextExact(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  // --- Day 4: Page-specific validation helpers ---

  async validateUrl(expectedUrlPart: string): Promise<this> {
    expect(this.page.url()).toContain(expectedUrlPart);
    return this;
  }

  async validateTitle(expectedTitle: string | RegExp): Promise<this> {
    await expect(this.page).toHaveTitle(expectedTitle);
    return this;
  }

  async validateElementVisible(locator: Locator): Promise<this> {
    await expect(locator).toBeVisible();
    return this;
  }

  async validateElementText(locator: Locator, expectedText: string): Promise<this> {
    await expect(locator).toHaveText(expectedText);
    return this;
  }

  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent()) || '';
  }

  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  async navigateTo(url: string): Promise<this> {
    await this.page.goto(url);
    return this;
  }

  async waitForPageLoad(): Promise<this> {
    await this.page.waitForLoadState('networkidle');
    return this;
  }
}
