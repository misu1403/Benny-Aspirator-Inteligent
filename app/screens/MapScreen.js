import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { getAuthorizedDb } from '../services/supabase';

const CELL_SIZE = 30;
const OFFSET = 0;
const USER_ID = '4895963a-2888-40a5-8fc7-58caaca2024b';

const LiveMapScreen = () => {
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    const interval = setInterval(fetchData, 1000);
    fetchData();
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const db = await getAuthorizedDb();
    const { data, error } = await db.from('map_data').select('*');
    if (error) return;

    const deduped = {};
    data.forEach(item => {
      const key = `${item.x}_${item.y}`;
      if (!deduped[key] || item.type === 'robot') {
        deduped[key] = item;
      }
    });
    setMapData(Object.values(deduped));
  };

  const clearMap = async () => {
    const db = await getAuthorizedDb();

    
    await db.from('map_data').delete().eq('user_id', USER_ID);

    
    await db.from('robot_logs').delete().neq('id', 0);

    setMapData([]);
    Alert.alert('Resetare completă', 'Datele au fost șterse cu succes.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗺️ Hartă Robot</Text>
      <Pressable onPress={clearMap} style={styles.resetBtn}>
        <Text style={styles.resetBtnText}>Resetează hartă și grafice</Text>
      </Pressable>
      <View style={styles.mapArea}>
        {mapData.map((item) => (
          <View
            key={`x${item.x}y${item.y}_${item.type}`}
            style={[
              styles.cell,
              {
                left: (item.x + OFFSET) * CELL_SIZE,
                bottom: (item.y + OFFSET) * CELL_SIZE,
                backgroundColor:
                  item.type === 'robot'
                    ? '#00eaff'
                    : item.type === 'wall'
                    ? '#888'
                    : '#1f1f1f',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    color: '#00cc88',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resetBtn: {
    marginBottom: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#222',
    borderRadius: 6,
  },
  resetBtnText: {
    color: '#ff6666',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  mapArea: {
    width: 400,
    height: 400,
    backgroundColor: '#111',
    position: 'relative',
    borderColor: '#444',
    borderWidth: 2,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#222',
  },
});

export default LiveMapScreen;
