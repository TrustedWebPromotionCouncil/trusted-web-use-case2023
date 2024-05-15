import { Card, CardBody, VStack } from '@chakra-ui/react';
import { type V2_MetaFunction } from '@remix-run/node';
import DataItem from '~/components/DataItem';
import DataList from '~/components/Datalist';
import PageHeading from '~/components/PageHeading';
import { useUser } from '~/features/user/hooks';

export const meta: V2_MetaFunction = () => [{ title: 'Homepage' }];

const Home = () => {
  const { display_org_name } = useUser('public');

  return (
    <VStack>
      <PageHeading heading="Home" />
      <Card mt="68px">
        <CardBody w="560px">
          <DataList p="20px" rowGap="8px">
            <DataItem term="Org Name" definition={display_org_name} />
          </DataList>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Home;
