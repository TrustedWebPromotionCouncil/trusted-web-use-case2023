import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  type InputProps,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useField } from 'remix-validated-form';

const LegalEntityIdentifierInputField = () => {
  const { error, getInputProps, defaultValue } = useField('legalEntityIdentifier');

  return (
    <FormControl isRequired isInvalid={!!error} pl="38px">
      <FormLabel>Legal Entity Identifier</FormLabel>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem colSpan={1}>
          <Select defaultValue="0" isDisabled bg="orange">
            <option value="0">Legal Entity Number</option>
          </Select>
        </GridItem>
        <GridItem colSpan={2}>
          <VStack>
            <Input
              defaultValue={defaultValue}
              {...getInputProps<InputProps>({ type: 'number', placeholder: '601040104528' })}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </VStack>
        </GridItem>
      </Grid>
    </FormControl>
  );
};

export default LegalEntityIdentifierInputField;
