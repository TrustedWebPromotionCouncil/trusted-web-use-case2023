import React, { FC, useState } from 'react';
import tw from 'tailwind-rn';
import { Text, SafeAreaView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useOID4VCI } from '@/hooks/useOID4VCI';
import { Title } from '@/components/Title';
import { toLocaleString } from '@/utils/dateUtils';
import { Button } from '@/components/Button';
import { LoadingScreen } from './LoadingScreen';
import RNPickerSelect, { Item } from 'react-native-picker-select';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CredentialOfferDetail'
>;

export const CredentialOfferDetailScreen: FC<Props> = ({
  navigation,
  route,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const { findCredentialOffer, fetchVC } = useOID4VCI();
  const [loading, setLoading] = useState(false);
  const item = findCredentialOffer(route.params.id);
  const selectItem: Item[] = item
    ? item.credentialOffer.credential_configuration_ids.map((v) => {
        return { label: v, value: v };
      })
    : [];

  const onPress = async () => {
    setLoading(() => true);
    await fetchVC(route.params.id);
    setLoading(() => false);
    // navigation.navigate('CredentialList');
  };
  const onBack = () => {
    navigation.navigate('CredentialOfferlList');
  };

  if (loading) {
    return <LoadingScreen text="Issuing" />;
  }

  return (
    <SafeAreaView style={tw('flex-1 bg-gray-100 items-center')}>
      <Title first="Offer" last="Detail" />
      <View style={tw('w-72 flex flex-row bg-gray-100 justify-start pt-8')}>
        <Text>Select Credential type:</Text>
      </View>
      <View style={[tw('border w-72 px-2 py-2 mt-1 rounded-lg')]}>
        <RNPickerSelect
          style={tw('w-full h-full')}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          items={selectItem}
        />
      </View>

      <View style={tw('flex-1 bg-gray-100 justify-start pt-8')}>
        <Text style={[tw('pb-4')]}>
          Issuer: {item?.credentialOffer.credential_issuer.split('://')[1]}
        </Text>
        <Text style={[tw('pb-4')]}>
          Accepted at: {item && toLocaleString(item.acceptDate)}
        </Text>
      </View>
      <Button
        title="Issue"
        onPress={onPress}
        bgColor={item?.issueState ? 'bg-gray-300' : 'bg-red-500'}
        disabled={item?.issueState}
      />
      <Button title="Back" onPress={onBack} bgColor="bg-gray-500" />
    </SafeAreaView>
  );
};
