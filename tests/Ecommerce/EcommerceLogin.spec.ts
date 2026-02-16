import { test, expect } from '../base/BaseTest';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import users from '../../data/user.json';

// Day 3 (existing): Basic Login Test

test('E-commerce login using reusable BasePage methods', async ({ page, loginPage }) => {
  await page.goto('/');

  await loginPage.login(users.standardUser.username, users.standardUser.password);

  await loginPage.takeScreenshot('login-success');

  expect(page.url()).toContain('inventory');
});

// Day 4: Login Tests - Method Chaining & Page Validations
test.describe('Day 4: Login Page - Method Chaining & Validations', () => {

  // Basic login using method chaining - login() returns 'this' for fluent API
  test('Login with valid credentials using method chaining', async ({ page, loginPage }) => {
    // Day 5: loginPage fixture auto-injects LoginPage instance (no manual new LoginPage())
    await page.goto('/');

    // Method chaining - login() returns 'this' enabling fluent calls
    await loginPage.login(users.standardUser.username, users.standardUser.password);

    // Page validation from BasePage - validates URL contains expected part
    await loginPage.validateUrl('inventory');
  });

  // Day 4: Page-specific validation - check all login elements visible before interacting
  test('Validate login page is fully loaded before login', async ({ page, loginPage }) => {
    await page.goto('/');

    // Page-specific validation - checks logo, username input, login button visible
    await loginPage.validateLoginPageLoaded();

    // Step-by-step method chaining - each method returns 'this'
    await loginPage
      .enterUsername(users.standardUser.username)
      .then((lp) => lp.enterPassword(users.standardUser.password))
      .then((lp) => lp.clickLogin());

    await loginPage.validateUrl('inventory');
  });

  // Day 4: Invalid login - page-specific error message validation
  test('Login with invalid credentials shows error message', async ({ page, loginPage }) => {
    await page.goto('/');

    await loginPage.login(users.invalidUser.username, users.invalidUser.password);

    // Page-specific validation - validates error element visible and contains text
    await loginPage.validateErrorMessage('Username and password do not match');

    await loginPage.takeScreenshot('day4-login-error');
  });

  // Day 4: Locked out user - page-specific validation for locked account error
  test('Locked out user gets appropriate error', async ({ page, loginPage }) => {
    await page.goto('/');

    await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);

    // Page-specific validation - locked user error message
    await loginPage.validateErrorMessage('Sorry, this user has been locked out');
  });
});

// Day 4: Inventory Page - Dynamic Locators & Inheritance
test.describe('Day 4: Inventory Page - Dynamic Locators & Product Interactions', () => {

  // Validate inventory page using inherited validation methods from BasePage
  test('Inventory page displays 6 products after login', async ({ authenticatedPage }) => {
    // authenticatedPage fixture auto-logs in before test starts
    const inventoryPage = new InventoryPage(authenticatedPage);

    // Page-specific validation (inherited from BasePage) - checks URL, list, title
    await inventoryPage.validateOnInventoryPage();

    // Page-specific validation - asserts exact product count
    await inventoryPage.validateProductCount(6);
  });

  // Day 4: Dynamic locator - add product using dynamically built test-id selector
  test('Add product to cart using dynamic locator', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    // Dynamic locator - getAddToCartButton() builds selector with dynamic product ID
    await inventoryPage.addProductToCart('sauce-labs-backpack');

    // Page-specific validation - cart badge shows correct count
    await inventoryPage.validateCartBadgeCount('1');

    await inventoryPage.takeScreenshot('day4-product-added');
  });

  // Day 4: Dynamic locators for add/remove - builds selectors dynamically per product
  test('Add and remove products with dynamic locators', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    //  Method chaining - addProductToCart returns 'this'
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.addProductToCart('sauce-labs-bike-light');

    //  Validate cart badge updated to 2
    await inventoryPage.validateCartBadgeCount('2');

    //  Dynamic locator - remove button selector built dynamically
    await inventoryPage.removeProductFromCart('sauce-labs-backpack');

    //  Validate badge decremented after removal
    await inventoryPage.validateCartBadgeCount('1');
  });

  // Day 4: Dynamic locator - getProductByName() uses dynamicLocator template replacement
  test('Get product price using dynamic locator', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    // Dynamic locator - getProductByName uses '{{value}}' template in selector
    const price = await inventoryPage.getProductPrice('Sauce Labs Backpack');
    expect(price).toContain('$29.99');
  });

  // Day 4: Method chaining - sortBy() returns 'this' for fluent API
  test('Sort products by price low to high', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    // Method chaining - sortBy returns 'this'
    await inventoryPage.sortBy('lohi');

    // BasePage inherited method - getText reads element content
    const firstItemPrice = await inventoryPage.getText(
      authenticatedPage.locator('.inventory_item_price').first()
    );
    expect(firstItemPrice).toBe('$7.99');
  });
});


