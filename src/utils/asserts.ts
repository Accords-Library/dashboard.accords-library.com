export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const isUndefined = <T>(value: T | null | undefined): value is null | undefined =>
  !isDefined(value);

export const filterDefined = <T>(array: (T | null | undefined)[]): T[] => array.filter(isDefined);

export const isValidDate = (date: Date): boolean => date instanceof Date && !isNaN(date.getDate());

export const isNotEmpty = (value: string | null | undefined): value is string =>
  isDefined(value) && value.trim().length > 0;

export const isEmpty = (value: string | null | undefined): value is string =>
  isUndefined(value) || value.trim().length === 0;

type Span = [number, number];
export const hasNoIntersection = (a: Span, b: Span): boolean => {
  const [aStart, aEnd] = a;
  const [bStart, bEnd] = b;
  return aEnd < bStart || aStart > bEnd;
};

export const hasIntersection = (a: Span, b: Span): boolean => !hasNoIntersection(a, b);

export const hasDuplicates = <T>(list: T[]): boolean => list.length !== new Set(list).size;
