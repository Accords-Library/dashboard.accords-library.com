import { CollectionConfig } from "payload/types";
import { rowField } from "../../fields/rowField/rowField";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { Collections, CollectionGroups } from "../../shared/payload/constants";

const fields = {
  url: "url",
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
    defaultColumns: [fields.url, fields.title, fields.subscribers, fields.videos],
    group: CollectionGroups.Media,
    disableDuplicate: true,
  },
  timestamps: false,
  fields: [
    { name: fields.url, type: "text", required: true, unique: true },
    rowField([
      { name: fields.title, type: "text", required: true },
      { name: fields.subscribers, type: "number", required: true },
    ]),
  ],
});
