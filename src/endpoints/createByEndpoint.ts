import payload from "payload";
import { CollectionConfig } from "payload/types";

export const createGetByEndpoint = <T, R>(
  collection: string,
  attribute: string,
  handler: (doc: T) => Promise<R>
): CollectionConfig["endpoints"][number] => ({
  path: `/${attribute}/:${attribute}`,
  method: "get",
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

    const result = await payload.find({
      collection,
      where: { [attribute]: { equals: req.params[attribute] } },
    });

    if (result.docs.length === 0) {
      return res.sendStatus(404);
    }

    res.status(200).send(await handler(result.docs[0]));
  },
});
