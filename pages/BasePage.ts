// BasePage: base class for all page objects.
// Provides method chaining, dynamic locators, reusable
// validations, and action-level Winston logging.

import { Page, Locator, expect } from '@playwright/test';
import * as fs from 'fs';
import logger from '../utils/Logger';

// Configurable via DEFAULT_TIMEOUT env var; falls back to 5000 ms
const DEFAULT_TIMEOUT = parseInt(process.env.DEFAULT_TIMEOUT || '5000', 10);

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Method chaining — all actions return 'this' for fluent API ---

  async waitForElement(locator: Locator, timeout = DEFAULT_TIMEOUT): Promise<this> {
    logger.debug(`Waiting for element: ${locator} (timeout: ${timeout}ms)`);
    await locator.waitFor({ state: 'visible', timeout });
    return this;
  }

  async click(locator: Locator): Promise<this> {
    logger.info(`Clicking element: ${locator}`);
    await this.waitForElement(locator);
    await locator.click();
    return this;
  }

  async fill(locator: Locator, value: string): Promise<this> {
    // Value intentionally omitted from the log to avoid exposing passwords
    logger.info(`Filling element: ${locator}`);
    await this.waitForElement(locator);
    await locator.fill(value);
    return this;
  }

  async scrollTo(locator: Locator): Promise<this> {
    logger.debug(`Scrolling to element: ${locator}`);
    await locator.scrollIntoViewIfNeeded();
    return this;
  }

  async takeScreenshot(name: string): Promise<this> {
    const screenshotsDir = 'screenshots';
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    logger.info(`Taking screenshot: ${screenshotsDir}/${name}.png`);
    await this.page.screenshot({
      path: `${screenshotsDir}/${name}.png`,
      fullPage: true,
    });
    return this;
  }

  // --- Dynamic locator helpers ---

  dynamicLocator(selector: string, dynamicValue: string): Locator {
    return this.page.locator(selector.replace('{{value}}', dynamicValue));
  }

  getByTextExact(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  // --- Page-specific validation helpers ---

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
