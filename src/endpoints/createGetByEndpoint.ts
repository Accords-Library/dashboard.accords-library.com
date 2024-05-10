import payload, { GeneratedTypes } from "payload";
import { CollectionEndpoint } from "../types/payload";
import { isPublished } from "../utils/asserts";

interface Params<C extends keyof GeneratedTypes["collections"], R> {
  collection: C;
  attribute: string;
  handler: (doc: GeneratedTypes["collections"][C]) => Promise<R> | R;
  depth?: number;
  suffix?: string;
}

export const createGetByEndpoint = <C extends keyof GeneratedTypes["collections"], R>({
  attribute,
  collection,
  handler,
  depth,
  suffix = "",
}: Params<C, R>): CollectionEndpoint => ({
  path: `/${attribute}/:${attribute}${suffix}`,
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

    const doc = result.docs[0];

    if (!doc) {
      return res.sendStatus(404);
    }

    if ("_status" in doc && !isPublished(doc)) {
      return res.sendStatus(404);
    }

    res.status(200).send(await handler(doc));
  },
});
