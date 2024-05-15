'use client';

import tw from 'tailwind-rn';
import { Text, SafeAreaView, TextInput } from 'react-native';
import { useSignature } from '@/hooks/useSignature';
import { uint8ArrayToHex } from '@/utils/hexUtils';
import { Button } from '@/components/Button';
import { Title } from '@/components/Title';

export const SignatureScreen = () => {
  const {
    publicKey,
    publicKeyQuering,
    hash,
    signature,
    signing,
    verifyMessage,
    onMessageChange,
    onSignClick,
    onVerifyClick,
    error,
  } = useSignature();
  return (
    <SafeAreaView>
      <Title first="tECDSA" last="Demo" />
      <Text style={tw('ml-3')}>Message:</Text>

      <TextInput
        style={tw('mx-3 py-2 border rounded-lg')}
        multiline={true}
        id="message"
        // className={textareaStyles}
        onChangeText={onMessageChange}
      />
      <Text style={tw('ml-3 mt-4')}>SHA256:</Text>
      <TextInput
        style={tw('mx-3 mb-4 py-4 border rounded-lg')}
        multiline={true}
        numberOfLines={2}
        editable={false}
        value={hash ? uint8ArrayToHex(hash) : ''}
      />
      <Button onPress={onSignClick} title="Sign" />

      <Text style={tw('ml-3 mt-4')}>Public Key:</Text>
      <Text style={tw('ml-3')}>{publicKeyQuering && 'Quering...'}</Text>
      <TextInput
        style={tw('mx-3 mb-4 py-4 border rounded-lg')}
        multiline={true}
        numberOfLines={2}
        editable={false}
        value={publicKey ? uint8ArrayToHex(publicKey) : ''}
      />

      <Text style={tw('ml-3 mt-4')}>Signature:</Text>
      <Text style={tw('ml-3')}>{publicKeyQuering && 'Quering...'}</Text>
      <TextInput
        style={tw('mx-3 mb-4 py-4 border rounded-lg')}
        multiline={true}
        numberOfLines={4}
        editable={false}
        value={signature ? uint8ArrayToHex(signature) : ''}
      />
      <Button onPress={onVerifyClick} title="Verify" />
      <Text>{verifyMessage}</Text>
      <Text>{error}</Text>
    </SafeAreaView>
  );
};
