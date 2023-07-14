import { CollectionConfig } from "payload/types";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  alt: "alt",
} as const satisfies Record<string, string>;

const labels = {
  singular: "Image",
  plural: "Images",
} as const satisfies { singular: string; plural: string };

export const Images: CollectionConfig = {
  slug: labels.plural,
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.filename,
  admin: {
    useAsTitle: fields.filename,
    group: "Media",
  },

  upload: {
    staticDir: `../uploads/${labels.plural}`,
    mimeTypes: ["image/*"],
  },

  fields: [
    {
      name: fields.alt,
      label: "Alt Text",
      type: "text",
    },
  ],
};
