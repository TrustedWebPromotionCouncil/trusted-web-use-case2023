import { IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react';
import { type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import orderBy from 'lodash/orderBy';
import { Suspense, useState } from 'react';
import { USER_TABLE_HEAD_COLOR } from '~/components/colors';
import ErrorToaster from '~/components/ErrorToaster';
import DetailIcon from '~/components/icons/DetailIcon';
import JsonModal from '~/components/JsonModal';
import PageHeading from '~/components/PageHeading';
import Toaster from '~/components/Toaster';
import { formatDate } from '~/decorators';
import { vcReceivedsLoader } from '~/features/authority/service.server';

export const meta: V2_MetaFunction = () => [{ title: 'List of Received VCs' }];
export const loader = ({ request }: LoaderArgs) => vcReceivedsLoader(request);

const VCReceiveds = () => {
  const detailDisclosure = useDisclosure();
  const [index, setIndex] = useState<number>();
  const { vcReceiveds } = useLoaderData<typeof loader>();

  return (
    <VStack>
      <PageHeading
        heading={['Digital Certificate Management', 'Digital Certificates']}
      />
      <TableContainer ml="24px" mt="83px">
        <Table variant="simple">
          <Thead>
            <Tr bg={USER_TABLE_HEAD_COLOR['authority']}>
              <Th>Ref. No.</Th>
              <Th>UUID</Th>
              <Th>Status</Th>
              <Th>Expiry Date</Th>
              <Th>Details</Th>
            </Tr>
          </Thead>
          <Suspense fallback={<Tbody />}>
            <Await
              resolve={vcReceiveds}
              errorElement={<ErrorToaster message="unknown error." />}
            >
              {(vcs) => {
                const orderedVcs = orderBy(
                  vcs.filter((vc) => vc != null),
                  [(vc) => new Date(vc!.validUntil!)],
                  ['desc'],
                );

                return (
                  <>
                    <Tbody>
                      {orderedVcs.map((vc, i) => (
                        <Tr key={vc!.id}>
                          <Td>{vc!.id}</Td>
                          <Td>{vc!.credentialSubject!.uuid}</Td>
                          <Td>Approved</Td>
                          <Td>{formatDate(vc!.validUntil!)}</Td>
                          <Td>
                            <IconButton
                              aria-label="detail"
                              icon={<DetailIcon fontSize="38px" />}
                              variant="ghost"
                              onClick={() => {
                                setIndex(i);
                                detailDisclosure.onOpen();
                              }}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    {index != null && (
                      <JsonModal
                        jsonify={orderedVcs[index]!}
                        isOpen={detailDisclosure.isOpen}
                        onClose={detailDisclosure.onClose}
                      />
                    )}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </Table>
      </TableContainer>
      <Toaster />
    </VStack>
  );
};

export default VCReceiveds;
