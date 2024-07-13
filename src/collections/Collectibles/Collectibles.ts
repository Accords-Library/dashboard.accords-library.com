import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import { Where } from "payload/types";
import { RowLabel } from "./components/RowLabel";
import { getBySlugEndpoint } from "./endpoints/getBySlugEndpoint";
import { getBySlugEndpointGallery } from "./endpoints/getBySlugEndpointGallery";
import { getBySlugEndpointGalleryImage } from "./endpoints/getBySlugEndpointGalleryImage";
import { getBySlugEndpointScanPage } from "./endpoints/getBySlugEndpointScanPage";
import { getBySlugEndpointScans } from "./endpoints/getBySlugEndpointScans";
import { attributesField } from "src/fields/attributesField/attributesField";
import { backPropagationField } from "src/fields/backPropagationField/backPropagationField";
import { componentField } from "src/fields/componentField/componentField";
import { creditsField } from "src/fields/creditsField/creditsField";
import { imageField } from "src/fields/imageField/imageField";
import { rowField } from "src/fields/rowField/rowField";
import { slugField } from "src/fields/slugField/slugField";
import { translatedFields } from "src/fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "src/hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "src/hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "src/hooks/beforeDuplicateUnpublish";
import {
  Collections,
  CollectionGroups,
  CollectibleNature,
  CollectibleBindingTypes,
  CollectiblePageOrders,
} from "src/shared/payload/constants";
import { Collectible } from "src/types/collections";
import { isPayloadType } from "src/utils/asserts";
import { createEditor } from "src/utils/editor";
import { buildVersionedCollectionConfig } from "src/utils/versionedCollectionConfig";

const fields = {
  status: "_status",
  slug: "slug",
  thumbnail: "thumbnail",
  backgroundImage: "backgroundImage",
  nature: "nature",
  attributes: "attributes",
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
  scansCredits: "credits",

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

  files: "files",

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
    preview: ({ slug }) =>
      `${process.env.PAYLOAD_PUBLIC_FRONTEND_BASE_URL}/en/collectibles/${slug}`,
    hooks: {
      beforeDuplicate: beforeDuplicatePiping([
        beforeDuplicateUnpublish,
        beforeDuplicateAddCopyTo(fields.slug),
      ]),
    },
  },
  endpoints: [
    getBySlugEndpoint,
    getBySlugEndpointScans,
    getBySlugEndpointScanPage,
    getBySlugEndpointGallery,
    getBySlugEndpointGalleryImage,
  ],
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
                options: Object.values(CollectibleNature).map((value) => ({
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

            attributesField({ name: fields.attributes }),

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
              relationTo: Collections.Images,
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
                  "Additional images of the collectible (e.g: unboxing, on shelf, promotional images...)",
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
                creditsField({ name: fields.scansCredits }),
                componentField({
                  name: fields.scansCover,
                  fields: [
                    rowField([
                      imageField({
                        name: fields.scansCoverFront,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansCoverSpine,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansCoverBack,
                        relationTo: Collections.Scans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansCoverInsideFront,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansCoverInsideBack,
                        relationTo: Collections.Scans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansCoverFlapFront,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansCoverFlapBack,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansCoverInsideFlapFront,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansCoverInsideFlapBack,
                        relationTo: Collections.Scans,
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
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansDustjacketSpine,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansDustjacketBack,
                        relationTo: Collections.Scans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansDustjacketInsideFront,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideSpine,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideBack,
                        relationTo: Collections.Scans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansDustjacketFlapFront,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansDustjacketFlapBack,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideFlapFront,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansDustjacketInsideFlapBack,
                        relationTo: Collections.Scans,
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
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansObiSpine,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansObiBack,
                        relationTo: Collections.Scans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansObiInsideFront,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansObiInsideSpine,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansObiInsideBack,
                        relationTo: Collections.Scans,
                      }),
                    ]),
                    rowField([
                      imageField({
                        name: fields.scansObiFlapFront,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansObiFlapBack,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansObiInsideFlapFront,
                        relationTo: Collections.Scans,
                      }),
                      imageField({
                        name: fields.scansObiInsideFlapBack,
                        relationTo: Collections.Scans,
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
                        relationTo: Collections.Scans,
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
                description: "Links to official websites where to get/buy the collectible.",
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
                    options: Object.values(CollectibleBindingTypes).map((value) => ({
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
                    options: Object.values(CollectiblePageOrders).map((value) => ({
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
              {
                name: fields.subitems,
                type: "relationship",
                hasMany: true,
                relationTo: Collections.Collectibles,
                admin: {
                  description:
                    "Collectibles that are part of this collectible (e.g: artbook in a collector's edition, booklet in a CD...)",
                },
              },
              {
                name: fields.files,
                type: "relationship",
                hasMany: true,
                relationTo: Collections.Files,
                admin: {
                  description: "Files related to the collectible (e.g: zip of all the scans)",
                },
              },
            ]),

            {
              name: fields.contents,
              type: "array",
              fields: [
                {
                  name: fields.contentsContent,
                  type: "relationship",
                  relationTo: [
                    Collections.Pages,
                    Collections.GenericContents,
                    Collections.Audios,
                    Collections.Videos,
                  ],
                  admin: {
                    allowCreate: false,
                  },
                  required: true,
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
                          name: "translations",
                          admin: { className: "no-label" },
                          required: true,
                          minRows: 1,
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
            ]),
          ],
        },
      ],
    },
  ],
  custom: {
    getBackPropagatedRelationships: ({ subitems, contents }: Collectible) => {
      const result: string[] = [];
      subitems?.forEach((subitem) => result.push(isPayloadType(subitem) ? subitem.id : subitem));
      contents?.forEach(({ content: { relationTo, value } }) => {
        if (relationTo === "pages") result.push(isPayloadType(value) ? value.id : value);
      });
      return result;
    },
  },
});
