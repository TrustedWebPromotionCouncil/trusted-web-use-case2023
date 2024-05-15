import {
  // Icon,
  // IconButton,
  Table,
  TableContainer,
  Tbody,
  // Td,
  Th,
  Thead,
  Tr,
  // useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { json, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense /*, useState*/ } from 'react';
import { USER_TABLE_HEAD_COLOR } from '~/components/colors';
import ErrorToaster from '~/components/ErrorToaster';
import PageHeading from '~/components/PageHeading';
import Toaster from '~/components/Toaster';
import { cordaErrorMessage } from '~/features/corda/decorators';

export const meta: V2_MetaFunction = () => [{ title: 'List of Received VCs' }];
export const loader = ({ request }: LoaderArgs) => json({ vcReceiveds: [] });

const VCReceiveds = () => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [index, setIndex] = useState<number>();
  const { vcReceiveds } = useLoaderData<typeof loader>();

  return (
    <VStack p={4}>
      <PageHeading heading={['Business Units Management', 'Onboarding']} />
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr bg={USER_TABLE_HEAD_COLOR['authority']}>
              <Th>Biz Unit</Th>
              <Th>VCID</Th>
              <Th>Status</Th>
              <Th>Auth Level</Th>
              <Th>Details</Th>
            </Tr>
          </Thead>
          <Suspense fallback={<Tbody />}>
            <Await resolve={vcReceiveds} errorElement={<ErrorToaster message={cordaErrorMessage} />}>
              {(vcs) => <></>}
            </Await>
          </Suspense>
        </Table>
      </TableContainer>
      <Toaster />
    </VStack>
  );
};

export default VCReceiveds;
