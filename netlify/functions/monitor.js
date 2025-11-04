// This is a simplified function for demonstration.
// A full implementation would require a database.
exports.handler = async (event, context) => {
  const { url, email } = JSON.parse(event.body);
  console.log(`Request to monitor ${url} for ${email}`);
  // In a real app, you would save this to a database here.
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Successfully added ${url} for monitoring.` }),
  };
};
