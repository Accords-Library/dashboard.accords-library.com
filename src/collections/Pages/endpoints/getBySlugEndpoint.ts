import {
  BreakBlockType,
  Collections,
  PageType,
  RichTextBreakBlock,
  RichTextContent,
  RichTextSectionBlock,
  isBlockNodeBreakBlock,
  isBlockNodeSectionBlock,
  isNodeBlockNode,
} from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointPage, EndpointPagePreview, TableOfContentEntry } from "../../../sdk";
import { Page } from "../../../types/collections";
import { isPayloadArrayType, isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import { convertTagsToGroups, handleParentPages, handleRecorder } from "../../../utils/endpoints";

export const getBySlugEndpoint = createGetByEndpoint({
  collection: Collections.Pages,
  attribute: "slug",
  handler: (page: Page): EndpointPage => {
    const { translations, collectibles, folders, backgroundImage } = page;

    return {
      ...convertPageToPreview(page),
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
          ...(pretitle ? { pretitle } : {}),
          title,
          ...(subtitle ? { subtitle } : {}),
          ...(summary ? { summary } : {}),
          content: handleContent(content),
          toc: handleToc(content),
          translators: isPayloadArrayType(translators) ? translators.map(handleRecorder) : [],
          transcribers: isPayloadArrayType(transcribers) ? transcribers.map(handleRecorder) : [],
          proofreaders: isPayloadArrayType(proofreaders) ? proofreaders.map(handleRecorder) : [],
        })
      ),
      parentPages: handleParentPages({ collectibles, folders }),
    };
  },
});

const handleContent = (
  { root: { children, ...others } }: RichTextContent,
  parentPrefix = ""
): RichTextContent => {
  let index = 0;
  return {
    root: {
      ...others,
      children: children.map((node) => {
        if (isNodeBlockNode(node)) {
          if (isBlockNodeSectionBlock(node)) {
            index++;
            const anchorHash = `${parentPrefix}${index}.`;
            const newNode: RichTextSectionBlock = {
              ...node,
              fields: {
                ...node.fields,
                content: handleContent(node.fields.content, anchorHash),
              },
              anchorHash,
            };
            return newNode;
          } else if (isBlockNodeBreakBlock(node)) {
            index++;
            const anchorHash = `${parentPrefix}${index}.`;
            const newNode: RichTextBreakBlock = {
              ...node,
              anchorHash,
            };
            return newNode;
          }
        }
        return node;
      }),
    },
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

export const convertPageToPreview = ({
  authors,
  slug,
  translations,
  tags,
  thumbnail,
  type,
}: Page): EndpointPagePreview => ({
  slug,
  type: type as PageType,
  ...(isValidPayloadImage(thumbnail) ? { thumbnail } : {}),
  tagGroups: convertTagsToGroups(tags),
  translations: translations.map(({ language, title, pretitle, subtitle }) => ({
    language: isPayloadType(language) ? language.id : language,
    ...(pretitle ? { pretitle } : {}),
    title,
    ...(subtitle ? { subtitle } : {}),
  })),
  authors: isPayloadArrayType(authors) ? authors.map(handleRecorder) : [],
});
