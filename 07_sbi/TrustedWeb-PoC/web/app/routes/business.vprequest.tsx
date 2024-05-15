import { Button, useDisclosure, VStack } from '@chakra-ui/react';
import { type ActionArgs, type V2_MetaFunction } from '@remix-run/node';
import PageHeading from '~/components/PageHeading';
import VpRequestModal from '~/features/business/components/VpRequestModal';
import { createVc } from '~/features/business/services.server';
import { actionAuthGuard } from '~/requests.server';

export const meta: V2_MetaFunction = () => [{ title: 'Generated VPs' }];

export const action = (args: ActionArgs) => actionAuthGuard(args, 'business', createVc);

const VcRequest = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <VStack p={4}>
      <PageHeading heading={['Verification', 'Generated VPs']} />
      <Button alignSelf="flex-end" mt={4} rounded="full" colorScheme="blue" onClick={onOpen}>Generate VP</Button>
      <VpRequestModal isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
};

export default VcRequest;
