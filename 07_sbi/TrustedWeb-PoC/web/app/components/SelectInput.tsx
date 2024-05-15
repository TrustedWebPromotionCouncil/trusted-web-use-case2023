import { FormControl, FormLabel, Select, type SelectProps } from '@chakra-ui/react';
import { useField } from 'remix-validated-form';

type SelectInputProps<TKey extends string> = {
  name: string;
  label: string;
  values: Record<TKey, string | number>;
  defaultValue?: TKey;
} & SelectProps;

const SelectInput = <TKey extends string>({ name, label, values, defaultValue, ...others }: SelectInputProps<TKey>) => {
  const { getInputProps } = useField(name);

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Select key={defaultValue} {...getInputProps<SelectProps>({ ...others })}>
        {Object.entries<string | number>(values).map(([label, value]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
