// InventoryPage: page object for the SauceDemo product listing.
// Inherits BasePage; supports method chaining and dynamic locators.

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  // --- Static locators ---
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.pageTitle = page.locator('.title');
  }

  // --- Dynamic locators ---

  getProductByName(productName: string): Locator {
    return this.dynamicLocator('.inventory_item:has-text("{{value}}")', productName);
  }

  getAddToCartButton(productTestId: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productTestId}"]`);
  }

  getRemoveButton(productTestId: string): Locator {
    return this.page.locator(`[data-test="remove-${productTestId}"]`);
  }

  // --- Method chaining actions ---

  async addProductToCart(productTestId: string): Promise<this> {
    await this.click(this.getAddToCartButton(productTestId));
    return this;
  }

  async removeProductFromCart(productTestId: string): Promise<this> {
    await this.click(this.getRemoveButton(productTestId));
    return this;
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<this> {
    await this.sortDropdown.selectOption(value);
    return this;
  }

  async openCart(): Promise<this> {
    await this.click(this.cartLink);
    // Wait for navigation to complete before returning
    await this.page.waitForURL('**/cart.html');
    return this;
  }

  async logout(): Promise<this> {
    await this.click(this.burgerMenuButton);
    // Wait for sidebar animation using the playwright config default timeout
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.click(this.logoutLink);
    await this.page.waitForURL('**/');
    return this;
  }

  async clickProductTitle(productName: string): Promise<this> {
    const productLink = this.page.locator('.inventory_item_name', { hasText: productName });
    await this.click(productLink);
    // Wait for navigation to the product detail page
    await this.page.waitForURL(/inventory-item/);
    return this;
  }

  // --- Page-specific validations ---

  async validateOnInventoryPage(): Promise<this> {
    await this.validateUrl('inventory.html');
    await this.validateElementVisible(this.inventoryList);
    await this.validateElementText(this.pageTitle, 'Products');
    return this;
  }

  async validateProductCount(expectedCount: number): Promise<this> {
    const count = await this.getElementCount(this.inventoryItems);
    expect(count).toBe(expectedCount);
    return this;
  }

  async validateCartBadgeCount(expectedCount: string): Promise<this> {
    await this.validateElementText(this.cartBadge, expectedCount);
    return this;
  }

  async validateCartBadgeNotVisible(): Promise<this> {
    await expect(this.cartBadge).not.toBeVisible();
    return this;
  }

  async getProductPrice(productName: string): Promise<string> {
    const priceLocator = this.getProductByName(productName).locator('.inventory_item_price');
    return await this.getText(priceLocator);
  }
}
