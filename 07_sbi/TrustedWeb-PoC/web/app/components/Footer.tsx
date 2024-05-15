import { Box, HStack, Text } from '@chakra-ui/react';
import { useRouteLoaderData } from '@remix-run/react';
import { FOOTER_HEIGHT } from './constants';

const Footer = () => {
  // useRouteLoaderDataには<typeof loader>的な型引数はない模様
  const { version } = useRouteLoaderData('root') as { version: string };

  return (
    <Box as="footer" bg="headerbg" pos="absolute" bottom={0} w="full" h={FOOTER_HEIGHT} p={2}>
      <HStack justify="center" align="center" pos="relative" h="full">
        <Text color="white">DeTC - Decentrailzed Trust Chain</Text>
        <Text color="white" pos="absolute" right={0}>release version: {version}</Text>
      </HStack>
    </Box>
  );
};

export default Footer;
