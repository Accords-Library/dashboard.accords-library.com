import { CollectionConfig } from "payload/types";
import { CollectionGroup, FileTypes } from "../../constants";
import { collectionSlug } from "../../utils/string";

const fields = {
  filename: "filename",
  type: "type",
} as const satisfies Record<string, string>;

const labels = {
  singular: "File",
  plural: "Files",
} as const satisfies { singular: string; plural: string };

export const Files: CollectionConfig = {
  slug: collectionSlug(labels.plural),
  labels,
  typescript: { interface: labels.singular },
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
};
