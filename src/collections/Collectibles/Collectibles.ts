import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import { Where } from "payload/types";
import {
  CollectibleBindingTypes,
  CollectibleNature,
  CollectiblePageOrders,
  CollectionGroups,
  Collections,
  PageType,
} from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { componentField } from "../../fields/componentField/componentField";
import { imageField } from "../../fields/imageField/imageField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { tagsField } from "../../fields/tagsField/tagsField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { createEditor } from "../../utils/editor";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { RowLabel } from "./components/RowLabel";
import { getBySlugEndpoint } from "./endpoints/getBySlugEndpoint";

const fields = {
  status: "_status",
  slug: "slug",
  thumbnail: "thumbnail",
  backgroundImage: "backgroundImage",
  nature: "nature",
  tags: "tags",
  languages: "languages",

  translations: "translations",
  pretitle: "pretitle",
  title: "title",
  subtitle: "subtitle",
  description: "description",

  price: "price",
  priceAmount: "amount",
  priceCurrency: "currency",

  size: "size",
  sizeWidth: "width",
  sizeHeight: "height",
  sizeThickness: "thickness",

  weight: "weight",
  weightAmount: "amount",

  urls: "urls",
  urlsUrl: "url",

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

  gallery: "gallery",
  galleryImage: "image",

  releaseDate: "releaseDate",

  parentItems: "parentItems",
  subitems: "subitems",
  folders: "folders",

  contents: "contents",
  contentsContent: "content",

  pageInfo: "pageInfo",
  pageInfoBindingType: "bindingType",
  pageInfoPageCount: "pageCount",
  pageInfoPageOrder: "pageOrder",
} as const satisfies Record<string, string>;

