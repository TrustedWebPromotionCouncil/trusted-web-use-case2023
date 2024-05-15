import {
  FormControl,
  type FormControlProps,
  FormErrorMessage,
  FormLabel,
  Input,
  type InputProps,
} from '@chakra-ui/react';
import { useField } from 'remix-validated-form';

type ValidatedTextInputProps = {
  name: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  defaultValue?: string;
  controlProps?: Omit<FormControlProps, 'error' | 'isRequired'>;
  type?: InputProps['type'];
};

const ValidatedTextInput = (
  { name, label, isRequired, placeholder, defaultValue, controlProps, type = 'text' }: ValidatedTextInputProps,
) => {
  const { error, getInputProps, defaultValue: rvfDefaultValue } = useField(name);

  return (
    <FormControl {...controlProps} isRequired={isRequired} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input
        {...getInputProps<InputProps>({ type, placeholder })}
        defaultValue={defaultValue ?? rvfDefaultValue}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default ValidatedTextInput;
