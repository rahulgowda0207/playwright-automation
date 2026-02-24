// CheckoutPage: page object for the SauceDemo checkout flow
// (step-one, step-two overview, and complete screens).
// Inherits BasePage; supports method chaining.
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // --- Step One locators ---
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // --- Step Two (Overview) locators ---
  readonly summaryInfo: Locator;
  readonly itemTotal: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly summaryItems: Locator;

  // --- Complete page locators ---
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    // Step One
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step Two
    this.summaryInfo = page.locator('.summary_info');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.summaryItems = page.locator('.cart_item');

    // Complete
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');

    this.pageTitle = page.locator('.title');
  }

  // --- Method chaining - Step One form fill ---

  async enterFirstName(firstName: string): Promise<this> {
    await this.fill(this.firstNameInput, firstName);
    return this;
  }

  async enterLastName(lastName: string): Promise<this> {
    await this.fill(this.lastNameInput, lastName);
    return this;
  }

  async enterPostalCode(postalCode: string): Promise<this> {
    await this.fill(this.postalCodeInput, postalCode);
    return this;
  }

  async fillShippingInfo(firstName: string, lastName: string, postalCode: string): Promise<this> {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterPostalCode(postalCode);
    return this;
  }

  // clickContinue intentionally does NOT add a URL wait: it is also called in
  // the error-validation tests where the URL stays on step-one.
  async clickContinue(): Promise<this> {
    await this.click(this.continueButton);
    return this;
  }

  async clickFinish(): Promise<this> {
    await this.click(this.finishButton);
    // Wait for navigation to the order-complete screen
    await this.page.waitForURL('**/checkout-complete.html');
    return this;
  }

  async clickBackHome(): Promise<this> {
    await this.click(this.backHomeButton);
    // Wait for navigation back to the product inventory
    await this.page.waitForURL('**/inventory.html');
    return this;
  }

  // --- Page-specific validations ---

  async validateOnCheckoutStepOne(): Promise<this> {
    await this.validateUrl('checkout-step-one.html');
    await this.validateElementText(this.pageTitle, 'Checkout: Your Information');
    return this;
  }

  async validateOnCheckoutStepTwo(): Promise<this> {
    await this.validateUrl('checkout-step-two.html');
    await this.validateElementText(this.pageTitle, 'Checkout: Overview');
    return this;
  }

  async validateOnCheckoutComplete(): Promise<this> {
    await this.validateUrl('checkout-complete.html');
    await this.validateElementText(this.pageTitle, 'Checkout: Complete!');
    return this;
  }

  async validateOrderComplete(): Promise<this> {
    await this.validateElementVisible(this.completeHeader);
    await this.validateElementText(this.completeHeader, 'Thank you for your order!');
    return this;
  }

  async validateCheckoutError(expectedMessage: string): Promise<this> {
    await this.validateElementVisible(this.errorMessage);
    await expect(this.errorMessage).toContainText(expectedMessage);
    return this;
  }

  async getTotalPrice(): Promise<string> {
    return await this.getText(this.totalLabel);
  }

  // --- Dynamic locator - find summary item by name ---
  getSummaryItemByName(productName: string): Locator {
    return this.dynamicLocator('.cart_item:has-text("{{value}}")', productName);
  }
}
