const { test, expect } = require('@playwright/test');

test.describe('API testomat requests', () => {
    const USER = {
        email: "emailid",
        pwd: "pwd",
        token: "",
        prj_token: ""
    }
    const PRJ = "API_test";

    test('API Post Request', async ({ request }) => {
        // Step 1: Send a POST request to the API URL with user credentials
        const res = await request.post('API URL', {
            data: {
                "email": USER.email,
                "password": USER.pwd
            }
        });

        // Step 2: Check if the response status is 200
        // Expected Result: The response status should be 200 indicating a successful request
        expect(res.status()).toBe(200);

        // Step 3: Check if the response content type is JSON
        // Expected Result: The response content type should be 'application/json'
        const contentType = res.headers()['content-type'];
        if (contentType && contentType.includes('application/json')) {
            // Step 4: Parse the response body as JSON
            // Expected Result: The response body should be parsed as JSON and contain a JWT token
            const body = await res.json();
            USER.token = body.jwt;
            console.log("TOKEN", USER.token);
        } else {
            // Step 5: Handle unexpected content type
            // Expected Result: Log an error message and throw an error if the content type is not JSON
            console.error('Unexpected content type:', contentType);
            const body = await res.text();
            console.error('Response body:', body);
            throw new Error('Expected JSON response but received different content type');
        }
    });
});