import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Highlight,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { type ActionArgs, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import range from 'lodash/range';
import { useState } from 'react';
import PageHeading from '~/components/PageHeading';
import VcRequestModal from '~/features/business/components/VcRequestModal';
import { createVc, rejectedBusinessVcRequestHistory } from '~/features/business/services.server';
import { actionAuthGuard } from '~/requests.server';

export const meta: V2_MetaFunction = () => [{ title: 'Business Unit ID Requests' }];
export const loader = (args: LoaderArgs) => rejectedBusinessVcRequestHistory(args);
export const action = (args: ActionArgs) => actionAuthGuard(args, 'business', createVc);

const VcRequest = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [level, setLevel] = useState<number>(1);
  const toast = useToast();
  const levelSelect = (selectedLevel: number) => {
    if (selectedLevel === 1) {
      onOpen();
    } else {
      toast({ title: `Unimplemented Authentication Level${selectedLevel}.`, status: 'error' });
    }
    setLevel(selectedLevel);
  };

  return (
    <VStack>
      <PageHeading heading={['Business Unit IDs Management', 'Business Unit ID Requests']} />
      <Card mt="84px">
        <CardHeader>
          <Heading fontSize="18px" textAlign="center" px="116px" pt="54px" fontWeight="normal" whiteSpace="pre">
            <Highlight query="Authentication Level" styles={{ fontWeight: 'bold' }}>
              {'Please choose the Authentication Level\nyou want to request.'}
            </Highlight>
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack px={12} pb={8} gap={4}>
            {range(1, 4).map((l) => <Button key={l} variant="ghost" onClick={() => levelSelect(l)}>Level{l}</Button>)}
          </VStack>
        </CardBody>
      </Card>
      <VcRequestModal level={level} isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
};

export default VcRequest;
