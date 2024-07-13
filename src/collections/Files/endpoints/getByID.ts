import payload from "payload";
import { Collections } from "src/shared/payload/constants";
import { PayloadMedia, EndpointFilePreview, EndpointFile } from "src/shared/payload/endpoint-types";
import { CollectionEndpoint } from "src/types/payload";
import { isFile, isNotEmpty, isMediaThumbnail } from "src/utils/asserts";
import {
  convertAttributesToEndpointAttributes,
  getLanguageId,
  convertMediaThumbnailToEndpointPayloadImage,
  convertRTCToEndpointRTC,
  convertCreditsToEndpointCredits,
} from "src/utils/endpoints";
import { File } from "src/types/collections";

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
        collection: Collections.Files,
        id: req.params.id,
      });

      if (!isFile(result)) {
        return res.sendStatus(404);
      }

      return res.status(200).json(convertFileToEndpointFile(result));
    } catch {
      return res.sendStatus(404);
    }
  },
};

export const convertFileToEndpointFilePreview = ({
  url,
  attributes,
  translations,
  mimeType,
  filename,
  id,
  thumbnail,
  filesize,
}: File & PayloadMedia): EndpointFilePreview => ({
  id,
  url,
  filename,
  filesize,
  mimeType,
  attributes: convertAttributesToEndpointAttributes(attributes),
  translations:
    translations?.map(({ language, title, pretitle, subtitle }) => ({
      language: getLanguageId(language),
      ...(isNotEmpty(pretitle) ? { pretitle } : {}),
      title,
      ...(isNotEmpty(subtitle) ? { subtitle } : {}),
    })) ?? [],
  ...(isMediaThumbnail(thumbnail)
    ? { thumbnail: convertMediaThumbnailToEndpointPayloadImage(thumbnail) }
    : {}),
});

const convertFileToEndpointFile = (file: File & PayloadMedia): EndpointFile => {
  const { translations, createdAt, updatedAt, filesize, credits } = file;

  return {
    ...convertFileToEndpointFilePreview(file),
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
