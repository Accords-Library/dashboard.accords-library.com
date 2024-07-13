import { convertRecorderToEndpointRecorderPreview } from "src/collections/Recorders/endpoints/getByID";
import { createGetByEndpoint } from "src/endpoints/createGetByEndpoint";
import { Collections, BreakBlockType } from "src/shared/payload/constants";
import {
  EndpointPagePreview,
  EndpointPage,
  TableOfContentEntry,
} from "src/shared/payload/endpoint-types";
import {
  RichTextContent,
  isNodeBlockNode,
  isBlockNodeSectionBlock,
  isBlockNodeBreakBlock,
} from "src/shared/payload/rich-text";
import { Page } from "src/types/collections";
import { isImage, isPayloadType, isNotEmpty } from "src/utils/asserts";
import {
  convertImageToEndpointPayloadImage,
  convertAttributesToEndpointAttributes,
  convertRTCToEndpointRTC,
  convertCreditsToEndpointCredits,
  convertSourceToEndpointSource,
} from "src/utils/endpoints";

export const getBySlugEndpoint = createGetByEndpoint({
  collection: Collections.Pages,
  attribute: "slug",
  handler: (page) => convertPageToEndpointPage(page),
});

export const convertPageToEndpointPagePreview = ({
  id,
  translations,
  slug,
  attributes,
  thumbnail,
  updatedAt,
}: Page): EndpointPagePreview => ({
  id,
  slug,
  ...(isImage(thumbnail) ? { thumbnail: convertImageToEndpointPayloadImage(thumbnail) } : {}),
  attributes: convertAttributesToEndpointAttributes(attributes),
  translations: translations.map(({ language, title, pretitle, subtitle }) => ({
    language: isPayloadType(language) ? language.id : language,
    ...(isNotEmpty(pretitle) ? { pretitle } : {}),
    title,
    ...(isNotEmpty(subtitle) ? { subtitle } : {}),
  })),
  updatedAt,
});

const convertPageToEndpointPage = (page: Page): EndpointPage => {
  const { translations, collectibles, folders, backgroundImage, createdAt, updatedBy } = page;

  return {
    ...convertPageToEndpointPagePreview(page),
    ...(isImage(backgroundImage)
      ? { backgroundImage: convertImageToEndpointPayloadImage(backgroundImage) }
      : {}),
    translations: translations.map(
      ({ content, language, sourceLanguage, title, pretitle, subtitle, summary, credits }) => ({
        language: isPayloadType(language) ? language.id : language,
        sourceLanguage: isPayloadType(sourceLanguage) ? sourceLanguage.id : sourceLanguage,
        ...(isNotEmpty(pretitle) ? { pretitle } : {}),
        title,
        ...(isNotEmpty(subtitle) ? { subtitle } : {}),
        ...(isNotEmpty(summary) ? { summary } : {}),
        content: convertRTCToEndpointRTC(content),
        toc: handleToc(content),
        credits: convertCreditsToEndpointCredits(credits),
      })
    ),
    createdAt,
    ...(isPayloadType(updatedBy)
      ? { updatedBy: convertRecorderToEndpointRecorderPreview(updatedBy) }
      : {}),
    parentPages: convertSourceToEndpointSource({ collectibles, folders }),
  };
};

const handleToc = (content: RichTextContent, parentPrefix = ""): TableOfContentEntry[] => {
  let index = 0;

  return content.root.children.filter(isNodeBlockNode).flatMap<TableOfContentEntry>((node) => {
    if (isBlockNodeSectionBlock(node)) {
      index++;
      return [
        {
          index,
          prefix: `${parentPrefix}${index}.`,
          title: node.fields.blockName ?? "",
          type: "section",
          children: handleToc(node.fields.content, `${index}.`),
        },
      ];
    } else if (isBlockNodeBreakBlock(node)) {
      switch (node.fields.type) {
        case BreakBlockType.dottedLine:
        case BreakBlockType.solidLine: {
          index++;
          return [
            {
              index,
              prefix: `${parentPrefix}${index}.`,
              title: node.fields.blockName ?? "",
              type: "break",
              children: [],
            },
          ];
        }

        case BreakBlockType.sceneBreak: {
          index++;
          return [
            {
              index,
              prefix: `${parentPrefix}${index}.`,
              title: node.fields.blockName ?? "",
              type: "sceneBreak",
              children: [],
            },
          ];
        }

        case BreakBlockType.space:
        default:
          return [];
      }
    }
    return [];
  });
};
