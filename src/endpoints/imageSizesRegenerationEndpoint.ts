import payload from "payload";
import { CollectionEndpoint } from "../types/payload";

export const createImageSizesRegenerationEndpoint = (
  collection: "images" | "scans" | "media-thumbnails"
): CollectionEndpoint => ({
  path: `/regenerate`,
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
      pagination: false,
    });

    for (const { id, filename } of result.docs) {
      console.log("Handling", id);

      if (!filename) {
        throw new Error("No filename!");
      }

      await payload.update({
        collection,
        id,
        filePath: `./uploads/${collection}/${filename}`,
        data: {},
      });
    }

    res.status(200).send({ message: `Regenerated sizes for ${result.docs.length} images!` });
  },
});
