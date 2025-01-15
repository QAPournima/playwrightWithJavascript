import { test, expect } from '@playwright/test';
import yaml from 'js-yaml';
import fs from 'fs';
import dotenv from 'dotenv';
import {
  navigateToLoginPage,
  clickGoogleLoginButton,
  handleGoogleLogin,
  verifyRedirection,
  clearBrowserCache,
  takeScreenshot,
} from '../utils/e2eTestUtils/e2e/utils.js'; // Import utility functions

dotenv.config({
  path: './e2e/.env',
});

// Load login data from YAML file
const loginData = yaml.load(fs.readFileSync('e2e/utils/TestData.yaml', 'utf8'));
const { google_user, WebsiteURL } = loginData;

test.describe('Google Authentication Login', () => {
  test('User logs in using Google Authentication', async ({ page, context }, testInfo) => {
    // Increase the timeout for the test
    test.setTimeout(120000); // Increase to 120 seconds

    // Step 1: Given the user opens the website
    try {
      await test.step('Given the user opens the website', async () => {
        await navigateToLoginPage(page, testInfo, WebsiteURL);
        await takeScreenshot(page, testInfo, 'navigate-to-login-page');
      });
    } catch (error) {
      console.error('Failed to navigate to the login page:', error);
      await takeScreenshot(page, testInfo, 'navigate-to-login-page-error');
      throw error;
    }

    // Step 2: When the user clicks on the "Login with Google" button
    let googlePage;
    try {
      await test.step('When the user clicks on the "Login with Google" button', async () => {
        [googlePage] = await Promise.all([
          context.waitForEvent('page'),
          clickGoogleLoginButton(page, testInfo)
        ]);
        await takeScreenshot(page, testInfo, 'click-google-login-button');
      });
    } catch (error) {
      console.error('Failed to find the Google login button:', error);
      await takeScreenshot(page, testInfo, 'google-login-button-error');
      throw error;
    }

    // Step 3: And the user selects a valid Google account and enters credentials
    try {
      await test.step('And the user selects a valid Google account and enters credentials', async () => {
        await handleGoogleLogin(page, googlePage, google_user, testInfo);
        await takeScreenshot(googlePage, testInfo, 'google-login-form');
      });
    } catch (error) {
      console.error('Failed to fill in the Google login form:', error);
      await takeScreenshot(googlePage, testInfo, 'google-login-form-error');
      throw error;
    }

    // Step 4: Then the user should be successfully logged into the application
    try {
      await test.step('Then the user should be successfully logged into the application', async () => {
        await googlePage.waitForNavigation();
        console.log('Navigation after Google login completed successfully');
        await takeScreenshot(googlePage, testInfo, 'google-login-navigation-completed');
      });
    } catch (error) {
      console.error('Failed to complete navigation after Google login:', error);
      await takeScreenshot(googlePage, testInfo, 'google-login-navigation-error');
      throw error;
    }

    // Step 5: And the user should be redirected to the homepage/dashboard
    try {
      await test.step('And the user should be redirected to the homepage/dashboard', async () => {
        await verifyRedirection(page, testInfo, WebsiteURL);
        await takeScreenshot(page, testInfo, 'verify-redirection');
      });
    } catch (error) {
      console.error('Failed to verify redirection back to the login page:', error);
      await takeScreenshot(page, testInfo, 'verify-redirection-error');
      throw error;
    }

    // Log success message
    console.log('Test passed successfully');

    // Step 6: Clear browser cache at the end of the test
    try {
      await clearBrowserCache(context, page, testInfo);
      await takeScreenshot(page, testInfo, 'clear-browser-cache');
    } catch (error) {
      console.error('Failed to clear browser cache:', error);
      await takeScreenshot(page, testInfo, 'clear-browser-cache-error');
      throw error;
    }
  });
});