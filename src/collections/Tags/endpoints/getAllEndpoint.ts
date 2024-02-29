import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointTag } from "../../../sdk";
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

    const tags = (
      await payload.find({
        collection: Collections.Tags,
        sort: "id",
        pagination: false,
      })
    ).docs;

    const result = tags.map<EndpointTag>(({ slug, translations, group }) => ({
      slug,
      translations:
        translations?.map(({ language, name }) => ({
          language: isPayloadType(language) ? language.id : language,
          name,
        })) ?? [],
      group: isPayloadType(group) ? group.slug : group,
    }));

    res.status(200).json(result);
  },
};
