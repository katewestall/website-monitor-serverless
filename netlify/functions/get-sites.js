// netlify/functions/get-sites.js
const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
    try {
        // Connect to our Data Entities store
        const store = getStore('monitored-sites');

        // Get a list of all our monitored sites
        const { blobs } = await store.list();

        // Fetch the details for each site
        const sites = await Promise.all(
            blobs.map(async (blob) => {
                const siteData = await store.get(blob.name);
                return JSON.parse(siteData);
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify(sites),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: `Failed to fetch sites: ${error.message}` }) };
    }
};
