const localeOptions: Intl.DateTimeFormatOptions = {
  //   weekday: 'narrow',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

export const toLocaleString = (utc: number) => {
  return new Date(utc).toLocaleDateString('ja-JP', localeOptions);
};
