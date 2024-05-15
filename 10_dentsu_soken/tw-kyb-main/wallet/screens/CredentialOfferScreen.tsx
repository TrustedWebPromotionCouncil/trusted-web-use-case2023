import React, { FC } from 'react';
import tw from 'tailwind-rn';
import { FlatList, SafeAreaView, View, Text, Pressable } from 'react-native';
import { Title } from '../components/Title';
import { useOID4VCI } from '@/hooks/useOID4VCI';
import { CredentialOfferListItem } from '@/types/oid4vci';
import { EvilIcons } from '@expo/vector-icons';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { toLocaleString } from '@/utils/dateUtils';

type ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CredentialOfferlList'
>;

type ItemProps = CredentialOfferListItem & {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'CredentialOfferlList'
  >;
};

const unissuedColor = '#5f9ea0';

const Item = ({
  id,
  credentialOffer,
  acceptDate,
  issueState,
  navigation,
}: ItemProps) => {
  const onPress = () => {
    navigation.navigate('CredentialOfferDetail', { id });
  };
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          tw(`my-2 rounded-lg w-96 ${issueState ? 'opacity-60' : ''}`),
          { backgroundColor: unissuedColor },
        ]}
      >
        <View style={[tw('p-1 text-lg rounded-t bg-gray-700')]}>
          <Text style={[tw('text-lg text-white font-bold')]}>
            Credential Offer
          </Text>
        </View>
        <View style={[tw('flex flex-col justify-between px-1 py-2')]}>
          <View style={[tw('flex flex-row items-center px-1 py-2')]}>
            <Text style={[tw('text-xl text-white')]}>Tap to detail</Text>
            <EvilIcons name="arrow-right" size={24} color="white" />
          </View>
          <View style={[tw('flex flex-row items-center justify-between px-1')]}>
            <Text style={[tw(`${issueState ? 'text-white' : 'text-red-500'}`)]}>
              {issueState ? 'issued' : 'not issued'}
            </Text>
            <View style={[tw('flex flex-col justify-between p-1 pt-2')]}>
              <Text style={[tw('text-xs text-white')]}>
                Issuer:{credentialOffer.credential_issuer.split('://')[1]}
              </Text>
              <Text style={[tw('text-xs text-white')]}>
                Accepted at:
                {toLocaleString(acceptDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const CredentialOfferScreen: FC<ScreenProps> = ({ navigation }) => {
  const { credentialOfferList } = useOID4VCI();
  return (
    <SafeAreaView style={[tw('flex-1 pt-4 items-center bg-gray-100')]}>
      <Title first="Credential Offer" last="List" />
      <FlatList
        data={credentialOfferList}
        renderItem={({ item }) => <Item {...item} navigation={navigation} />}
      />
    </SafeAreaView>
  );
};
