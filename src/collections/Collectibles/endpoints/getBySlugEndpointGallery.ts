import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { Collections } from "../../../shared/payload/constants";
import { EndpointCollectibleGallery } from "../../../shared/payload/endpoint-types";
import { isImage, isNotEmpty, isPayloadType } from "../../../utils/asserts";
import { convertImageToEndpointPayloadImage } from "../../../utils/endpoints";
import { convertCollectibleToEndpointCollectiblePreview } from "./getBySlugEndpoint";

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
      backlinks: [
        {
          type: Collections.Collectibles,
          value: convertCollectibleToEndpointCollectiblePreview(collectible),
        },
      ],
    };
  },
});
