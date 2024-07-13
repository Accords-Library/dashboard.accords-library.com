import payload from "payload";
import { Collections } from "src/shared/payload/constants";
import {
  PayloadImage,
  EndpointImagePreview,
  EndpointImage,
} from "src/shared/payload/endpoint-types";
import { CollectionEndpoint } from "src/types/payload";
import { isImage, isNotEmpty, isPayloadImage } from "src/utils/asserts";
import {
  convertAttributesToEndpointAttributes,
  getLanguageId,
  convertSizesToPayloadImages,
  convertRTCToEndpointRTC,
  convertCreditsToEndpointCredits,
} from "src/utils/endpoints";
import { Image } from "src/types/collections";

export const getByID: CollectionEndpoint = {
  method: "get",
  path: "/id/:id",
  handler: async (req, res) => {
    if (!req.user) {
      return res.status(403).send({
        errors: [
          {
            message: "You are not allowed to perform this action.",
          },
        ],
      });
    }

    if (!req.params.id) {
      return res.status(400).send({ errors: [{ message: "Missing 'id' query params" }] });
    }

    try {
      const result = await payload.findByID({
        collection: Collections.Images,
        id: req.params.id,
      });

      if (!isImage(result)) {
        return res.sendStatus(404);
      }

      return res.status(200).json(convertImageToEndpointImage(result));
    } catch {
      return res.sendStatus(404);
    }
  },
};

export const convertImageToEndpointImagePreview = ({
  url,
  width,
  height,
  attributes,
  translations,
  mimeType,
  filename,
  filesize,
  id,
  sizes,
}: Image & PayloadImage): EndpointImagePreview => ({
  id,
  url,
  filename,
  mimeType,
  attributes: convertAttributesToEndpointAttributes(attributes),
  translations:
    translations?.map(({ language, title, pretitle, subtitle }) => ({
      language: getLanguageId(language),
      ...(isNotEmpty(pretitle) ? { pretitle } : {}),
      title,
      ...(isNotEmpty(subtitle) ? { subtitle } : {}),
    })) ?? [],
  width,
  height,
  sizes: convertSizesToPayloadImages(
    [
      sizes?.["200w"],
      sizes?.["320w"],
      sizes?.["480w"],
      sizes?.["800w"],
      sizes?.["1280w"],
      sizes?.["1920w"],
      sizes?.["2560w"],
      { url, width, height, filename, filesize, mimeType },
    ],
    [200, 320, 480, 800, 1280, 1920, 2560]
  ),
  ...(isPayloadImage(sizes?.og) ? { openGraph: sizes.og } : {}),
});

export const convertImageToEndpointImage = (image: Image & PayloadImage): EndpointImage => {
  const { translations, createdAt, updatedAt, filesize, credits } = image;
  return {
    ...convertImageToEndpointImagePreview(image),
    createdAt,
    filesize,
    updatedAt,
    translations:
      translations?.map(({ language, title, pretitle, subtitle, description }) => ({
        language: getLanguageId(language),
        ...(isNotEmpty(pretitle) ? { pretitle } : {}),
        title,
        ...(isNotEmpty(subtitle) ? { subtitle } : {}),
        ...(isNotEmpty(description) ? { description: convertRTCToEndpointRTC(description) } : {}),
      })) ?? [],
    credits: convertCreditsToEndpointCredits(credits),
  };
};
