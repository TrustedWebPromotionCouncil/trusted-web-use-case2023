import { Card, CardBody, VStack } from '@chakra-ui/react';
import { type V2_MetaFunction } from '@remix-run/node';
import DataItem from '~/components/DataItem';
import DataList from '~/components/Datalist';
import PageHeading from '~/components/PageHeading';
import { useUser } from '~/features/user/hooks';

export const meta: V2_MetaFunction = () => [{ title: 'Homepage' }];

const Home = () => {
  const { display_org_name } = useUser('authority');

  return (
    <VStack p={4}>
      <PageHeading heading="Home" />
      <VStack>
        <Card maxW="xl" mt="68px" pr="30px">
          <CardBody>
            <DataList p="20px" rowGap="8px">
              <DataItem term="Organization Name" definition={display_org_name} />
            </DataList>
          </CardBody>
        </Card>
      </VStack>
    </VStack>
  );
};

export default Home;
