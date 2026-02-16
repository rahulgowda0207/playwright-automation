import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import users from '../../data/user.json';

type EcommerceFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productDetailPage: ProductDetailPage;
  authenticatedPage: Page;  // Pre-authenticated browser page
  testContext: TestContext;  // Shared test context for data between steps
};

// --- Day 5: Test context sharing - shared state across fixtures ---
export class TestContext {
  private data: Record<string, unknown> = {};

  set(key: string, value: unknown): void {
    this.data[key] = value;
  }

  get<T = unknown>(key: string): T {
    return this.data[key] as T;
  }

  has(key: string): boolean {
    return key in this.data;
  }

  clear(): void {
    this.data = {};
  }
}

// --- Day 5: Extend base test with custom fixtures ---
export const test = base.extend<EcommerceFixtures>({

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  // Day 5: Auth fixture - provides a pre-authenticated page (logged in)
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto('/');
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await page.waitForURL('**/inventory.html');
    // Provide the authenticated page to the test
    await use(page);
    //  Data cleanup hook - navigate to reset state (faster than logout)
    try {
      await page.goto('/', { timeout: 5000 });
    } catch {
      // Page may have closed; ignore cleanup errors
    }
  },

  // Day 5: Test context sharing - shared state object for passing data between fixtures
  testContext: async ({}, use) => {
    const context = new TestContext();
    await use(context);
    context.clear();
  },
});

// --- Day 5: Global beforeEach / afterEach hooks
test.beforeEach(async ({}, testInfo) => {
  console.log(`[Hook] Starting test: "${testInfo.title}"`);
});

test.afterEach(async ({}, testInfo) => {
  console.log(`[Hook] Finished test: "${testInfo.title}" - Status: ${testInfo.status}`);
  if (testInfo.status === 'failed') {
    console.log(`[Hook] Test "${testInfo.title}" FAILED - check report for details`);
  }
});

export { expect };
