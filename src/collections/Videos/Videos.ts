import { CollectionConfig } from "payload/types";
import { mustBeAdmin } from "../../accesses/collections/mustBeAdmin";
import { CollectionGroups, Collections, VideoSources } from "../../constants";
import { rowField } from "../../fields/rowField/rowField";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";

const fields = {
  uid: "uid",
  gone: "gone",
  source: "source",
  liveChat: "liveChat",
  title: "title",
  description: "description",
  publishedDate: "publishedDate",
  views: "views",
  likes: "likes",
  channel: "channel",
} as const satisfies Record<string, string>;

export const Videos: CollectionConfig = buildCollectionConfig({
  slug: Collections.Videos,
  labels: {
    singular: "Video",
    plural: "Videos",
  },
  defaultSort: fields.uid,
  admin: {
    useAsTitle: fields.title,
    defaultColumns: [
      fields.uid,
      fields.title,
      fields.source,
      fields.gone,
      fields.liveChat,
      fields.publishedDate,
      fields.views,
      fields.likes,
      fields.channel,
    ],
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
    rowField([
      { name: fields.uid, type: "text", required: true, unique: true },
      {
        name: fields.gone,
        type: "checkbox",
        defaultValue: false,
        required: true,
        admin: {
          description:
            "Is the video no longer available (deleted, privatized, unlisted, blocked...)",
        },
      },
      {
        name: fields.source,
        type: "select",
        required: true,
        options: Object.entries(VideoSources).map(([_, value]) => ({
          label: value,
          value: value,
        })),
      },
    ]),
    { name: fields.title, type: "text", required: true },
    { name: fields.description, type: "textarea" },
    rowField([
      { name: fields.likes, type: "number" },
      { name: fields.views, type: "number" },
    ]),
    {
      name: fields.publishedDate,
      type: "date",
      admin: {
        date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
      },
      required: true,
    },
    {
      name: fields.channel,
      type: "relationship",
      relationTo: Collections.VideosChannels,
    },
  ],
});
