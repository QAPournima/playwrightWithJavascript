// @ts-check
import { test, expect, selectors } from '@playwright/test';
import yaml from 'js-yaml';
import fs from 'fs';
import {
  navigateToLoginPage,
  fillLoginForm,
  submitLoginForm,
  handleMicrophonePermission,
  handleOnboardingPage,
  clearBrowserCache,
  takeScreenshot,
  handlepageList,
} from '../utils/e2eTestUtils/e2e/utils.js'; // Import utility functions

// Load login data and expected URLs from YAML file
const loginData = yaml.load(fs.readFileSync('e2e/utils/TestData.yaml', 'utf8'));
const { valid_user, expected_urls, WebsiteURL } = loginData;

test('Success login with user id and password', async ({ page, context }, testInfo) => {
  // Step 1: Navigate to the Company login page
  try {
    await test.step('Go to the Company login page', async () => {
      await navigateToLoginPage(page, testInfo, WebsiteURL);
    });
  } catch (error) {
    console.error('Failed to navigate to the login page:', error);
    await takeScreenshot(page, testInfo, 'navigate-to-login-page-error');
    throw error;
  }

  // Step 2: Fill in the login details with valid credentials
  try {
    await test.step('Fill in the login details with valid credentials', async () => {
      await fillLoginForm(page, testInfo, valid_user);
    });
  } catch (error) {
    console.error('Failed to fill in the login form:', error);
    await takeScreenshot(page, testInfo, 'fill-login-form-error');
    throw error;
  }

  // Step 3: Submit the login details
  try {
    await test.step('Submit the login details', async () => {
      await submitLoginForm(page, testInfo);
    });
  } catch (error) {
    console.error('Failed to submit the login form:', error);
    await takeScreenshot(page, testInfo, 'submit-login-form-error');
    throw error;
  }

  // Step 4: Wait for navigation to complete after login
  try {
    await test.step('Wait for navigation to complete', async () => {
      await page.waitForNavigation();
      console.log('Navigation after login completed successfully');
      await takeScreenshot(page, testInfo, 'navigation-completed');
    });
  } catch (error) {
    console.error('Failed to complete navigation after login:', error);
    await takeScreenshot(page, testInfo, 'navigation-error');
    throw error;
  }

  // Log the current URL after login
  const currentURL = page.url();
  console.log(`Current URL after login: ${currentURL}`);

  // Step 5: Grant microphone permissions
  try {
    await test.step('Grant microphone permissions', async () => {
      await handleMicrophonePermission(page, context, testInfo, WebsiteURL);
    });

    // Step 6: Check the URL and proceed accordingly
    await test.step('Check the URL and proceed accordingly', async () => {
      if (currentURL === expected_urls.onboarding) {
        await handlepageList(page, context, testInfo, WebsiteURL);
      } else if (currentURL === expected_urls.conversations) {
        await handlepageList(page, context, testInfo, WebsiteURL);
      } else if (currentURL === expected_urls.open_calls) {
        await handleOnboardingPage(page, context, testInfo, WebsiteURL);
      } else {
        console.log(`Unexpected URL: ${currentURL}`);
        await page.waitForTimeout(10000); // Wait for 10 seconds
        await takeScreenshot(page, testInfo, 'unexpected-url');
        throw new Error(`Unexpected URL: ${currentURL}`);
      }
    });
  } catch (error) {
    console.error('Failed to complete the steps based on the current URL:', error);
    await takeScreenshot(page, testInfo, 'steps-error');
    throw error;
  }

  // Log success message
  console.log('login - Test passed successfully');

  // Step 7: Clear browser cache at the end of the test
  try {
    await test.step('Clear browser cache', async () => {
      await clearBrowserCache(context, page, testInfo);
    });
  } catch (error) {
    console.error('Failed to clear browser cache:', error);
    await takeScreenshot(page, testInfo, 'clear-browser-cache-error');
    throw error;
  }
});