const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8443; // Use 8443 for HTTPS

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Load SSL certificate and key
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'key')), // Replace with your key file
    cert: fs.readFileSync(path.join(__dirname, 'certif.crt')), // Replace with your cert file
};

// Route to receive data from ESP32
app.post('/receive-data', (req, res) => {
    const { temperature, humidity } = req.body;

    // Check if the required fields are present
    if (temperature === undefined || humidity === undefined) {
        return res.status(400).json({ status: 'error', message: 'Missing temperature or humidity data' });
    }

    // Write the data to a text file for logging or debugging purposes
    fs.writeFile('sensor_data.txt', `temperature:${temperature}\nhumidity:${humidity}\n`, (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Failed to write to file' });
        }

        // Zabbix sender command parameters
        const zabbixServerIp = 'zabbixServerIp'; // Replace with your Zabbix server IP
        const windowsHostname = 'windowsHostname'; // Replace with your Windows machine hostname
        const tlsConnect = 'tlsConnect';
        const tlsPskIdentity = 'tlsPskIdentity';
        const tlsPskFile = 'tlsPskFile';

        // Send temperature data to Zabbix
        const tempCommand = `zabbix_sender -z ${zabbixServerIp} -s "${windowsHostname}" -k sensor.temperature -o ${temperature} ${tlsConnect} ${tlsPskIdentity} ${tlsPskFile}`;

        exec(tempCommand, (err, stdout, stderr) => {
            if (err || stderr) {
                return res.status(500).json({ status: 'error', message: `Zabbix sender error for temperature: ${stderr || err.message}` });
            }

            // Send humidity data to Zabbix
            const humidityCommand = `zabbix_sender -z ${zabbixServerIp} -s "${windowsHostname}" -k sensor.humidity -o ${humidity} ${tlsConnect} ${tlsPskIdentity} ${tlsPskFile}`;

            exec(humidityCommand, (err, stdout, stderr) => {
                if (err || stderr) {
                    return res.status(500).json({ status: 'error', message: `Zabbix sender error for humidity: ${stderr || err.message}` });
                }

                return res.status(200).json({ status: 'success', message: 'Data sent to Zabbix securely' });
            });
        });
    });
});

// Start the HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Secure server is running on https://localhost:${port}`);
});
