import { HStack, Text } from '@chakra-ui/react';
import { Fragment } from 'react';

type PageHeadingProps = {
  heading: string | string[];
};

const PageHeading = ({ heading }: PageHeadingProps) => (
  <HStack mt="75px" ml="24px" alignSelf="flex-start" fontSize="24px">
    {typeof heading === 'string' ?
      <Text>{heading}</Text> :
      heading.map((text, i) => (
        <Fragment key={i}>
          <Text fontWeight={heading.length - 1 === i ? 'bold' : 'normal'}>
            {text}
          </Text>
          {heading.length - 1 !== i && <Text>{'　＞　'}</Text>}
        </Fragment>
      ))}
  </HStack>
);

export default PageHeading;
