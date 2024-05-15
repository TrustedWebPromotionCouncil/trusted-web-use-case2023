import {
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import DataItem from '~/components/DataItem';
import DataList from '~/components/Datalist';
import { dateTimeColor, formatDateTime } from '~/decorators';
import { type SignedVC } from '~/features/api/api';

type VcDetailModalProps = {
  signedVc: SignedVC;
  isOpen: boolean;
  onClose: () => void;
};

const VcDetailModal = ({ signedVc, isOpen, onClose }: VcDetailModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} size="6xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader ml="45px" mt="80px">
        <HStack>
          <Image src="/vc.png" mr="12px" />
          <Heading size="20px" fontWeight="normal">
            Business Unit ID for Authentication Level {signedVc.credentialSubject.authenticationLevel}
          </Heading>
          <Spacer />
          <Button rounded="full" variant="secondary" onClick={onClose}>Close</Button>
        </HStack>
      </ModalHeader>
      <ModalBody>
        <VStack align="start" ml="45px" mt="10px">
          <Card mb="30px" w="680px">
            <CardBody pl="20px" py="20px">
              <DataList rowGap="20px">
                <DataItem
                  term="Certification Date（ValidFrom）"
                  definition={formatDateTime(signedVc.validFrom)}
                  definitionColor={dateTimeColor(signedVc.validFrom)}
                />
                <DataItem
                  term="Expiry Date（ValidUntil）"
                  definition={formatDateTime(signedVc.validUntil)}
                  definitionColor={dateTimeColor(signedVc.validUntil)}
                />
                <DataItem term="UUID" definition={signedVc.credentialSubject.uuid} />
              </DataList>
            </CardBody>
          </Card>
          <Heading size="20px" bg="#FFD166" w="full" fontWeight="normal">
            1. Issuer Information
          </Heading>
          <Heading size="18px" ml="16px" mt="8px" fontWeight="normal">（1）Authenticator Info</Heading>
          <VStack ml="64px" align="start">
            <Text fontSize="14px">Digital Certificate Origanization ID</Text>
            <Input
              value={signedVc.issuer.id}
              isReadOnly
            />
            <Text fontSize="14px">Digital Certificate Origanization Name</Text>
            <Input
              value={signedVc.credentialSubject.authenticatorInfo.digitalCertificateOrganizationName}
              isReadOnly
            />
            <Text fontSize="14px">Digital Certificate Origanization's Credential Issuer</Text>
            <Input
              value={signedVc.credentialSubject.authenticatorInfo.digitalCertificateOrganizationCredentialIssuer}
              isReadOnly
            />
          </VStack>
          <Heading size="20px" mt="28px" bg="#FFD166" w="full" fontWeight="normal">
            2. Business Unit ID Holder Information
          </Heading>
          <Heading size="18px" ml="16px" mt="8px" fontWeight="normal">（1）Business Unit Info</Heading>
          <VStack ml="64px" align="start">
            <Text fontSize="14px">Business Unit ID</Text>
            <Input
              value={signedVc.credentialSubject.didDocument.id}
              isReadOnly
            />
            <Text fontSize="14px">Business Unit Name</Text>
            <Input
              value={signedVc.credentialSubject.businessUnitInfo.businessUnitName}
              isReadOnly
            />
            <Text fontSize="14px">Ref. No.</Text>
            <Input value={signedVc.id} isReadOnly />
            <Text fontSize="14px">Country</Text>
            <Input
              value={signedVc.credentialSubject.businessUnitInfo.country}
              isReadOnly
            />
            {signedVc.credentialSubject.businessUnitInfo.address != null && (
              <>
                <Text fontSize="14px">Address</Text>
                <Input
                  value={signedVc.credentialSubject.businessUnitInfo.address}
                  isReadOnly
                />
              </>
            )}
            {signedVc.credentialSubject.businessUnitInfo.contactInfo != null && (
              <>
                <Text fontSize="14px">Contact Info</Text>
                <Text fontSize="14px">Name</Text>
                <Input
                  value={signedVc.credentialSubject.businessUnitInfo.contactInfo.name}
                  isReadOnly
                />
                <Text fontSize="14px">Department</Text>
                <Input
                  value={signedVc.credentialSubject.businessUnitInfo.contactInfo.department}
                  isReadOnly
                />
                <Text fontSize="14px">Job title</Text>
                <Input
                  value={signedVc.credentialSubject.businessUnitInfo.contactInfo.jobTitle}
                  isReadOnly
                />
                <Text fontSize="14px">Contact Number</Text>
                <Input
                  value={signedVc.credentialSubject.businessUnitInfo.contactInfo.contactNumber}
                  isReadOnly
                />
              </>
            )}
          </VStack>
          <Heading size="18px" ml="16px" mt="8px" fontWeight="normal">（2）Legal Entity Info</Heading>
          <VStack ml={16} align="start">
            <Text>Legal Entity Identifier</Text>
            <HStack w="full">
              <Text fontSize="14px">Legal Entity Number</Text>{' '}
              <Input
                value={signedVc.credentialSubject.legalEntityInfo.legalEntityIdentifier}
                isReadOnly
              />
            </HStack>
            <Text fontSize="14px">Legal Entity Name</Text>
            <Input
              value={signedVc.credentialSubject.legalEntityInfo.legalEntityName}
              isReadOnly
            />
            <Text fontSize="14px">Location</Text>
            <Input
              value={signedVc.credentialSubject.legalEntityInfo.location}
              isReadOnly
            />
          </VStack>
          <Heading size="18px" ml="16px" mt="8px" fontWeight="normal">（3）Authentication Level Info</Heading>
          <VStack ml={16} align="start">
            <Text fontSize="14px">Authentication Level Info</Text>
            <Input value={signedVc.credentialSubject.authenticationLevel} isReadOnly />
          </VStack>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default VcDetailModal;
