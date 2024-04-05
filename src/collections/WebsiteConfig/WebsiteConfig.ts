import { GlobalConfig } from "payload/types";
import { mustBeAdmin } from "../../accesses/collections/mustBeAdmin";
import { CollectionGroups, Collections } from "../../constants";
import { imageField } from "../../fields/imageField/imageField";
import { rowField } from "../../fields/rowField/rowField";
import { getConfigEndpoint } from "./endpoints/getConfigEndpoint";

const fields = {
  homeFolders: "homeFolders",
  homeFoldersDarkThumbnail: "darkThumbnail",
  homeFoldersLightThumbnail: "lightThumbnail",
  homeFoldersFolder: "folder",
  eras: "eras",
  name: "name",
  timeline: "timeline",
  erasStartingYear: "startingYear",
  erasEndingYear: "endingYear",
  erasWording: "name",
  timelineBreaks: "breaks",
} as const satisfies Record<string, string>;

export const WebsiteConfig: GlobalConfig = {
  slug: Collections.WebsiteConfig,
  typescript: { interface: "WebsiteConfig" },
  admin: {
    group: CollectionGroups.Meta,
  },
  access: { update: mustBeAdmin, read: mustBeAdmin },
  endpoints: [getConfigEndpoint],
  fields: [
    {
      name: fields.homeFolders,
      admin: {
        description:
          "These will be the folders displayed on the home page, under the Library section.",
      },
      type: "array",
      fields: [
        rowField([
          imageField({ name: fields.homeFoldersLightThumbnail, relationTo: Collections.Images }),
          imageField({ name: fields.homeFoldersDarkThumbnail, relationTo: Collections.Images }),
          {
            name: fields.homeFoldersFolder,
            type: "relationship",
            relationTo: Collections.Folders,
            required: true,
          },
        ]),
      ],
    },
    {
      name: fields.timeline,
      type: "group",
      fields: [
        {
          name: fields.timelineBreaks,
          type: "number",
          hasMany: true,
        },
        {
          name: fields.eras,
          type: "array",
          fields: [
            {
              name: fields.erasWording,
              type: "relationship",
              relationTo: Collections.Wordings,
              required: true,
            },
            { name: fields.erasStartingYear, type: "number", required: true, min: 0 },
            { name: fields.erasEndingYear, type: "number", required: true, min: 0 },
          ],
        },
      ],
    },
  ],
};
