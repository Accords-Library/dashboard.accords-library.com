import { CollectionConfig } from "payload/types";
import { CollectionGroup } from "../../constants";
import { slugField } from "../../fields/slugField/slugField";
import { imageField } from "../../fields/imageField/imageField";
import { collectionSlug } from "../../utils/string";
import { isDefined, isUndefined } from "../../utils/asserts";

const fields = {
  status: "status",
  slug: "slug",
  thumbnail: "thumbnail",
  pretitle: "pretitle",
  title: "title",
  subtitle: "subtitle",
  rootItem: "rootItem",
  primary: "primary",
  digital: "digital",
  downloadable: "downloadable",
  size: "size",
  width: "width",
  height: "height",
  thickness: "thickness",
} as const satisfies Record<string, string>;

const labels = {
  singular: "Library Item",
  plural: "Library Items",
} as const satisfies { singular: string; plural: string };

const validateSizeValue = (value?: number) => {
  if (isDefined(value) && value <= 0) return "This value must be greater than 0";
  return true;
};

const validateRequiredSizeValue = (value?: number) => {
  if (isUndefined(value)) return "This field is required.";
  if (value <= 0) return "This value must be greater than 0.";
  return true;
};

export const LibraryItems: CollectionConfig = {
  slug: collectionSlug(labels.plural),
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.thumbnail, fields.status],
    group: CollectionGroup.Collections,
    preview: (doc) => `https://accords-library.com/library/${doc.slug}`,
  },
  timestamps: true,
  versions: { drafts: true },
  fields: [
    {
      type: "row",
      fields: [
        slugField({ name: fields.slug, admin: { width: "50%" } }),
        imageField({ name: fields.thumbnail, admin: { width: "50%" } }),
      ],
    },
    {
      type: "row",
      fields: [
        { name: fields.pretitle, type: "text" },
        { name: fields.title, type: "text", required: true },
        { name: fields.subtitle, type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: fields.rootItem,
          type: "checkbox",
          required: true,
          defaultValue: true,
          admin: {
            description: "Only items that can be sold separetely should be root items.",
            width: "25%",
          },
        },
        {
          name: fields.primary,
          type: "checkbox",
          required: true,
          defaultValue: true,
          admin: {
            description:
              "A primary item is an official item that focuses primarly on one or more of our Categories.",
            width: "25%",
          },
        },
        {
          name: fields.digital,
          type: "checkbox",
          required: true,
          defaultValue: false,
          admin: {
            description:
              "The item is the digital version of another item, or the item is sold only digitally.",
            width: "25%",
          },
        },
        {
          name: fields.downloadable,
          type: "checkbox",
          required: true,
          defaultValue: false,
          admin: {
            description: "Are the scans available for download?",
            width: "25%",
          },
        },
      ],
    },
    {
      name: "size",
      type: "group",
      admin: { condition: (data) => !data.digital },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: fields.width,
              type: "number",
              validate: validateRequiredSizeValue,
              admin: { step: 1, width: "33%", description: "in mm." },
            },
            {
              name: fields.height,
              type: "number",
              validate: validateRequiredSizeValue,
              admin: { step: 1, width: "33%", description: "in mm." },
            },
            {
              name: fields.thickness,
              type: "number",
              validate: validateSizeValue,
              admin: { step: 1, width: "33%", description: "in mm." },
            },
          ],
        },
      ],
    },
  ],
};
