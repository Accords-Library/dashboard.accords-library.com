import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointRecorder } from "../../../sdk";
import { CollectionEndpoint } from "../../../types/payload";
import { isPayloadArrayType, isValidPayloadImage } from "../../../utils/asserts";
import { convertImageToEndpointImage } from "../../Images/endpoints/getByID";

export const getAllEndpoint: CollectionEndpoint = {
  method: "get",
  path: "/all",
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

    const recorders = (
      await payload.find({
        collection: Collections.Recorders,
        sort: "id",
        pagination: false,
      })
    ).docs;

    const result: EndpointRecorder[] = recorders.map(
      ({ anonymize, id, username, avatar, languages }) => ({
        id,
        username: anonymize ? `Recorder#${id.substring(0, 5)}` : username,
        ...(isValidPayloadImage(avatar) ? { avatar: convertImageToEndpointImage(avatar) } : {}),
        languages: isPayloadArrayType(languages) ? languages.map(({ id }) => id) : [],
      })
    );

    res.status(200).json(result);
  },
};
