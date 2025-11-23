import { test } from '@playwright/test';

test('capture console output', async ({ page }) => {
  const consoleLogs: string[] = [];
  
  page.on('console', msg => {
    consoleLogs.push(msg.text());
  });

  await page.goto('http://localhost:3000/reading');
  await page.waitForLoadState('networkidle');
  
  await page.waitForTimeout(1000);
  
  console.log('Console output from page:');
  consoleLogs.forEach(log => console.log(log));
});
