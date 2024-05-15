import {
  FormControl,
  type FormControlProps,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { useField } from 'remix-validated-form';

type ValidatedNumberInputProps = {
  name: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  defaultValue?: number;
  controlProps?: Omit<FormControlProps, 'error' | 'isRequired'>;
};

const ValidatedNumberInput = (
  { name, label, isRequired, placeholder, defaultValue, controlProps }: ValidatedNumberInputProps,
) => {
  const { error, getInputProps, defaultValue: rvfDefaultValue } = useField(name);

  return (
    <FormControl {...controlProps} isRequired={isRequired} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <NumberInput defaultValue={defaultValue ?? rvfDefaultValue}>
        <NumberInputField {...getInputProps()} placeholder={placeholder} />
      </NumberInput>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default ValidatedNumberInput;
