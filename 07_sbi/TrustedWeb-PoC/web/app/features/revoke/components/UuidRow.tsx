import { Td, Tr } from '@chakra-ui/react';

type UuidRowProps = {
  uuid: string;
  status: string;
};

const UuidRow = ({ uuid, status }: UuidRowProps) => (
  <Tr key={uuid}>
    <Td>{uuid}</Td>
    <Td>{status}</Td>
  </Tr>
);

export default UuidRow;
