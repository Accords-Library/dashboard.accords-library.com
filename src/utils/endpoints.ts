import { convertAudioToEndpointAudioPreview } from "../collections/Audios/endpoints/getByID";
import { convertEventToEndpointEvent } from "../collections/ChronologyEvents/endpoints/getAllEndpoint";
import { convertCollectibleToEndpointCollectiblePreview } from "../collections/Collectibles/endpoints/getBySlugEndpoint";
import { convertFileToEndpointFilePreview } from "../collections/Files/endpoints/getByID";
import { convertFolderToEndpointFolderPreview } from "../collections/Folders/endpoints/getBySlugEndpoint";
import { convertImageToEndpointImagePreview } from "../collections/Images/endpoints/getByID";
import { convertPageToEndpointPagePreview } from "../collections/Pages/endpoints/getBySlugEndpoint";
import { convertRecorderToEndpointRecorderPreview } from "../collections/Recorders/endpoints/getByID";
import { convertVideoToEndpointVideoPreview } from "../collections/Videos/endpoints/getByID";
import { AttributeTypes, Collections } from "../shared/payload/constants";
import {
  EndpointTag,
  EndpointRole,
  EndpointCredit,
  EndpointAttribute,
  PayloadImage,
  EndpointScanImage,
  EndpointPayloadImage,
  EndpointRelation,
} from "../shared/payload/endpoint-types";
import {
  RichTextContent,
  isNodeBlockNode,
  isBlockNodeSectionBlock,
  RichTextSectionBlock,
  isBlockNodeBreakBlock,
  RichTextBreakBlock,
  isNodeUploadNode,
  RichTextUploadNode,
  isUploadNodeImageNode,
  isUploadNodeAudioNode,
  isUploadNodeVideoNode,
} from "../shared/payload/rich-text";
import {
  Audio,
  Credits,
  CreditsRole,
  Image,
  Language,
  MediaThumbnail,
  NumberBlock,
  Relationship,
  Scan,
  Tag,
  TagsBlock,
  TextBlock,
  Video,
} from "../types/collections";
import {
  isAudio,
  isDefined,
  isEmpty,
  isFile,
  isImage,
  isPayloadArrayType,
  isPayloadImage,
  isPayloadType,
  isVideo,
} from "./asserts";

const convertTagToEndpointTag = ({ id, slug, page, translations }: Tag): EndpointTag => ({
  id,
  slug,
  ...(page && isPayloadType(page) ? { page: { slug: page.slug } } : {}),
  translations: translations.map(({ language, name }) => ({
    language: isPayloadType(language) ? language.id : language,
    name,
  })),
});

export const convertRTCToEndpointRTC = (
  { root: { children, ...others } }: RichTextContent,
  parentPrefix = ""
): RichTextContent => {
  let index = 0;
  return {
    root: {
      ...others,
      children: children.map((node) => {
        if (isNodeBlockNode(node)) {
          // Remove ids in blocks to avoid considering them when caching
          if ("id" in node.fields) {
            delete node.fields.id;
          }

          // Add anchor hash on section block (TOC)
          if (isBlockNodeSectionBlock(node)) {
            index++;
            const anchorHash = `${parentPrefix}${index}.`;
            const newNode: RichTextSectionBlock = {
              ...node,
              fields: {
                ...node.fields,
                content: convertRTCToEndpointRTC(node.fields.content, anchorHash),
              },
              anchorHash,
            };
            return newNode;
            // Add anchor hash on section block (TOC)
          } else if (isBlockNodeBreakBlock(node)) {
            index++;
            const anchorHash = `${parentPrefix}${index}.`;
            const newNode: RichTextBreakBlock = {
              ...node,
              anchorHash,
            };
            return newNode;
          }
        } else if (isNodeUploadNode(node)) {
          const errorUploadNode: RichTextUploadNode = {
            type: "upload",
            relationTo: "error",
            version: 1,
          };
          if (isUploadNodeImageNode(node)) {
            const value = node.value as unknown as Image | string;
            if (!isImage(value)) return errorUploadNode;
            return {
              ...node,
              value: convertImageToEndpointImagePreview(value),
            };
          } else if (isUploadNodeAudioNode(node)) {
            const value = node.value as unknown as Audio | string;
            if (!isAudio(value)) return errorUploadNode;
            return {
              ...node,
              value: convertAudioToEndpointAudioPreview(value),
            };
          } else if (isUploadNodeVideoNode(node)) {
            const value = node.value as unknown as Video | string;
            if (!isVideo(value)) return errorUploadNode;
            return {
              ...node,
              value: convertVideoToEndpointVideoPreview(value),
            };
          }
        }
        return node;
      }),
    },
  };
};

