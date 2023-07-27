import {
  CollectionGroup,
  KeysTypes,
  LibraryItemsTextualBindingTypes,
  LibraryItemsTextualPageOrders,
  LibraryItemsTypes,
} from "../../constants";
import { slugField } from "../../fields/slugField/slugField";
import { imageField } from "../../fields/imageField/imageField";
import { LibraryItemThumbnails } from "../LibraryItemThumbnails/LibraryItemThumbnails";
import { LibraryItem } from "../../types/collections";
import { Keys } from "../Keys/Keys";
import { Languages } from "../Languages/Languages";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { Currencies } from "../Currencies/Currencies";
import { optionalGroupField } from "../../fields/optionalGroupField/optionalGroupField";
import { RowLabel } from "./components/RowLabel";
import { getSlug } from "./endpoints/getSlug";

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
  price: "price",
  priceAmount: "amount",
  priceCurrency: "currency",
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
  scans: "scans",
  scansCover: "cover",
  scansCoverFront: "front",
  scansCoverSpine: "spine",
  scansCoverBack: "back",
  scansDustjacket: "dustjacket",
  scansDustjacketFront: "front",
  scansDustjacketSpine: "spine",
  scansDustjacketBack: "back",
  scansObibelt: "obibelt",
  scansObibeltFront: "front",
  scansObibeltSpine: "spine",
  scansObibeltBack: "back",
  scansPages: "pages",
  scansPagesPage: "page",
  scansPagesImage: "image",
} as const satisfies Record<string, string>;

export const LibraryItems = buildVersionedCollectionConfig(
  {
    singular: "Library Item",
    plural: "Library Items",
  },
  ({ slug }) => ({
    defaultSort: fields.slug,
    admin: {
      useAsTitle: fields.slug,
      description:
        "A comprehensive list of all Yokoverse’s side materials (books, novellas, artbooks, \
         stage plays, manga, drama CDs, and comics).",
      defaultColumns: [fields.slug, fields.thumbnail, fields.status],
      group: CollectionGroup.Collections,
      hooks: {
        beforeDuplicate: beforeDuplicatePiping([
          beforeDuplicateUnpublish,
          beforeDuplicateAddCopyTo(fields.slug),
        ]),
      },
      preview: (doc) => `https://accords-library.com/library/${doc.slug}`,
    },
    endpoints: [getSlug(slug)],
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
      optionalGroupField({
        name: fields.scans,
        fields: [
          optionalGroupField({
            name: fields.scansCover,
            fields: [
              {
                type: "row",
                fields: [
                  imageField({
                    name: fields.scansCoverFront,
                    relationTo: LibraryItemThumbnails.slug,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansCoverSpine,
                    relationTo: LibraryItemThumbnails.slug,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansCoverBack,
                    relationTo: LibraryItemThumbnails.slug,
                    admin: { width: "33%" },
                  }),
                ],
              },
            ],
          }),
          optionalGroupField({
            name: fields.scansDustjacket,
            label: "Dust Jacket",
            labels: { singular: "Dust Jacket", plural: "Dust Jackets" },
            fields: [
              {
                type: "row",
                fields: [
                  imageField({
                    name: fields.scansDustjacketFront,
                    relationTo: LibraryItemThumbnails.slug,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansDustjacketSpine,
                    relationTo: LibraryItemThumbnails.slug,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansDustjacketBack,
                    relationTo: LibraryItemThumbnails.slug,
                    admin: { width: "33%" },
                  }),
                ],
              },
            ],
          }),
          optionalGroupField({
            name: fields.scansObibelt,
            label: "Obi Belt",
            labels: { singular: "Obi Belt", plural: "Obi Belts" },
            fields: [
              {
                type: "row",
                fields: [
                  imageField({
                    name: fields.scansObibeltFront,
                    relationTo: LibraryItemThumbnails.slug,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansObibeltSpine,
                    relationTo: LibraryItemThumbnails.slug,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansObibeltBack,
                    relationTo: LibraryItemThumbnails.slug,
                    admin: { width: "33%" },
                  }),
                ],
              },
            ],
          }),
          {
            name: fields.scansPages,
            type: "array",
            admin: {
              initCollapsed: true,
              components: {
                RowLabel: ({ data }) => RowLabel(data),
              },
            },
            fields: [
              {
                type: "row",
                fields: [
                  {
                    name: fields.scansPagesPage,
                    type: "number",
                    required: true,
                    admin: { width: "33%" },
                  },
                  imageField({
                    name: fields.scansPagesImage,
                    relationTo: LibraryItemThumbnails.slug,
                    required: true,
                    admin: { width: "66%" },
                  }),
                ],
              },
            ],
          },
        ],
      }),
      optionalGroupField({
        name: fields.size,
        admin: { condition: (data) => !data.digital },
        fields: [
          {
            type: "row",
            fields: [
              {
                name: fields.width,
                type: "number",
                required: true,
                admin: { step: 1, width: "33%", description: "in mm." },
              },
              {
                name: fields.height,
                type: "number",
                required: true,
                admin: { step: 1, width: "33%", description: "in mm." },
              },
              {
                name: fields.thickness,
                type: "number",
                admin: { step: 1, width: "33%", description: "in mm." },
              },
            ],
          },
        ],
      }),
      optionalGroupField({
        name: fields.price,
        admin: { className: "group-array" },
        fields: [
          {
            type: "row",
            fields: [
              {
                name: fields.priceAmount,
                type: "number",
                required: true,
                min: 0,
                admin: { width: "50%" },
              },
              {
                name: fields.priceCurrency,
                type: "relationship",
                relationTo: Currencies.slug,
                required: true,
                admin: { allowCreate: false, width: "50%" },
              },
            ],
          },
        ],
      }),
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
