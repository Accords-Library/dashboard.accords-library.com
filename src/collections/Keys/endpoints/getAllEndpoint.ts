import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointKey } from "../../../sdk";
import { Key } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isPayloadType } from "../../../utils/asserts";

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

    const keys: Key[] = (
      await payload.find({
        collection: Collections.Keys,
        sort: "id",
        pagination: false,
      })
    ).docs;

    const result: EndpointKey[] = keys.map(({ translations, ...others }) => ({
      ...others,
      translations:
        translations?.map(({ language, name, short }) => ({
          language: isPayloadType(language) ? language.id : language,
          name,
          short: short ?? name,
        })) ?? [],
    }));

    res.status(200).json(result);
  },
};
