export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const isUndefined = <T>(value: T | null | undefined): value is null | undefined =>
  !isDefined(value);

export const filterDefined = <T>(array: (T | null | undefined)[]): T[] => array.filter(isDefined);

export const isValidDate = (date: Date): boolean => date instanceof Date && !isNaN(date.getDate());

export const isNotEmpty = (value: string | null | undefined): value is string =>
  isDefined(value) && value.trim().length > 0;
