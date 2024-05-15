import { Flex, Spacer, Text } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import { type UserType } from '~/features/user/types';
import { HEADER_HEIGHT } from './constants';

type HeaderProps = {
  userType: UserType;
  orgName: string;
  userName: string;
};

const Header = ({ userType, orgName, userName }: HeaderProps) => (
  <Flex
    as="header"
    zIndex={3}
    h={HEADER_HEIGHT}
    bg="headerbg"
    px={12}
    pos="fixed"
    w="full"
    top={0}
    left={0}
    alignItems="center"
    shadow="md"
    overflow="hidden"
  >
    <Text as={Link} to={`/${userType}/home`} fontSize="24px" fontWeight={400} color="white">
      {orgName}
    </Text>
    <Spacer />
    <Text mr={4} color="white">{userName}</Text>
  </Flex>
);

export default Header;
