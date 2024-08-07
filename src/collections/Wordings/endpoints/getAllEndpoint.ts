import payload from "payload";
import { CollectionEndpoint } from "../../../types/payload";
import { isPayloadType } from "../../../utils/asserts";
import { Collections } from "../../../shared/payload/constants";
import { EndpointWording } from "../../../shared/payload/endpoint-types";

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

    const wordings = (
      await payload.find({
        collection: Collections.Wordings,
        sort: "id",
        pagination: false,
      })
    ).docs;

    const result: EndpointWording[] = wordings.map(({ translations, name }) => ({
      name,
      translations:
        translations?.map(({ language, name }) => ({
          language: isPayloadType(language) ? language.id : language,
          name,
        })) ?? [],
    }));

    res.status(200).json(result);
  },
};
