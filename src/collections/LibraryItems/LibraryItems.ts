import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import {
  CollectionGroups,
  Collections,
  FileTypes,
  KeysTypes,
  LibraryItemsTextualBindingTypes,
  LibraryItemsTextualPageOrders,
  LibraryItemsTypes,
} from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { componentField } from "../../fields/componentField/componentField";
import { fileField } from "../../fields/fileField/fileField";
import { imageField } from "../../fields/imageField/imageField";
import { keysField } from "../../fields/keysField/keysField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { LibraryItem } from "../../types/collections";
import { isDefined } from "../../utils/asserts";
import { createEditor } from "../../utils/editor";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { RowLabel } from "./components/RowLabel";

const fields = {
  status: "_status",
  itemType: "itemType",
  language: "language",

  slug: "slug",
  thumbnail: "thumbnail",

  pretitle: "pretitle",
  title: "title",
  subtitle: "subtitle",

  translations: "translations",
  translationsDescription: "description",

  digital: "digital",

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

  textual: "textual",
  textualSubtype: "subtype",
  textualBindingType: "bindingType",
  textualPageCount: "pageCount",
  textualPageOrder: "pageOrder",

  audio: "audio",
  audioSubtype: "audioSubtype",
  audioTracks: "tracks",
  audioTracksFile: "file",
  audioTracksTitle: "title",

  video: "video",
  videoSubtype: "subtype",

  game: "game",
  gameDemo: "demo",
  gamePlatform: "platform",
  gameAudioLanguages: "audioLanguages",
  gameSubtitleLanguages: "subtitleLanguages",
  gameInterfacesLanguages: "interfacesLanguages",

  scans: "scans",
  scansScanners: "scanners",
  scansCleaners: "cleaners",
  scansTypesetters: "typesetters",

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

  scanArchiveFile: "archiveFile",

  contents: "contents",
  contentsContent: "content",
  contentsPageStart: "pageStart",
  contentsPageEnd: "pageEnd",
  contentsTimeStart: "timeStart",
  contentsTimeEnd: "timeEnd",
  contentsNote: "note",

  parentFolders: "parentFolders",
  parentItems: "parentItems",
  subitems: "subitems",
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
    defaultColumns: [fields.thumbnail, fields.slug, fields.status],
    group: CollectionGroups.Collections,
    hooks: {
      beforeDuplicate: beforeDuplicatePiping([
        beforeDuplicateUnpublish,
        beforeDuplicateAddCopyTo(fields.slug),
      ]),
    },
  },
  fields: [
    rowField([
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
        name: fields.language,
        type: "relationship",
        relationTo: Collections.Languages,
        required: true,
        admin: {
          allowCreate: false,
          description:
            "This item sole or primary language (most notably, the language used on the cover)",
        },
      },
    ]),
    {
      type: "tabs",
      admin: {
        condition: ({ itemType }) => isDefined(itemType),
      },
      tabs: [
        {
          label: "Overview",
          fields: [
            rowField([
              slugField({
                name: fields.slug,
              }),
              imageField({
                name: fields.thumbnail,
                relationTo: Collections.LibraryItemsThumbnails,
              }),
            ]),
            rowField([
              { name: fields.pretitle, type: "text" },
              { name: fields.title, type: "text", required: true },
              { name: fields.subtitle, type: "text" },
            ]),
            {
              name: fields.digital,
              type: "checkbox",
              required: true,
              defaultValue: false,
              admin: {
                description:
                  "The item is the digital version of another item, or the item is sold only digitally.",
              },
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
              labels: { singular: "Image", plural: "Images" },
              fields: [
                imageField({
                  name: fields.galleryImage,
                  relationTo: Collections.LibraryItemsGallery,
                }),
              ],
            },
            componentField({
              name: fields.scans,
              fields: [
                rowField([
                  {
                    name: fields.scansScanners,
                    type: "relationship",
                    relationTo: Collections.Recorders,
                    hasMany: true,
                    required: true,
                  },
                  {
                    name: fields.scansCleaners,
                    type: "relationship",
                    relationTo: Collections.Recorders,
                    hasMany: true,
                    required: true,
                  },
                  {
                    name: fields.scansTypesetters,
                    type: "relationship",
                    relationTo: Collections.Recorders,
                    hasMany: true,
                  },
                ]),
                componentField({
                  name: fields.scansCover,
                  fields: [
                    rowField([
                      imageField({
                        name: fields.scansCoverFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansCoverSpine,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansCoverBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansCoverInsideFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansCoverBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansCoverFlapFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansCoverFlapBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansCoverInsideFlapFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansCoverInsideFlapBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                    ]),
                  ],
                }),
                componentField({
                  name: fields.scansDustjacket,
                  label: "Dust Jacket",
                  admin: {
                    description:
                      "The dust jacket of a book is the detachable outer cover with folded \
                  flaps that hold it to the front and back book covers",
                  },
                  fields: [
                    rowField([
                      imageField({
                        name: fields.scansDustjacketFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansDustjacketSpine,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansDustjacketBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansDustjacketInsideFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideSpine,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansDustjacketFlapFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansDustjacketFlapBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideFlapFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideFlapBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                    ]),
                  ],
                }),
                componentField({
                  name: fields.scansObi,
                  label: "Obi",
                  admin: {
                    description:
                      "An obi is a strip of paper looped around a book or other product. \
                    it typically add marketing claims, or other relevant information about the product.",
                  },
                  fields: [
                    rowField([
                      imageField({
                        name: fields.scansObiFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansObiSpine,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansObiBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansObiInsideFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansObiInsideSpine,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansObiInsideBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansObiFlapFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansObiFlapBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansObiInsideFlapFront,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                      imageField({
                        name: fields.scansObiInsideFlapBack,
                        relationTo: Collections.LibraryItemsScans,
                      }),
                    ]),
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
                    rowField([
                      {
                        name: fields.scansPagesPage,
                        type: "number",
                        required: true,
                      },
                      imageField({
                        name: fields.scansPagesImage,
                        relationTo: Collections.LibraryItemsScans,
                        required: true,
                      }),
                    ]),
                  ],
                },
                fileField({
                  name: fields.scanArchiveFile,
                  relationTo: FileTypes.LibraryScans,
                }),
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
              label: false,
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
                    }),
                    {
                      name: fields.textualPageCount,
                      type: "number",
                      min: 1,
                    },
                  ],
                },
                rowField([
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
                      condition: (data: Partial<LibraryItem>) => !data.digital,
                      layout: "horizontal",
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
                    },
                  },
                ]),
              ],
            },
            {
              name: fields.audio,
              type: "group",
              label: false,
              admin: {
                condition: (data: Partial<LibraryItem>) =>
                  data.itemType === LibraryItemsTypes.Audio,
              },
              fields: [
                keysField({
                  name: fields.audioSubtype,
                  relationTo: KeysTypes.LibraryAudio,
                }),
                {
                  name: fields.audioTracks,
                  type: "array",
                  fields: [
                    rowField([
                      {
                        name: fields.audioTracksTitle,
                        type: "text",
                        required: true,
                      },
                      fileField({
                        name: fields.audioTracksFile,
                        relationTo: FileTypes.LibrarySoundtracks,
                        required: true,
                      }),
                    ]),
                  ],
                },
              ],
            },
            {
              name: fields.video,
              type: "group",
              label: false,
              admin: {
                condition: (data: Partial<LibraryItem>) =>
                  data.itemType === LibraryItemsTypes.Video,
              },
              fields: [
                keysField({
                  name: fields.videoSubtype,
                  relationTo: KeysTypes.LibraryVideo,
                }),
              ],
            },
            {
              name: fields.game,
              type: "group",
              label: false,
              admin: {
                condition: (data: Partial<LibraryItem>) => data.itemType === LibraryItemsTypes.Game,
              },
              fields: [
                rowField([
                  {
                    name: fields.gameDemo,
                    type: "checkbox",
                    admin: { description: "Is this item a demo for the game" },
                  },
                  keysField({
                    name: fields.gamePlatform,
                    relationTo: KeysTypes.GamePlatforms,
                  }),
                ]),
                rowField([
                  {
                    name: fields.gameAudioLanguages,
                    type: "relationship",
                    relationTo: Collections.Languages,
                    hasMany: true,
                  },
                  {
                    name: fields.gameSubtitleLanguages,
                    type: "relationship",
                    relationTo: Collections.Languages,
                    hasMany: true,
                  },
                  {
                    name: fields.gameInterfacesLanguages,
                    type: "relationship",
                    relationTo: Collections.Languages,
                    hasMany: true,
                  },
                ]),
              ],
            },
          ],
        },
        {
          label: "Details",
          fields: [
            rowField([
              {
                name: fields.releaseDate,
                type: "date",
                admin: {
                  date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
                },
              },
              keysField({
                name: fields.categories,
                relationTo: KeysTypes.Categories,
                hasMany: true,
              }),
            ]),
            componentField({
              name: fields.size,
              admin: {
                condition: (data: Partial<LibraryItem>) => !data.digital,
                description: "Add physical size information about the item",
              },
              fields: [
                rowField([
                  {
                    name: fields.width,
                    type: "number",
                    required: true,
                    admin: { step: 1, description: "in mm." },
                  },
                  {
                    name: fields.height,
                    type: "number",
                    required: true,
                    admin: { step: 1, description: "in mm." },
                  },
                  {
                    name: fields.thickness,
                    type: "number",
                    admin: { step: 1, description: "in mm." },
                  },
                ]),
              ],
            }),
            componentField({
              name: fields.price,
              admin: { description: "Add pricing information about the item" },
              fields: [
                rowField([
                  {
                    name: fields.priceAmount,
                    type: "number",
                    required: true,
                    min: 0,
                  },
                  {
                    name: fields.priceCurrency,
                    type: "relationship",
                    relationTo: Collections.Currencies,
                    required: true,
                    admin: { allowCreate: false },
                  },
                ]),
              ],
            }),
            translatedFields({
              name: fields.translations,
              label: "Descriptions",
              admin: { initCollapsed: true, useAsTitle: fields.translationsDescription },
              fields: [
                {
                  name: fields.translationsDescription,
                  required: true,
                  type: "richText",
                  editor: createEditor({ inlines: true, lists: true, links: true }),
                },
              ],
            }),
            {
              name: fields.urls,
              label: "URLs",
              type: "array",
              admin: {
                description: "Links to official websites where to get/buy the item.",
              },
              fields: [{ name: fields.urlsUrl, type: "text", required: true }],
            },
          ],
        },
        {
          label: "Contents",
          fields: [
            rowField([
              backPropagationField({
                name: fields.parentFolders,
                relationTo: Collections.LibraryFolders,
                hasMany: true,
                where: ({ id }) => ({ items: { equals: id } }),
                admin: {
                  description: `You can set the folders from the "Library Folders" collection`,
                },
              }),
              backPropagationField({
                name: fields.parentItems,
                relationTo: Collections.LibraryItems,
                hasMany: true,
                where: ({ id }) => ({ [fields.subitems]: { equals: id } }),
              }),
              {
                name: fields.subitems,
                type: "relationship",
                hasMany: true,
                relationTo: Collections.LibraryItems,
              },
            ]),
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
                    // TODO: Check why those condition doesn't work
                    condition: ({ itemType }: Partial<LibraryItem>) =>
                      itemType === LibraryItemsTypes.Textual,
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
                    condition: ({ itemType }: Partial<LibraryItem>) =>
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
                  type: "richText",
                  editor: createEditor({ inlines: true, lists: true, links: true }),
                  admin: {
                    condition: ({ itemType }: Partial<LibraryItem>) =>
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
