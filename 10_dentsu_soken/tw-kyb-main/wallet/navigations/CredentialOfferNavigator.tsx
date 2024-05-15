import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { CredentialOfferScreen } from '@/screens/CredentialOfferScreen';
import { CredentialOfferDetailScreen } from '@/screens/CredentialOfferDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const CredentialOfferNavigator: FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="CredentialOfferlList"
      component={CredentialOfferScreen}
    />
    <Stack.Screen
      name="CredentialOfferDetail"
      component={CredentialOfferDetailScreen}
    />
  </Stack.Navigator>
);
