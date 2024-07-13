import payload from "payload";
import { Collections } from "src/shared/payload/constants";
import { Language } from "src/types/collections";
import { CollectionEndpoint } from "src/types/payload";

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

    const languages: Language[] = (
      await payload.find({
        collection: Collections.Languages,
        sort: "name",
        pagination: false,
      })
    ).docs;

    res.status(200).json(languages);
  },
};
