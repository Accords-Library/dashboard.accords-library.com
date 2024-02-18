import payload from "payload";
import { Collections } from "../../../constants";
import { Language } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";

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
        limit: 100,
        sort: "name"
      })
    ).docs;

    res.status(200).json(languages);
  },
};
