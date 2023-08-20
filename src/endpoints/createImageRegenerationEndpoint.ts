import payload from "payload";
import { mustBeAdmin } from "../accesses/endpoints/mustBeAdmin";
import { Collections } from "../constants";
import { CollectionEndpoint } from "../types/payload";
import { isDefined } from "../utils/asserts";

type Image = {
  filename: string;
  id: string | number;
};

export const createImageRegenerationEndpoint = (collection: Collections): CollectionEndpoint => ({
  method: "put",
  path: "/regenerate",
  handler: async (req, res) => {
    if (!mustBeAdmin(req)) {
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
    let count = 0;
    const errors: string[] = [];

    while (page <= totalPage) {
      const images = await payload.find({
        collection,
        page,
        user: req.user,
      });

      await Promise.all(
        images.docs.map(async (image: Image) => {
          try {
            await payload.update({
              collection,
              id: image.id,
              data: {},
              filePath: `uploads/${collection}/${image.filename}`,
              overwriteExistingFiles: true,
            });
          } catch (e) {
            console.warn(e);
            if (typeof e === "object" && isDefined(e) && "name" in e) {
              errors.push(`${e.name} with ${image.id}`);
            }
          }
        })
      );

      totalPage = images.totalPages;
      count += images.docs.length;
      page++;
    }

    res
      .status(200)
      .json({ message: `${count} entries have been regenerated successfully.`, errors });
  },
});
