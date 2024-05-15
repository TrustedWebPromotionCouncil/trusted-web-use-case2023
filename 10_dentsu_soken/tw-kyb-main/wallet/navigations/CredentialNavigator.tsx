import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { CredentialScreen } from '@/screens/CredentialScreen';
import { CredentialDetailScreen } from '@/screens/CredentialDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const CredentialNavigator: FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="CredentialList" component={CredentialScreen} />
    <Stack.Screen name="CredentialDetail" component={CredentialDetailScreen} />
  </Stack.Navigator>
);
