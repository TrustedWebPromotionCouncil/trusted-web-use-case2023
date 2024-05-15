import {
  Center,
  chakra,
  FormControl,
  type FormControlProps,
  FormLabel,
  HStack,
  Spacer,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';

type YesNoRadioProps = {
  name: string;
} & FormControlProps;

const YesNoRadio = ({ name, children, ...others }: React.PropsWithChildren<YesNoRadioProps>) => {
  const { getRadioProps, getRootProps } = useRadioGroup({
    name,
    defaultValue: 'no',
    onChange: (next) => console.log(next),
  });
  const noRadio = useRadio(getRadioProps({ value: 'no' }));
  const yesRadio = useRadio(getRadioProps({ value: 'yes' }));

  return (
    <FormControl {...others}>
      <HStack {...getRootProps()}>
        <FormLabel>{children}</FormLabel>
        <Spacer />
        <chakra.label {...noRadio.htmlProps} cursor="pointer">
          <input {...noRadio.getInputProps({})} hidden />
          <Center
            {...noRadio.getRadioProps()}
            mr="16px"
            shadow="md"
            w="41px"
            h="30px"
            rounded="full"
            fontSize="14px"
            bg="#FF9696"
            _hover={{ boxShadow: 'outline' }}
            _checked={{
              color: 'white',
            }}
          >
            No
          </Center>
        </chakra.label>
        <chakra.label {...noRadio.htmlProps} cursor="pointer">
          <input {...yesRadio.getInputProps({})} />
          <Center
            {...yesRadio.getRadioProps()}
            shadow="md"
            w="45px"
            h="30px"
            rounded="full"
            fontSize="14px"
            bg="#FFD166"
            _hover={{ boxShadow: 'outline' }}
            _checked={{
              color: 'white',
            }}
          >
            Yes
          </Center>
        </chakra.label>
      </HStack>
    </FormControl>
  );
};

export default YesNoRadio;
