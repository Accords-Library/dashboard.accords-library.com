import { CollectibleNature, Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointCollectible, EndpointCollectiblePreview } from "../../../sdk";
import { Collectible } from "../../../types/collections";
import {
  isAudio,
  isDefined,
  isImage,
  isNotEmpty,
  isPayloadArrayType,
  isPayloadType,
  isPublished,
  isScan,
  isVideo,
} from "../../../utils/asserts";
import {
  convertAttributesToEndpointAttributes,
  convertScanToEndpointScanImage,
  convertSourceToEndpointSource,
  getDomainFromUrl,
} from "../../../utils/endpoints";
import { convertAudioToEndpointAudio } from "../../Audios/endpoints/getByID";
import { convertImageToEndpointImage } from "../../Images/endpoints/getByID";
import { convertPageToEndpointPagePreview } from "../../Pages/endpoints/getBySlugEndpoint";
import { convertRecorderToEndpointRecorderPreview } from "../../Recorders/endpoints/getByID";
import { convertVideoToEndpointVideo } from "../../Videos/endpoints/getByID";

export const getBySlugEndpoint = createGetByEndpoint({
  collection: Collections.Collectibles,
  attribute: "slug",
  depth: 3,
  handler: (collectible) => convertCollectibleToEndpointCollectible(collectible),
});

export const convertCollectibleToEndpointCollectiblePreview = ({
  id,
  priceEnabled,
  price,
  slug,
  thumbnail,
  translations,
  releaseDate,
  languages,
  attributes,
}: Collectible): EndpointCollectiblePreview => ({
  id,
  slug,
  ...(isImage(thumbnail) ? { thumbnail: convertImageToEndpointImage(thumbnail) } : {}),
  translations:
    translations?.map(({ language, title, pretitle, subtitle }) => ({
      language: isPayloadType(language) ? language.id : language,
      title,
      ...(isNotEmpty(pretitle) ? { pretitle } : {}),
      ...(isNotEmpty(subtitle) ? { subtitle } : {}),
    })) ?? [],
  attributes: convertAttributesToEndpointAttributes(attributes),
  ...(isDefined(releaseDate) ? { releaseDate } : {}),
  languages: languages?.map((language) => (isPayloadType(language) ? language.id : language)) ?? [],
  ...handlePrice(price, priceEnabled),
});

const convertCollectibleToEndpointCollectible = (collectible: Collectible): EndpointCollectible => {
  const {
    nature,
    urls,
    subitems,
    gallery: rawGallery,
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
    translations,
    scans: rawScans,
    createdAt,
    updatedAt,
    scansEnabled,
    updatedBy,
  } = collectible;
  const gallery = handleGallery(rawGallery);
  const scans = scansEnabled ? handleScans(rawScans) : undefined;

  return {
    ...convertCollectibleToEndpointCollectiblePreview(collectible),
    translations:
      translations?.map(({ language, title, description, pretitle, subtitle }) => ({
        language: isPayloadType(language) ? language.id : language,
        title,
        ...(isNotEmpty(pretitle) ? { pretitle } : {}),
        ...(isNotEmpty(subtitle) ? { subtitle } : {}),
        ...(isNotEmpty(description) ? { description } : {}),
      })) ?? [],
    ...(isImage(backgroundImage)
      ? { backgroundImage: convertImageToEndpointImage(backgroundImage) }
      : {}),
    nature: nature === "Physical" ? CollectibleNature.Physical : CollectibleNature.Digital,
    ...(gallery ? { gallery } : {}),
    ...(scans ? { scans } : {}),
    urls: urls?.map(({ url }) => ({ url, label: getDomainFromUrl(url) })) ?? [],
    ...handleSize(size, sizeEnabled),
    ...(weightEnabled && isDefined(weight) ? { weight: weight.amount } : {}),
    ...handlePageInfo(pageInfo, pageInfoEnabled),
    subitems: isPayloadArrayType(subitems)
      ? subitems.filter(isPublished).map(convertCollectibleToEndpointCollectiblePreview)
      : [],
    contents: handleContents(contents),
    ...handlePrice(price, priceEnabled),
    createdAt,
    updatedAt,
    ...(isPayloadType(updatedBy)
      ? { updatedBy: convertRecorderToEndpointRecorderPreview(updatedBy) }
      : {}),
    parentPages: convertSourceToEndpointSource({ collectibles: parentItems, folders }),
  };
};

const handlePrice = (
  price: Collectible["price"],
  enabled: Collectible["priceEnabled"]
): { price: NonNullable<EndpointCollectible["price"]> } | {} => {
  if (!price || !enabled || !isPayloadType(price.currency)) return {};
  return {
    price: { amount: price.amount, currency: price.currency.id },
  };
};

const handleSize = (
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

const handlePageInfo = (
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

const handleGallery = (gallery: Collectible["gallery"]): EndpointCollectible["gallery"] => {
  const thumbnail = gallery?.[0]?.image;
  if (!thumbnail || !isImage(thumbnail)) return;
  return { count: gallery.length, thumbnail: convertImageToEndpointImage(thumbnail) };
};

const handleScans = (scans: Collectible["scans"]): EndpointCollectible["scans"] => {
  if (!scans) return;

  const totalCount =
    Object.keys(scans?.cover ?? {}).length +
    Object.keys(scans?.dustjacket ?? {}).length +
    Object.keys(scans?.obi ?? {}).length +
    (scans.pages ?? []).length;

  const result =
    scans?.pages?.flatMap(({ image, page }) => {
      if (!isScan(image)) return [];
      return { image, index: page.toString() };
    }) ?? [];

  if (isScan(scans?.cover?.front)) {
    result.push({ image: scans.cover.front, index: "cover-front" });
  }

  if (isScan(scans?.dustjacket?.front)) {
    result.push({ image: scans.dustjacket.front, index: "dustjacket-front" });
  }

  const thumbnail = result?.[0];
  if (!thumbnail) return;

  return {
    count: totalCount,
    thumbnail: convertScanToEndpointScanImage(thumbnail.image, thumbnail.index),
  };
};

const handleContents = (contents: Collectible["contents"]): EndpointCollectible["contents"] => {
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
        case Collections.GenericContents:
          return isPayloadType(content.value)
            ? {
                relationTo: Collections.GenericContents,
                value: {
                  translations: content.value.translations.map(({ language, name }) => ({
                    language: isPayloadType(language) ? language.id : language,
                    name,
                  })),
                },
              }
            : undefined;

        case Collections.Pages:
          return isPayloadType(content.value) && isPublished(content.value)
            ? {
                relationTo: Collections.Pages,
                value: convertPageToEndpointPagePreview(content.value),
              }
            : undefined;

        case Collections.Audios:
          return isAudio(content.value)
            ? { relationTo: Collections.Audios, value: convertAudioToEndpointAudio(content.value) }
            : undefined;

        case Collections.Videos:
          return isVideo(content.value)
            ? { relationTo: Collections.Videos, value: convertVideoToEndpointVideo(content.value) }
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
