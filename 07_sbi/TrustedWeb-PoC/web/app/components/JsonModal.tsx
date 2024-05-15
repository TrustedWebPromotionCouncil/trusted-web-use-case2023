import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { type JsonObject } from 'type-fest';

type JsonModalProps = {
  jsonify: JsonObject;
  isOpen: boolean;
  onClose: () => void;
};

const JsonModal = ({ jsonify, isOpen, onClose }: JsonModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Detail</ModalHeader>
      <ModalCloseButton />
      <ModalBody whiteSpace="pre-wrap">{JSON.stringify(jsonify, null, 2)}</ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default JsonModal;
