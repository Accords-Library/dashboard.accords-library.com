import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointTagsGroup } from "../../../sdk";
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
        collection: Collections.TagsGroups,
        sort: "id",
        pagination: false,
      })
    ).docs;

    const result = tags.map<EndpointTagsGroup>(({ slug, translations, icon }) => ({
      slug,
      ...(icon ? { icon } : {}),
      translations:
        translations?.map(({ language, name }) => ({
          language: isPayloadType(language) ? language.id : language,
          name,
        })) ?? [],
      tags: [] // TODO: Add tags,
    }));

    res.status(200).json(result);
  },
};
