import { PayloadImage } from "../sdk";

export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const isUndefined = <T>(value: T | null | undefined): value is null | undefined =>
  !isDefined(value);

export const isNotEmpty = (value: string | null | undefined): value is string =>
  isDefined(value) && value.trim().length > 0;

export const isEmpty = (value: string | null | undefined): value is string =>
  isUndefined(value) || value.trim().length === 0;

type Span = [number, number];
const hasNoIntersection = (a: Span, b: Span): boolean => {
  const [aStart, aEnd] = a;
  const [bStart, bEnd] = b;
  return aEnd < bStart || aStart > bEnd;
};

export const hasIntersection = (a: Span, b: Span): boolean => !hasNoIntersection(a, b);

export const hasDuplicates = <T>(list: T[]): boolean => list.length !== new Set(list).size;

export const isValidPayloadImage = (
  image: Partial<PayloadImage> | undefined
): image is PayloadImage => {
  if (isUndefined(image)) return false;
  if (isEmpty(image.filename)) return false;
  if (isEmpty(image.url)) return false;
  if (isEmpty(image.mimeType)) return false;
  if (isUndefined(image.width)) return false;
  if (isUndefined(image.height)) return false;
  return true;
};

export const isString = <T extends Object>(value: string | T): value is string =>
  typeof value === "string";

export const isPayloadType = <T extends Object>(value: string | T): value is T =>
  typeof value === "object";

export const isPayloadArrayType = <T extends Object>(value: string[] | T[]): value is T[] =>
  value.every(isPayloadType<T>);
