import payload from "payload";
import { mustBeApi } from "../accesses/endpoints/mustBeApi";
import { Collections } from "../constants";
import { CollectionEndpoint } from "../types/payload";

export const createGetSlugsEndpoint = (collection: Collections): CollectionEndpoint => ({
  path: "/slugs",
  method: "get",
  handler: async (req, res) => {
    if (!mustBeApi(req)) {
      return res.status(403).send({
        errors: [
          {
            message: "You are not allowed to perform this action.",
          },
        ],
      });
    }

    let page = 1;
    let totalPage = 1;
    const slugs: string[] = [];

    while (page <= totalPage) {
      const entries = await payload.find({
        collection,
        page,
        user: req.user,
      });

      entries.docs.forEach(({ slug }: { slug: string }) => slugs.push(slug));

      totalPage = entries.totalPages;
      page++;
    }

    res.status(200).json(slugs);
  },
});
