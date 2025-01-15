// Add the function related to button, input, and other elements

import { expect } from '@playwright/test';
import yaml from 'js-yaml';
// Function to navigate to the login page
export async function navigateToLoginPage(page, testInfo, WebsiteURL) {
  try {
    console.log('Navigating to the web page..');
    await page.goto(`${WebsiteURL}/login`);
    await page.waitForLoadState('load');
    console.log('Page loaded, waiting for the "Welcome to" text to be visible...');
    await expect(page.locator('text=Welcome to Our site')).toBeVisible({ timeout: 60000 });
    console.log('Navigated to the login page successfully');
    await takeScreenshot(page, testInfo, 'login-page');
  } catch (error) {
    console.error('Failed to navigate to the login page:', error);
    await takeScreenshot(page, testInfo, 'navigate-to-login-page-error');
    throw error;
  }
}

// Function to fill the login detsils
export async function fillLoginForm(page, testInfo, valid_user) {
  try {
    console.log('Filling in the login details...');
    await page.fill('input[name="email"]', valid_user.username);
    await page.fill('input[name="password"]', valid_user.password);
    await page.waitForLoadState('load');
    console.log('Filled in the login details successfully');
    await takeScreenshot(page, testInfo, 'login-form-filled');
  } catch (error) {
    console.error('Failed to fill in the login details:', error);
    await takeScreenshot(page, testInfo, 'fill-login-form-error');
    throw error;
  }
}

// Function to submit the login details pws, user id and button
export async function submitLoginForm(page, testInfo) {
  try {
    console.log('Submitting the login details...');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('load');
    console.log('Submitted the login form successfully');
    await takeScreenshot(page, testInfo, 'login-form-submitted');
  } catch (error) {
    console.error('Failed to submit the login details:', error);
    await takeScreenshot(page, testInfo, 'submit-login-form-error');
    throw error;
  }
}

// Function to verify the user navigated to the Wellcome page
export async function verifyLogin(page, testInfo, WebsiteURL) {
  try {
    console.log('Verifying login...');
    await expect(page).toHaveURL(WebsiteURL, { timeout: 60000 });
    await expect(page.locator('text=Welcome to our site')).toBeVisible({ timeout: 60000 });
    await page.waitForLoadState('load');
    console.log('User is logged in successfully');
    await takeScreenshot(page, testInfo, 'login-verified');
  } catch (error) {
    console.error('Failed to verify the login:', error);
    await takeScreenshot(page, testInfo, 'verify-login-error');
    throw error;
  }
}

// Function to clear the browser cache after logout
export async function clearBrowserCache(context, page, testInfo) {
  try {
    console.log('Clearing browser cache...');
    await context.clearCookies();
    await context.clearPermissions();
    await page.waitForLoadState('load');
    console.log('Browser cache cleared successfully');
    await takeScreenshot(page, testInfo, 'browser-cache-cleared');
  } catch (error) {
    console.error('Failed to clear browser cache:', error);
    await takeScreenshot(page, testInfo, 'clear-browser-cache-error');
    throw error;
  }
}

// Function to take a screenshot to add in report
export async function takeScreenshot(page, testInfo, step) {
  if (!page.isClosed()) {
    const screenshot = await page.screenshot();
    await testInfo.attach(`screenshot-${step}`, { body: screenshot, contentType: 'image/png' });
  } else {
    console.warn(`Cannot take screenshot for step "${step}" because the page is closed.`);
  }
}

// Function to handle the microphone permission of a browser popup
export async function handleMicrophonePermission(page, context, testInfo, WebsiteURL) {
  try {
    console.log('Granting microphone permissions...');
    await context.grantPermissions(['microphone'], { origin: WebsiteURL });
    await takeScreenshot(page, testInfo, 'microphone');
    console.log('Granted microphone permissions successfully');

    console.log('Handling the microphone permission popup...');
    const microphonePopup = page.locator('text=Use your microphones');
    if (await microphonePopup.isVisible({ timeout: 10000 })) {
      await page.click('button:has-text("Allow while visiting the site")');
      await takeScreenshot(page, testInfo, 'microphone_popup');

      await page.waitForLoadState('load');
      console.log('Microphone permission granted successfully');
      await takeScreenshot(page, testInfo, 'microphone-permission-granted');
      await takeScreenshot(page, testInfo, 'microphone_popup_granted');
    }
  } catch (error) {
    console.error('Failed to handle microphone permission:', error);
    await takeScreenshot(page, testInfo, 'microphone-permission-error');
    await takeScreenshot(page, testInfo, 'microphone_popup_error');
    throw error;
  }
}

