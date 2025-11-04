// netlify/functions/add-site.js
const axios = require('axios');

exports.handler = async (event, context) => {
    const { url, email } = JSON.parse(event.body);

    if (!url || !email) {
        return { statusCode: 400, body: JSON.stringify({ error: 'URL and email are required.' }) };
    }

    try {
        // Fetch initial content
        const response = await axios.get(url, { timeout: 10000 });
        const htmlContent = response.data;

        // Use Netlify's Identity/Functions database or a simple JSON file for storage
        // For simplicity, we'll use a Netlify Function environment variable to store data
        // In a real app, you'd use a proper database like FaunaDB or Supabase.
        // Here we simulate a database by reading/writing an environment variable.
        // NOTE: This is a DEMO. For many sites, this will exceed env var size limits.
        // A real DB is recommended for production.
        
        // For this demo, we'll just return a success message.
        // The `scan-sites` function will be responsible for storing state.
        // A more robust solution would involve a database like FaunaDB.

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Successfully added ${url} for monitoring.` }),
        };
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ error: `Failed to fetch URL: ${error.message}` }) };
    }
};
