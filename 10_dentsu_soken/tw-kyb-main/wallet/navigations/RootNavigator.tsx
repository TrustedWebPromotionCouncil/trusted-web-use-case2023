import React, { FC } from 'react';
import tw from 'tailwind-rn';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStackNavigator } from './AuthStackNavigator';
import { DemoStackNavigator } from './DemoStackNavigator'
import { useAuthState } from '@/hooks/useAuthState';

export const RootNavigator: FC = () => {
  const { user, isLoading } = useAuthState();

  if (isLoading) {
    return (
      <SafeAreaView style={tw('flex-1 items-center justify-center')}>
        <ActivityIndicator size="large" color="gray" />
      </SafeAreaView>
    );
  }
  return (
    <NavigationContainer>
      {user?.uid ? <DemoStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};
