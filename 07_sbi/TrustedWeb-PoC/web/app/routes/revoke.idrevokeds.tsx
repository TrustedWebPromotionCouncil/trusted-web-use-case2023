import { Table, TableContainer, Tbody, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { USER_TABLE_HEAD_COLOR } from '~/components/colors';
import ErrorToaster from '~/components/ErrorToaster';
import PageHeading from '~/components/PageHeading';
import UuidRow from '~/features/revoke/components/UuidRow';
import { idRevokeds } from '~/features/revoke/services.server';

export const meta: V2_MetaFunction = () => [{ title: 'Revoked Digital Certificates' }];
export const loader = ({ request }: LoaderArgs) => idRevokeds(request);

const VcRequests = () => {
  const { idRevokeds, idValids } = useLoaderData<typeof loader>();

  return (
    <VStack p={4}>
      <PageHeading heading={['Revoked Digital Certificates']} />
      <TableContainer>
        <Table variant="simple" mt="80px">
          <Thead>
            <Tr bg={USER_TABLE_HEAD_COLOR['revoke']}>
              <Th w="600px">UUID</Th>
              <Th w="188px">Status</Th>
            </Tr>
          </Thead>
          <Suspense fallback={<Tbody />}>
            <Await
              resolve={Promise.all([idRevokeds, idValids])}
              errorElement={<ErrorToaster message="unknown error." />}
            >
              {([revokedList, validList]) => (
                <Tbody>
                  {revokedList.map(({ uuid }) => <UuidRow key={uuid} uuid={uuid} status="Revoked" />)}
                  {validList.map(({ uuid }) => <UuidRow key={uuid} uuid={uuid} status="Valid" />)}
                </Tbody>
              )}
            </Await>
          </Suspense>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default VcRequests;
