export const excludePropertyFromObject = <T extends object, K extends keyof T>(
  obj: T,
  prop: K
): Omit<T, K> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [prop]: _, ...rest } = obj;
  return rest;
};
