import payload from "payload";
import { Collections } from "src/shared/payload/constants";
import { EndpointRecorderPreview, EndpointRecorder } from "src/shared/payload/endpoint-types";
import { Recorder } from "src/types/collections";
import { CollectionEndpoint } from "src/types/payload";
import { isPayloadType, isImage } from "src/utils/asserts";
import { convertImageToEndpointPayloadImage, convertRTCToEndpointRTC } from "src/utils/endpoints";

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
        collection: Collections.Recorders,
        id: req.params.id,
      });

      return res.status(200).json(convertRecorderToEndpointRecorder(result));
    } catch {
      return res.sendStatus(404);
    }
  },
};

export const convertRecorderToEndpointRecorderPreview = ({
  id,
  username,
  anonymize,
}: Recorder): EndpointRecorderPreview => ({
  id,
  username: anonymize ? `Recorder#${id.substring(0, 5)}` : username,
});

const convertRecorderToEndpointRecorder = (recorder: Recorder): EndpointRecorder => {
  const { languages, avatar, translations } = recorder;
  return {
    ...convertRecorderToEndpointRecorderPreview(recorder),
    languages:
      languages?.map((language) => (isPayloadType(language) ? language.id : language)) ?? [],
    ...(isImage(avatar) ? { avatar: convertImageToEndpointPayloadImage(avatar) } : {}),
    translations:
      translations?.map(({ language, biography }) => ({
        language: isPayloadType(language) ? language.id : language,
        biography: convertRTCToEndpointRTC(biography),
      })) ?? [],
  };
};
