import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import { auth, supabaseUrl, supabaseAnonKey } from '../services/supabase';
import { PostgrestClient } from '@supabase/postgrest-js';

export default function ControlScreen() {
  const [manualControl, setManualControl] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await auth.getUser();

      if (error || !user) {
        Alert.alert('Eroare autentificare', 'Nu s-a putut obține utilizatorul.');
        return;
      }

      setUserId(user.id);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const supabaseClient = (token) =>
    new PostgrestClient(`${supabaseUrl}/rest/v1`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    });

  const updateManualControl = async (value) => {
    if (!userId) return;

    setManualControl(value);

    const session = await auth.getSession();
    const token = session.data.session?.access_token;
    const db = supabaseClient(token);

    const { error } = await db
      .from('robot_control')
      .update({ manual_control: value })
      .eq('user_id', userId);

    if (error) {
      Alert.alert('Eroare la activarea modului manual');
      console.error(error);
    }
  };

  const sendCommand = async (command) => {
    if (!manualControl) {
      Alert.alert('Control inactiv', 'Activează controlul manual mai întâi.');
      return;
    }

    const session = await auth.getSession();
    const token = session.data.session?.access_token;
    const db = supabaseClient(token);

    const { error } = await db
      .from('robot_control')
      .update({ command, manual_control: true })
      .eq('user_id', userId);

    if (error) {
      Alert.alert('Eroare la trimiterea comenzii');
      console.error(error);
    } else {
      Alert.alert('Comandă trimisă', command);
    }
  };

  const ControlButton = ({ label, onPress, bg = '#222' }) => (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: bg,
          opacity: manualControl ? 1 : 0.5,
        },
      ]}
      onPress={onPress}
      disabled={!manualControl}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>🔄 Se conectează la utilizator...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🤖 Smart Robot Controller</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Manual Control</Text>
        <Switch
          value={manualControl}
          onValueChange={updateManualControl}
          trackColor={{ false: '#999', true: '#00cc88' }}
          thumbColor={manualControl ? '#fff' : '#ccc'}
        />
      </View>

      <Text style={{ color: '#ccc', marginBottom: 20 }}>
        {manualControl ? '📱 Control manual activat' : '🤖 Autopilot activ'}
      </Text>

      <View style={styles.controlGrid}>
        <ControlButton label="↑" onPress={() => sendCommand('forward')} />
        <ControlButton label="←" onPress={() => sendCommand('left')} />
        <ControlButton label="→" onPress={() => sendCommand('right')} />
        <ControlButton label="↓" onPress={() => sendCommand('backward')} />
        <ControlButton label="⛔ STOP" onPress={() => sendCommand('stop')} bg="#ff4444" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    color: '#00cc88',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  switchLabel: {
    fontSize: 18,
    color: '#fff',
  },
  controlGrid: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  button: {
    width: 140,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
