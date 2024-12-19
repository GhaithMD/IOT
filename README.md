# Secure IoT Monitoring System for Temperature and Humidity

## Overview
This project aims to develop a secure IoT system for monitoring temperature and humidity data from sensors and storing it for analysis. The system integrates IoT devices, a backend server, and a monitoring platform to deliver real-time insights into environmental conditions while ensuring robust security.

### Key Features
- **Real-Time Data Monitoring**: Continuously captures and displays environmental conditions on Zabbix and a mobile application, "Sensify."
- **Data Storage and Analysis**: Securely stores sensor data for historical analysis and advanced analytics.
- **Secure Communication**: Utilizes HTTPS for encrypted data transmission and ensures data integrity.
- **Enhanced Authentication**: Employs Firebase Authentication to manage user access securely.
- **Robust Monitoring with Zabbix**: Uses Zabbix PSK for secure data submission and monitoring.
- **Wi-Fi Connectivity**: Implements Wi-Fi security standards to ensure secure connectivity.

---

## Architecture
![image](https://github.com/user-attachments/assets/ceea7e7b-33c8-4000-a7a0-9620088e06ef)


1. **Data Capture**: ESP32 collects temperature and humidity data.
2. **Data Transmission**: 
   - From ESP32 to a home router over Wi-Fi.
   - From the router to the Gateway via HTTPS.
3. **Data Storage and Monitoring**: Data is stored and monitored in Zabbix.
4. **Alerting**: Zabbix generates alerts for threshold breaches.
5. **End-User Access**: Firebase Authentication ensures secure user access to real-time data and alerts.

---
## Key Components
- **ESP32**: Captures temperature and humidity data.
- **Gateway**: Relays data securely to the internet.
- **Zabbix**: Monitors, stores data, and generates alerts.
- **Firebase**: Manages user authentication.
- **Mobile App (Sensify)**: Displays real-time data and alerts.

## Technologies Used

- **IoT Devices**: Sensors for temperature and humidity monitoring.
- **Backend**: Express.js for handling and forwarding data.
- **Monitoring Platform**: Zabbix for storing and visualizing data.
- **Development Environment**:  
  - Ubuntu (VM) for Zabbix Server.  
  - Windows for Zabbix Agent. 

---

## Practical Implementation

### 1. Data Collection and Transmission
**Objective:** Capture temperature and humidity data from sensors and securely transmit it to the gateway.

**Key Components:**
- **ESP32**: Captures temperature and humidity data.
- **Wi-Fi Communication**: The ESP32 sends data wirelessly to the home router.
- **Gateway**: Receives the data locally from the router and prepares it for secure transmission.

**Key Protocols:**
- Wi-Fi
- HTTPS

#### Detailed Implementation
**Assembling the IoT Circuit:**
The IoT circuit was built using an ESP32 microcontroller connected to temperature and humidity sensors. Connections were verified to ensure reliable communication between the ESP32 and the sensors.

![image](https://github.com/user-attachments/assets/9d8712af-095b-4431-ad71-800c0a5ac2eb)


**Wi-Fi Configuration:**

![image](https://github.com/user-attachments/assets/61ea3a72-7cbf-41b3-8629-d41dd1241ecb)


| Protocol       | Encryption | Security                 | Performance | Recommendation             |
|----------------|------------|--------------------------|-------------|----------------------------|
| WEP            | RC4        | Weak, easily cracked     | Low         | Not recommended            |
| WPA (TKIP)     | TKIP       | Improved over WEP, but still vulnerable | Moderate    | Not recommended            |
| WPA (AES)      | AES        | Stronger security, resistant to attacks | High        | Recommended for better security |
| WPA2 (TKIP)    | TKIP       | Better than WPA (TKIP), but less secure than AES | Moderate    | Not recommended            |
| WPA2 (AES)     | AES        | Best security, robust encryption         | High        | Highly recommended          |
| WPA/WPA2 (TKIP+AES) | Mixed (TKIP + AES) | Compatible with old and new devices, but less secure than AES-only | Moderate    | Use only if compatibility is required |

**Writing the Sensor Code:**
Developed a script for the ESP32 to capture real-time temperature and humidity data from the sensors. The code ensures the data is periodically collected and prepared for transmission to the backend.

![image](https://github.com/user-attachments/assets/c2aa7329-d4db-4d7a-a713-5c536a46f08f)

**Setting Up the Gateway:**
- Installed the Zabbix Agent on the Gateway.

![image](https://github.com/user-attachments/assets/5397541e-ac22-4d8b-8922-f541e18a237c)

- Secured communication between the Zabbix Agent and the Zabbix Server using `encryption.key`.

![image](https://github.com/user-attachments/assets/eccd72e1-d72c-4aad-993d-098d82b31038)

- Configured PSK (Pre-Shared Key) by modifying `Zabbix_agentd.conf` to ensure data authenticity and encryption.

  ![image](https://github.com/user-attachments/assets/ce4071eb-fea9-48c4-b17f-bb4f4bb60282)


**API Development for Data Transmission:**
- Wrote an API on the Gateway using Express.js to:
  - Retrieve temperature and humidity data from the IoT circuit (ESP32).
  - Transmit the collected data securely to the Zabbix Server using the HTTPS protocol.
 
   ![image](https://github.com/user-attachments/assets/a017250d-3a55-4a89-96c1-72633ebf8b31)

- This ensures data integrity during transmission from the Gateway to the Zabbix Server.

### 2. Data Storage, Monitoring, and Alerting
**Objective:** Securely store sensor data, monitor it in real time, and generate alerts.

**Key Components:**
- **Zabbix Server**: Stores the data, monitors it, and triggers alerts for abnormal values.
- **HTTPS**: Ensures secure communication when transmitting data to Zabbix.
- **PSK (Pre-Shared Key)**: Used for secure authentication between the Gateway and the Zabbix Server.

**Output:** Zabbix generates real-time alerts and stores historical data for analysis.

#### Detailed Implementation
**Installing and Securing Zabbix Server:**
1. Install Zabbix repository.

![image](https://github.com/user-attachments/assets/413312a5-564c-4a22-9232-c5c0aeb18d3a)

![image](https://github.com/user-attachments/assets/335c6f0f-f2cc-4a00-99f2-c7861fbad6b0)

2. Install Zabbix server, frontend, and agent.

![image](https://github.com/user-attachments/assets/dafea454-ec57-4f61-b1ec-7c0053664a4d)

3. Create initial database.

![image](https://github.com/user-attachments/assets/ca07f032-0abe-4c0e-937e-5d914ccce354)

![image](https://github.com/user-attachments/assets/82957c66-5dac-4460-ae57-6fa41c23f654)


4. On Zabbix server host, import the initial schema and data. You will be prompted to enter your newly created password.

![image](https://github.com/user-attachments/assets/159097fa-c4bd-4f39-b3c9-f6f021ae891c)

5. Disable `log_bin_trust_function_creators` option after importing the database schema.

![image](https://github.com/user-attachments/assets/f2121838-8299-47f6-8d0e-4a90bf08b188)

6. Configure the database for Zabbix server: Edit the file `/etc/zabbix/zabbix_server.conf`.

![image](https://github.com/user-attachments/assets/703ac487-3c5e-4f24-a02d-d9ee3c80e849)

7. Start Zabbix server and agent processes. Check the Zabbix server status.

![image](https://github.com/user-attachments/assets/53a88db9-eb01-4541-a8c2-9522da1b75f4)

8. Add the Zabbix IP address and its corresponding domain to the `/etc/hosts` file.

![image](https://github.com/user-attachments/assets/808f0048-d347-4847-9052-57dc21d540df)

9. To ensure secure data transmission, implement the HTTPS protocol:
   - Create a directory at `/etc/ssl/zabbix` to store SSL certificate and key files: `sudo mkdir -p /etc/ssl/zabbix`

      ![image](https://github.com/user-attachments/assets/5ae95362-addf-47b9-91af-9de58c2a7588)

   - Using OpenSSL, generate a self-signed SSL certificate and private key with a validity of 365 days, saving them in `/etc/ssl/zabbix`:
     ```bash
     sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/zabbix/zabbix.key -out /etc/ssl/zabbix/zabbix.crt
     ```
      ![image](https://github.com/user-attachments/assets/d9c02897-aa8a-47e9-9b3b-79bb881c1121)

   - Enable the Apache SSL module to support HTTPS on the server: `sudo a2enmod ssl`

      ![image](https://github.com/user-attachments/assets/5e801d39-7265-4d40-ad7d-76963b3a1da1)

   - Enable the default SSL site configuration for Apache to serve HTTPS requests: `sudo a2ensite default-ssl`
      
      ![image](https://github.com/user-attachments/assets/98a9f389-84ce-4596-b187-e5ee0c452e02)

   - Edit the SSL site configuration file to include custom settings like specifying the `ServerName`.
   - Set the `ServerName` directive in the Apache configuration to match the domain `zabbix.iot.com`: `sudo nano /etc/apache2/sites-available/default-ssl.conf`

      ![image](https://github.com/user-attachments/assets/f39f53b7-bbbe-4ad0-83fb-2731cab0bb15)

   - On a Windows system, access the hosts file at `C:\Windows\System32\drivers\etc` to map the Zabbix domain name to its IP address for local resolution.

      ![image](https://github.com/user-attachments/assets/479daaa4-bba2-410b-9bbd-27d04fab5d01)

10. The default URL for Zabbix UI when using the Apache web server is `https://www.zabbix.iot.tn/zabbix`. 

![image](https://github.com/user-attachments/assets/fdb27fd9-4736-4966-aa8c-b3b9dbad77bc)

Inspect the certificate on the web browser.

![image](https://github.com/user-attachments/assets/ba0a6429-be6c-45c5-8f5d-bcc80cae74f6)

**Configuring the Gateway as a Zabbix Host:**
- Add the Gateway machine to Zabbix as a host.

![image](https://github.com/user-attachments/assets/b8032028-5ddb-40be-9fb3-509c1520d27f)

- Enhance security by enabling the PSK (Pre-Shared Key) configuration, ensuring authenticated and encrypted communication between the Gateway and the Zabbix Server.

![image](https://github.com/user-attachments/assets/2cc20383-1a48-4fb4-9137-0b8683cd2690)


**Creating Items for Data Storage:**
- Two key items were created under the Gateway host in Zabbix:
  - **Temperature Item**: To store temperature data received from the API.

   ![image](https://github.com/user-attachments/assets/d8f0a528-5995-4835-b2e3-8e9d9b8ea956)

  - **Humidity Item**: To store humidity data received from the API.
   ![image](https://github.com/user-attachments/assets/c1e3eedd-cca8-43cd-b64b-0f64719761f6)

- This setup ensures each type of data is stored appropriately for further monitoring and analysis.

**Configuring Alerts:**
- Set up alerts in Zabbix to trigger notifications when thresholds are exceeded:
  - **Temperature Alert**: Triggers when the temperature exceeds 40°C.
  - **Humidity Alert**: Triggers when the humidity exceeds 75%.

   ![image](https://github.com/user-attachments/assets/54905209-c905-4ba7-b65a-5952e03c0d98)

- These alerts enable real-time notifications for critical environmental conditions, ensuring prompt action.

### 3. End-User Application and Security
**Objective:** Provide secure access to real-time data and alerts for end-users.

**Key Components:**
- **Firebase Authentication**: Ensures only authorized users can access the application.
- **End-User Application**: Displays temperature, humidity, and alert notifications.
- **Secure Alerts**: Real-time alerts pushed to the application from Zabbix.
- **Key Protocols:** HTTPS for secure communication between Zabbix, Firebase, and the app.

This division simplifies the practical implementation while highlighting the key objectives, components, and security measures at each stage.

#### Detailed Implementation
**Setting up Firebase:**
1. Visit the Firebase website at [https://firebase.google.com/](https://firebase.google.com/), create an account, and navigate to the Firebase console. From there, create a new project and name it "IotApp."

![image](https://github.com/user-attachments/assets/1532fa3a-b317-43ed-a15f-04113238abcb)

**Connect Firebase to the application:**
1. Go to the Project Settings in your Firebase console.
2. Register your application by adding it to the project. This process will generate the Firebase SDK, which will be used to establish a connection between your app and Firebase.

![image](https://github.com/user-attachments/assets/c379410d-26e1-47aa-8c3e-b93a41a5b43b)

**Setting Up Firebase Authentication:**
Firebase Authentication was configured to handle user sign-up and login, ensuring secure access to the application.

![image](https://github.com/user-attachments/assets/c0e890a2-67a3-4d92-a4a4-e5fb4dbef4e4)

**Developing the Application:**
- **Frontend:**
  - The application was developed using React Native to create a responsive and user-friendly mobile interface.

      ![image](https://github.com/user-attachments/assets/4916b9e1-f573-42e6-aea9-39061594c4f4)

  - The first page serves as a Welcome Screen with user authentication.

      ![image](https://github.com/user-attachments/assets/397b03cb-b805-47f6-9995-d228312da283)

  - Firebase handles user login and verifies credentials:
    - If authentication fails, the app displays an error.

      ![Screenshot_1734613484](https://github.com/user-attachments/assets/a746e8d7-17ac-4388-8c67-6c3b5c35719c)

    - If authentication is successful, the app displays:

      ![image](https://github.com/user-attachments/assets/cefcebba-9911-44b3-9bb1-6bfb2d189af9)

      - Real-Time Temperature and Humidity Data
      - Alert Notifications for threshold breaches (temperature > 40°C or humidity > 75%).
      
      ![image](https://github.com/user-attachments/assets/94df5f96-b6f4-4807-b447-d7e2cf809bf0)


- **Backend:**
  - The backend was developed using Express.js to act as a bridge between the Zabbix Server and the mobile application.

   ![image](https://github.com/user-attachments/assets/18f85d98-14a5-40c2-9482-33431282b197)

  - The Express API performs the following:
    - Retrieves temperature, humidity, and alert data from the Zabbix Server.
    - Sends the retrieved data securely to the mobile application for real-time monitoring.

**Secure Data Communication:**
- Data between the backend (Express.js) and the application is transmitted securely using HTTPS to ensure encryption and protection from interception.
- Firebase Authentication ensures that only authorized users can access the data and alerts.

## Test Phase

### 1. Data Collection and Transmission
**Test Objectives:**
- Ensure that the sensor data, including temperature, humidity, and timestamp, is accurately captured and seamlessly transferred. Additionally, verify that the data transmission from the IoT device to the server functions reliably, without any interruptions or errors, to maintain the integrity and consistency of the information.

![image](https://github.com/user-attachments/assets/e8713426-3241-4a39-819c-34c417e82d00)

- Test the data transmission over Wi-Fi to ensure stability and reliability, and verify that HTTPS is being used securely to protect the data during transfer.

![image](https://github.com/user-attachments/assets/c9bfec77-4c8f-4485-9844-99055785ced9)


### 2. Data Storage, Monitoring, and Alerting
**Test Objectives:**
- Verify that the data is being accurately stored in Zabbix, ensuring proper logging and accessibility for monitoring and analysis. Additionally, validate that the monitoring system effectively captures real-time data and trends, enabling comprehensive and up-to-date insights.

![image](https://github.com/user-attachments/assets/9622014c-37c8-40df-a76f-a1334e32b842) ![image](https://github.com/user-attachments/assets/04508787-4cfd-4007-9efc-0cc23b1bd555)


- Test the alerting functionality to ensure the system responds appropriately when predefined thresholds, such as high temperature, are exceeded.

![image](https://github.com/user-attachments/assets/5a220bc2-2a1c-455c-9c77-b9841b3b9f48)

### 3. End-User Application and Security
**Test Objectives:**
- Test the end-user application, if applicable, to confirm that sensor data is displayed accurately.

![image](https://github.com/user-attachments/assets/453d38cb-6899-4db0-851e-2d7f38e712fa)

- Ensure that the app's security features, including Firebase integration and user authentication, are functioning correctly to safeguard user data and maintain secure access.

![image](https://github.com/user-attachments/assets/a02feb3b-aad4-44ed-af34-e0afbe5acc77)

- Verify that only authorized users can access sensitive data and perform actions, ensuring that proper access control mechanisms and authentication procedures are in place.

![image](https://github.com/user-attachments/assets/4bc9a86a-85ed-430b-ab58-fa2d3cb8e88f)

## Pentesting Report for the Project

**Objective:** To ensure the security of the project by analyzing SSL/TLS configurations and testing for vulnerabilities in data transmission.

### Step 1: SSL/TLS Analysis with SSLLyze
**Tool Used:** SSLLyze  
**Purpose:**
- To evaluate the SSL/TLS configuration of the HTTPS server.
- To identify any potential vulnerabilities or misconfigurations.

**Process:**
- Ran SSLLyze on the server hosting the project, targeting port 8443 (HTTPS).

![image](https://github.com/user-attachments/assets/a1117da1-7b4b-4652-b565-9f344617f29c)

- Analyzed the SSL/TLS certificates, supported protocols, ciphers, and server configurations.

![image](https://github.com/user-attachments/assets/417bb61a-2a62-41b6-85db-630cb3a5360c)

**Findings:**
- **Protocols:**
  - Supported TLS 1.2 and TLS 1.3, with no support for deprecated versions like SSL 2.0 or SSL 3.0.
- **Cipher Suites:**
  - Secure ciphers such as AES-GCM and CHACHA20 were supported.
  - Forward secrecy was enabled.
- **Security Vulnerabilities:**
  - No major vulnerabilities like Heartbleed, ROBOT, or CCS injection were detected.

**Conclusion:**
The server's SSL/TLS configuration is secure, with strong encryption and forward secrecy. However, the use of a self-signed certificate and hostname mismatch might impact trust.

### Step 2: Man-in-the-Middle (MitM) Simulation with Ettercap
**Tool Used:** Ettercap  
**Purpose:**
- To simulate a MitM attack and verify if the communication between the client and server is encrypted.

**Process:**
- Set up Ettercap in a Local Area Network (LAN) environment to perform ARP spoofing.

![image](https://github.com/user-attachments/assets/43d5e39a-1c44-4647-afd3-1940b3f91a30)

- Redirected traffic between the Zabbix server and the API to the attacker's machine.
- Captured network packets to inspect transmitted data.

![image](https://github.com/user-attachments/assets/ccf886f2-f1f3-407f-83c1-9c763b8f5daf)

**Findings:**
- All traffic between the client and server was encrypted.
- No sensitive data was visible in plaintext during interception.
- The encryption ensured that data integrity and confidentiality were maintained even in a compromised network.

**Conclusion:**
The communication layer is secure, with no visible data leakage or vulnerabilities in the transmission.

## Project Perspective
The primary goal of this project is to leverage Zabbix’s monitoring capabilities to track and manage the data from the IoT sensors. By utilizing the ESP32 to capture the data and the Zabbix agent on the gateway to forward it to the server, we’re creating a scalable and secure system for real-time monitoring. Once fully deployed, this setup will provide valuable insights into environmental conditions, helping to automate responses and improve system efficiency.

## Acknowledgements
I would like to sincerely thank my colleagues __Eya Berradhia__ and __Mayssa Berradhia__ for their incredible teamwork and dedication throughout this project. Their contributions were invaluable in making this project a success, and I greatly appreciate their hard work and support.
