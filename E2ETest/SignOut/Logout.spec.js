import { test, expect } from '@playwright/test';
import yaml from 'js-yaml';
import fs from 'fs';
import {
  navigateToLoginPage,
  fillLoginForm,
  submitLoginForm,
  handleMicrophonePermission,
  handleOnboardingSteps,
  handleOnboardingPage,
  clearBrowserCache,
  takeScreenshot,
  handleLogout,
  addEventIdToReport, // Import the function here
} from '../utils/e2eTestUtils/e2e/utils.js'; // Import utility functions

// Load login data and expected URLs from YAML file
const loginData = yaml.load(fs.readFileSync('E2ETest/utils/TestData.yaml', 'utf8'));
const { valid_user, expected_urls, WebsiteURL, Button_XPath } = loginData;

test('Logout website Test', async ({ page, context }, testInfo) => {
  const eventId = '12345'; // Replace with your actual event ID generation logic

  // Step 1: Go to the login page
  try {
    await test.step('Go to the login page', async () => {
      await navigateToLoginPage(page, testInfo, WebsiteURL);
    });
  } catch (error) {
    console.error('Failed to navigate to the login page:', error);
    await takeScreenshot(page, testInfo, 'navigate-to-login-page-error');
    await addEventIdToReport(testInfo, eventId);
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
    await addEventIdToReport(testInfo, eventId);
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
    await addEventIdToReport(testInfo, eventId);
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
    await addEventIdToReport(testInfo, eventId);
    throw error;
  }

  // Log the current URL after login
  const currentURL = page.url();
  console.log(`Current URL after login: ${currentURL}`);

  // Step 5: Check the website URL and proceed accordingly
  try {
    await test.step('Check the web URL and proceed accordingly', async () => {
      if (currentURL === expected_urls.onboarding) {
        await handleOnboardingSteps(page, context, testInfo, WebsiteURL);
      } else if (currentURL === expected_urls.webpage) {
        await handleOnboardingPage(page, context, testInfo, WebsiteURL);
      } else if (currentURL === expected_urls.open_calls) {
        await handleOnboardingPage(page, context, testInfo, WebsiteURL);
      } else {
        console.log(`Unexpected URL: ${currentURL}`);
        await takeScreenshot(page, testInfo, 'unexpected-url');
        await addEventIdToReport(testInfo, eventId);
        throw new Error(`Unexpected URL: ${currentURL}`);
      }
    });
  } catch (error) {
    console.error('Failed to complete the steps based on the current URL:', error);
    await takeScreenshot(page, testInfo, 'steps-error');
    await addEventIdToReport(testInfo, eventId);
    throw error;
  }

  // Step 6: Logout from the web page
  try {
    await test.step('Logout from the web page', async () => {
      await handleLogout(test, page, context, testInfo, WebsiteURL, eventId);
    });
  } catch (error) {
    console.error('Failed to logout from the web page:', error);
    await takeScreenshot(page, testInfo, 'logout-error');
    await addEventIdToReport(testInfo, eventId);
    throw error;
  }

  // Log success message
  console.log('Test passed successfully');

  // Step 7: Clear browser cache at the end of the test
  try {
    await test.step('Clear browser cache', async () => {
      await clearBrowserCache(context, page, testInfo);
    });
  } catch (error) {
    console.error('Failed to clear browser cache:', error);
    await takeScreenshot(page, testInfo, 'clear-browser-cache-error');
    await addEventIdToReport(testInfo, eventId);
    throw error;
  }
});