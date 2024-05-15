import { Text } from '@chakra-ui/react';
import { NavLink } from '@remix-run/react';
import { type UserType } from '~/features/user/types';
import { menuBg, menuColor } from './colors';

type MenuLinkProps = {
  text: string;
  to: string;
  userType: UserType;
};

const MenuLink = ({ text, to, userType }: MenuLinkProps) => (
  <NavLink to={to}>
    {({ isActive }) => (
      <Text
        p="16px"
        mr="16px"
        rounded="md"
        bg={menuBg(userType, isActive)}
        color={menuColor(isActive)}
        fontWeight={isActive ? 'bold' : 'normal'}
        fontSize="20px"
      >
        {text}
      </Text>
    )}
  </NavLink>
);

export default MenuLink;
