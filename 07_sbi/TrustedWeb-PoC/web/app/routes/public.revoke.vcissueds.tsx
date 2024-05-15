import { IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import orderBy from 'lodash/orderBy';
import { Suspense } from 'react';
import { USER_TABLE_HEAD_COLOR } from '~/components/colors';
import ErrorToaster from '~/components/ErrorToaster';
import DetailIcon from '~/components/icons/DetailIcon';
import JsonModal from '~/components/JsonModal';
import PageHeading from '~/components/PageHeading';
import { formatDate } from '~/decorators';
import { cordaErrorMessage } from '~/features/corda/decorators';
import { vcIssuedsForAuthConsortiumLoader } from '~/features/public/services.server';
import { useIndexdDisclosure } from '~/hooks';

export const meta: V2_MetaFunction = () => [{ title: 'List of Issued VCs' }];
export const loader = ({ request }: LoaderArgs) => vcIssuedsForAuthConsortiumLoader(request);

const VcIssueds = () => {
  const { index, isOpen, onOpen, onClose } = useIndexdDisclosure();
  const { vcIssueds } = useLoaderData<typeof loader>();

  return (
    <VStack>
      <PageHeading heading="RCO Digital Certificates" />
      <TableContainer>
        <Table variant="simple" mt="80px">
          <Thead>
            <Tr bg={USER_TABLE_HEAD_COLOR['public']}>
              <Th>DIDName</Th>
              <Th>UUID</Th>
              <Th>Status</Th>
              <Th>Expiry Date</Th>
              <Th>Details</Th>
            </Tr>
          </Thead>
          <Suspense fallback={<Tbody />}>
            <Await
              resolve={vcIssueds}
              errorElement={<ErrorToaster message={cordaErrorMessage} />}
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
                        // TODO.nullが配列に入り得るか確認
                        <Tr key={vc?.id}>
                          <Td>{vc?.credentialSubject?.didDocument?.id?.split(':')?.[2]}</Td>
                          <Td>{vc?.credentialSubject?.uuid}</Td>
                          <Td>Approved</Td>
                          <Td>{formatDate(vc?.validUntil)}</Td>
                          <Td>
                            {vc && (
                              <IconButton
                                aria-label="detail"
                                variant="ghost"
                                icon={<DetailIcon fontSize="38px" />}
                                onClick={() => onOpen(i)}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    {index != null && (
                      <JsonModal
                        jsonify={orderedVcs[index]!}
                        isOpen={isOpen}
                        onClose={onClose}
                      />
                    )}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default VcIssueds;