// Day 4: Product Detail Page - Inheritance & Validations
test.describe('Day 4: Product Detail Page - Inheritance & Page Validations', () => {

  // Navigate to product detail - validate using inherited BasePage methods
  test('View product detail page and validate product info', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const productDetailPage = new ProductDetailPage(authenticatedPage);

    // Method chaining - clickProductTitle navigates to detail page
    await inventoryPage.clickProductTitle('Sauce Labs Backpack');

    // Page-specific validation - checks URL contains 'inventory-item.html'
    await productDetailPage.validateOnProductDetailPage();

    // Page-specific validation - validates product name and price text
    await productDetailPage.validateProductName('Sauce Labs Backpack');
    await productDetailPage.validateProductPrice('$29.99');
  });

  // Day 4: Add to cart from detail page - validates button state changes
  test('Add to cart from product detail and navigate back', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const productDetailPage = new ProductDetailPage(authenticatedPage);

    await inventoryPage.clickProductTitle('Sauce Labs Backpack');

    //  Method chaining - addToCart returns 'this'
    await productDetailPage.addToCart();

    //  Page-specific validation - remove button visible after add to cart
    await productDetailPage.validateRemoveButtonVisible();

    //  Method chaining - goBackToProducts returns 'this'
    await productDetailPage.goBackToProducts();
    await inventoryPage.validateOnInventoryPage();
  });
});


// Day 4: Cart & Checkout - Full E2E with All 5 Page Classes

test.describe('Day 4: Cart & Checkout - Full E2E Flow with All Page Classes', () => {

  // Complete purchase flow - demonstrates inheritance across all 5 page classes
  test('Complete purchase flow using all page objects', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);

    // Step 1: Add product (InventoryPage inherits BasePage)
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.validateCartBadgeCount('1');

    // Step 2: Open cart (CartPage inherits BasePage)
    await inventoryPage.openCart();
    await cartPage.validateOnCartPage();

    // Dynamic locator - validates specific product in cart by name
    await cartPage.validateProductInCart('Sauce Labs Backpack');
    await cartPage.validateCartItemCount(1);

    // Step 3: Checkout (CheckoutPage inherits BasePage)
    await cartPage.proceedToCheckout();
    await checkoutPage.validateOnCheckoutStepOne();

    // Method chaining - fillShippingInfo chains 3 fill calls internally
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.clickContinue();

    // Step 4: Overview validation
    await checkoutPage.validateOnCheckoutStepTwo();

    // Dynamic locator - getSummaryItemByName finds product in checkout summary
    const summaryItem = checkoutPage.getSummaryItemByName('Sauce Labs Backpack');
    await checkoutPage.validateElementVisible(summaryItem);

    // Step 5: Finish order
    await checkoutPage.clickFinish();

    // Page-specific validation - order completion message
    await checkoutPage.validateOnCheckoutComplete();
    await checkoutPage.validateOrderComplete();

    await checkoutPage.takeScreenshot('day4-order-complete');
  });

  // Day 4: Page-specific validation - empty cart check
  test('Cart page shows empty when no products added', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    // Page-specific validation - no cart badge when empty
    await inventoryPage.validateCartBadgeNotVisible();

    await inventoryPage.openCart();
    await cartPage.validateOnCartPage();

    // Page-specific validation - validateCartEmpty asserts 0 items
    await cartPage.validateCartEmpty();
  });

  // Day 4: Page-specific validation - checkout form validation error
  test('Checkout shows error when shipping info is missing', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);

    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    // Submit without filling form
    await checkoutPage.clickContinue();

    // Page-specific validation - validates checkout error message
    await checkoutPage.validateCheckoutError('First Name is required');
  });
});


