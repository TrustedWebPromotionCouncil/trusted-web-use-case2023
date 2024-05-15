import React, { FC, useEffect, useState } from 'react';
import tw from 'tailwind-rn';
import { Text, SafeAreaView, View } from 'react-native';

export type Props = {
  text: string;
};

export const LoadingScreen: FC<Props> = ({ text }) => {
  const [emphasis, setEmphasis] = useState(0);
  const [id, setId] = useState<NodeJS.Timeout | undefined>();

  useEffect(() => {
    setId(
      setInterval(() => {
        setEmphasis((prev) => (prev === 2 ? 0 : prev + 1));
      }, 800),
    );
    return () => {
      id && clearInterval(id);
    };
  }, []);

  return (
    <SafeAreaView
      style={[tw('flex-1 pt-16 items-center'), { backgroundColor: '#008b8b' }]}
    >
      <View style={[tw('flex-1 flex-col items-center justify-center')]}>
        <Text style={[tw('text-3xl')]}>
          {text}
          <Text style={emphasis === 0 && { fontSize: 50 }}>.</Text>
          <Text style={emphasis === 1 && { fontSize: 50 }}>.</Text>
          <Text style={emphasis === 2 && { fontSize: 50 }}>.</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};
