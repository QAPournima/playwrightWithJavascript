import { test, expect } from '@playwright/test';
import yaml from 'js-yaml';
import fs from 'fs';

// Load login data from YAML file
const loginData = yaml.load(fs.readFileSync('e2e/utils/TestData.yaml', 'utf8'));
const { api_base_url, valid_user, invalid_user } = loginData;

test.describe('API Sign-In Tests', () => {
  test('Successful sign-in with valid credentials', async ({ request }) => {
    // Step 1: Send a POST request to the API URL with valid user credentials
    const response = await request.post(`${api_base_url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        email: valid_user.username,
        password: valid_user.password,
      },
    });

    // Log the response status and body for debugging purposes
    console.log('Response status:', response.status());
    const responseBodyText = await response.text();
    console.log('Response body:', responseBodyText);

    // Step 2: Check if the response status is 200
    // Expected Result: The response status should be 200 indicating a successful request
    expect(response.status()).toBe(200);

    // Step 3: Parse the response body as JSON
    // Expected Result: The response body should be parsed as JSON
    let responseBody;
    try {
      responseBody = JSON.parse(responseBodyText);
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${responseBodyText}`);
    }

    // Step 4: Check if the response body contains a token
    // Expected Result: The response body should have a property 'token'
    expect(responseBody).toHaveProperty('token');
    console.log('Sign-in successful, token received:', responseBody.token);
  });

  test('Sign-in with invalid credentials', async ({ request }) => {
    // Step 1: Send a POST request to the API URL with invalid user credentials
    const response = await request.post(`${api_base_url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        email: invalid_user.username,
        password: invalid_user.password,
      },
    });

    // Log the response status and body for debugging purposes
    console.log('Response status:', response.status());
    const responseBodyText = await response.text();
    console.log('Response body:', responseBodyText);

    // Step 2: Check if the response status is 401
    // Expected Result: The response status should be 401 indicating an unauthorized request
    expect(response.status()).toBe(401);

    // Step 3: Parse the response body as JSON
    // Expected Result: The response body should be parsed as JSON
    let responseBody;
    try {
      responseBody = JSON.parse(responseBodyText);
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${responseBodyText}`);
    }

    // Step 4: Check if the response body contains an error
    // Expected Result: The response body should have a property 'error'
    expect(responseBody).toHaveProperty('error');
    console.log('Sign-in failed with invalid credentials:', responseBody.error);
  });
});