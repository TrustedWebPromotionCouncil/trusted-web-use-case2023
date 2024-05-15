import { Button, Center, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react';
import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import { $path } from 'remix-routes';
import { type action } from '~/routes/authority.revoke.$uuid';
import { revokeVcResponseSchema } from '../validators';

type RevokeModalProps = {
  requestId: string;
  uuid: string;
  isOpen: boolean;
  onClose: () => void;
};

const RevokeModal = ({ requestId, uuid, isOpen, onClose }: RevokeModalProps) => {
  const fetcher = useFetcher<typeof action>();
  const toast = useToast();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.type === 'done') {
      if (revokeVcResponseSchema.safeParse(fetcher.data).success) {
        toast({ status: 'success', title: 'vc revoked.' });
      } else {
        toast({ status: 'error', title: 'corda error.' });
      }
      onClose();
    }
  }, [fetcher, onClose, toast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Revoke the VC?
        </ModalHeader>
        <ModalBody>
          <fetcher.Form method="post" action={$path('/authority/revoke/:uuid', { uuid: requestId })}>
            <Center>
              <Button variant="secondary" mr="32px" rounded="full" onClick={onClose}>No</Button>
              <Button type="submit">Revoke</Button>
            </Center>
          </fetcher.Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RevokeModal;
