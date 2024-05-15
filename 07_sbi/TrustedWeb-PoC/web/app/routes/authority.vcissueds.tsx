import { IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react';
import { type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import capitalize from 'lodash/capitalize';
import orderBy from 'lodash/orderBy';
import { Suspense, useState } from 'react';
import { USER_TABLE_HEAD_COLOR } from '~/components/colors';
import ErrorToaster from '~/components/ErrorToaster';
import DetailIcon from '~/components/icons/DetailIcon';
import RevokeIcon from '~/components/icons/RevokeIcon';
import PageHeading from '~/components/PageHeading';
import Toaster from '~/components/Toaster';
import { formatDate } from '~/decorators';
import RevokeModal from '~/features/authority/components/RevokeModal';
import { vcIssuedsLoader } from '~/features/authority/service.server';
import VcDetailModal from '~/features/business/components/VcDetailModal';
import { STATUS } from '~/features/vcRequest/constants';

export const meta: V2_MetaFunction = () => [{ title: 'List of Received VCs' }];
export const loader = ({ request }: LoaderArgs) => vcIssuedsLoader(request);

const VCIssueds = () => {
  const detailDisclosure = useDisclosure();
  const revokeDisclosure = useDisclosure();
  const [index, setIndex] = useState<number>();
  const { vcIssueds } = useLoaderData<typeof loader>();

  return (
    <VStack>
      <PageHeading heading={['Business Units Management', 'Ongoing']} />
      <TableContainer ml="24px" mt="83px">
        <Table variant="simple">
          <Thead>
            <Tr bg={USER_TABLE_HEAD_COLOR['authority']}>
              <Th>Biz Unit</Th>
              <Th>Ref. No.</Th>
              <Th>Status</Th>
              <Th>Auth Level</Th>
              <Th>Expiry Date</Th>
              <Th>Details</Th>
              <Th>Renew</Th>
              <Th>Revoke</Th>
            </Tr>
          </Thead>
          <Suspense fallback={<Tbody />}>
            <Await
              resolve={vcIssueds}
              errorElement={<ErrorToaster message="unknown error." />}
            >
              {(vcs) => {
                const orderedVcs = orderBy(vcs, [({ signed_vc }) => new Date(signed_vc.validUntil)], ['desc']);

                return (
                  <>
                    <Tbody>
                      {orderedVcs.map(({ signed_vc, status }, i) => (
                        <Tr key={signed_vc.id}>
                          <Td>
                            {signed_vc.credentialSubject.businessUnitInfo
                              .businessUnitName}
                          </Td>
                          <Td>{signed_vc.id}</Td>
                          <Td>{capitalize(status)}</Td>
                          <Td>
                            {signed_vc.credentialSubject.authenticationLevel}
                          </Td>
                          <Td>{formatDate(signed_vc.validUntil)}</Td>
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
                          <Td />
                          <Td>
                            {status === STATUS.APPROVED && (
                              <IconButton
                                aria-label="revoke"
                                icon={<RevokeIcon fontSize="38px" />}
                                variant="ghost"
                                onClick={() => {
                                  setIndex(i);
                                  revokeDisclosure.onOpen();
                                }}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    {index != null && (
                      <>
                        <VcDetailModal
                          signedVc={orderedVcs[index]!.signed_vc}
                          isOpen={detailDisclosure.isOpen}
                          onClose={() => {
                            setIndex(undefined);
                            detailDisclosure.onClose();
                          }}
                        />
                        {orderedVcs[index]!.status === STATUS.APPROVED && (
                          <RevokeModal
                            requestId={orderedVcs[index]!.request_id}
                            uuid={orderedVcs[index]!.signed_vc.credentialSubject
                              .uuid}
                            isOpen={revokeDisclosure.isOpen}
                            onClose={() => {
                              setIndex(undefined);
                              revokeDisclosure.onClose();
                            }}
                          />
                        )}
                      </>
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

export default VCIssueds;
