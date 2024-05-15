import React, { FC } from 'react';
import { useRecoilState } from 'recoil';
import tw from 'tailwind-rn';
import { View, Alert } from 'react-native';
import { auth } from '@/firebaseConfig';
import { userState } from '@/states';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '@/types';
import { IconButton } from '@/components/IconButton';
import { MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';
import { QRScanScreen } from '@/screens/QRScanScreen';
// import { CredentialListScreen } from '@/screens/CredentialListScreen';
import { CredentialOfferNavigator } from './CredentialOfferNavigator';
import { CredentialNavigator } from './CredentialNavigator';

const Tab = createBottomTabNavigator<RootStackParamList>();

const defaultColor = '#BFCDDB';
const selectedColor = '#5f9ea0';

export const DemoStackNavigator: FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const signOut = async () => {
    try {
      await auth.signOut();
      setUser({ uid: '', email: '' });
    } catch {
      Alert.alert('Logout error');
    }
  };
  return (
    <Tab.Navigator
      initialRouteName="CredentialOfferNavigator"
      screenOptions={{
        tabBarActiveTintColor: selectedColor,
        tabBarInactiveTintColor: defaultColor,
        headerStyle: {
          backgroundColor: '#008b8b',
        },
        headerTitle: user.email,
        headerTintColor: 'white',
        // headerBackTitle: 'Back',
        headerRight: () => (
          <View style={tw('mr-3')}>
            <IconButton
              name="logout"
              size={20}
              color="white"
              onPress={signOut}
            />
          </View>
        ),
      }}
    >
      <Tab.Group>
        <Tab.Screen
          name="QRScan"
          component={QRScanScreen}
          options={{
            tabBarLabel: 'QR Code',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="qrcode" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="CredentialOfferNavigator"
          component={CredentialOfferNavigator}
          options={{
            tabBarLabel: 'Credential Offer',
            tabBarIcon: ({ color, size }) => (
              <Feather name="list" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="CredentialNavigator"
          component={CredentialNavigator}
          options={{
            tabBarLabel: 'Credentials',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="idcard" size={size} color={color} />
            ),
          }}
        />
      </Tab.Group>
    </Tab.Navigator>
  );
};
