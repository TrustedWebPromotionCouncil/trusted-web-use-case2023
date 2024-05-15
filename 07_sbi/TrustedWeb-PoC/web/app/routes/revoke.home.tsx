import { Button, Card, CardBody, VStack } from '@chakra-ui/react';
import { type V2_MetaFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { $path } from 'remix-routes';
import DataItem from '~/components/DataItem';
import DataList from '~/components/Datalist';
import PageHeading from '~/components/PageHeading';
import { useUser } from '~/features/user/hooks';

export const meta: V2_MetaFunction = () => [{ title: 'Homepage' }];

const Home = () => {
  const { display_org_name } = useUser('revoke');
  const fetcher = useFetcher();

  return (
    <VStack>
      <PageHeading heading="Home" />
      <fetcher.Form method="post" action={$path('/revoke/vcrequest')}>
        <VStack>
          <Card mt="68px">
            <CardBody w="560px">
              <DataList p="20px" rowGap="8px">
                <DataItem term="Organization Name" definition={display_org_name} />
              </DataList>
            </CardBody>
          </Card>
          <Button
            colorScheme="blue"
            type="submit"
            rounded="full"
            alignSelf="flex-end"
            mt={4}
            isDisabled={fetcher.state !== 'idle'}
          >
            Request Certificate
          </Button>
        </VStack>
      </fetcher.Form>
    </VStack>
  );
};

export default Home;
