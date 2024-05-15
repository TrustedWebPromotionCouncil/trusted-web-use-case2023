export const format = (str: string, ...args: unknown[]): string => {
  for (const [i, arg] of args.entries()) {
    const regExp = new RegExp(`\\{${i}\\}`, 'g');
    str = str.replace(regExp, arg as string);
  }
  return str;
};
