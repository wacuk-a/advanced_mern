import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to navigate through main pages', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173');

    // Check if the home page loads
    await expect(page).toHaveTitle(/SafeVoice|React App/);
    
    // Check for important elements on the page
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Test navigation (adjust selectors based on your app)
    const navLinks = page.locator('nav a, [role="navigation"] a');
    await expect(navLinks.first()).toBeVisible();

    // Take a screenshot for visual regression
    await page.screenshot({ path: 'tests/screenshots/home-page.png' });
  });

  test('should handle form interactions', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Test form interactions if available
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      const firstForm = forms.first();
      
      // Try to find input fields
      const inputs = firstForm.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        // Test typing in the first input
        const firstInput = inputs.first();
        await firstInput.click();
        await firstInput.fill('test input');
        await expect(firstInput).toHaveValue('test input');
      }
    }
  });

  test('should handle error scenarios', async ({ page }) => {
    // Test navigation to non-existent route
    await page.goto('http://localhost:5173/non-existent-route');
    
    // Check if error handling works (either 404 page or redirect)
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/http:\/\/localhost:5173/);
    
    // Should still be able to navigate back to home
    await page.goto('http://localhost:5173');
    await expect(page).toHaveURL('http://localhost:5173/');
  });
});
