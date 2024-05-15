import {
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { type useLoaderData } from '@remix-run/react';
import { makeDID } from '~/features/vcRequest/models';
import { type loader } from '~/routes/business.vcrequest';

type VcRejectedDetailModalProps = {
  data: Awaited<ReturnType<typeof useLoaderData<typeof loader>>['vcRequests']>[number];
  isOpen: boolean;
  onClose: () => void;
};

const VcRejectedDetailModal = ({ data, isOpen, onClose }: VcRejectedDetailModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} size="6xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Business Unit ID for Authentication Level {data.applied_authentication_level}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack align="start">
          <Heading size="md" bg="lightgrey" w="f">1. Issuer Information</Heading>
          <Heading size="sm" ml={4}>（1）Authenticator Info</Heading>
          <VStack ml={16} align="start">
            <Text>Digital Certificate Origanization ID</Text>
            <Input value={makeDID(data.authority_name)} isReadOnly />
            <Text>Digital Certificate Origanization Name</Text>
            <Input value={data.authority_name} isReadOnly />
            <Text>Digital Certificate Origanization's Credential Issuer</Text>
            <Input value="?????" isReadOnly />
            <Text>Certification Date</Text>
            <Input isReadOnly />
            <Text>Certification Result</Text>
            <Input value="Rejected" isReadOnly color="red" />
            <Text>Expiry Date of Digital Certificate Organization's Credentials</Text>
            {/*<Input value={formatDate(data.expiry_date)} isReadOnly color="red" />*/}
          </VStack>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default VcRejectedDetailModal;
