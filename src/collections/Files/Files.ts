import { CollectionGroup, FileTypes } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  filename: "filename",
  type: "type",
} as const satisfies Record<string, string>;

export const Files = buildCollectionConfig(
  {
    singular: "File",
    plural: "Files",
  },
  () => ({
    defaultSort: fields.filename,
    admin: {
      useAsTitle: fields.filename,
      group: CollectionGroup.Media,
    },
    fields: [
      {
        name: fields.filename,
        required: true,
        type: "text",
      },
      {
        name: fields.type,
        type: "select",
        required: true,
        options: Object.entries(FileTypes).map(([value, label]) => ({ label, value })),
      },
    ],
  })
);
