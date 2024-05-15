import React, { FC } from 'react';
import tw from 'tailwind-rn';
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';

type Props = {
  title: string;
  bgColor?: string;
  titleColor?: string;
  disabled?: boolean;
  onPress: (e: GestureResponderEvent) => void;
};

export const Button: FC<Props> = ({
  title,
  bgColor = 'bg-gray-500',
  titleColor = 'text-white',
  disabled = false,
  onPress,
}) => (
  <TouchableOpacity
    style={tw(`mb-4 mx-3 rounded-3xl w-11/12 ${bgColor}`)}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={tw(`text-center text-lg font-semibold p-2 ${titleColor}`)}>
      {title}
    </Text>
  </TouchableOpacity>
);
