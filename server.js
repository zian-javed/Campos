// Import necessary modules
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Place the app.post route here
app.post('/api/teams-message', async (req, res) => {
    const userMessage = req.body.message;

    try {
        console.log('Sending request to GPT API...');
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4', // Use 'gpt-4' or 'gpt-3.5-turbo'
                messages: [
                    { role: 'system', content: 'You are a tax advisor specialized in Canadian corporate taxes. Provide concise and accurate answers.'},
                    { role: 'user', content: userMessage },
                ],
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('GPT API Response:', response.data); // Debugging log
        // Extract GPT response
        const gptResponse = response.data.choices[0].message.content.trim();

        // Send the response back to the client
        res.json({ reply: gptResponse });
    } catch (error) {
        console.error('Error connecting to GPT API:'); // Debugging log
        console.error(error.response?.data || error.message); // Detailed error log
        res.status(500).json({ error: 'Failed to process your request.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