export const Collectibles = buildVersionedCollectionConfig({
  slug: Collections.Collectibles,
  labels: {
    singular: "Collectible",
    plural: "Collectibles",
  },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.status],
    group: CollectionGroups.Collections,
    description:
      "A physical or digital item. This can be a book, a CD/DVD, a video game copy...\
     any product related to our Scope.\
     This can also include merchandises such as figurines, music boxes, posters, key chains...",
    preview: ({ slug }) => `https://v3.accords-library.com/en/collectibles/${slug}`,
    hooks: {
      beforeDuplicate: beforeDuplicatePiping([
        beforeDuplicateUnpublish,
        beforeDuplicateAddCopyTo(fields.slug),
      ]),
    },
  },
  endpoints: [getBySlugEndpoint],
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Overview",
          fields: [
            rowField([
              slugField({ name: fields.slug }),
              imageField({
                name: fields.thumbnail,
                relationTo: Collections.Images,
              }),
            ]),

            rowField([
              {
                name: fields.nature,
                type: "radio",
                required: true,
                defaultValue: CollectibleNature.Physical,
                options: Object.entries(CollectibleNature).map(([_, value]) => ({
                  label: value,
                  value: value,
                })),
              },
              {
                name: fields.languages,
                type: "relationship",
                relationTo: Collections.Languages,
                hasMany: true,
                admin: {
                  allowCreate: false,
                  description:
                    "Languages used by this collectible: language(s) available for a game,\
                    in a video, a book is written in... Leave empty if inapplicable",
                },
              },
            ]),

            tagsField({ name: fields.tags }),

            translatedFields({
              name: fields.translations,
              admin: { useAsTitle: fields.title },
              required: true,
              minRows: 1,
              fields: [
                rowField([
                  { name: fields.pretitle, type: "text" },
                  { name: fields.title, type: "text", required: true },
                  { name: fields.subtitle, type: "text" },
                ]),
                {
                  name: fields.description,
                  type: "richText",
                  editor: createEditor({ inlines: true, lists: true, links: true }),
                },
              ],
            }),
          ],
        },
        {
          label: "Images",
          fields: [
            imageField({
              name: fields.backgroundImage,
              relationTo: Collections.BackgroundImages,
              admin: {
                description:
                  "The image used as background from the webpage.\
                  If missing, the thumbnail will be used instead.",
              },
            }),
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
                  required: true,
                  relationTo: Collections.Images,
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
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansCoverSpine,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansCoverBack,
                        relationTo: Collections.Images,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansCoverInsideFront,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansCoverInsideBack,
                        relationTo: Collections.Images,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansCoverFlapFront,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansCoverFlapBack,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansCoverInsideFlapFront,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansCoverInsideFlapBack,
                        relationTo: Collections.Images,
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
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansDustjacketSpine,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansDustjacketBack,
                        relationTo: Collections.Images,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansDustjacketInsideFront,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideSpine,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideBack,
                        relationTo: Collections.Images,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansDustjacketFlapFront,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansDustjacketFlapBack,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideFlapFront,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideFlapBack,
                        relationTo: Collections.Images,
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
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansObiSpine,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansObiBack,
                        relationTo: Collections.Images,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansObiInsideFront,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansObiInsideSpine,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansObiInsideBack,
                        relationTo: Collections.Images,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansObiFlapFront,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansObiFlapBack,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansObiInsideFlapFront,
                        relationTo: Collections.Images,
                      }),
                      imageField({
                        name: fields.scansObiInsideFlapBack,
                        relationTo: Collections.Images,
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
                        relationTo: Collections.Images,
                        required: true,
                      }),
                    ]),
                  ],
                },
              ],
            }),
          ],
        },
        {
          label: "Details",
          fields: [
            {
              name: fields.urls,
              label: "URLs",
              type: "array",
              admin: {
                description: "Links to official websites where to get/buy the item.",
              },
              fields: [{ name: fields.urlsUrl, type: "text", required: true }],
            },
            {
              name: fields.releaseDate,
              type: "date",
              admin: {
                date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
              },
            },
            componentField({
              name: fields.price,
              admin: {
                description:
                  "Add pricing information about this collectible. Leave this unchecked if the collectible is not for sale or set the amount to 0 if it is free.",
              },
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
            componentField({
              name: fields.size,
              admin: {
                condition: ({ nature }) => nature === CollectibleNature.Physical,
                description: "Add physical size information about this collectible",
              },
              fields: [
                rowField([
                  {
                    name: fields.sizeWidth,
                    type: "number",
                    required: true,
                    admin: { step: 1, description: "in mm." },
                  },
                  {
                    name: fields.sizeHeight,
                    type: "number",
                    required: true,
                    admin: { step: 1, description: "in mm." },
                  },
                  {
                    name: fields.sizeThickness,
                    type: "number",
                    admin: { step: 1, description: "in mm." },
                  },
                ]),
              ],
            }),
            componentField({
              name: fields.weight,
              admin: {
                condition: ({ nature }) => nature === CollectibleNature.Physical,
                description: "Add physical weight information about this collectible",
              },
              fields: [
                {
                  name: fields.weightAmount,
                  type: "number",
                  required: true,
                  admin: { step: 1, description: "in g." },
                  min: 0,
                },
              ],
            }),
            componentField({
              name: fields.pageInfo,
              label: "Page information",
              admin: {
                description:
                  "If the collectible is book-like (has pages),\
                use this to add additional information about its format.",
              },
              fields: [
                {
                  name: fields.pageInfoPageCount,
                  type: "number",
                  required: true,
                  min: 1,
                },
                rowField([
                  {
                    name: fields.pageInfoBindingType,
                    type: "radio",
                    options: Object.entries(CollectibleBindingTypes).map(([_, value]) => ({
                      label: value,
                      value: value,
                    })),
                    admin: {
                      condition: ({ nature }) => nature === CollectibleNature.Physical,
                    },
                  },
                  {
                    name: fields.pageInfoPageOrder,
                    type: "radio",
                    options: Object.entries(CollectiblePageOrders).map(([_, value]) => ({
                      label: value,
                      value: value,
                    })),
                  },
                ]),
              ],
            }),
          ],
        },
        {
          label: "Contents",
          fields: [
            rowField([
              backPropagationField({
                name: fields.folders,
                relationTo: Collections.Folders,
                hasMany: true,
                where: ({ id }) => ({
                  and: [
                    { "files.value": { equals: id } },
                    { "files.relationTo": { equals: Collections.Collectibles } },
                  ] as Where[],
                }),
                admin: {
                  description: `You can go to the "Folders" collection to include this collectible in a folder.`,
                },
              }),
              backPropagationField({
                name: fields.parentItems,
                relationTo: Collections.Collectibles,
                hasMany: true,
                where: ({ id }) => ({ [fields.subitems]: { equals: id } }),
              }),
              {
                name: fields.subitems,
                type: "relationship",
                hasMany: true,
                relationTo: Collections.Collectibles,
              },
            ]),
            {
              name: fields.contents,
              type: "array",
              fields: [
                {
                  name: fields.contentsContent,
                  type: "relationship",
                  // TODO: Add audio and video files
                  relationTo: [Collections.Pages, Collections.GenericContents],
                  admin: {
                    allowCreate: false,
                  },
                  required: true,
                  filterOptions: ({ relationTo }) => {
                    switch (relationTo) {
                      case Collections.Pages:
                        return { type: { equals: PageType.Content } };

                      default:
                        return true;
                    }
                  },
                },
                {
                  name: "range",
                  type: "blocks",
                  maxRows: 1,
                  admin: { className: "no-label" },
                  blocks: [
                    {
                      slug: "pageRange",
                      labels: { singular: "Page Range", plural: "Page Ranges" },
                      fields: [
                        rowField([
                          {
                            name: "start",
                            type: "number",
                            required: true,
                            admin: {
                              description:
                                "Make sure the page range corresponds to the pages as written\
                                on the collectible. You can use negative page numbers if necessary.",
                            },
                          },
                          { name: "end", type: "number", required: true },
                        ]),
                      ],
                    },
                    {
                      slug: "timeRange",
                      labels: { singular: "Time Range", plural: "Time Ranges" },
                      fields: [
                        rowField([
                          {
                            name: "start",
                            type: "text",
                            required: true,
                            defaultValue: "00:00:00",
                            validate: (value) =>
                              /\d{2}:\d{2}:\d{2}/g.test(value)
                                ? true
                                : "The format should be hh:mm:ss\
                                (e.g: 01:23:45 for 1 hour, 23 minutes, and 45 seconds)",
                            admin: {
                              description:
                                "hh:mm:ss (e.g: 01:23:45 for 1 hour, 23 minutes, and 45 seconds)",
                            },
                          },
                          {
                            name: "end",
                            type: "text",
                            required: true,
                            defaultValue: "00:00:00",
                            validate: (value) =>
                              /\d{2}:\d{2}:\d{2}/g.test(value)
                                ? true
                                : "The format should be hh:mm:ss\
                                (e.g: 01:23:45 for 1 hour, 23 minutes, and 45 seconds)",
                            admin: {
                              description:
                                "hh:mm:ss (e.g: 01:23:45 for 1 hour, 23 minutes, and 45 seconds)",
                            },
                          },
                        ]),
                      ],
                    },
                    {
                      slug: "other",
                      labels: { singular: "Other", plural: "Others" },
                      fields: [
                        translatedFields({
                          admin: { className: "no-label" },
                          name: "translations",
                          fields: [
                            {
                              name: "note",
                              type: "richText",
                              required: true,
                              editor: createEditor({ inlines: true, lists: true, links: true }),
                            },
                          ],
                        }),
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
