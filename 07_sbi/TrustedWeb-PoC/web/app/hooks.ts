import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';

export const useIndexdDisclosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [index, setIndex] = useState<number>();

  return {
    index,
    isOpen,
    onOpen: (i: number) => {
      setIndex(i);
      onOpen();
    },
    onClose: () => {
      setIndex(undefined);
      onClose();
    },
  };
};
