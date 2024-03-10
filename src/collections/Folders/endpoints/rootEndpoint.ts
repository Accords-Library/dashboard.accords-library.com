import payload from "payload";
import { Collections } from "../../../constants";
import { Folder } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isPayloadType } from "../../../utils/asserts";
import { convertFolderToPreview } from "./getBySlugEndpoint";

export const getRootFoldersEndpoint: CollectionEndpoint = {
  method: "get",
  path: "/root",
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

    const homeFolder = (
      await payload.find({
        collection: Collections.Folders,
        limit: 100,
        where: { slug: { equals: "home" } },
      })
    ).docs[0];

    if (!homeFolder) {
      res.status(404);
      return;
    }

    const folders = homeFolder.sections?.[0]?.subfolders;

    if (!folders) {
      res.status(404);
      return;
    }

    const result = folders.filter(isPayloadType).filter(isEmptyFolder).map(convertFolderToPreview);

    res.status(200).json(result);
  },
};

const isEmptyFolder = ({ sections, files }: Folder): boolean => {
  if (sections && sections.length > 0) return true;
  if (files && files.length > 0) return true;
  return false;
};
