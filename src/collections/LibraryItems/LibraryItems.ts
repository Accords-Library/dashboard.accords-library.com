import {
  CollectionGroup,
  KeysTypes,
  LibraryItemsTextualBindingTypes,
  LibraryItemsTextualPageOrders,
  LibraryItemsTypes,
} from "../../constants";
import { slugField } from "../../fields/slugField/slugField";
import { imageField } from "../../fields/imageField/imageField";
import { isDefined, isUndefined } from "../../utils/asserts";
import { LibraryItemThumbnails } from "../LibraryItemThumbnails/LibraryItemThumbnails";
import { LibraryItem } from "../../types/collections";
import { Keys } from "../Keys/Keys";
import { Languages } from "../Languages";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";

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
  releaseDate: "releaseDate",
  itemType: "itemType",
  textual: "textual",
  textualSubtype: "subtype",
  textualBindingType: "bindingType",
  textualPageCount: "pageCount",
  textualPageOrder: "pageOrder",
  textualLanguages: "languages",
  audio: "audio",
  audioSubtype: "audioSubtype",
} as const satisfies Record<string, string>;

const validateSizeValue = (value?: number) => {
  if (isDefined(value) && value <= 0) return "This value must be greater than 0";
  return true;
};

const validateRequiredSizeValue = (value?: number) => {
  if (isUndefined(value)) return "This field is required.";
  if (value <= 0) return "This value must be greater than 0.";
  return true;
};

export const LibraryItems = buildVersionedCollectionConfig(
  {
    singular: "Library Item",
    plural: "Library Items",
  },
  () => ({
    defaultSort: fields.slug,
    admin: {
      useAsTitle: fields.slug,
      description:
        "A comprehensive list of all Yokoverse’s side materials (books, novellas, artbooks, \
stage plays, manga, drama CDs, and comics).",
      defaultColumns: [fields.slug, fields.thumbnail, fields.status],
      group: CollectionGroup.Collections,
      preview: (doc) => `https://accords-library.com/library/${doc.slug}`,
    },
    fields: [
      {
        type: "row",
        fields: [
          slugField({ name: fields.slug, admin: { width: "50%" } }),
          imageField({
            name: fields.thumbnail,
            relationTo: LibraryItemThumbnails.slug,
            admin: { width: "50%" },
          }),
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
      {
        name: fields.itemType,
        type: "radio",
        options: Object.entries(LibraryItemsTypes).map(([value, label]) => ({ label, value })),
        admin: {
          layout: "horizontal",
        },
      },
      {
        name: fields.textual,
        type: "group",
        admin: {
          condition: (data: Partial<LibraryItem>) => data.itemType === LibraryItemsTypes.Textual,
        },
        fields: [
          {
            type: "row",
            fields: [
              {
                name: fields.textualSubtype,
                label: "Subtype",
                type: "relationship",
                relationTo: [Keys.slug],
                filterOptions: { type: { equals: KeysTypes.LibraryTextual } },
                hasMany: true,
                admin: { allowCreate: false, width: "50%" },
              },
              {
                name: fields.textualLanguages,
                type: "relationship",
                relationTo: [Languages.slug],
                hasMany: true,
                admin: { allowCreate: false, width: "50%" },
              },
            ],
          },
          {
            type: "row",
            fields: [
              { name: fields.textualPageCount, type: "number", min: 1, admin: { width: "33%" } },
              {
                name: fields.textualBindingType,
                label: "Binding Type",
                type: "radio",
                options: Object.entries(LibraryItemsTextualBindingTypes).map(([value, label]) => ({
                  label,
                  value,
                })),
                admin: {
                  layout: "horizontal",
                  width: "33%",
                },
              },
              {
                name: fields.textualPageOrder,
                label: "Page Order",
                type: "radio",
                options: Object.entries(LibraryItemsTextualPageOrders).map(([value, label]) => ({
                  label,
                  value,
                })),
                admin: {
                  layout: "horizontal",
                  width: "33%",
                },
              },
            ],
          },
        ],
      },
      {
        name: fields.audio,
        type: "group",
        admin: {
          condition: (data: Partial<LibraryItem>) => data.itemType === LibraryItemsTypes.Audio,
        },
        fields: [
          {
            type: "row",
            fields: [
              {
                name: fields.audioSubtype,
                label: "Subtype",
                type: "relationship",
                relationTo: [Keys.slug],
                filterOptions: { type: { equals: KeysTypes.LibraryAudio } },
                hasMany: true,
                admin: { allowCreate: false, width: "50%" },
              },
            ],
          },
        ],
      },
      {
        name: fields.releaseDate,
        type: "date",
        admin: {
          date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
          position: "sidebar",
        },
      },
    ],
  })
);
