const express = require('express');
const axios = require('axios');
const base64 = require('base-64');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON request body
app.use(express.json());

app.post('/meal-planner', async (req, res) => {
  try {
    // Use the request body received from Insomnia
    const requestBody = req.body;

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Edamam-Account-User': process.env.EDAMAM_ACCOUNT_USER,
      'Authorization': 'Basic ' + base64.encode(`${process.env.EDAMAM_API_ID}:${process.env.EDAMAM_API_KEY}`)
    };

    // Log headers to verify they are correct
    console.log('Headers:', headers);

    const response = await axios.post(
      `https://api.edamam.com/api/meal-planner/v1/${process.env.EDAMAM_API_ID}/select`,
      requestBody,
      { headers }
    );

    // Send the API response back to Insomnia
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request data:', error.request);
      res.status(500).send('No response received from the API.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      res.status(500).send('An error occurred while setting up the request.');
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
