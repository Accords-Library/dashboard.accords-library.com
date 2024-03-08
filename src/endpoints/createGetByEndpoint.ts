import payload, { GeneratedTypes } from "payload";
import { CollectionEndpoint } from "../types/payload";

export const createGetByEndpoint = <C extends keyof GeneratedTypes["collections"], R>(
  collection: C,
  attribute: string,
  handler: (doc: GeneratedTypes["collections"][C]) => Promise<R> | R,
  depth?: number,
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
      depth,
      where: { [attribute]: { equals: req.params[attribute] } },
    });

    if (!result.docs[0]) {
      return res.sendStatus(404);
    }

    res.status(200).send(await handler(result.docs[0]));
  },
});
