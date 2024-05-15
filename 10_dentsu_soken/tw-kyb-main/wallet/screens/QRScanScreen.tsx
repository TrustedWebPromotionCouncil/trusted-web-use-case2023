import React, { FC } from 'react';
import tw from 'tailwind-rn';

import { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { useOID4VCI } from '@/hooks/useOID4VCI';
import { LoadingScreen } from './LoadingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';

export type QRScanScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QRScan'>;
};

export const QRScanScreen: FC<QRScanScreenProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const { scanQr, err } = useOID4VCI();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async (data: BarCodeScannerResult) => {
    setLoading(() => true);
    await scanQr(data);
    setLoading(() => false);
    setScanned(() => true);
    err
      ? Alert.alert('Faild to Accept', err, [
          { onPress: onError, text: 'Tap to Try Again' },
        ])
      : Alert.alert('Accepted Credential Offer', '', [
          {
            onPress: onSuccess,
          },
        ]);
  };

  const onSuccess = () => {
    setScanned(() => false);
    navigation.navigate('CredentialOfferlList');
  };

  const onError = () => {
    setScanned(() => false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (loading) {
    return <LoadingScreen text="Issuing" />;
  }

  if (!scanned) {
    return (
      <View style={[tw(`flex-1 flex-col justify-center`)]}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={[tw('absolute inset-0')]}
        />
        <Text style={[tw('absolute text-white text-2xl pb-80 pl-16')]}>
          Scan QR code
        </Text>
        <View style={[tw('flex-1 flex-row justify-center items-center')]}>
          <View
            style={[tw('text-white border border-white border-4 h-64 w-64')]}
          ></View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[tw('flex-1 items-center'), { backgroundColor: '#008b8b' }]}
    ></SafeAreaView>
  );
};
