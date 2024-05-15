import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { type ActionArgs, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import { Await, useActionData, useLoaderData } from '@remix-run/react';
import orderBy from 'lodash/orderBy';
import { Suspense, useEffect, useState } from 'react';
import { USER_TABLE_HEAD_COLOR } from '~/components/colors';
import ErrorToaster from '~/components/ErrorToaster';
import DetailIcon from '~/components/icons/DetailIcon';
import RenewalIcon from '~/components/icons/RenewalIcon';
import PageHeading from '~/components/PageHeading';
import { formatDate } from '~/decorators';
import VcDetailModal from '~/features/business/components/VcDetailModal';
import VcRequestModal from '~/features/business/components/VcRequestModal';
import { approvedBusinessVcRequestHistory, renewVc } from '~/features/business/services.server';
import { vcRenewResponseSchema } from '~/features/business/validators';
import { actionAuthGuard } from '~/requests.server';

export const meta: V2_MetaFunction = () => [{ title: 'List of VC Issuance Requests' }];
export const loader = (args: LoaderArgs) => approvedBusinessVcRequestHistory(args);
export const action = (args: ActionArgs) => actionAuthGuard(args, 'business', renewVc);

const VcRequests = () => {
  const detailDisclosure = useDisclosure();
  const renewDisclosure = useDisclosure();
  const toast = useToast();
  const [index, setIndex] = useState<number>();
  const { vcRequests } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  // useEffect警告抑止
  const { onClose: renewDisclosureOnClose } = renewDisclosure;

  useEffect(() => {
    if (actionData != null) {
      if (vcRenewResponseSchema.safeParse(actionData).success) {
        toast({ status: 'success', title: 'vc revoked.' });
      } else {
        toast({ status: 'error', title: 'corda error.' });
      }
      renewDisclosureOnClose();
    }
  }, [actionData, renewDisclosureOnClose, toast]);

  return (
    <VStack>
      <PageHeading heading={['Business Unit IDs Management', 'Business Unit IDs']} />
      <TableContainer ml="11px" mt="83px">
        <Table variant="simple">
          <Thead>
            <Tr bg={USER_TABLE_HEAD_COLOR['business']}>
              <Th>Ref.No.</Th>
              <Th>Status</Th>
              <Th>Auth Level</Th>
              <Th>Expiry Date</Th>
              <Th>Issuer</Th>
              <Th>Details-all</Th>
              <Th>Details-part</Th>
              <Th>Renewal Request</Th>
            </Tr>
          </Thead>
          <Suspense fallback={<Tbody />}>
            <Await resolve={vcRequests} errorElement={<ErrorToaster message="unknown error." />}>
              {(vcs) => {
                const orderedVcs = orderBy(vcs, [({ vc }) => new Date(vc.validUntil)], ['desc']);
                return (
                  <>
                    <Tbody>
                      {orderedVcs.map((
                        { vc, vc_id, address_included_in_vc, contact_info_included_in_vc },
                        i,
                      ) => (
                        <Tr key={vc_id}>
                          <Td>{vc_id}</Td>
                          <Td>Approved</Td>
                          <Td>{vc.credentialSubject.authenticationLevel}</Td>
                          <Td>{formatDate(vc.validUntil)}</Td>
                          <Td>{vc.issuer.name}</Td>
                          <Td>
                            {address_included_in_vc && contact_info_included_in_vc && (
                              <IconButton
                                aria-label="detail1"
                                icon={<DetailIcon fontSize="38px" />}
                                variant="ghost"
                                onClick={() => {
                                  setIndex(i);
                                  detailDisclosure.onOpen();
                                }}
                              />
                            )}
                          </Td>
                          <Td>
                            {!(address_included_in_vc && contact_info_included_in_vc) && (
                              <IconButton
                                aria-label="detail2"
                                icon={<DetailIcon fontSize="38px" />}
                                variant="ghost"
                                onClick={() => {
                                  setIndex(i);
                                  detailDisclosure.onOpen();
                                }}
                              />
                            )}
                          </Td>
                          <Td align="center">
                            <IconButton
                              aria-label="renewal"
                              icon={<RenewalIcon fontSize="38px" />}
                              variant="ghost"
                              onClick={() => {
                                setIndex(i);
                                renewDisclosure.onOpen();
                              }}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    {index != null && (
                      <>
                        <VcDetailModal
                          signedVc={orderedVcs[index]!.vc}
                          isOpen={detailDisclosure.isOpen}
                          onClose={() => {
                            setIndex(undefined);
                            detailDisclosure.onClose();
                          }}
                        />
                        <VcRequestModal
                          level={orderedVcs[index]!.vc.credentialSubject.authenticationLevel}
                          isOpen={renewDisclosure.isOpen}
                          onClose={renewDisclosure.onClose}
                          vc={orderedVcs[index]}
                        />
                      </>
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

export default VcRequests;
