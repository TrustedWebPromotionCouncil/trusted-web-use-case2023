import { Button, FormControl, Heading, Input, VStack } from '@chakra-ui/react';
import { ValidatedForm } from 'remix-validated-form';
import { LoginFormValidator } from '../validators';

type LoginProps = {
  type: string;
};

const LoginForm = ({ type }: LoginProps) => (
  <VStack p={4}>
    <Heading>{type} Login</Heading>
    <ValidatedForm method="post" validator={LoginFormValidator}>
      <VStack p={4}>
        <FormControl isRequired>
          <Input name="id" placeholder="userID" />
        </FormControl>
        <FormControl isRequired>
          <Input name="password" placeholder="password" type="password" />
        </FormControl>
        <Button type="submit" variant="outline" colorScheme="blue">login</Button>
      </VStack>
    </ValidatedForm>
  </VStack>
);

export default LoginForm;
