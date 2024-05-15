import React, { FC } from 'react';
import tw from 'tailwind-rn';
import { FlatList, SafeAreaView, View, Text, Pressable } from 'react-native';
import { Title } from '../components/Title';
import { useOID4VCI } from '@/hooks/useOID4VCI';
import { CredentialListItem } from '@/types/oid4vci';
import { EvilIcons } from '@expo/vector-icons';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { decodeSdJwt } from '@/oid4vci/sdJwt';
import { toLocaleString } from '@/utils/dateUtils';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'CredentialList'>;

type ItemProps = CredentialListItem & {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CredentialList'>;
};

const unissuedColor = '#5f9ea0';

const Item = ({ id, credentialResponse, navigation }: ItemProps) => {
  const decoded = decodeSdJwt(credentialResponse.credential);

  const onPress = () => {
    navigation.navigate('CredentialDetail', { id });
  };
  return (
    <Pressable onPress={onPress}>
      <View
        style={[tw(`my-2 rounded-lg w-96`), { backgroundColor: unissuedColor }]}
      >
        <View style={[tw('p-1 text-lg rounded-t bg-gray-700')]}>
          <Text style={[tw('text-lg text-white font-bold')]}>Credential</Text>
        </View>
        <View style={[tw('flex flex-col justify-between px-1 py-2')]}>
          <View style={[tw('flex flex-row items-center px-1 py-2')]}>
            <Text style={[tw('text-xl text-white')]}>Tap to detail</Text>
            <EvilIcons name="arrow-right" size={24} color="white" />
          </View>
          <View style={[tw('flex flex-row items-center justify-end px-1')]}>
            <View style={[tw('flex flex-col justify-between p-1 pt-2')]}>
              <Text style={[tw('text-xs text-white')]}>
                Issuer:{decoded.decodedJwt.parsedPayload.iss.split('://')[1]}
              </Text>
              <Text style={[tw('text-xs text-white')]}>
                Issued at:
                {toLocaleString(decoded.decodedJwt.parsedPayload.iat * 1000)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const CredentialScreen: FC<ScreenProps> = ({ navigation }) => {
  const { credentialList } = useOID4VCI();
  return (
    <SafeAreaView style={[tw('flex-1 pt-4 items-center bg-gray-100')]}>
      <Title first="Credential" last="List" />
      <FlatList
        data={credentialList}
        renderItem={({ item }) => <Item {...item} navigation={navigation} />}
      />
    </SafeAreaView>
  );
};
