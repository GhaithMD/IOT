const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

// Zabbix API URL and credentials
const ZABBIX_URL = 'ZABBIX_URL';
const ZABBIX_USERNAME = 'ZABBIX_USERNAME'; // Replace with your Zabbix username
const ZABBIX_PASSWORD = 'ZABBIX_PASSWORD'; // Replace with your Zabbix password

// Function to authenticate with Zabbix and get the authentication token
async function authenticate() {
  try {
    const response = await axios.post(ZABBIX_URL, {
      jsonrpc: '2.0',
      method: 'user.login',
      params: {
        username: ZABBIX_USERNAME, // Corrected parameter name
        password: ZABBIX_PASSWORD,
      },
      id: 1,
    });

    return response.data.result; // Return the authentication token
  } catch (error) {
    console.error('Error authenticating with Zabbix:', error.response?.data || error.message);
    return null; // Return null in case of an error
  }
}


// Function to get sensor data from Zabbix
async function getSensorData(authToken, itemName) {
  try {
    const response = await axios.post(ZABBIX_URL, {
      jsonrpc: '2.0',
      method: 'item.get',
      params: {
        output: ['itemid', 'name', 'lastvalue'], // Fetch item ID, name, and last value
        filter: {
          name: itemName, // Filter by item name
        },
      },
      auth: authToken,
      id: 2,
    });
    return response.data.result[0]?.lastvalue || 'N/A'; // Return the last value or 'N/A'
  } catch (error) {
    console.error(`Error fetching ${itemName} data:`, error.message);
    return 'Error';
  }
}

// Endpoint to get temperature and humidity data
app.get('/get-sensor-data', async (req, res) => {
  try {
    const authToken = await authenticate();
    if (!authToken) {
      return res.status(500).json({ status: 'error', message: 'Authentication failed' });
    }

    const temperature = parseFloat(await getSensorData(authToken, 'temperature')) || 0; // Replace with your temperature item name
    const humidity = parseFloat(await getSensorData(authToken, 'humidity')) || 0; // Replace with your humidity item name

    // Check if the temperature exceeds the threshold
    const alert = temperature > 40 ? '⚠️ High Temperature Alert: Exceeds 40°C!' : null;
    const humidityAlert = humidity > 75 ? '⚠️ High Humidity Alert: Exceeds 75%!' : null;

    res.json({ temperature, humidity, alert });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ status: 'error', message: 'Error fetching sensor data' });
  }
});


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
