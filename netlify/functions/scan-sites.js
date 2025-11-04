// netlify/functions/scan-sites.js
const axios = require('axios');

// --- EMAIL CONFIGURATION ---
// We use Netlify Environment Variables for security!
// Go to Site settings > Build & deploy > Environment > Environment variables
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD; // Use an App Password for Gmail
const SMTP_SERVER = "smtp.gmail.com";
const SMTP_PORT = 587;
// --------------------------

// A simple in-memory "database" for this demo.
// In a real app, use a persistent database like FaunaDB.
let siteDatabase = [
    { id: '1', url: 'https://www.nasa.gov/', email: 'your-test-email@gmail.com', baseline: '' }
];

async function sendChangeEmail(receiverEmail, url) {
    // Using a service like EmailJS or Formspree is easier for serverless.
    // This is a nodemailer example, which requires more setup.
    // For simplicity, we'll just log to the console.
    console.log(`--- CHANGE DETECTED ---`);
    console.log(`Sending email to ${receiverEmail} for URL: ${url}`);
    console.log(`----------------------`);
    // In a real implementation, you would use a library like `nodemailer` here.
}

exports.handler = async (event, context) => {
    console.log("Running scheduled scan...");
    for (const site of siteDatabase) {
        try {
            const response = await axios.get(site.url, { timeout: 10000 });
            const currentContent = response.data;

            if (site.baseline === '') {
                site.baseline = currentContent;
                console.log(`Baseline set for ${site.url}`);
                continue;
            }

            const similarity = simpleSimilarity(site.baseline, currentContent);
            console.log(`Similarity for ${site.url}: ${similarity}%`);

            if (similarity < 99) {
                console.log(`CHANGE DETECTED on ${site.url}!`);
                await sendChangeEmail(site.email, site.url);
                site.baseline = currentContent; // Update baseline
            }
        } catch (error) {
            console.error(`ERROR scanning ${site.url}: ${error.message}`);
        }
    }
    return { statusCode: 200, body: JSON.stringify({ message: 'Scan complete.' }) };
};

function simpleSimilarity(str1, str2) {
    let longer = str1;
    let shorter = str2;
    if (str1.length < str2.length) {
        longer = str2;
        shorter = str1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) return 100.0;
    return ( (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength) ) * 100;
}
function editDistance(str1, str2) {
    str1 = str1.toLowerCase(); str2 = str2.toLowerCase();
    const costs = [];
    for (let i = 0; i <= str1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (str1.charAt(i - 1) !== str2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[str2.length] = lastValue;
    }
    return costs[str2.length];
}
