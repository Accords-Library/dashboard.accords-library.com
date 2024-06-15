import { convertAudioToEndpointAudioPreview } from "../collections/Audios/endpoints/getByID";
import { convertImageToEndpointImagePreview } from "../collections/Images/endpoints/getByID";
import { convertRecorderToEndpointRecorderPreview } from "../collections/Recorders/endpoints/getByID";
import { convertVideoToEndpointVideoPreview } from "../collections/Videos/endpoints/getByID";
import {
  AttributeTypes,
  RichTextBreakBlock,
  RichTextContent,
  RichTextSectionBlock,
  RichTextUploadNode,
  isBlockNodeBreakBlock,
  isBlockNodeSectionBlock,
  isNodeBlockNode,
  isNodeUploadNode,
  isUploadNodeAudioNode,
  isUploadNodeImageNode,
  isUploadNodeVideoNode
} from "../constants";
import {
  EndpointAttribute,
  EndpointCredit,
  EndpointPayloadImage,
  EndpointRole,
  EndpointScanImage,
  EndpointSource,
  EndpointSourcePreview,
  EndpointTag,
  PayloadImage,
} from "../sdk";
import {
  Audio,
  Collectible,
  Credits,
  CreditsRole,
  Folder,
  Image,
  Language,
  MediaThumbnail,
  NumberBlock,
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
  isImage,
  isNotEmpty,
  isPayloadArrayType,
  isPayloadImage,
  isPayloadType,
  isPublished,
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

// TODO: Handle URL sources
export const convertSourceToEndpointSource = ({
  collectibles,
  folders,
  gallery,
  scans,
}: {
  collectibles?: (string | Collectible)[] | null | undefined;
  scans?: (string | Collectible)[] | null | undefined;
  gallery?: (string | Collectible)[] | null | undefined;
  folders?: (string | Folder)[] | null | undefined;
}): EndpointSource[] => {
  const result: EndpointSource[] = [];

  const convertFolderToEndpointSourcePreview = ({
    id,
    slug,
    translations,
  }: Folder): EndpointSourcePreview => ({
    id,
    slug,
    translations: translations.map(({ language, name }) => ({
      language: isPayloadType(language) ? language.id : language,
      title: name,
    })),
  });

  const convertCollectibleToEndpointSourcePreview = ({
    id,
    slug,
    translations,
  }: Collectible): EndpointSourcePreview => ({
    id,
    slug,
    translations: translations.map(({ language, title, pretitle, subtitle }) => ({
      language: isPayloadType(language) ? language.id : language,
      title,
      ...(isNotEmpty(pretitle) ? { pretitle } : {}),
      ...(isNotEmpty(subtitle) ? { subtitle } : {}),
    })),
  });

  if (collectibles && isPayloadArrayType(collectibles)) {
    collectibles.filter(isPublished).forEach((collectible) => {
      result.push({
        type: "collectible",
        collectible: convertCollectibleToEndpointSourcePreview(collectible),
      });
    });
  }

  if (scans && isPayloadArrayType(scans)) {
    scans.filter(isPublished).forEach((collectible) => {
      result.push({
        type: "scans",
        collectible: convertCollectibleToEndpointSourcePreview(collectible),
      });
    });
  }

  if (gallery && isPayloadArrayType(gallery)) {
    gallery.filter(isPublished).forEach((collectible) => {
      result.push({
        type: "gallery",
        collectible: convertCollectibleToEndpointSourcePreview(collectible),
      });
    });
  }

  if (folders && isPayloadArrayType(folders)) {
    folders.forEach((folder) => {
      result.push({
        type: "folder",
        folder: convertFolderToEndpointSourcePreview(folder),
      });
    });
  }

  return result;
};

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
