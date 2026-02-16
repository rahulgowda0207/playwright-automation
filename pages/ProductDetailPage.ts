// ============================================================
// Day 4: Advanced POM - ProductDetailPage (Individual Product)
//        Inherits BasePage, method chaining, dynamic locators,
//        page-specific validations
// ============================================================

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

  // --- Day 4: Method chaining actions ---

  async addToCart(): Promise<this> {
    await this.click(this.addToCartButton);
    return this;
  }

  async removeFromCart(): Promise<this> {
    await this.click(this.removeButton);
    return this;
  }

  async goBackToProducts(): Promise<this> {
    await this.click(this.backToProductsButton);
    return this;
  }

  // --- Day 4: Page-specific validations ---

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
