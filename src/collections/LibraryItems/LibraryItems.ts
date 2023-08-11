import {
  CollectionGroups,
  Collections,
  KeysTypes,
  LibraryItemsTextualBindingTypes,
  LibraryItemsTextualPageOrders,
  LibraryItemsTypes,
} from "../../constants";
import { imageField } from "../../fields/imageField/imageField";
import { optionalGroupField } from "../../fields/optionalGroupField/optionalGroupField";
import { slugField } from "../../fields/slugField/slugField";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { LibraryItem } from "../../types/collections";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { RowLabel } from "./components/RowLabel";
import { getBySlug } from "./endpoints/getBySlug";

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
  scansObi: "obi",
  scansObiFront: "front",
  scansObiSpine: "spine",
  scansObiBack: "back",
  scansPages: "pages",
  scansPagesPage: "page",
  scansPagesImage: "image",
  contents: "contents",
  contentsContent: "content",
  contentsPageStart: "pageStart",
  contentsPageEnd: "pageEnd",
  contentsTimeStart: "timeStart",
  contentsTimeEnd: "timeEnd",
  contentsNote: "note",
} as const satisfies Record<string, string>;

export const LibraryItems = buildVersionedCollectionConfig(
  Collections.LibraryItems,
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
      group: CollectionGroups.Collections,
      hooks: {
        beforeDuplicate: beforeDuplicatePiping([
          beforeDuplicateUnpublish,
          beforeDuplicateAddCopyTo(fields.slug),
        ]),
      },
      preview: (doc) => `https://accords-library.com/library/${doc.slug}`,
    },
    endpoints: [getBySlug],
    fields: [
      {
        type: "row",
        fields: [
          slugField({ name: fields.slug, admin: { width: "50%" } }),
          imageField({
            name: fields.thumbnail,
            relationTo: Collections.LibraryItemsThumbnails,
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
                    relationTo: Collections.LibraryItemsThumbnails,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansCoverSpine,
                    relationTo: Collections.LibraryItemsThumbnails,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansCoverBack,
                    relationTo: Collections.LibraryItemsThumbnails,
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
            admin: {
              description:
                "The dust jacket of a book is the detachable outer cover with folded \
              flaps that hold it to the front and back book covers",
            },
            fields: [
              {
                type: "row",
                fields: [
                  imageField({
                    name: fields.scansDustjacketFront,
                    relationTo: Collections.LibraryItemsThumbnails,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansDustjacketSpine,
                    relationTo: Collections.LibraryItemsThumbnails,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansDustjacketBack,
                    relationTo: Collections.LibraryItemsThumbnails,
                    admin: { width: "33%" },
                  }),
                ],
              },
            ],
          }),
          optionalGroupField({
            name: fields.scansObi,
            label: "Obi",
            labels: { singular: "Obi Belt", plural: "Obi Belts" },
            admin: {
              description:
                "An obi is a strip of paper looped around a book or other product. \
                it typically add marketing claims, or other relevant information about the product.",
            },
            fields: [
              {
                type: "row",
                fields: [
                  imageField({
                    name: fields.scansObiFront,
                    relationTo: Collections.LibraryItemsThumbnails,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansObiSpine,
                    relationTo: Collections.LibraryItemsThumbnails,
                    admin: { width: "33%" },
                  }),
                  imageField({
                    name: fields.scansObiBack,
                    relationTo: Collections.LibraryItemsThumbnails,
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
              description:
                "Make sure the page number corresponds to the page number written on \
              the scan. You can use negative page numbers if necessary.",
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
                    relationTo: Collections.LibraryItemsThumbnails,
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
                relationTo: Collections.Currencies,
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
                relationTo: [Collections.Keys],
                filterOptions: { type: { equals: KeysTypes.LibraryTextual } },
                hasMany: true,
                admin: { allowCreate: false, width: "50%" },
              },
              {
                name: fields.textualLanguages,
                type: "relationship",
                relationTo: [Collections.Languages],
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
                relationTo: [Collections.Keys],
                filterOptions: { type: { equals: KeysTypes.LibraryAudio } },
                hasMany: true,
                admin: { allowCreate: false, width: "50%" },
              },
            ],
          },
        ],
      },
      {
        name: fields.contents,
        type: "array",
        fields: [
          {
            name: fields.contentsContent,
            type: "relationship",
            relationTo: Collections.Contents,
            required: true,
          },
          {
            type: "row",
            admin: {
              condition: ({ itemType }) => {
                return itemType === LibraryItemsTypes.Textual;
              },
            },
            fields: [
              {
                name: fields.contentsPageStart,
                type: "number",
              },
              { name: fields.contentsPageEnd, type: "number" },
            ],
          },
          {
            type: "row",
            admin: {
              condition: ({ itemType }) => {
                return itemType === LibraryItemsTypes.Audio || itemType === LibraryItemsTypes.Video;
              },
            },
            fields: [
              {
                name: fields.contentsTimeStart,
                type: "number",
              },
              { name: fields.contentsTimeEnd, type: "number" },
            ],
          },
          {
            name: fields.contentsNote,
            type: "textarea",
            admin: {
              condition: ({ itemType }) => {
                return itemType === LibraryItemsTypes.Game || itemType === LibraryItemsTypes.Other;
              },
            },
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
