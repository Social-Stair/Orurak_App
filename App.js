import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import InitialScreen from './src/screens/InitialScreen';
import LoginScreen from './src/screens/LoginScreen';
import RecordDetailScreen from './src/screens/RecordDetailScreen';
import RecordWriteScreen from './src/screens/RecordWriteScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import StartScreen from './src/screens/StartScreen';

import MainTab from './src/navigation/MainTab';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Pretendard-Regular': require('./src/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('./src/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('./src/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('./src/fonts/Pretendard-Bold.otf'),
    'Pretendard-ExtraBold': require('./src/fonts/Pretendard-ExtraBold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* 로그인 화면 */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="Initial" 
          component={InitialScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Start" 
          component={StartScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen name="MainTab" component={MainTab} options={{ headerShown: false }} />

        <Stack.Screen 
          name="RecordWrite" 
          component={RecordWriteScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="RecordDetail" 
          component={RecordDetailScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}