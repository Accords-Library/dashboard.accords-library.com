import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointHomeFolder } from "../../../sdk";
import { Folder } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import { convertFolderToPreview } from "../../Folders/endpoints/getBySlugEndpoint";

export const getAllEndpoint: CollectionEndpoint = {
  method: "get",
  path: "/all",
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

    const homeFolders = await payload.findGlobal({
      slug: Collections.HomeFolders,
    });

    const result =
      homeFolders.folders?.flatMap<EndpointHomeFolder>(
        ({ folder, darkThumbnail, lightThumbnail }) => {
          if (!isPayloadType(folder)) return [];
          if (isEmptyFolder(folder)) return [];
          return [
            {
              ...(isValidPayloadImage(darkThumbnail) ? { darkThumbnail } : {}),
              ...(isValidPayloadImage(lightThumbnail) ? { lightThumbnail } : {}),
              ...convertFolderToPreview(folder),
            },
          ];
        }
      ) ?? [];

    res.status(200).json(result);
  },
};

const isEmptyFolder = ({ sections, files }: Folder): boolean =>
  (!files || files.length === 0) && (!sections || sections.length === 0);
