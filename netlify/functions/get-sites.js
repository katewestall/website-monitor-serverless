// netlify/functions/get-sites.js
exports.handler = async (event, context) => {
    // In a real app, fetch this from your database.
    // For this demo, we return a mock list.
    const mockSites = [
        { id: '1', url: 'https://www.nasa.gov/', status: 'OK', last_scanned: new Date().toISOString() },
        { id: '2', url: 'https://example.com', status: 'CHANGED', last_scanned: new Date(Date.now() - 3600000).toISOString() }
    ];

    return {
        statusCode: 200,
        body: JSON.stringify(mockSites),
    };
};
