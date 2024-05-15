import { Box, Button, Flex } from '@chakra-ui/react';
import { Form } from '@remix-run/react';
import { Fragment } from 'react';
import { $path } from 'remix-routes';
import { type ReadonlyDeep } from 'type-fest';
import { type UserType } from '~/features/user/types';
import { FOOTER_HEIGHT, HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants';
import Footer from './Footer';
import Header from './Header';
import LogoutIcon from './icons/LogoutIcon';
import MenuLabel from './MenuLabel';
import MenuLink from './MenuLink';

type LayoutProps = React.PropsWithChildren<{
  userType: UserType;
  orgName: string;
  userName: string;
  menu: ReadonlyDeep<{ heading?: string; links: { text: string; to: string }[] }[]>;
}>;

const Layout = ({ userType, orgName, userName, menu, children }: LayoutProps) => (
  <Box>
    <Box h={HEADER_HEIGHT} />
    <Header userType={userType} orgName={orgName} userName={userName} />
    <Box minH={`calc(100VH - ${HEADER_HEIGHT})`}>
      <Box
        as="nav"
        w={SIDEBAR_WIDTH}
        pos="fixed"
        h="full"
        bg="headerbg"
        alignItems="start"
        overflowY="auto"
        pl="10px"
        pt="108px"
      >
        <Box h={`calc(100% - ${FOOTER_HEIGHT} - 20px)`} position="relative">
          <Flex direction="column">
            <MenuLink text="Home" to={$path(`/${userType}/home`)} userType={userType} />
            {menu.map(({ heading, links }) => (
              <Fragment key={heading}>
                {heading && <MenuLabel text={heading} userType={userType} />}
                {links.map(({ text, to }, i) => <MenuLink key={text} text={text} to={to} userType={userType} />)}
              </Fragment>
            ))}
          </Flex>
          <Form action="/logout" method="post">
            <Button
              leftIcon={<LogoutIcon fontSize="38px" />}
              type="submit"
              w="260px"
              position="absolute"
              bottom={12}
              justifyContent={'start'}
              bg="#667A8A"
              color="white"
              _hover={{ background: '#667A8A', color: 'white' }}
              rounded="md"
            >
              logout
            </Button>
          </Form>
        </Box>
      </Box>
      <Box ml={SIDEBAR_WIDTH}>
        {children}
      </Box>
      <Box h={FOOTER_HEIGHT} />
      <Footer />
    </Box>
  </Box>
);

export default Layout;
