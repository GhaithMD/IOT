import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const SensorScreen = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [alert, setAlert] = useState(null); // Updated alert state
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get('window').width;

  const updateTimestampLabels = () => {
    const now = new Date();
    const newLabels = Array.from({ length: 3 }, (_, i) => {
      const time = new Date(now.getTime() - (2 - i) * 60000); // Last 3 minutes
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    setLabels(newLabels);
  };

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await axios.get('http://192.168.1.20:3001/get-sensor-data');
        const { temperature, humidity, alert } = response.data; // Get alert from backend

        setTemperature(temperature);
        setHumidity(humidity);
        setAlert(alert); // Update alert state

        setTemperatureData(prev => [...prev, parseFloat(temperature)].slice(-3));
        setHumidityData(prev => [...prev, parseFloat(humidity)].slice(-3));

        updateTimestampLabels();
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {alert && ( // Show alert if present
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>{alert}</Text>
          </View>
        )}
        <View style={styles.sensorDataContainer}>
          <View style={styles.dataBox}>
            <Text style={styles.dataLabel}>Temperature</Text>
            <Text style={styles.dataValue}>{temperature}°C</Text>
          </View>
          <View style={styles.dataBox}>
            <Text style={styles.dataLabel}>Humidity</Text>
            <Text style={styles.dataValue}>{humidity}%</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {temperature > 30
              ? '🌡️ High temperature detected!'
              : '😊 Temperature is comfortable'}
            {humidity < 30 ? ', Air is dry' : ''}
          </Text>
        </View>
        <View style={styles.graphContainer}>
          <Text style={styles.graphLabel}>Temperature and Humidity Over Time</Text>
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: temperatureData,
                  color: () => '#007ACC',
                },
                {
                  data: humidityData,
                  color: () => '#FFC107',
                },
              ],
              legend: ['Temperature °C', 'Humidity %'],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 122, 204, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#007ACC' },
            }}
            bezier
            style={styles.graph}
          />
        </View>
        <View style={styles.recordContainer}>
          <Text style={styles.recordTitle}>Recorded Data</Text>
          {labels.map((label, index) => (
            <Text key={index} style={styles.recordText}>
              {label} - Temp: {temperatureData[index]}°C, Hum: {humidityData[index]}%
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eaf6ff',
  },
  scrollContainer: {
    padding: 20,
  },
  alertBox: {
    backgroundColor: '#FFCCCC',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  alertText: {
    fontSize: 16,
    color: '#D8000C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sensorDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dataBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
    elevation: 2,
  },
  dataLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007ACC',
  },
  statusContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  graphContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  graphLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  graph: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recordContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007ACC',
    marginBottom: 10,
  },
  recordText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  loadingText: {
    fontSize: 20,
    color: '#007ACC',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SensorScreen;
