import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between Design and Compose modes correctly', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to design by default
    await expect(page).toHaveURL('/design');
    
    // Design button should be active
    const designButton = page.getByRole('button', { name: 'design' });
    const composeButton = page.getByRole('button', { name: 'compose' });
    
    await expect(designButton).toHaveClass(/primary/);
    await expect(composeButton).not.toHaveClass(/primary/);
    
    // Click compose button
    await composeButton.click();
    await expect(page).toHaveURL('/compose');
    
    // Compose button should now be active
    await expect(composeButton).toHaveClass(/primary/);
    await expect(designButton).not.toHaveClass(/primary/);
    
    // Click design button
    await designButton.click();
    await expect(page).toHaveURL('/design');
    
    // Design button should be active again
    await expect(designButton).toHaveClass(/primary/);
    await expect(composeButton).not.toHaveClass(/primary/);
  });

  test('should handle browser back/forward buttons correctly', async ({ page }) => {
    await page.goto('/design');
    
    // Navigate to compose
    await page.getByRole('button', { name: 'compose' }).click();
    await expect(page).toHaveURL('/compose');
    
    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/design');
    
    // Design button should be active
    const designButton = page.getByRole('button', { name: 'design' });
    const composeButton = page.getByRole('button', { name: 'compose' });
    
    await expect(designButton).toHaveClass(/primary/);
    await expect(composeButton).not.toHaveClass(/primary/);
    
    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/compose');
    
    // Compose button should be active
    await expect(composeButton).toHaveClass(/primary/);
    await expect(designButton).not.toHaveClass(/primary/);
  });

  test('should reflect current application state in URL', async ({ page }) => {
    // Test direct navigation to design
    await page.goto('/design');
    await expect(page).toHaveURL('/design');
    
    const designButton = page.getByRole('button', { name: 'design' });
    await expect(designButton).toHaveClass(/primary/);
    
    // Test direct navigation to compose
    await page.goto('/compose');
    await expect(page).toHaveURL('/compose');
    
    const composeButton = page.getByRole('button', { name: 'compose' });
    await expect(composeButton).toHaveClass(/primary/);
    
    // Test invalid route redirects to default
    await page.goto('/invalid-route');
    await expect(page).toHaveURL('/design');
    
    // Test root redirects to default
    await page.goto('/');
    await expect(page).toHaveURL('/design');
  });

  test('should maintain URL state on page refresh', async ({ page }) => {
    // Navigate to compose
    await page.goto('/compose');
    await expect(page).toHaveURL('/compose');
    
    // Refresh the page
    await page.reload();
    
    // Should still be on compose page with correct active state
    await expect(page).toHaveURL('/compose');
    const composeButton = page.getByRole('button', { name: 'compose' });
    const designButton = page.getByRole('button', { name: 'design' });
    
    await expect(composeButton).toHaveClass(/primary/);
    await expect(designButton).not.toHaveClass(/primary/);
  });

  test('should display navigation buttons in correct order (design first as default)', async ({ page }) => {
    await page.goto('/');
    
    // Get all navigation buttons
    const navigationButtons = page.getByRole('button').filter({ 
      has: page.locator('text=/^(design|compose)$/') 
    });
    
    // Should have exactly 2 navigation buttons
    await expect(navigationButtons).toHaveCount(2);
    
    // First button should be design (default route)
    await expect(navigationButtons.nth(0)).toHaveText('design');
    
    // Second button should be compose
    await expect(navigationButtons.nth(1)).toHaveText('compose');
  });
});