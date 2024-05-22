import { RichTextContent, isNodeParagraphNode } from "../constants";
import { PayloadImage, PayloadMedia } from "../sdk";
import { Image } from "../types/collections";

export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const isUndefined = <T>(value: T | null | undefined): value is null | undefined =>
  !isDefined(value);

export const isNotEmpty = (
  value: string | null | undefined | RichTextContent
): value is string | RichTextContent => !isEmpty(value);

export const isEmpty = (value: string | null | undefined | RichTextContent): boolean =>
  isUndefined(value) ||
  (typeof value === "string" && isEmptyString(value)) ||
  (typeof value === "object" && isEmptyRichText(value));

const isEmptyString = (value: string) => value.trim().length === 0;
const isEmptyRichText = (value: RichTextContent) =>
  value.root.children.length === 0 ||
  value.root.children.every((node) => isNodeParagraphNode(node) && node.children.length === 0);

export const hasDuplicates = <T>(list: T[]): boolean => list.length !== new Set(list).size;

export const isValidPayloadImage = (
  image: string | Image | null | undefined
): image is Image & PayloadImage => {
  if (typeof image === "string") return false;
  if (!isValidPayloadMedia(image)) return false;
  if (isUndefined(image.width)) return false;
  if (isUndefined(image.height)) return false;
  return true;
};

export const isValidPayloadMedia = (
  media:
    | Partial<{ [K in keyof PayloadMedia]: null | undefined | PayloadMedia[K] }>
    | undefined
    | null
    | string
): media is PayloadMedia => {
  if (isUndefined(media)) return false;
  if (typeof media === "string") return false;
  if (isEmpty(media.filename)) return false;
  if (isEmpty(media.url)) return false;
  if (isEmpty(media.mimeType)) return false;
  if (isUndefined(media.filesize)) return false;
  return true;
};

export const isPayloadType = <T extends Object>(value: string | T): value is T =>
  typeof value === "object";

export const isPayloadArrayType = <T extends Object>(
  value: (string | T)[] | null | undefined
): value is T[] => isDefined(value) && value.every(isPayloadType<T>);

export const isPublished = <T extends { _status?: ("draft" | "published") | null }>(
  object: T
): boolean => object._status === "published";

export type ImageSize = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  filesize?: number | null;
  filename?: string | null;
};

export type ValidImageSize = {
  url: string;
  width: number;
  height: number;
  mimeType: string;
  filesize: number;
  filename: string;
};

export const isValidImageSize = (size: ImageSize | undefined): size is ValidImageSize => {
  if (isUndefined(size)) return false;
  if (isUndefined(size.url)) return false;
  if (isUndefined(size.width)) return false;
  if (isUndefined(size.height)) return false;
  if (isUndefined(size.mimeType)) return false;
  if (isUndefined(size.filesize)) return false;
  if (isUndefined(size.filename)) return false;
  return true;
};
