import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { type ActionArgs, type V2_MetaFunction } from '@remix-run/node';
import { Form, useNavigation } from '@remix-run/react';
import { createVcRequest } from '~/features/authority/service.server';
import { useUser } from '~/features/user/hooks';
import { actionAuthGuard } from '~/requests.server';

export const meta: V2_MetaFunction = () => [{ title: 'VC Issuance Request' }];
export const action = (args: ActionArgs) => actionAuthGuard(args, 'authority', createVcRequest);

const VCRequest = () => {
  const { state } = useNavigation();
  const { authority_name } = useUser('authority');

  return (
    <VStack p={4}>
      <Heading>VC Issuance Request</Heading>
      <Form method="post">
        <VStack>
          <Text>OrgName：{authority_name}</Text>
          <Text>VC Status:Unissued</Text>
          <Text>Expire Date:</Text>
          <HStack p={4}>
            <Button colorScheme="blue" type="submit" isDisabled={state !== 'idle'}>VC Issuance Requests</Button>
          </HStack>
        </VStack>
      </Form>
    </VStack>
  );
};

export default VCRequest;
