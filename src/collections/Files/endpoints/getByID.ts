import payload from "payload";
import { File } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isFile, isMediaThumbnail, isNotEmpty } from "../../../utils/asserts";
import {
  convertAttributesToEndpointAttributes,
  convertCreditsToEndpointCredits,
  convertMediaThumbnailToEndpointPayloadImage,
  convertRTCToEndpointRTC,
  convertRelationshipsToEndpointRelations,
  getLanguageId,
} from "../../../utils/endpoints";
import { Collections } from "../../../shared/payload/constants";
import {
  PayloadMedia,
  EndpointFilePreview,
  EndpointFile,
} from "../../../shared/payload/endpoint-types";
import { findIncomingRelationships } from "payloadcms-relationships";

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

      return res.status(200).json(await convertFileToEndpointFile(result));
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

const convertFileToEndpointFile = async (file: File & PayloadMedia): Promise<EndpointFile> => {
  const { translations, createdAt, updatedAt, filesize, credits, id } = file;

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
    backlinks: convertRelationshipsToEndpointRelations(
      await findIncomingRelationships(Collections.Files, id)
    ),
  };
};
