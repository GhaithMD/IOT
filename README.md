# IoT Project: Temperature and Humidity Monitoring

## Overview

This project aims to build an IoT system that monitors temperature and humidity data from sensors and stores it for analysis. The system integrates IoT devices, a backend server, and a monitoring platform to provide real-time insights into environmental conditions.

### Features:
- Real-time monitoring of temperature and humidity.
- Data transmission from IoT sensors to a central server.
- Integration with Zabbix for data storage and visualization.
- Simulated sensor data during the development phase using static files.

---

## Project Architecture
![image](https://github.com/user-attachments/assets/ceea7e7b-33c8-4000-a7a0-9620088e06ef)


The architecture of this IoT project is as follows:

1. **IoT Sensors**:  
   - Devices capture temperature and humidity data.
   - In the development phase, a static file with pre-recorded data simulates sensor readings.

2. **Data Transmission**:  
   - Data is sent from the sensors to the backend server using HTTP POST requests.

3. **Backend Server**:  
   - Built using **Express.js**, the server processes incoming data.
   - The server forwards data to the Zabbix monitoring platform using the Zabbix sender protocol.

4. **Monitoring and Visualization**:  
   - **Zabbix** is used to store, monitor, and visualize the collected data.
   - The server and Zabbix are hosted on a **Ubuntu virtual machine**.
   - A **Windows machine** acts as the Zabbix agent for testing.

---

## Technologies Used

- **IoT Devices**: Sensors for temperature and humidity monitoring.
- **Backend**: Express.js for handling and forwarding data.
- **Monitoring Platform**: Zabbix for storing and visualizing data.
- **Development Environment**:  
  - Ubuntu (VM) for Zabbix Server.  
  - Windows for Zabbix Agent.  
  - Static file simulation for initial testing.

---

## How It Works

1. **Development Phase**:  
   - Static files with simulated data (temperature, humidity, and timestamp) are used to test the backend and monitoring system.
   
2. **Backend Functionality**:  
   - The backend server receives sensor data via HTTP POST requests.
   - It processes and sends the data to Zabbix using Zabbix sender.

3. **Data Visualization**:  
   - Zabbix stores the data in time-series format.
   - Dashboards provide real-time visualization of temperature and humidity trends.

---

## Future Enhancements

- Replace simulated data with real-time sensor inputs using ESP cards.
- Add advanced data analytics for pattern recognition and anomaly detection.
- Expand to other environmental metrics (e.g., air quality, pressure).

---

## Setup Instructions
### How to Use It
- Copy the code above into a file named `README.md` and save it in the root of your project.
- Update specific details like file names, contributors, or links if needed. 

This README provides a professional overview and architecture for your IoT project while being beginner-friendly.

