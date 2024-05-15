import { Text } from '@chakra-ui/react';

type DataItemProps = {
  term: string;
  definition: string | null | undefined;
  definitionColor?: string;
};

const DataItem = ({ term, definition, definitionColor }: DataItemProps) => (
  <>
    <Text as="dt" size="18px" w="40%" whiteSpace="nowrap">{term}</Text>
    <Text as="dd" size="18px" w="60%" color={definitionColor} whiteSpace="nowrap">{definition}</Text>
  </>
);

export default DataItem;
