import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointImage, PayloadImage } from "../../../sdk";
import { Image } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isNotEmpty, isValidPayloadImage } from "../../../utils/asserts";
import {
  convertAttributesToEndpointAttributes,
  convertCreditsToEndpointCredits,
  convertRTCToEndpointRTC,
  getLanguageId,
} from "../../../utils/endpoints";

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

      if (!isValidPayloadImage(result)) {
        return res.sendStatus(404);
      }

      return res.status(200).json(convertImageToEndpointImage(result));
    } catch {
      return res.sendStatus(404);
    }
  },
};

export const convertImageToEndpointImage = ({
  url,
  width,
  height,
  attributes,
  translations,
  mimeType,
  createdAt,
  updatedAt,
  filename,
  filesize,
  id,
  credits,
}: Image & PayloadImage): EndpointImage => ({
  url,
  width,
  height,
  attributes: convertAttributesToEndpointAttributes(attributes),
  createdAt,
  filename,
  filesize,
  id,
  mimeType,
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
});
