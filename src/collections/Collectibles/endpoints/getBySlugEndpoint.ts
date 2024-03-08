import { CollectibleNature, CollectionStatus, Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointCollectible, EndpointCollectiblePreview, PayloadImage } from "../../../sdk";
import { Collectible } from "../../../types/collections";
import {
  isDefined,
  isPayloadArrayType,
  isPayloadType,
  isValidPayloadImage,
} from "../../../utils/asserts";
import { convertTagsToGroups, handleParentPages } from "../../../utils/endpoints";
import { convertPageToPreview } from "../../Pages/endpoints/getBySlugEndpoint";

export const getBySlugEndpoint = createGetByEndpoint(
  Collections.Collectibles,
  "slug",
  (collectible: Collectible): EndpointCollectible => {
    const {
      nature,
      urls,
      subitems,
      gallery,
      contents,
      priceEnabled,
      price,
      size,
      sizeEnabled,
      weight,
      weightEnabled,
      pageInfo,
      pageInfoEnabled,
      parentItems,
      folders,
      backgroundImage,
    } = collectible;

    return {
      ...convertCollectibleToPreview(collectible),
      ...(isValidPayloadImage(backgroundImage) ? { backgroundImage } : {}),
      contents: handleContents(contents),
      gallery: handleGallery(gallery),
      scans: handleScans(collectible.scans),
      nature: nature === "Physical" ? CollectibleNature.Physical : CollectibleNature.Digital,
      parentPages: handleParentPages({collectibles: parentItems, folders}),
      subitems: isPayloadArrayType(subitems) ? subitems.map(convertCollectibleToPreview) : [],
      urls: urls?.map(({ url }) => ({ url, label: getLabelFromUrl(url) })) ?? [],
      ...(weightEnabled && weight ? { weight: weight.amount } : {}),
      ...handleSize(size, sizeEnabled),
      ...handlePageInfo(pageInfo, pageInfoEnabled),
      ...handlePrice(price, priceEnabled),
    };
  },
  3
);

export const handlePrice = (
  price: Collectible["price"],
  enabled: Collectible["priceEnabled"]
): { price: NonNullable<EndpointCollectible["price"]> } | {} => {
  if (!price || !enabled || !isPayloadType(price.currency)) return {};
  return {
    price: { amount: price.amount, currency: price.currency.id },
  };
};

export const handleSize = (
  size: Collectible["size"],
  enabled: Collectible["sizeEnabled"]
): { size: NonNullable<EndpointCollectible["size"]> } | {} => {
  if (!size || !enabled) return {};
  return {
    size: {
      width: size.width,
      height: size.height,
      ...(isDefined(size.thickness) ? { thickness: size.thickness } : {}),
    },
  };
};

export const handlePageInfo = (
  pageInfo: Collectible["pageInfo"],
  enabled: Collectible["pageInfoEnabled"]
): { pageInfo: NonNullable<EndpointCollectible["pageInfo"]> } | {} => {
  if (!pageInfo || !enabled) return {};
  return {
    pageInfo: {
      pageCount: pageInfo.pageCount,
      ...(isDefined(pageInfo.bindingType) ? { bindingType: pageInfo.bindingType } : {}),
      ...(isDefined(pageInfo.pageOrder) ? { pageOrder: pageInfo.pageOrder } : {}),
    },
  };
};

export const handleGallery = (gallery: Collectible["gallery"]): EndpointCollectible["gallery"] => {
  const result: PayloadImage[] = [];
  if (!gallery) return result;

  gallery?.forEach(({ image }) => {
    if (isValidPayloadImage(image)) {
      result.push(image);
    }
  });

  return result.slice(0, 10);
};

export const handleScans = (scans: Collectible["scans"]): EndpointCollectible["scans"] => {
  const result: PayloadImage[] = [];
  if (!scans) return result;

  scans.pages?.forEach(({ image }) => {
    if (isValidPayloadImage(image)) {
      result.push(image);
    }
  });

  if (isValidPayloadImage(scans.cover?.front)) {
    result.push(scans.cover.front);
  }

  if (isValidPayloadImage(scans.cover?.back)) {
    result.push(scans.cover.back);
  }

  if (isValidPayloadImage(scans.dustjacket?.front)) {
    result.push(scans.dustjacket.front);
  }

  if (isValidPayloadImage(scans.dustjacket?.back)) {
    result.push(scans.dustjacket.back);
  }

  return result.slice(0, 10);
};

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
            ? {
                relationTo: "generic-contents",
                value: {
                  translations: content.value.translations.map(({ language, name }) => ({
                    language: isPayloadType(language) ? language.id : language,
                    name,
                  })),
                },
              }
            : undefined;

        case "pages":
          return isPayloadType(content.value)
            ? { relationTo: "pages", value: convertPageToPreview(content.value) }
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