// Day 5: Custom Fixtures Tests
test.describe('Day 5: Custom Fixtures - Auto-Injected Page Objects', () => {

  //  loginPage fixture - auto-instantiates LoginPage via BaseTest.ts fixture
  test('Login using fixture-injected loginPage', async ({ page, loginPage }) => {
    //  loginPage auto-created by fixture - no 'new LoginPage(page)' needed
    await page.goto('/');
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await loginPage.validateUrl('inventory');
  });

  // Day 5: Multiple fixtures - loginPage + inventoryPage injected together
  test('Login and browse using multiple fixture-injected pages', async ({ page, loginPage, inventoryPage }) => {
    // Both page objects auto-injected by their respective fixtures
    await page.goto('/');
    await loginPage.login(users.standardUser.username, users.standardUser.password);

    // inventoryPage fixture auto-creates InventoryPage bound to same page
    await inventoryPage.validateOnInventoryPage();
    await inventoryPage.validateProductCount(6);
  });
});


// Day 5: Auth Fixture Tests

test.describe('Day 5: Auth Fixture - Pre-Authenticated Page', () => {

  // Day 5: authenticatedPage fixture - auto-logs in before test, auto-logouts after
  test('Browse products with pre-authenticated page', async ({ authenticatedPage }) => {
    // authenticatedPage fixture already logged in - test starts at inventory
    const inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.validateOnInventoryPage();
    await inventoryPage.validateProductCount(6);
    // After test, fixture teardown runs logout (data cleanup hook)
  });

  // Day 5: Auth fixture with cart - fixture handles entire login/logout lifecycle
  test('Add to cart with auth fixture and auto-cleanup', async ({ authenticatedPage }) => {
    // No login code needed - authenticatedPage fixture handled it
    const inventoryPage = new InventoryPage(authenticatedPage);

    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.addProductToCart('sauce-labs-bike-light');
    await inventoryPage.validateCartBadgeCount('2');
    // Fixture teardown will logout and cleanup after this test
  });
});


// Day 5: Test Context Sharing

test.describe('Day 5: Test Context Sharing - Pass Data Between Steps', () => {

  // testContext fixture - shared state object for passing data within a test
  test('Share product price via test context', async ({ authenticatedPage, testContext }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    // testContext.set() stores data in shared context
    const price = await inventoryPage.getProductPrice('Sauce Labs Backpack');
    testContext.set('backpackPrice', price);

    // testContext.get() retrieves stored data
    const storedPrice = testContext.get<string>('backpackPrice');
    expect(storedPrice).toContain('$29.99');

    // testContext.has() checks if key exists in shared state
    expect(testContext.has('backpackPrice')).toBe(true);
    expect(testContext.has('nonExistentKey')).toBe(false);
  });

  // Day 5: Test context sharing across checkout steps - stores product/cart data
  test('Share cart data across checkout steps via context', async ({ authenticatedPage, testContext }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);

    // Store product info in shared context
    testContext.set('productName', 'Sauce Labs Backpack');
    testContext.set('productId', 'sauce-labs-backpack');

    // Use context data throughout test steps
    await inventoryPage.addProductToCart(testContext.get<string>('productId'));
    await inventoryPage.openCart();
    await cartPage.validateProductInCart(testContext.get<string>('productName'));

    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo('Jane', 'Smith', '54321');
    await checkoutPage.clickContinue();

    // Store total price in context for assertion
    const total = await checkoutPage.getTotalPrice();
    testContext.set('totalPrice', total);
    expect(testContext.get<string>('totalPrice')).toContain('Total');
    // After test, testContext fixture cleanup calls context.clear()
  });
});

// Day 5: Hooks in Action

test.describe('Day 5: Hooks - beforeEach/afterEach Logging & Cleanup', () => {
  // Hooks fire automatically - beforeEach logs start, afterEach logs result
  test('Hooks log test lifecycle - successful test', async ({ page, loginPage }) => {
    // beforeEach hook already logged: "[Hook] Starting test: ..."
    await page.goto('/');
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await loginPage.validateUrl('inventory');
    // afterEach hook will log: "[Hook] Finished test: ... - Status: passed"
  });

  // Day 5: Hooks + auth fixture - both lifecycle hooks and fixture teardown fire
  test('Hooks log test lifecycle with auth fixture cleanup', async ({ authenticatedPage }) => {
    // beforeEach hook logs start, auth fixture logs in automatically
    const inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.validateOnInventoryPage();
    await inventoryPage.takeScreenshot('day5-hooks-test');
  });
});
