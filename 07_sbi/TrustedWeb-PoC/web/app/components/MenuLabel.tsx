import { Box, Heading } from '@chakra-ui/react';
import { type UserType } from '~/features/user/types';
import { USER_BORDER_COLOER } from './colors';

type MenuLabelProps = {
  text: string;
  userType: UserType;
};

const MenuLabel = ({ text, userType }: MenuLabelProps) => (
  <Box py="16px">
    <Heading
      as="h2"
      color="white"
      fontWeight="bold"
      fontSize="20px"
      borderLeft="solid"
      borderLeftWidth="4px"
      pl="16px"
      pr={0}
      borderLeftColor={USER_BORDER_COLOER[userType]}
    >
      {text}
    </Heading>
  </Box>
);

export default MenuLabel;
