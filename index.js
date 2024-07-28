const express = require('express');
const axios = require('axios');
const base64 = require('base-64');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

app.post('/meal-planner', async (req, res) => {
  try {
    const requestBody = req.body;

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Edamam-Account-User': process.env.EDAMAM_ACCOUNT_USER,
      'Authorization': 'Basic ' + base64.encode(`${process.env.EDAMAM_API_ID}:${process.env.EDAMAM_API_KEY}`)
    };

    console.log('Headers:', headers);

    const response = await axios.post(
      `https://api.edamam.com/api/meal-planner/v1/${process.env.EDAMAM_API_ID}/select`,
      requestBody,
      { headers }
    );

    res.json(response.data);

  } catch (error) {
  console.error('Error:', error);
  res.status(500).send('An error occurred while processing your request.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
