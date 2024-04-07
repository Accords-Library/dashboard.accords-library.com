import {
  BreakBlockType,
  Collections,
  PageType,
  RichTextContent,
  isBlockNodeBreakBlock,
  isBlockNodeSectionBlock,
  isNodeBlockNode,
} from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointPage, TableOfContentEntry } from "../../../sdk";
import { Page } from "../../../types/collections";
import {
  isNotEmpty,
  isPayloadArrayType,
  isPayloadType,
  isValidPayloadImage,
} from "../../../utils/asserts";
import {
  convertRTCToEndpointRTC,
  convertSourceToEndpointSource,
  convertTagsEndpointTagsGroups,
} from "../../../utils/endpoints";
import { convertRecorderToEndpointRecorder } from "../../Recorders/endpoints/getByUsername";

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
  authors,
  slug,
  tags,
  thumbnail,
  type,
}: Page): EndpointPage => ({
  slug,
  type: type as PageType,
  ...(isValidPayloadImage(thumbnail) ? { thumbnail } : {}),
  tagGroups: convertTagsEndpointTagsGroups(tags),
  authors: isPayloadArrayType(authors) ? authors.map(convertRecorderToEndpointRecorder) : [],
  ...(isValidPayloadImage(backgroundImage) ? { backgroundImage } : {}),
  translations: translations.map(
    ({
      content,
      language,
      sourceLanguage,
      title,
      pretitle,
      subtitle,
      proofreaders,
      summary,
      transcribers,
      translators,
    }) => ({
      language: isPayloadType(language) ? language.id : language,
      sourceLanguage: isPayloadType(sourceLanguage) ? sourceLanguage.id : sourceLanguage,
      ...(isNotEmpty(pretitle) ? { pretitle } : {}),
      title,
      ...(isNotEmpty(subtitle) ? { subtitle } : {}),
      ...(isNotEmpty(summary) ? { summary } : {}),
      content: convertRTCToEndpointRTC(content),
      toc: handleToc(content),
      translators: isPayloadArrayType(translators)
        ? translators.map(convertRecorderToEndpointRecorder)
        : [],
      transcribers: isPayloadArrayType(transcribers)
        ? transcribers.map(convertRecorderToEndpointRecorder)
        : [],
      proofreaders: isPayloadArrayType(proofreaders)
        ? proofreaders.map(convertRecorderToEndpointRecorder)
        : [],
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