export const convertRelationshipsToEndpointRelations = (
  relationships: Relationship["incomingRelations"] | Relationship["outgoingRelations"]
): EndpointRelation[] =>
  relationships?.flatMap<EndpointRelation>(({ relationTo, value }) => {
    if (!isPayloadType(value)) return [];
    switch (relationTo) {
      case Collections.Folders:
        return { type: Collections.Folders, value: convertFolderToEndpointFolderPreview(value) };

      case Collections.Pages:
        return { type: Collections.Pages, value: convertPageToEndpointPagePreview(value) };

      case Collections.Collectibles:
        return {
          type: Collections.Collectibles,
          value: convertCollectibleToEndpointCollectiblePreview(value),
        };

      case Collections.Images:
        if (!isImage(value)) return [];
        return { type: Collections.Images, value: convertImageToEndpointImagePreview(value) };

      case Collections.Videos:
        if (!isVideo(value)) return [];
        return { type: Collections.Videos, value: convertVideoToEndpointVideoPreview(value) };

      case Collections.Audios:
        if (!isAudio(value)) return [];
        return { type: Collections.Audios, value: convertAudioToEndpointAudioPreview(value) };

      case Collections.Files:
        if (!isFile(value)) return [];
        return { type: Collections.Files, value: convertFileToEndpointFilePreview(value) };

      case Collections.Recorders:
        return {
          type: Collections.Recorders,
          value: convertRecorderToEndpointRecorderPreview(value),
        };

      case Collections.ChronologyEvents:
        return { type: Collections.ChronologyEvents, value: convertEventToEndpointEvent(value) };

      case Collections.MediaThumbnails:
      case Collections.VideosSubtitles:
      case Collections.VideosChannels:
      case Collections.Scans:
      case Collections.Tags:
      case Collections.Attributes:
      case Collections.CreditsRole:
      case Collections.Languages:
      case Collections.Currencies:
      case Collections.Wordings:
      case Collections.GenericContents:
      default:
        return [];
    }
  }) ?? [];

export const getDomainFromUrl = (url: string): string => {
  const urlObject = new URL(url);
  let domain = urlObject.hostname;
  if (domain.startsWith("www.")) {
    domain = domain.substring("www.".length);
  }
  return domain;
};

export const getLanguageId = (language: string | Language) =>
  typeof language === "object" ? language.id : language;

const convertRoleToEndpointRole = ({ id, icon, translations }: CreditsRole): EndpointRole => ({
  id,
  icon: icon ?? "material-symbols:person",
  translations: translations.map(({ language, name }) => ({
    language: getLanguageId(language),
    name,
  })),
});

export const convertCreditsToEndpointCredits = (credits?: Credits | null): EndpointCredit[] =>
  credits?.flatMap<EndpointCredit>(({ recorders, role }) => {
    if (!isPayloadArrayType(recorders) || !isPayloadType(role)) return [];
    return [
      {
        role: convertRoleToEndpointRole(role),
        recorders: recorders.map(convertRecorderToEndpointRecorderPreview),
      },
    ];
  }) ?? [];

export const convertAttributesToEndpointAttributes = (
  attributes: (TagsBlock | NumberBlock | TextBlock)[] | null | undefined
): EndpointAttribute[] =>
  attributes?.map(convertAttributeToEndpointAttribute).filter(isDefined) ?? [];

