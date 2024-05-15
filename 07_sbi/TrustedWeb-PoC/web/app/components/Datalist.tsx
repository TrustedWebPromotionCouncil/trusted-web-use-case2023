import { Flex, type FlexProps } from '@chakra-ui/react';

type DataListProps = React.PropsWithChildren<Omit<FlexProps, 'as' | 'wrap'>>;

const DataList = ({ children, ...props }: DataListProps) => (
  <Flex as="dl" wrap="wrap" {...props}>
    {children}
  </Flex>
);

export default DataList;
