import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForElement(locator: Locator, timeout = 5000) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
    } catch {
      throw new Error(`Element not visible after ${timeout}ms`);
    }
  }

  async click(locator: Locator) {
    try {
      await this.waitForElement(locator);
      await locator.click();
    } catch {
      throw new Error(`Failed to click on element`);
    }
  }

  async fill(locator: Locator, value: string) {
    try {
      await this.waitForElement(locator);
      await locator.fill(value);
    } catch {
      throw new Error(`Failed to fill value: ${value}`);
    }
  }

  async scrollTo(locator: Locator) {
    try {
      await locator.scrollIntoViewIfNeeded();
    } catch {
      throw new Error(`Failed to scroll to element`);
    }
  }

  async takeScreenshot(name: string) {
    try {
      await this.page.screenshot({
        path: `screenshots/${name}.png`,
        fullPage: true,
      });
    } catch {
      throw new Error(`Failed to take screenshot`);
    }
  }
}
