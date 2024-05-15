import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigation } from '@remix-run/react';
import { ValidatedForm } from 'remix-validated-form';
import ValidatedTextInput from '~/components/ValidatedTextInput';
import YesNoRadio from '~/components/YesNoRadio';
import { type SignedVC } from '~/features/api/api';
import { vcRequestValidator } from '~/features/business/validators';
import { useUser } from '~/features/user/hooks';
import LegalEntityIdentifierInputField from './LegalEntityIdentifierInputField';

type VcRequestModalProps = {
  level: number | '1' | '2' | '3';
  isOpen: boolean;
  vc?: {
    vc: SignedVC;
    address: string;
    contact_name: string;
    contact_department: string;
    contact_job_title: string;
    contact_number: string;
  };
  onClose: () => void;
};

const VcRequestModal = ({ level, isOpen, vc, onClose }: VcRequestModalProps) => {
  const { state } = useNavigation();
  const { business_name } = useUser('business');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      closeOnEsc={state === 'idle'}
      closeOnOverlayClick={state === 'idle'}
    >
      <ModalOverlay />
      <ModalContent>
        <ValidatedForm
          method="post"
          validator={vcRequestValidator}
          defaultValues={{
            country: vc?.vc?.credentialSubject?.businessUnitInfo?.country,
            address: vc?.address,
            contactName: vc?.contact_name,
            contactDepartment: vc?.contact_department,
            contactJobTitle: vc?.contact_job_title,
            contactNumber: vc?.contact_number,
            legalEntityIdentifier: vc?.vc?.credentialSubject?.legalEntityInfo?.legalEntityIdentifier,
            legalEntityName: vc?.vc?.credentialSubject?.legalEntityInfo?.legalEntityName,
            location: vc?.vc?.credentialSubject?.legalEntityInfo?.location,
          }}
        >
          <ModalHeader>
            <HStack px="47px" pt="47px">
              <Heading size="20px" mt="10px" fontWeight="normal">
                Authentication Level{level}
              </Heading>
              <Spacer />
              <Button
                onClick={onClose}
                rounded="full"
                variant="secondary"
                mr="32px"
                isDisabled={state !== 'idle'}
              >
                Close
              </Button>
              <Button
                type="submit"
                rounded="full"
                colorScheme="blue"
                isDisabled={state !== 'idle'}
              >
                Request
              </Button>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <VStack align="start" px="47px" py="24px" gap="12px">
              <Heading size="20px" fontWeight="normal">
                1.Business Unit Info
              </Heading>
              <FormControl pl="38px">
                <FormLabel>Business Unit Name</FormLabel>
                {vc == null ? <Input value={business_name} isDisabled /> : <Text>{business_name}</Text>}
              </FormControl>
              <Text>Business Unit Location</Text>
              <ValidatedTextInput
                label="Country"
                name="country"
                isRequired
                placeholder="Japan"
                controlProps={{ pl: '38px' }}
              />
              <ValidatedTextInput
                label="Address"
                name="address"
                isRequired
                placeholder="1-6-1 Roppongi, Minato-ku, Tokyo"
                controlProps={{ pl: '38px' }}
              />
              <YesNoRadio name="addressIncludedInVc" pl="38px">
                Address included in VC
              </YesNoRadio>
              <Text>Contact Info</Text>
              <ValidatedTextInput
                label="Name"
                name="contactName"
                isRequired
                placeholder="Fujimoto Mamoru"
                controlProps={{ pl: '38px' }}
              />
              <ValidatedTextInput
                label="Department"
                name="contactDepartment"
                isRequired
                placeholder="Business Management"
                controlProps={{ pl: '38px' }}
              />
              <ValidatedTextInput
                label="Job title"
                name="contactJobTitle"
                isRequired
                placeholder="Director"
                controlProps={{ pl: '38px' }}
              />
              <ValidatedTextInput
                label="Contact Number"
                name="contactNumber"
                isRequired
                placeholder="0312345678"
                controlProps={{ pl: '38px' }}
                type="number"
              />
              <YesNoRadio name="contactInfoIncludedInVc" pl="38px">
                Address included in VC
              </YesNoRadio>
              <Heading size="md">2.Legal Entity Info</Heading>
              <LegalEntityIdentifierInputField />
              <ValidatedTextInput
                label="Legal Entity Name"
                name="legalEntityName"
                isRequired
                placeholder="SBI Holdings"
                controlProps={{ pl: '38px' }}
              />
              <ValidatedTextInput
                label="Location"
                name="location"
                isRequired
                placeholder="1-6-1 Roppongi, Minato-ku, Tokyo"
                controlProps={{ pl: '38px' }}
              />
              <Heading size="20px">3.Authentication Level Info</Heading>
              <FormControl pl="38px">
                <FormLabel>Authentication Level</FormLabel>
                {vc == null ? <Input value={level} isDisabled /> : <Text>{level}</Text>}
                <input type="hidden" name="authenticationLevel" value={level} />
              </FormControl>
            </VStack>
          </ModalBody>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
};

export default VcRequestModal;
