import payload from "payload";
import { Audio } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isAudio, isMediaThumbnail, isNotEmpty } from "../../../utils/asserts";
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
  EndpointAudioPreview,
  EndpointAudio,
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
        collection: Collections.Audios,
        id: req.params.id,
      });

      if (!isAudio(result)) {
        return res.sendStatus(404);
      }

      return res.status(200).json(await convertAudioToEndpointAudio(result));
    } catch {
      return res.sendStatus(404);
    }
  },
};

export const convertAudioToEndpointAudioPreview = ({
  url,
  attributes,
  translations,
  mimeType,
  filename,
  duration,
  id,
  thumbnail,
}: Audio & PayloadMedia): EndpointAudioPreview => ({
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
  duration,
  ...(isMediaThumbnail(thumbnail)
    ? { thumbnail: convertMediaThumbnailToEndpointPayloadImage(thumbnail) }
    : {}),
});

const convertAudioToEndpointAudio = async (audio: Audio & PayloadMedia): Promise<EndpointAudio> => {
  const { translations, createdAt, updatedAt, filesize, credits, id } = audio;
  return {
    ...convertAudioToEndpointAudioPreview(audio),
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
      await findIncomingRelationships(Collections.Audios, id)
    ),
  };
};
