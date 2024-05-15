import { useToast } from '@chakra-ui/react';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { type loader } from '~/root';

const Toaster = () => {
  const { flash } = useLoaderData<typeof loader>();
  const toast = useToast();

  useEffect(() => {
    if (flash != null) {
      toast({ title: flash.message, status: flash.status });
    }
  }, [flash, toast]);

  return null;
};

export default Toaster;
