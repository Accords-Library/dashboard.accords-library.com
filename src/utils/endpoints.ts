import { convertAudioToEndpointAudio } from "../collections/Audios/endpoints/getByID";
import { convertCollectibleToEndpointCollectible } from "../collections/Collectibles/endpoints/getBySlugEndpoint";
import { convertFolderToEndpointFolder } from "../collections/Folders/endpoints/getBySlugEndpoint";
import { convertImageToEndpointImage } from "../collections/Images/endpoints/getByID";
import { convertPageToEndpointPage } from "../collections/Pages/endpoints/getBySlugEndpoint";
import { convertRecorderToEndpointRecorder } from "../collections/Recorders/endpoints/getByID";
import { convertVideoToEndpointVideo } from "../collections/Videos/endpoints/getByID";
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
  isUploadNodeVideoNode,
} from "../constants";
import {
  EndpointAttribute,
  EndpointCredit,
  EndpointImageSize,
  EndpointMediaThumbnail,
  EndpointRole,
  EndpointScanImage,
  EndpointSource,
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
  ImageSize,
  ValidImageSize,
  isDefined,
  isEmpty,
  isPayloadArrayType,
  isPayloadType,
  isPublished,
  isValidImageSize,
  isValidPayloadImage,
  isValidPayloadMedia,
} from "./asserts";

const convertTagToEndpointTag = ({ slug, page, translations }: Tag): EndpointTag => ({
  slug,
  ...(page && isPayloadType(page) ? { page: convertPageToEndpointPage(page) } : {}),
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
            if (!isPayloadType(value) || !isValidPayloadImage(value)) return errorUploadNode;
            return {
              ...node,
              value: convertImageToEndpointImage(value),
            };
          } else if (isUploadNodeAudioNode(node)) {
            const value = node.value as unknown as Audio | string;
            if (!isPayloadType(value) || !isValidPayloadMedia(value)) return errorUploadNode;
            return {
              ...node,
              value: convertAudioToEndpointAudio(value),
            };
          } else if (isUploadNodeVideoNode(node)) {
            const value = node.value as unknown as Video | string;
            if (!isPayloadType(value) || !isValidPayloadMedia(value)) return errorUploadNode;
            return {
              ...node,
              value: convertVideoToEndpointVideo(value),
            };
          }
        }
        return node;
      }),
    },
  };
};

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

  if (collectibles && isPayloadArrayType(collectibles)) {
    collectibles.filter(isPublished).forEach((collectible) => {
      result.push({
        type: "collectible",
        collectible: convertCollectibleToEndpointCollectible(collectible),
      });
    });
  }

  if (scans && isPayloadArrayType(scans)) {
    scans.filter(isPublished).forEach((collectible) => {
      result.push({
        type: "scans",
        collectible: convertCollectibleToEndpointCollectible(collectible),
      });
    });
  }

  if (gallery && isPayloadArrayType(gallery)) {
    gallery.filter(isPublished).forEach((collectible) => {
      result.push({
        type: "gallery",
        collectible: convertCollectibleToEndpointCollectible(collectible),
      });
    });
  }

  if (folders && isPayloadArrayType(folders)) {
    folders.forEach((folder) => {
      result.push({
        type: "folder",
        folder: convertFolderToEndpointFolder(folder),
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

const convertRoleToEndpointRole = ({ icon, translations }: CreditsRole): EndpointRole => ({
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
        recorders: recorders.map(convertRecorderToEndpointRecorder),
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
      const { slug, icon, translations } = name;
      return {
        slug,
        icon: icon ?? "material-symbols:category-outline",
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
      const { slug, icon, translations } = name;
      return {
        slug,
        icon: icon ?? "material-symbols:category-outline",
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
      const { slug, icon, translations } = name;

      return {
        slug,
        icon: icon ?? "material-symbols:category-outline",
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

export const convertSizesToEndpointImageSize = (
  sizes: (ImageSize | undefined)[],
  targetSizes: number[]
): EndpointImageSize[] => {
  if (!sizes) return [];
  const processedSizes = sizes.filter(isValidImageSize);

  const targetBins: { min: number; target: number; max: number; image: ValidImageSize }[] = [];
  for (let index = 0; index < targetSizes.length; index++) {
    const previous = targetSizes[index - 1];
    const current = targetSizes[index]!;
    const next = targetSizes[index + 1];

    const min = previous ? previous + (current - previous) / 2 : 0;
    const max = next ? current + (next - current) / 2 : Infinity;

    const images = processedSizes
      .filter(({ width }) => width > min && width <= max)
      .sort((a, b) => a.filesize - b.filesize);

    const smallestImage = images[0];
    if (!smallestImage) continue;

    targetBins.push({ min, target: current, max, image: smallestImage });
  }

  return targetBins.map(({ target, image: { height, width, url } }) => ({
    width,
    height,
    url,
    wSize: target,
  }));
};

export const convertScanToEndpointScanImage = (
  { url, width, height, mimeType, filename, filesize, sizes }: Scan & PayloadImage,
  index: string
): EndpointScanImage => ({
  index,
  url,
  width,
  height,
  filename,
  filesize,
  mimeType,
  sizes: convertSizesToEndpointImageSize(
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

export const convertMediaThumbnailToEndpointMediaThumbnail = ({
  url,
  width,
  height,
  mimeType,
  filename,
  filesize,
  sizes,
}: MediaThumbnail & PayloadImage): EndpointMediaThumbnail => ({
  url,
  width,
  height,
  filename,
  filesize,
  mimeType,
  sizes: convertSizesToEndpointImageSize(
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
});
