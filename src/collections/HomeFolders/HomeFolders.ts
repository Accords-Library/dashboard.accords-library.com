import { GlobalConfig } from "payload/types";
import { mustBeAdmin } from "../../accesses/collections/mustBeAdmin";
import { CollectionGroups, Collections } from "../../constants";
import { imageField } from "../../fields/imageField/imageField";
import { rowField } from "../../fields/rowField/rowField";
import { getAllEndpoint } from "./endpoints/getAllEndpoint";

const fields = {
  folders: "folders",
  darkThumbnail: "darkThumbnail",
  lightThumbnail: "lightThumbnail",
  folder: "folder",
  icon: "icon",
} as const satisfies Record<string, string>;

export const HomeFolders: GlobalConfig = {
  slug: Collections.HomeFolders,
  typescript: { interface: "HomeFolder" },
  admin: {
    group: CollectionGroups.Meta,
  },
  access: { update: mustBeAdmin },
  endpoints: [getAllEndpoint],
  fields: [
    {
      name: fields.folders,
      admin: {
        description:
          "These will be the folders displayed on the home page, under the Library section.",
      },
      type: "array",
      fields: [
        rowField([
          imageField({ name: fields.lightThumbnail, relationTo: Collections.Images }),
          imageField({ name: fields.darkThumbnail, relationTo: Collections.Images }),
          {
            name: fields.folder,
            type: "relationship",
            relationTo: Collections.Folders,
            required: true,
          },
        ]),
      ],
    },
  ],
};
