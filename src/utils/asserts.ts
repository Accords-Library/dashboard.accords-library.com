import { PayloadImage, PayloadMedia } from "src/shared/payload/endpoint-types";
import { RichTextContent, isNodeParagraphNode } from "src/shared/payload/rich-text";
import { Scan, MediaThumbnail, Video, Image, Audio } from "src/types/collections";
import { File } from "src/types/collections";

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

export const isPayloadType = <T extends Object>(value: string | T): value is T =>
  typeof value === "object";

export const isPayloadArrayType = <T extends Object>(
  value: (string | T)[] | null | undefined
): value is T[] => isDefined(value) && value.every(isPayloadType<T>);

export const isPublished = <T extends { _status?: ("draft" | "published") | null }>(
  object: T
): boolean => object._status === "published";

export const isImage = (image: string | Image | null | undefined): image is PayloadImage & Image =>
  isPayloadImage(image);

export const isScan = (image: string | Scan | null | undefined): image is PayloadImage & Scan =>
  isPayloadImage(image);

export const isMediaThumbnail = (
  image: string | MediaThumbnail | null | undefined
): image is PayloadImage & MediaThumbnail => isPayloadImage(image);

export const isPayloadImage = (image: unknown): image is PayloadImage => {
  if (!isPayloadMedia(image)) return false;
  if (!("width" in image) || typeof image.width !== "number") return false;
  if (!("height" in image) || typeof image.height !== "number") return false;
  return true;
};

export const isVideo = (video: string | Video | null | undefined): video is PayloadMedia & Video =>
  isPayloadMedia(video);

export const isFile = (file: string | File | null | undefined): file is PayloadMedia & File =>
  isPayloadMedia(file);

export const isAudio = (video: string | Audio | null | undefined): video is PayloadMedia & Audio =>
  isPayloadMedia(video);

const isPayloadMedia = (media: unknown): media is PayloadMedia => {
  if (typeof media !== "object") return false;
  if (isUndefined(media)) return false;
  if (!("url" in media) || typeof media.url !== "string") return false;
  if (!("mimeType" in media) || typeof media.mimeType !== "string") return false;
  if (!("filename" in media) || typeof media.filename !== "string") return false;
  if (!("filesize" in media) || typeof media.filesize !== "number") return false;
  return true;
};
