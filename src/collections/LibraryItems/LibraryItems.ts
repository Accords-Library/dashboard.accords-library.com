import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import {
  CollectionGroups,
  Collections,
  KeysTypes,
  LibraryItemsTextualBindingTypes,
  LibraryItemsTextualPageOrders,
  LibraryItemsTypes,
} from "../../constants";
import { imageField } from "../../fields/imageField/imageField";
import { keysField } from "../../fields/keysField/keysField";
import { optionalGroupField } from "../../fields/optionalGroupField/optionalGroupField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { LibraryItem } from "../../types/collections";
import { isDefined } from "../../utils/asserts";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { RowLabel } from "./components/RowLabel";

const fields = {
  status: "_status",

  slug: "slug",
  thumbnail: "thumbnail",

  pretitle: "pretitle",
  title: "title",
  subtitle: "subtitle",

  translations: "translations",
  translationsDescription: "description",

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

  gallery: "gallery",
  galleryImage: "image",

  urls: "urls",
  urlsUrl: "url",

  categories: "categories",

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
  scansCoverFlapFront: "flapFront",
  scansCoverFront: "front",
  scansCoverSpine: "spine",
  scansCoverBack: "back",
  scansCoverFlapBack: "flapBack",
  scansCoverInsideFlapFront: "insideFlapFront",
  scansCoverInsideFront: "insideFront",
  scansCoverInsideBack: "insideBack",
  scansCoverInsideFlapBack: "insideFlapBack",

  scansDustjacket: "dustjacket",
  scansDustjacketFlapFront: "flapFront",
  scansDustjacketFront: "front",
  scansDustjacketSpine: "spine",
  scansDustjacketBack: "back",
  scansDustjacketFlapBack: "flapBack",
  scansDustjacketInsideFlapFront: "insideFlapFront",
  scansDustjacketInsideFront: "insideFront",
  scansDustjacketInsideSpine: "insideSpine",
  scansDustjacketInsideBack: "insideBack",
  scansDustjacketInsideFlapBack: "insideFlapBack",

  scansObi: "obi",
  scansObiFlapFront: "flapFront",
  scansObiFront: "front",
  scansObiSpine: "spine",
  scansObiBack: "back",
  scansObiFlapBack: "flapBack",
  scansObiInsideFlapFront: "insideFlapFront",
  scansObiInsideFront: "insideFront",
  scansObiInsideSpine: "insideSpine",
  scansObiInsideBack: "insideBack",
  scansObiInsideFlapBack: "insideFlapBack",

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

export const LibraryItems = buildVersionedCollectionConfig({
  slug: Collections.LibraryItems,
  labels: {
    singular: "Library Item",
    plural: "Library Items",
  },
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
  fields: [
    {
      name: fields.itemType,
      type: "radio",
      options: Object.entries(LibraryItemsTypes).map(([value, label]) => ({
        label,
        value,
      })),
      admin: {
        layout: "horizontal",
      },
    },
    {
      type: "tabs",
      admin: {
        condition: ({ itemType }) => isDefined(itemType),
      },
      tabs: [
        {
          label: "Overview",
          fields: [
            {
              type: "row",
              fields: [
                slugField({
                  name: fields.slug,
                  admin: { width: "50%" },
                }),
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
          ],
        },
        {
          label: "Images",
          fields: [
            {
              name: fields.gallery,
              type: "array",
              admin: {
                description:
                  "Additional images of the item (unboxing, on shelf, promotional images...)",
              },
              fields: [
                imageField({
                  name: fields.galleryImage,
                  relationTo: Collections.LibraryItemsGallery,
                }),
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
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                        imageField({
                          name: fields.scansCoverSpine,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                        imageField({
                          name: fields.scansCoverBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        imageField({
                          name: fields.scansCoverInsideFront,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "50%" },
                        }),
                        imageField({
                          name: fields.scansCoverBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "50%" },
                        }),
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        imageField({
                          name: fields.scansCoverFlapFront,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
                        }),
                        imageField({
                          name: fields.scansCoverFlapBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
                        }),
                        imageField({
                          name: fields.scansCoverInsideFlapFront,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
                        }),
                        imageField({
                          name: fields.scansCoverInsideFlapBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
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
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                        imageField({
                          name: fields.scansDustjacketSpine,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                        imageField({
                          name: fields.scansDustjacketBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        imageField({
                          name: fields.scansDustjacketInsideFront,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                        imageField({
                          name: fields.scansDustjacketInsideSpine,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                        imageField({
                          name: fields.scansDustjacketInsideBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        imageField({
                          name: fields.scansDustjacketFlapFront,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
                        }),
                        imageField({
                          name: fields.scansDustjacketFlapBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
                        }),
                        imageField({
                          name: fields.scansDustjacketInsideFlapFront,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
                        }),
                        imageField({
                          name: fields.scansDustjacketInsideFlapBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
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
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                        imageField({
                          name: fields.scansObiSpine,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                        imageField({
                          name: fields.scansObiBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        imageField({
                          name: fields.scansObiInsideFront,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                        imageField({
                          name: fields.scansObiInsideSpine,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                        imageField({
                          name: fields.scansObiInsideBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "33%" },
                        }),
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        imageField({
                          name: fields.scansObiFlapFront,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
                        }),
                        imageField({
                          name: fields.scansObiFlapBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
                        }),
                        imageField({
                          name: fields.scansObiInsideFlapFront,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
                        }),
                        imageField({
                          name: fields.scansObiInsideFlapBack,
                          relationTo: Collections.LibraryItemsScans,
                          admin: { width: "25%" },
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
                      RowLabel: ({ data }: RowLabelArgs) => RowLabel(data),
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
                          relationTo: Collections.LibraryItemsScans,
                          required: true,
                          admin: { width: "66%" },
                        }),
                      ],
                    },
                  ],
                },
              ],
            }),
          ],
        },
        {
          label: "Type",
          admin: { condition: () => false },
          fields: [
            {
              name: fields.textual,
              type: "group",
              admin: {
                condition: (data: Partial<LibraryItem>) =>
                  data.itemType === LibraryItemsTypes.Textual,
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    keysField({
                      name: fields.textualSubtype,
                      relationTo: KeysTypes.LibraryTextual,
                      hasMany: true,
                      admin: { allowCreate: false, width: "50%" },
                    }),
                    {
                      name: fields.textualLanguages,
                      type: "relationship",
                      relationTo: Collections.Languages,
                      hasMany: true,
                      admin: { allowCreate: false, width: "50%" },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: fields.textualPageCount,
                      type: "number",
                      min: 1,
                      admin: { width: "33%" },
                    },
                    {
                      name: fields.textualBindingType,
                      type: "radio",
                      options: Object.entries(LibraryItemsTextualBindingTypes).map(
                        ([value, label]) => ({
                          label,
                          value,
                        })
                      ),
                      admin: {
                        layout: "horizontal",
                        width: "33%",
                      },
                    },
                    {
                      name: fields.textualPageOrder,
                      type: "radio",
                      options: Object.entries(LibraryItemsTextualPageOrders).map(
                        ([value, label]) => ({
                          label,
                          value,
                        })
                      ),
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
                condition: (data: Partial<LibraryItem>) =>
                  data.itemType === LibraryItemsTypes.Audio,
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    keysField({
                      name: fields.audioSubtype,
                      relationTo: KeysTypes.LibraryAudio,
                      hasMany: true,
                      admin: { allowCreate: false, width: "50%" },
                    }),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Details",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: fields.releaseDate,
                  type: "date",
                  admin: {
                    date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
                    width: "50%",
                  },
                },
                keysField({
                  name: fields.categories,
                  relationTo: KeysTypes.Categories,
                  hasMany: true,
                  admin: { allowCreate: false, width: "50%" },
                }),
              ],
            },
            translatedFields({
              name: fields.translations,
              label: "Descriptions",
              admin: { initCollapsed: true },
              fields: [{ name: fields.translationsDescription, type: "textarea", required: true }],
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
              admin: { className: "group-array", width: "50%" },
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
              name: fields.urls,
              label: "URLs",
              type: "array",
              admin: {
                description: "Links to official websites where to get/buy the item.",
                width: "50%",
              },
              fields: [{ name: fields.urlsUrl, type: "text", required: true }],
            },
          ],
        },
        {
          label: "Contents",
          fields: [
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
                    condition: ({ itemType }) => itemType === LibraryItemsTypes.Textual,
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
                    condition: ({ itemType }) =>
                      itemType === LibraryItemsTypes.Audio || itemType === LibraryItemsTypes.Video,
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
                    condition: ({ itemType }) =>
                      itemType === LibraryItemsTypes.Game || itemType === LibraryItemsTypes.Other,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
