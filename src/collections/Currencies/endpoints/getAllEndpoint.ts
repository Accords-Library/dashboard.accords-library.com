import payload from "payload";
import { Collections } from "../../../constants";
import { Currency } from "../../../types/collections";
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

    const currencies: Currency[] = (
      await payload.find({
        collection: Collections.Currencies,
        limit: 100,
        sort: "id"
      })
    ).docs;

    res.status(200).header("Cache-Control", "max-age=60").json(currencies);
  },
};
