import { Button, Card, CardBody, VStack } from '@chakra-ui/react';
import { type V2_MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { $path } from 'remix-routes';
import DataItem from '~/components/DataItem';
import DataList from '~/components/Datalist';
import PageHeading from '~/components/PageHeading';
import { useUser } from '~/features/user/hooks';

export const meta: V2_MetaFunction = () => [{ title: 'Home' }];

const Home = () => {
  const user = useUser('business');

  return (
    <VStack>
      <PageHeading heading="Home" />
      <VStack>
        <Card maxW="xl" mt="68px">
          <CardBody>
            <DataList p="20px" rowGap="8px">
              <DataItem term="Business Unit Name" definition={user.business_name} />
              <DataItem term="Legal Entity Number" definition={user.legal_entity_number} />
              <DataItem term="Legal Entity Name" definition={user.legal_entity_name} />
              <DataItem term="Location" definition={user.legal_entity_location} />
            </DataList>
          </CardBody>
        </Card>
        <Button
          as={Link}
          to={$path('/business/vcrequest')}
          alignSelf="flex-end"
          mt={4}
          rounded="full"
        >
          Request Biz Unit Id
        </Button>
      </VStack>
    </VStack>
  );
};

export default Home;
