import { createGetByEndpoint } from "src/endpoints/createGetByEndpoint";
import { Collections } from "src/shared/payload/constants";
import { EndpointCollectibleGallery } from "src/shared/payload/endpoint-types";
import { isPayloadType, isNotEmpty, isImage } from "src/utils/asserts";
import {
  convertImageToEndpointPayloadImage,
  convertSourceToEndpointSource,
} from "src/utils/endpoints";

export const getBySlugEndpointGallery = createGetByEndpoint({
  collection: Collections.Collectibles,
  attribute: "slug",
  suffix: "/gallery",
  depth: 3,
  handler: (collectible): EndpointCollectibleGallery => {
    const { slug, thumbnail, translations, gallery } = collectible;
    return {
      slug,
      translations:
        translations?.map(({ language, title, description, pretitle, subtitle }) => ({
          language: isPayloadType(language) ? language.id : language,
          title,
          ...(isNotEmpty(pretitle) ? { pretitle } : {}),
          ...(isNotEmpty(subtitle) ? { subtitle } : {}),
          ...(isNotEmpty(description) ? { description } : {}),
        })) ?? [],
      ...(isImage(thumbnail) ? { thumbnail: convertImageToEndpointPayloadImage(thumbnail) } : {}),
      images:
        gallery?.flatMap(({ image }) =>
          isImage(image) ? convertImageToEndpointPayloadImage(image) : []
        ) ?? [],
      parentPages: convertSourceToEndpointSource({ collectibles: [collectible] }),
    };
  },
});
