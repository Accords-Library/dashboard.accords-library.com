import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointCollectibleGallery } from "../../../sdk";
import { isNotEmpty, isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import { convertSourceToEndpointSource } from "../../../utils/endpoints";
import { convertImageToEndpointImage } from "../../Images/endpoints/getByID";

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
      ...(isValidPayloadImage(thumbnail)
        ? { thumbnail: convertImageToEndpointImage(thumbnail) }
        : {}),
      images:
        gallery?.flatMap(({ image }) =>
          isValidPayloadImage(image) ? convertImageToEndpointImage(image) : []
        ) ?? [],
      parentPages: convertSourceToEndpointSource({ collectibles: [collectible] }),
    };
  },
});
