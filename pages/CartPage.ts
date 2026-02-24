// CartPage: page object for the SauceDemo shopping cart.
// Inherits BasePage; supports method chaining and dynamic locators.

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // --- Static locators ---
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.pageTitle = page.locator('.title');
  }

  // --- Dynamic locators ---

  getCartItemByName(productName: string): Locator {
    return this.dynamicLocator('.cart_item:has-text("{{value}}")', productName);
  }

  getRemoveButtonByTestId(productTestId: string): Locator {
    return this.page.locator(`[data-test="remove-${productTestId}"]`);
  }

  // --- Method chaining actions ---

  async removeItem(productTestId: string): Promise<this> {
    await this.click(this.getRemoveButtonByTestId(productTestId));
    return this;
  }

  async proceedToCheckout(): Promise<this> {
    await this.click(this.checkoutButton);
    // Wait for navigation to checkout step one
    await this.page.waitForURL('**/checkout-step-one.html');
    return this;
  }

  async continueShopping(): Promise<this> {
    await this.click(this.continueShoppingButton);
    // Wait for navigation back to inventory
    await this.page.waitForURL('**/inventory.html');
    return this;
  }

  // --- Page-specific validations ---

  async validateOnCartPage(): Promise<this> {
    await this.validateUrl('cart.html');
    await this.validateElementVisible(this.checkoutButton);
    await this.validateElementText(this.pageTitle, 'Your Cart');
    return this;
  }

  async validateCartItemCount(expectedCount: number): Promise<this> {
    const count = await this.getElementCount(this.cartItems);
    expect(count).toBe(expectedCount);
    return this;
  }

  async validateProductInCart(productName: string): Promise<this> {
    const item = this.getCartItemByName(productName);
    await this.validateElementVisible(item);
    return this;
  }

  async validateCartEmpty(): Promise<this> {
    const count = await this.getElementCount(this.cartItems);
    expect(count).toBe(0);
    return this;
  }
}
