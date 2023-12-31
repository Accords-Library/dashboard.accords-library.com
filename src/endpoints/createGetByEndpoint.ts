import payload, { GeneratedTypes } from "payload";
import { Collections } from "../constants";
import { CollectionEndpoint } from "../types/payload";

export const createGetByEndpoint = <C extends Collections, R>(
  collection: C,
  attribute: string,
  handler: (doc: GeneratedTypes["collections"][C]) => Promise<R> | R
): CollectionEndpoint => ({
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

    if (!result.docs[0]) {
      return res.sendStatus(404);
    }

    res.status(200).send(await handler(result.docs[0]));
  },
});
