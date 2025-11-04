// netlify/functions/add-site.js
const axios = require('axios');
const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
    const { url, email } = JSON.parse(event.body);

    if (!url || !email) {
        return { statusCode: 400, body: JSON.stringify({ error: 'URL and email are required.' }) };
    }

    try {
        // Fetch initial content to set a baseline
        const response = await axios.get(url, { timeout: 10000 });
        const htmlContent = response.data;

        // Connect to our Data Entities store
        const store = getStore('monitored-sites');

        // Create a unique ID for the new site
        const siteId = `site-${Date.now()}`;

        // Save the site data to the database
        await store.set(siteId, {
            id: siteId,
            url: url,
            email: email,
            baseline_content: htmlContent,
            status: 'OK',
            last_scanned: new Date().toISOString(),
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Successfully added ${url} for monitoring.` }),
        };
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ error: `Failed to fetch or save URL: ${error.message}` }) };
    }
};
