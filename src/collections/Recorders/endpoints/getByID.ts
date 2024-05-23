import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointRecorder } from "../../../sdk";
import { Recorder } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isImage, isPayloadType } from "../../../utils/asserts";
import { convertRTCToEndpointRTC } from "../../../utils/endpoints";
import { convertImageToEndpointImage } from "../../Images/endpoints/getByID";

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

export const convertRecorderToEndpointRecorder = ({
  id,
  languages,
  username,
  avatar,
  anonymize,
  translations,
}: Recorder): EndpointRecorder => ({
  id,
  languages: languages?.map((language) => (isPayloadType(language) ? language.id : language)) ?? [],
  username: anonymize ? `Recorder#${id.substring(0, 5)}` : username,
  ...(isImage(avatar) ? { avatar: convertImageToEndpointImage(avatar) } : {}),
  translations:
    translations?.map(({ language, biography }) => ({
      language: isPayloadType(language) ? language.id : language,
      biography: convertRTCToEndpointRTC(biography),
    })) ?? [],
});
