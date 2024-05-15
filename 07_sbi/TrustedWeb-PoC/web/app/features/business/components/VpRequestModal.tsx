import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ValidatedForm } from 'remix-validated-form';
import ValidatedTextInput from '~/components/ValidatedTextInput';
import { vcRequestValidator } from '~/features/business/validators';

type VpRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const VpRequestModal = ({ isOpen, onClose }: VpRequestModalProps) => {
  const [level, setLevel] = useState<number>();
  const closeModal = () => {
    setLevel(undefined);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        {level == null ?
          (
            <ModalBody>
              <VStack px={12} py={8} gap={4}>
                <Text textAlign="center">Please choose the Authentication Level you want to generate</Text>
                <Button onClick={() => setLevel(1)}>Level1</Button>
                <Button>Level2</Button>
                <Button>Level3</Button>
              </VStack>
            </ModalBody>
          ) :
          (
            <ValidatedForm method="post" validator={vcRequestValidator}>
              <ModalBody>
                <VStack px={12} py={8} gap={4}>
                  <Text textAlign="center">VPに入る内容確認</Text>
                  <ValidatedTextInput label="Corporation Number" name="corporationNumber" isRequired />
                  <ValidatedTextInput label="Corporation Name" name="corporationName" />
                  <ValidatedTextInput label="Location" name="location" />
                  <input type="hidden" name="authenticationLevel" value={level} />
                </VStack>
              </ModalBody>
              <ModalFooter gap={3}>
                <Button onClick={closeModal}>Close</Button>
                <Button type="submit" colorScheme="blue">Generate VP</Button>
              </ModalFooter>
            </ValidatedForm>
          )}
      </ModalContent>
    </Modal>
  );
};

export default VpRequestModal;
