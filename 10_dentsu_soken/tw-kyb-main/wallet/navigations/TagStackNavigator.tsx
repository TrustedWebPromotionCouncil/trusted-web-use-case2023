import React, { FC } from 'react';
import { useRecoilState } from 'recoil';
import tw from 'tailwind-rn';
import { View, Alert } from 'react-native';
import { auth } from '@/firebaseConfig';
import { userState } from '@/states';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { TagListScreen } from '@/screens/TagListScreen';
import { CreateTagScreen } from '@/screens/CreateTagScreen';
import { IconButton } from '@/components/IconButton';
import { TaskStackNavigator } from './TaskStackNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const TagStackNavigator: FC = () => {
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
    <Stack.Navigator
    // screenOptions={{
    //   headerShown: false,
    // }}
    >
      <Stack.Group
        screenOptions={{
          headerStyle: {
            backgroundColor: '#008b8b',
          },
          headerTitle: user.email,
          headerTintColor: 'white',
          headerBackTitle: 'Back',
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
        <Stack.Screen name="TagList" component={TagListScreen} />
        <Stack.Screen name="TaskStack" component={TaskStackNavigator} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
        }}
      >
        <Stack.Screen name="CreateTag" component={CreateTagScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
