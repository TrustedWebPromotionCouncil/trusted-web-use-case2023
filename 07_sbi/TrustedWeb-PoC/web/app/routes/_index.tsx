import { Link, ListItem, UnorderedList, VStack } from '@chakra-ui/react';
import { type V2_MetaFunction } from '@remix-run/node';
import { Link as RemixLink } from '@remix-run/react';
import { $path } from 'remix-routes';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Trusted Web Demo' }];
};

const Index = () => (
  <VStack p={4} align="start">
    <UnorderedList>
      <ListItem>
        <Link as={RemixLink} to={$path('/public/login')}>
          Public Institutions
        </Link>
      </ListItem>
      <ListItem>
        <Link as={RemixLink} to={$path('/authority/login')}>
          Digital Certification Organizations
        </Link>
      </ListItem>
      <ListItem>
        <Link as={RemixLink} to={$path('/revoke/login')}>
          Revocation Control Organizations
        </Link>
      </ListItem>
      <ListItem>
        <Link as={RemixLink} to={$path('/business/login')}>
          Businesses
        </Link>
      </ListItem>
    </UnorderedList>
  </VStack>
);

export default Index;
