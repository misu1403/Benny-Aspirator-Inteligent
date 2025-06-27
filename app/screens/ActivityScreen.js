import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { auth, supabaseUrl, supabaseAnonKey } from '../services/supabase';
import { PostgrestClient } from '@supabase/postgrest-js';

export default function ActivityDashboard() {
  const [loading, setLoading] = useState(true);
  const [distancePoints, setDistancePoints] = useState([]);
  const [activityPerHour, setActivityPerHour] = useState([]);
  const [obstaclesPerHour, setObstaclesPerHour] = useState([]);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const session = await auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) return;

    const client = new PostgrestClient(`${supabaseUrl}/rest/v1`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    });

    const { data, error } = await client
      .from('robot_logs')
      .select('event,value,source,created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !data) return;

    const activity = Array(24).fill(0);
    const obstacles = Array(24).fill(0);
    const distances = [];

    data.forEach((log) => {
      const hour = new Date(log.created_at).getHours();
      if (log.event === 'distance' && log.source === 'front') {
        const val = parseFloat(log.value);
        if (isFinite(val)) distances.push(val);
        activity[hour] += 1;
      }
      if (log.event === 'obstacle') {
        obstacles[hour] += 1;
      }
    });

    setDistancePoints(distances.slice(0, 30).reverse());
    setActivityPerHour(activity);
    setObstaclesPerHour(obstacles);
    setLoading(false);
  };

  const chartConfig = {
    backgroundGradientFrom: '#1E1E1E',
    backgroundGradientTo: '#0D0D0D',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 255, 132, ${opacity})`,
    labelColor: () => '#ccc',
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#00cc88' },
    propsForLabels: { fontSize: 10 },
  };

  const filterHourLabels = () => {
    return Array.from({ length: 24 }, (_, i) => (i % 3 === 0 ? `${i}:00` : ''));
  };

  const generateDistanceLabels = () => {
    const total = distancePoints.length;
    return distancePoints.map((_, i) => (i % 5 === 0 ? `${i + 1}` : ''));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Dashboard Activitate Robot</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00cc88" />
      ) : (
        <>
          <Text style={styles.subtitle}>1. Distanță frontală (ultimele 30 măsurători)</Text>
          {distancePoints.length > 0 ? (
            <LineChart
              data={{
                labels: generateDistanceLabels(),
                datasets: [{ data: distancePoints }],
              }}
              width={screenWidth - 20}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <Text style={styles.noData}>⚠️ Nicio măsurătoare disponibilă</Text>
          )}

          <Text style={styles.subtitle}>2. Activitate robot (măsurători/oră)</Text>
          <BarChart
            data={{
              labels: filterHourLabels(),
              datasets: [{ data: activityPerHour }],
            }}
            width={screenWidth - 20}
            height={220}
            chartConfig={chartConfig}
            fromZero
            style={styles.chart}
          />

          <Text style={styles.subtitle}>3. Obstacole detectate pe oră</Text>
          <BarChart
            data={{
              labels: filterHourLabels(),
              datasets: [{ data: obstaclesPerHour }],
            }}
            width={screenWidth - 20}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(255, 80, 80, ${opacity})`,
            }}
            fromZero
            style={styles.chart}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00cc88',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 10,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 20,
  },
  noData: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
});
