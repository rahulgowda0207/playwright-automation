// ProductDetailPage: page object for a single SauceDemo product.
// Inherits BasePage; supports method chaining.

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  // --- Static locators ---
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.productImage = page.locator('.inventory_details_img');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton = page.locator('[data-test^="remove"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  // --- Method chaining actions ---

  async addToCart(): Promise<this> {
    await this.click(this.addToCartButton);
    // Wait for the Remove button to appear — confirms the cart was updated
    await this.removeButton.waitFor({ state: 'visible' });
    return this;
  }

  async removeFromCart(): Promise<this> {
    await this.click(this.removeButton);
    return this;
  }

  async goBackToProducts(): Promise<this> {
    await this.click(this.backToProductsButton);
    // Wait for navigation back to the inventory page
    await this.page.waitForURL('**/inventory.html');
    return this;
  }

  // --- Page-specific validations ---

  async validateOnProductDetailPage(): Promise<this> {
    await this.validateUrl('inventory-item.html');
    await this.validateElementVisible(this.productName);
    await this.validateElementVisible(this.productPrice);
    return this;
  }

  async validateProductName(expectedName: string): Promise<this> {
    await this.validateElementText(this.productName, expectedName);
    return this;
  }

  async validateProductPrice(expectedPrice: string): Promise<this> {
    await this.validateElementText(this.productPrice, expectedPrice);
    return this;
  }

  async validateAddToCartVisible(): Promise<this> {
    await this.validateElementVisible(this.addToCartButton);
    return this;
  }

  async validateRemoveButtonVisible(): Promise<this> {
    await this.validateElementVisible(this.removeButton);
    return this;
  }

  async getProductNameText(): Promise<string> {
    return await this.getText(this.productName);
  }

  async getProductPriceText(): Promise<string> {
    return await this.getText(this.productPrice);
  }
}
