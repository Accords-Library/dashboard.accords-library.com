import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointImage, PayloadImage } from "../../../sdk";
import { Image } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isNotEmpty, isValidPayloadImage } from "../../../utils/asserts";
import {
  convertCreditsToEndpointCredits,
  convertRTCToEndpointRTC,
  convertTagsEndpointTagsGroups,
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
  tags,
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
  tagGroups: convertTagsEndpointTagsGroups(tags),
  createdAt,
  filename,
  filesize,
  id,
  mimeType,
  updatedAt,
  translations:
    translations?.map(({ language, title, description }) => ({
      language: getLanguageId(language),
      title,
      ...(isNotEmpty(description) ? { description: convertRTCToEndpointRTC(description) } : {}),
    })) ?? [],
  credits: convertCreditsToEndpointCredits(credits),
});