import { test, expect } from "@playwright/test";

test("Basic e-commerce functionality", async ({ page }) => {
  // Go to homepage
  await page.goto("/en");

  // Fill login form
  await page.fill("#email", "test@test.com");
  await page.fill("#password", "test");

  // Submit login form
  await page.getByRole("button", { name: "login" }).click();

  // Check that login was successful by redirecting to homepage
  await expect(page).toHaveURL("/en");

  // Select first product
  const firstProduct = page.locator('a[href^="/en/products/"]').first();
  await firstProduct.click();

  // Check that product page loaded
  await expect(page.locator("h1")).toBeVisible();

  // Add product to cart
  const addToCartButton = page.locator("#add-to-cart");
  await addToCartButton.click();

  // Open cart
  const cartButton = page.locator("#open-cart");
  await cartButton.click();

  // Check that product is in cart
  await expect(page.locator('[data-testid="empty-cart"]')).toBeHidden();

  // Go to checkout
  const checkoutButton = page.locator('[data-testid="checkout"]');
  await checkoutButton.click();

  // Fill shipping address
  await page.fill('input[name="fullName"]', "Test Customer");
  await page.fill('input[name="streetLine1"]', "Test Street 1");
  await page.fill('input[name="city"]', "Helsinki");
  await page.fill('input[name="postalCode"]', "00100");

  // Select shipping method
  await page
    .locator('input[name="shippingMethod"][type="radio"]')
    .first()
    .check();

  // Select payment method
  await page
    .locator('input[name="paymentMethod"][type="radio"]')
    .first()
    .check();

  // Submit order
  const submitButton = page.locator("#submit-order");
  await submitButton.click();

  // Check that order was successful
  await expect(page.locator("h1")).toContainText("Thank you for your order");

  // Check order confirmation details
  await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
  await expect(page.locator('[data-testid="order-total"]')).toBeVisible();
});
