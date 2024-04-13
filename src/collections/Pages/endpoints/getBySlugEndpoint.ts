import {
  BreakBlockType,
  Collections,
  RichTextContent,
  isBlockNodeBreakBlock,
  isBlockNodeSectionBlock,
  isNodeBlockNode,
} from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointPage, TableOfContentEntry } from "../../../sdk";
import { Page } from "../../../types/collections";
import { isNotEmpty, isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import {
  convertCreditsToEndpointCredits,
  convertRTCToEndpointRTC,
  convertSourceToEndpointSource,
  convertTagsEndpointTagsGroups,
} from "../../../utils/endpoints";
import { convertImageToEndpointImage } from "../../Images/endpoints/getByID";

export const getBySlugEndpoint = createGetByEndpoint({
  collection: Collections.Pages,
  attribute: "slug",
  handler: (page) => convertPageToEndpointPage(page),
});

export const convertPageToEndpointPage = ({
  translations,
  collectibles,
  folders,
  backgroundImage,
  slug,
  tags,
  thumbnail,
}: Page): EndpointPage => ({
  slug,
  ...(isValidPayloadImage(thumbnail) ? { thumbnail: convertImageToEndpointImage(thumbnail) } : {}),
  ...(isValidPayloadImage(backgroundImage)
    ? { backgroundImage: convertImageToEndpointImage(backgroundImage) }
    : {}),
  tagGroups: convertTagsEndpointTagsGroups(tags),
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
  parentPages: convertSourceToEndpointSource({ collectibles, folders }),
});

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
