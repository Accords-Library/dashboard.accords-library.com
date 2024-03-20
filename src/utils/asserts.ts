import { PayloadImage } from "../sdk";

export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const isUndefined = <T>(value: T | null | undefined): value is null | undefined =>
  !isDefined(value);

export const isNotEmpty = (value: string | null | undefined): value is string =>
  isDefined(value) && value.trim().length > 0;

export const isEmpty = (value: string | null | undefined): value is string =>
  isUndefined(value) || value.trim().length === 0;

export const hasDuplicates = <T>(list: T[]): boolean => list.length !== new Set(list).size;

export const isValidPayloadImage = (
  image:
    | {
        filename?: string | null;
        mimeType?: string | null;
        width?: number | null;
        height?: number | null;
        url?: string | null;
      }
    | undefined
    | null
    | string
): image is PayloadImage => {
  if (isUndefined(image)) return false;
  if (typeof image === "string") return false;
  if (isEmpty(image.filename)) return false;
  if (isEmpty(image.url)) return false;
  if (isEmpty(image.mimeType)) return false;
  if (isUndefined(image.width)) return false;
  if (isUndefined(image.height)) return false;
  return true;
};

export const isPayloadType = <T extends Object>(value: string | T): value is T =>
  typeof value === "object";

export const isPayloadArrayType = <T extends Object>(
  value: (string | T)[] | null | undefined
): value is T[] => isDefined(value) && value.every(isPayloadType<T>);