const convertAttributeToEndpointAttribute = (
  attribute: TagsBlock | NumberBlock | TextBlock
): EndpointAttribute | undefined => {
  switch (attribute.blockType) {
    case "numberBlock": {
      const { name, number } = attribute;
      if (!isPayloadType(name)) return;
      const { id, slug, icon, translations } = name;
      return {
        id,
        slug,
        icon: icon ?? "material-symbols:category",
        translations: translations.map(({ language, name }) => ({
          language: isPayloadType(language) ? language.id : language,
          name,
        })),
        type: AttributeTypes.Number,
        value: number,
      };
    }

    case "textBlock": {
      const { name, text } = attribute;
      if (!isPayloadType(name)) return;
      if (isEmpty(text)) return;
      const { id, slug, icon, translations } = name;
      return {
        id,
        slug,
        icon: icon ?? "material-symbols:category",
        translations: translations.map(({ language, name }) => ({
          language: isPayloadType(language) ? language.id : language,
          name,
        })),
        type: AttributeTypes.Text,
        value: text,
      };
    }

    case "tagsBlock": {
      const { name, tags } = attribute;
      if (!isPayloadType(name)) return;
      if (!isPayloadArrayType(tags)) return;
      if (tags.length === 0) return;
      const { id, slug, icon, translations } = name;

      return {
        id,
        slug,
        icon: icon ?? "material-symbols:category",
        translations: translations.map(({ language, name }) => ({
          language: isPayloadType(language) ? language.id : language,
          name,
        })),
        type: AttributeTypes.Tags,
        value: tags.map(convertTagToEndpointTag),
      };
    }
  }
};

type Nullable<T> = { [P in keyof T]?: T[P] | undefined | null };

export const convertSizesToPayloadImages = (
  sizes: (Nullable<PayloadImage> | undefined)[],
  targetSizes: number[]
): PayloadImage[] => {
  const processedSizes = sizes.filter(isPayloadImage);

  const images: PayloadImage[] = [];
  for (let index = 0; index < targetSizes.length; index++) {
    const previous = targetSizes[index - 1];
    const current = targetSizes[index]!;
    const next = targetSizes[index + 1];

    const min = previous ? previous + (current - previous) / 2 : 0;
    const max = next ? current + (next - current) / 2 : Infinity;

    const imagesAtTargetSize = processedSizes
      .filter(({ width }) => width > min && width <= max)
      .sort((a, b) => a.filesize - b.filesize);

    const smallestImage = imagesAtTargetSize[0];
    if (!smallestImage) continue;

    images.push(smallestImage);
  }

  return images;
};

export const convertScanToEndpointScanImage = (
  { id, url, width, height, mimeType, filename, filesize, sizes }: Scan & PayloadImage,
  index: string
): EndpointScanImage => ({
  id,
  index,
  url,
  width,
  height,
  filename,
  filesize,
  mimeType,
  sizes: convertSizesToPayloadImages(
    [
      sizes?.["200w"],
      sizes?.["320w"],
      sizes?.["480w"],
      sizes?.["800w"],
      { url, width, height, filename, filesize, mimeType },
    ],
    [200, 320, 480, 800]
  ),
});

export const convertImageToEndpointPayloadImage = ({
  url,
  width,
  height,
  mimeType,
  filename,
  filesize,
  id,
  sizes,
}: Image & PayloadImage): EndpointPayloadImage => ({
  filename,
  filesize,
  height,
  id,
  mimeType,
  sizes: convertSizesToPayloadImages(
    [
      sizes?.["200w"],
      sizes?.["320w"],
      sizes?.["480w"],
      sizes?.["800w"],
      sizes?.["1280w"],
      sizes?.["1920w"],
      sizes?.["2560w"],
      { url, width, height, filename, filesize, mimeType },
    ],
    [200, 320, 480, 800, 1280, 1920, 2560]
  ),
  url,
  width,
  ...(isPayloadImage(sizes?.og) ? { openGraph: sizes.og } : {}),
});

export const convertMediaThumbnailToEndpointPayloadImage = ({
  id,
  url,
  width,
  height,
  mimeType,
  filename,
  filesize,
  sizes,
}: MediaThumbnail & PayloadImage): EndpointPayloadImage => ({
  id,
  url,
  width,
  height,
  filename,
  filesize,
  mimeType,
  sizes: convertSizesToPayloadImages(
    [
      sizes?.["200w"],
      sizes?.["320w"],
      sizes?.["480w"],
      sizes?.["800w"],
      sizes?.["1280w"],
      sizes?.["1920w"],
      sizes?.["2560w"],
      { url, width, height, filename, filesize, mimeType },
    ],
    [200, 320, 480, 800, 1280, 1920, 2560]
  ),
  ...(isPayloadImage(sizes?.og) ? { openGraph: sizes.og } : {}),
});
