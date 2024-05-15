import React, { FC, useState } from 'react';
import tw from 'tailwind-rn';
import { Text, SafeAreaView, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useOID4VCI } from '@/hooks/useOID4VCI';
import { Title } from '@/components/Title';
import { Button } from '@/components/Button';
import { decodeSdJwt } from '@/oid4vci/sdJwt';
import { ParsedPayload } from '@/oid4vci/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CredentialDetail'>;

export const CredentialDetailScreen: FC<Props> = ({ navigation, route }) => {
  const [isDecoded, setIsDecoded] = useState(false);
  const { findCredential } = useOID4VCI();
  const raw = findCredential(route.params.id)?.credentialResponse.credential;
  const decoded = raw ? decodeSdJwt(raw) : '';
  const onBack = () => {
    navigation.navigate('CredentialList');
  };

  const maskSD = (payload: Partial<ParsedPayload>) => {
    delete payload._sd;
    delete payload._sd_alg;
    return payload;
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-gray-100 items-center')}>
      <Title first="Credential" last="Detail" />
      {/* <Text>{route.params.id}</Text> */}
      <ScrollView style={[tw('w-96 p-2')]}>
        {isDecoded ? (
          <>
            <Text>Header:</Text>
            <View style={[tw('border rounded-lg p-2 mb-2')]}>
              <Text>
                {JSON.stringify(
                  decoded && decoded.decodedJwt.parsedHeader,
                  null,
                  2,
                )}
              </Text>
            </View>
            <Text>Payload:</Text>
            <View style={[tw('border rounded-lg p-2 mb-2')]}>
              <Text>
                {JSON.stringify(
                  // decoded && decoded.decodedJwt.parsedPayload,
                  decoded && maskSD(decoded.decodedJwt.parsedPayload),
                  null,
                  2,
                )}
              </Text>
            </View>
            <Text>Disclosures:</Text>
            <View style={[tw('border rounded-lg p-2 mb-2')]}>
              <Text>
                {JSON.stringify(decoded && decoded.decodedDisclosures, null, 2)}
              </Text>
            </View>
            <Text>Signature:</Text>
            <View style={[tw('border rounded-lg p-2')]}>
              <Text>
                {JSON.stringify(
                  decoded && decoded.decodedJwt.signature,
                  null,
                  2,
                )}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text>Raw Data:</Text>
            <View style={[tw('border rounded-lg p-2')]}>
              <Text>{raw}</Text>
            </View>
          </>
        )}
      </ScrollView>
      {isDecoded ? (
        <Button
          title="Raw"
          onPress={() => setIsDecoded(!isDecoded)}
          bgColor="bg-blue-500"
        />
      ) : (
        <Button
          title="Decode"
          onPress={() => setIsDecoded(!isDecoded)}
          bgColor="bg-blue-500"
        />
      )}
      <Button title="Back" onPress={onBack} bgColor="bg-gray-500" />
    </SafeAreaView>
  );
};
