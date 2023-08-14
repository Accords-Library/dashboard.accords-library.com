import { CollectionConfig } from "payload/types";
import { mustBeAdmin } from "../../accesses/mustBeAdmin";
import { CollectionGroups, Collections } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";

const fields = {
  uid: "uid",
  title: "title",
  subscribers: "subscribers",
  videos: "videos",
} as const satisfies Record<string, string>;

export const VideosChannels: CollectionConfig = buildCollectionConfig({
  slug: Collections.VideosChannels,
  labels: {
    singular: "Videos Channel",
    plural: "Videos Channels",
  },
  defaultSort: fields.title,
  admin: {
    useAsTitle: fields.title,
    defaultColumns: [fields.uid, fields.title, fields.subscribers, fields.videos],
    group: CollectionGroups.Media,
    disableDuplicate: true,
  },
  access: {
    create: mustBeAdmin,
    delete: mustBeAdmin,
  },
  endpoints: [importFromStrapi],
  timestamps: false,
  fields: [
    { name: fields.uid, type: "text", required: true, unique: true },
    {
      type: "row",
      fields: [
        { name: fields.title, type: "text", required: true },
        { name: fields.subscribers, type: "number" },
      ],
    },
  ],
});
