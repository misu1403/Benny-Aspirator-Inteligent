import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { auth } from './services/supabase';
import AuthScreen from './screens/AuthScreen';
import MapScreen from './screens/MapScreen';
import ActivityScreen from './screens/ActivityScreen';
import ControlScreen from './screens/ControlScreen';
import HomeScreen from './screens/HomeScreen';



const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();


function AppTabs() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#111',
            borderBottomColor: '#333',
          },
          tabBarActiveTintColor: '#33ff99',
          tabBarInactiveTintColor: '#aaa',
          tabBarIndicatorStyle: {
            backgroundColor: '#33ff99',
            height: 3,
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 14,
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Activity" component={ActivityScreen} />
        <Tab.Screen name="Control" component={ControlScreen} /> 
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: authListener } = auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {session ? (
            <Stack.Screen name="Main" component={AppTabs} />
          ) : (
            <Stack.Screen name="Auth" component={AuthScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
