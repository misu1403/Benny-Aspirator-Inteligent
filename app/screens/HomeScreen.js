import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { auth } from '../services/supabase';

export default function HomeScreen() {
  const logout = async () => {
    await auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bine ai venit în aplicația Benny</Text>
      <Text style={styles.subtitle}>Te-ai autentificat cu succes.</Text>

      <Pressable onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Deconectează-te</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00cc88',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 40,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#222',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: '#ff6666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