// Function to handle the onbording page steps if you have more than one onbording page use this function
export async function handleOnboardingPage(page, context, testInfo, WebsiteURL) {
  try {
    console.log('Handling onboarding steps after login...');
    await expect(page.locator('text=Select your language')).toBeVisible({ timeout: 15000 });
    await context.grantPermissions(['microphone'], { origin: WebsiteURL });
    const popupCloseButton = page.locator('button[aria-label="Allow this time"]');
    await page.waitForLoadState('load');
    await takeScreenshot(page, testInfo, 'open-calls-page');
    if (await popupCloseButton.isVisible()) {
      const allowButton = popupCloseButton.locator('button[aria-label="Allow this time"]');
      if (await allowButton.isVisible()) {
        await allowButton.click();
      }
    }
    await page.waitForLoadState('load');
    await page.click('button:has-text("Next")');
    await page.waitForLoadState('load');
    await takeScreenshot(page, testInfo, 'next-button-clicked');

    // in case you have lotes on onbording screen use the above 4 lines code navigate from each screen

    console.log('Open Onbording page steps completed successfully');
  } catch (error) {
    console.error('Failed to handle onboarding page:', error);
    await takeScreenshot(page, testInfo, 'open-onbording-page-error');
    throw error;
  }
}

// Function to click the Google login button when you have a login with Google Auth
export async function clickGoogleLoginButton(page, testInfo) {
    try {
      console.log('Clicking on the "Sign in with Google" button...');
      const googleLoginButton = page.locator('button:has-text("Sign in with Google")');
      await googleLoginButton.waitFor({ state: 'visible', timeout: 60000 });
      await googleLoginButton.click();
      console.log('Clicked on the "Sign in with Google" button successfully');
      await takeScreenshot(page, testInfo, 'google-login-button-clicked');
    } catch (error) {
      console.error('Failed to click the "Sign in with Google" button:', error);
      await takeScreenshot(page, testInfo, 'google-login-button-error');
      throw error;
    }
  }
  
  // Function to handle Google auth login
  export async function handleGoogleLogin(page, googlePage, google_user, testInfo) {
    try {
      console.log('Handling Google login...');
      await googlePage.fill('input[type="email"]', google_user.username);
      await googlePage.click('button:has-text("Next")');
      await googlePage.fill('input[type="password"]', google_user.password);
      await googlePage.click('button:has-text("Next")');
      console.log('Filled in the Google login form successfully');
      await takeScreenshot(googlePage, testInfo, 'google-login-form-filled');
    } catch (error) {
      console.error('Failed to handle Google login:', error);
      await takeScreenshot(googlePage, testInfo, 'google-login-form-error');
      throw error;
    }
  }
  
  // Function to verify redirection
  export async function verifyRedirection(page, testInfo, WebsiteURL) {
    try {
      console.log('Verifying redirection to the homepage/dashboard...')
      await expect(page).toHaveURL(WebsiteURL, { timeout: 60000 });
      await expect(page.locator('text=Welcome to xyz company')).toBeVisible();
      console.log('User is redirected back to the xyz Workspace successfully');
      await takeScreenshot(page, testInfo, 'redirection-verified');
    } catch (error) {
      console.error('Failed to verify redirection:', error);
      await takeScreenshot(page, testInfo, 'verify-redirection-error');
      throw error;
    }
  }

  export async function handleLogout(test, page, context, testInfo, WebsiteURL, eventId) {
    try {
      // Logout from the WS page
      await test.step('Logout from the web page', async () => {
        const logoutButton = page.locator(logout_button_xpath);
        await logoutButton.click();
        await page.locator('text=Sign out').click();
        console.log('Clicked on the logout button successfully');
        await takeScreenshot(page, testInfo, 'logout-button-clicked');
      });
  
      // Verify that the user is redirected to the login page
      await test.step('Verify that the user is redirected to the login page', async () => {
        await expect(page).toHaveURL(`${WebsiteURL}/login`, { timeout: 20000 });
        await expect(page.locator('text=Welcome to xyz company')).toBeVisible();
        console.log('User is redirected to the login page successfully');
        await takeScreenshot(page, testInfo, 'redirected-to-login-page');
      });
    } catch (error) {
      console.error('Failed to complete the steps based on the current URL:', error);
      await takeScreenshot(page, testInfo, 'steps-error');
      await addEventIdToReport(testInfo, eventId);
      throw error;
    }
  }

export async function addEventIdToReport(testInfo, eventId) {
  testInfo.annotations.push({ type: 'eventId', description: eventId });
}

// Function to handle the conversation list
export async function handlepageList(page, context, testInfo, AWStagingURL) {
  try {
    console.log('Handling conversation page steps...');
    await context.grantPermissions(['microphone'], { origin: AWStagingURL });
    const popupCloseButton = page.locator('button[aria-label="Close"]');
    await page.waitForLoadState('load');
    await takeScreenshot(page, testInfo, 'conversation-page');
    if (await popupCloseButton.isVisible()) {
      await popupCloseButton.click();
    }
    await expect(page.locator('text=Select a conversation in your inbox to follow up with your customer.')).toBeVisible({ timeout: 10000 });
    await page.waitForLoadState('load');
    console.log('Conversation page steps completed successfully');
    await takeScreenshot(page, testInfo, 'conversation-page-completed');
  } catch (error) {
    console.error('Failed to handle conversation page:', error);
    await takeScreenshot(page, testInfo, 'conversation-page-error');
    throw error;
  }
}