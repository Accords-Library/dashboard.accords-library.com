import payload from "payload";
import { Endpoint } from "payload/config";
import { Collections } from "../../../constants";

export const getSlugsEndpoint: Endpoint = {
  method: "get",
  path: "/slugs",
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

    const pages = await payload.find({
      collection: Collections.Pages,
      depth: 0,
      pagination: false,
      user: req.user,
      where: {
        _status: {
          equals: "published",
        },
      },
    });

    return res.status(200).send(pages.docs.map(({ slug }) => slug));
  },
};
