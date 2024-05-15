import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { QRScanScreen } from '@/screens/QRScanScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const QRScanStackNavigator: FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="QRScan" component={QRScanScreen} />
  </Stack.Navigator>
);
