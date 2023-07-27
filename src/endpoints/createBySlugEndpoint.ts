import payload from "payload";
import { CollectionConfig } from "payload/types";

export const createBySlugEndpoint = <T>(
  collection: string,
  handler: (doc: T) => unknown
): CollectionConfig["endpoints"][number] => ({
  path: "/slug/:slug",
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
      where: { slug: { equals: req.params.slug } },
    });

    if (result.docs.length === 0) {
      return res.sendStatus(404);
    }

    res.status(200).send(handler(result.docs[0]));
  },
});
