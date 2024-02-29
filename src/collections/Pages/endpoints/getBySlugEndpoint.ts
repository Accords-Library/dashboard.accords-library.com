import {
  Collections,
  PageType,
  RichTextContent,
  isBlockNodeSectionBlock,
  isNodeBlockNode,
} from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointPage, ParentPage, TableOfContentEntry } from "../../../sdk";
import { Page } from "../../../types/collections";
import { isPayloadArrayType, isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import { convertTagsToGroups } from "../../../utils/tags";

export const getBySlugEndpoint = createGetByEndpoint(
  Collections.Pages,
  "slug",
  ({
    authors,
    slug,
    translations,
    tags,
    thumbnail,
    _status,
    collectibles,
    folders,
    type,
  }: Page): EndpointPage => ({
    slug,
    type: type as PageType,
    ...(isValidPayloadImage(thumbnail) ? { thumbnail } : {}),
    tagGroups: convertTagsToGroups(tags),
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
        translators: isPayloadArrayType(translators) ? translators.map(({ id }) => id) : [],
        transcribers: isPayloadArrayType(transcribers) ? transcribers.map(({ id }) => id) : [],
        proofreaders: isPayloadArrayType(proofreaders) ? proofreaders.map(({ id }) => id) : [],
      })
    ),
    authors: isPayloadArrayType(authors) ? authors.map(({ id }) => id) : [],
    status: _status === "published" ? "published" : "draft",
    parentPages: handleParentPages({ collectibles, folders }),
  })
);

const handleContent = (
  { root: { children, ...others } }: RichTextContent,
  parentPrefix = ""
): RichTextContent => {
  let sectionCount = 0;
  return {
    root: {
      ...others,
      children: children.map((node) => {
        if (isNodeBlockNode(node) && isBlockNodeSectionBlock(node)) {
          sectionCount++;
          const anchorHash = `${parentPrefix}${sectionCount}.`;
          return {
            ...node,
            fields: {
              ...node.fields,
              anchorHash,
              content: handleContent(node.fields.content, anchorHash),
            },
          };
        }
        return node;
      }),
    },
  };
};

const handleToc = (content: RichTextContent, parentPrefix = ""): TableOfContentEntry[] =>
  content.root.children
    .filter(isNodeBlockNode)
    .filter(isBlockNodeSectionBlock)
    .map(({ fields }, index) => ({
      prefix: `${parentPrefix}${index + 1}.`,
      title: fields.blockName ?? "",
      children: handleToc(fields.content, `${index + 1}.`),
    }));

const handleParentPages = ({
  collectibles,
  folders,
}: Pick<Page, "collectibles" | "folders">): ParentPage[] => {
  const result: ParentPage[] = [];

  if (collectibles && isPayloadArrayType(collectibles)) {
    collectibles.forEach(({ slug, title }) => {
      result.push({
        collection: Collections.LibraryItems,
        slug,
        translations: [{ language: "en", name: title }],
        tag: "collectible",
      });
    });
  }

  if (folders && isPayloadArrayType(folders)) {
    folders.forEach(({ slug, translations }) => {
      result.push({
        collection: Collections.Folders,
        slug,
        translations:
          translations?.map(({ language, name }) => ({
            language: isPayloadType(language) ? language.id : language,
            name,
          })) ?? [],
        tag: "folders",
      });
    });
  }

  return result;
};
