import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should navigate between different pages', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Test navigation by clicking links (adjust selectors based on your app)
    const links = page.locator('a[href]:not([href=""])');
    const linkCount = await links.count();

    if (linkCount > 0) {
      // Click the first internal link that doesn't open in new tab
      const firstInternalLink = links.filter({ hasNot: page.locator('[target="_blank"]') }).first();
      
      if (await firstInternalLink.isVisible()) {
        const linkHref = await firstInternalLink.getAttribute('href');
        
        if (linkHref && !linkHref.startsWith('http') && !linkHref.startsWith('#')) {
          await firstInternalLink.click();
          
          // Wait for navigation to complete
          await page.waitForURL(`http://localhost:5173${linkHref}`);
          await expect(page).toHaveURL(`http://localhost:5173${linkHref}`);
          
          // Navigate back to home
          await page.goto('http://localhost:5173');
          await expect(page).toHaveURL('http://localhost:5173/');
        }
      }
    }
  });

  test('should maintain application state during navigation', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Test if the application maintains basic state
    // This could be theme, language, or any persistent state
    const html = page.locator('html');
    const body = page.locator('body');

    // Check for any persisted classes or attributes
    const htmlClasses = await html.getAttribute('class');
    const bodyClasses = await body.getAttribute('class');

    // Navigate and come back
    await page.reload();
    
    // State should be maintained after reload
    const htmlClassesAfterReload = await html.getAttribute('class');
    const bodyClassesAfterReload = await body.getAttribute('class');

    // Basic state consistency check
    expect(htmlClasses).toEqual(htmlClassesAfterReload);
    expect(bodyClasses).toEqual(bodyClassesAfterReload);
  });

  test('should handle browser navigation buttons', async ({ page }) => {
    await page.goto('http://localhost:5173');
    const initialUrl = page.url();

    // Navigate to a different page if possible
    const links = page.locator('a[href^="/"]');
    const linkCount = await links.count();

    if (linkCount > 1) {
      const secondLink = links.nth(1);
      const linkHref = await secondLink.getAttribute('href');
      
      if (linkHref) {
        await secondLink.click();
        await page.waitForURL(`http://localhost:5173${linkHref}`);

        // Test back button
        await page.goBack();
        await expect(page).toHaveURL(initialUrl);

        // Test forward button
        await page.goForward();
        await expect(page).toHaveURL(`http://localhost:5173${linkHref}`);
      }
    }
  });
});
