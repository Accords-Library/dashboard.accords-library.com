import { convertAudioToEndpointAudio } from "../collections/Audios/endpoints/getByID";
import { convertCollectibleToEndpointCollectible } from "../collections/Collectibles/endpoints/getBySlugEndpoint";
import { convertFolderToEndpointFolder } from "../collections/Folders/endpoints/getBySlugEndpoint";
import { convertImageToEndpointImage } from "../collections/Images/endpoints/getByID";
import { convertRecorderToEndpointRecorder } from "../collections/Recorders/endpoints/getByUsername";
import { convertVideoToEndpointVideo } from "../collections/Videos/endpoints/getByID";
import {
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
  EndpointCredit,
  EndpointRole,
  EndpointSource,
  EndpointTag,
  EndpointTagsGroup,
} from "../sdk";
import {
  Audio,
  Collectible,
  Credits,
  CreditsRole,
  Folder,
  Image,
  Language,
  Tag,
  Video,
} from "../types/collections";
import {
  isPayloadArrayType,
  isPayloadType,
  isPublished,
  isValidPayloadImage,
  isValidPayloadMedia,
} from "./asserts";

export const convertTagsEndpointTagsGroups = (
  tags: (string | Tag)[] | null | undefined
): EndpointTagsGroup[] => {
  if (!isPayloadArrayType(tags)) {
    return [];
  }

  const groups: EndpointTagsGroup[] = [];

  tags.forEach(({ translations, slug, group }) => {
    if (isPayloadType(group)) {
      const existingGroup = groups.find((existingGroup) => existingGroup.slug === group.slug);

      const endpointTag: EndpointTag = {
        slug,
        translations: translations.map(({ language, name }) => ({
          language: isPayloadType(language) ? language.id : language,
          name,
        })),
      };

      if (existingGroup) {
        existingGroup.tags.push(endpointTag);
      } else {
        groups.push({
          slug: group.slug,
          icon: group.icon ?? "material-symbols:category-outline",
          tags: [endpointTag],
          translations: group.translations.map(({ language, name }) => ({
            language: isPayloadType(language) ? language.id : language,
            name,
          })),
        });
      }
    }
  });

  return groups;
};

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
