import { CollectibleNature, CollectionStatus, Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointCollectible, EndpointCollectiblePreview } from "../../../sdk";
import { Collectible } from "../../../types/collections";
import { isPayloadArrayType, isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import { convertTagsToGroups } from "../../../utils/endpoints";

export const getBySlugEndpoint = createGetByEndpoint(
  Collections.Collectibles,
  "slug",
  (collectible: Collectible): EndpointCollectible => {
    const { nature, urls, subitems, gallery, contents } = collectible;
    return {
      ...convertCollectibleToPreview(collectible),
      contents: handleContents(contents),
      gallery:
        gallery
          ?.map(({ image }) => image)
          .flatMap((image) => (isValidPayloadImage(image) ? [image] : [])) ?? [],
      nature: nature === "Physical" ? CollectibleNature.Physical : CollectibleNature.Digital,
      parentPages: [], // TODO: todo
      subitems: isPayloadArrayType(subitems) ? subitems.map(convertCollectibleToPreview) : [],
      urls: urls?.map(({ url }) => ({ url, label: getLabelFromUrl(url) })) ?? [],
    };
  }
);

export const handleContents = (
  contents: Collectible["contents"]
): EndpointCollectible["contents"] => {
  if (!contents) return [];

  return contents.flatMap(({ content, range: rangeArray }) => {
    const handleRange = (): EndpointCollectible["contents"][number]["range"] => {
      const range = rangeArray?.[0];
      switch (range?.blockType) {
        case "other": {
          const { translations, blockType } = range;
          return {
            type: blockType,
            translations:
              translations?.map(({ language, note }) => ({
                language: isPayloadType(language) ? language.id : language,
                note,
              })) ?? [],
          };
        }

        case "pageRange": {
          const { blockType, end, start } = range;
          return { type: blockType, end, start };
        }

        case "timeRange": {
          const { blockType, end, start } = range;
          return { type: blockType, end, start };
        }

        default:
          return undefined;
      }
    };

    const handleContent = (): EndpointCollectible["contents"][number]["content"] | undefined => {
      switch (content.relationTo) {
        case "generic-contents":
          return isPayloadType(content.value)
            ? { relationTo: "generic-contents", value: content.value }
            : undefined;

        case "pages":
          return isPayloadType(content.value)
            ? { relationTo: "pages", value: content.value }
            : undefined;

        default:
          return undefined;
      }
    };

    const newContent = handleContent();
    const range = handleRange();

    if (!newContent) return [];
    return [{ content: newContent, range }];
  });
};

export const convertCollectibleToPreview = ({
  slug,
  _status,
  thumbnail,
  translations,
  releaseDate,
  languages,
  tags,
}: Collectible): EndpointCollectiblePreview => {
  return {
    slug,
    languages:
      languages?.map((language) => (isPayloadType(language) ? language.id : language)) ?? [],
    status: _status === "draft" ? CollectionStatus.Draft : CollectionStatus.Published,
    ...(releaseDate ? { releaseDate } : {}),
    ...(isValidPayloadImage(thumbnail) ? { thumbnail } : {}),
    tagGroups: convertTagsToGroups(tags),
    translations:
      translations?.map(({ language, title, description, pretitle, subtitle }) => ({
        language: isPayloadType(language) ? language.id : language,
        title,
        ...(pretitle ? { pretitle } : {}),
        ...(subtitle ? { subtitle } : {}),
        ...(description ? { description } : {}),
      })) ?? [],
  };
};

const getLabelFromUrl = (url: string): string => {
  const urlObject = new URL(url);
  let domain = urlObject.hostname;
  if (domain.startsWith("www.")) {
    domain = domain.substring("www.".length);
  }
  return domain;
};
