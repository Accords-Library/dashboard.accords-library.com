import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { findIncomingRelationships } from "payloadcms-relationships";
import { Collections, BreakBlockType } from "../../../shared/payload/constants";
import {
  EndpointPagePreview,
  EndpointPage,
  TableOfContentEntry,
} from "../../../shared/payload/endpoint-types";
import {
  RichTextContent,
  isNodeBlockNode,
  isBlockNodeSectionBlock,
  isBlockNodeBreakBlock,
} from "../../../shared/payload/rich-text";
import { Page } from "../../../types/collections";
import { isImage, isNotEmpty, isPayloadType } from "../../../utils/asserts";
import {
  convertAttributesToEndpointAttributes,
  convertCreditsToEndpointCredits,
  convertImageToEndpointPayloadImage,
  convertRTCToEndpointRTC,
  convertRelationshipsToEndpointRelations,
} from "../../../utils/endpoints";
import { convertRecorderToEndpointRecorderPreview } from "../../Recorders/endpoints/getByID";

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

const convertPageToEndpointPage = async (page: Page): Promise<EndpointPage> => {
  const { translations, backgroundImage, createdAt, updatedBy, id } = page;

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
    backlinks: convertRelationshipsToEndpointRelations(
      await findIncomingRelationships(Collections.Pages, id)
    ),
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
