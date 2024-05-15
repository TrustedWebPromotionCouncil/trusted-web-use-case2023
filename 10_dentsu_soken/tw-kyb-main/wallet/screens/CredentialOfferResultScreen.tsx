import React, { FC, useState } from 'react';
import tw from 'tailwind-rn';
import { Text, SafeAreaView, View, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { Title } from '@/components/Title';
import { InputField } from '@/components/InputField';
import { AuthTokenResponse } from '@/auth-session/tokenRequest';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DemoMenu'>;
};
export const CredentialOfferResultScreen: FC<Props> = ({ navigation }) => {
  const [error, setError] = useState('');
  const [userPinReq, setUserPinReq] = useState(false);
  const [token, setToken] = useState<AuthTokenResponse | undefined>();
  const [userPin, setUserPin] = useState('');

  const onPress = async () => {};

  const onPressPin = async () => {};

  const reset = () => {
    setToken(undefined);
  };

  if (token) {
    return (
      <SafeAreaView style={tw('flex-1 bg-gray-100 items-center')}>
        <Title first="Token" last="Result" />
        <View style={[tw('flex flex-col justify-center items-center')]}>
          <Text style={[tw('bg-white mx-2 py-4')]}>
            {JSON.stringify(token, null, 2)}
          </Text>
          <Button title={'Tap to Reset'} onPress={reset} />
        </View>
      </SafeAreaView>
    );
  }

  if (userPinReq) {
    return (
      <SafeAreaView style={tw('flex-1 bg-gray-100 items-center')}>
        <Title first="Input" last="Pin" />
        <View style={[tw('flex flex-col justify-center items-center')]}>
          <InputField
            leftIcon="keyboard"
            placeholder="User Pin"
            autoFocus
            value={userPin}
            onChangeText={(text: string) => setUserPin(text)}
          />
          <Button title={'Submit'} onPress={onPressPin} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={tw('flex-1 bg-gray-100 items-center')}>
        <Title first="Offer" last="Result" />
        <View style={[tw('flex flex-col justify-center items-center')]}>
          <Text style={[tw('text-2xl')]}>{error}</Text>
          <Button
            title={'Tap to Return'}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw('flex-1 bg-gray-100 items-center')}>
      <Title first="Offer" last="Result" />
      <View style={[tw('flex flex-col justify-center items-center')]}>
        <Button title={'get Access Token'} onPress={onPress} />
        <Button
          title={'Tap to Return'}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
};
