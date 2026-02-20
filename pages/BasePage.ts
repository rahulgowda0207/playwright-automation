// ============================================================
// Day 4: Advanced POM - BasePage with method chaining support,
//        dynamic locators, and reusable page validations
// Day 6: Added Winston logger for action-level logging
// ============================================================

import { Page, Locator, expect } from '@playwright/test';
import logger from '../utils/Logger';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Day 4: Method chaining - all actions return 'this' for fluent API ---

  async waitForElement(locator: Locator, timeout = 5000): Promise<this> {
    logger.debug(`Waiting for element to be visible (timeout: ${timeout}ms)`);
    await locator.waitFor({ state: 'visible', timeout });
    return this;
  }

  async click(locator: Locator): Promise<this> {
    logger.info(`Clicking element`);
    await this.waitForElement(locator);
    await locator.click();
    return this;
  }

  async fill(locator: Locator, value: string): Promise<this> {
    logger.info(`Filling element with value: "${value}"`);
    await this.waitForElement(locator);
    await locator.fill(value);
    return this;
  }

  async scrollTo(locator: Locator): Promise<this> {
    logger.debug(`Scrolling to element`);
    await locator.scrollIntoViewIfNeeded();
    return this;
  }

  async takeScreenshot(name: string): Promise<this> {
    logger.info(`Taking screenshot: screenshots/${name}.png`);
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
    logger.debug(`Validating URL contains: "${expectedUrlPart}"`);
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
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    return this;
  }

  async waitForPageLoad(): Promise<this> {
    logger.debug(`Waiting for page load (networkidle)`);
    await this.page.waitForLoadState('networkidle');
    return this;
  }
}
