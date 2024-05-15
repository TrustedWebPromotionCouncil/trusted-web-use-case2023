import { format } from 'date-fns';

export const formatDate = (date: string | undefined | null) => date != null ? format(new Date(date), 'yyyy-MM-dd') : '';
export const formatDateTime = (date: string | undefined | null) =>
  date != null ? format(new Date(date), 'yyyy-MM-dd hh:mm:ss') : '';
export const dateTimeColor = (date: string | undefined | null) =>
  date != null ? new Date(date) < new Date() ? '#D32929' : 'black' : undefined;
