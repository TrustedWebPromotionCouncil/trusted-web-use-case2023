import { useToast } from '@chakra-ui/react';
import { useAsyncError } from '@remix-run/react';
import { useEffect } from 'react';

type ErrorToasterProps = {
  message: string | ((error: unknown) => string);
};

const ErrorToaster = ({ message }: ErrorToasterProps) => {
  const toast = useToast();
  const error = useAsyncError();

  useEffect(() => {
    toast({ title: typeof message === 'function' ? message(error) : message, status: 'error' });
  }, [message, error, toast]);

  return null;
};

export default ErrorToaster;
