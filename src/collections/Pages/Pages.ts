import { Where } from "payload/types";
import { breakBlock } from "../../blocks/breakBlock";
import { sectionBlock } from "../../blocks/sectionBlock";
import { transcriptBlock } from "../../blocks/transcriptBlock";
import { QuickFilters, publishStatusFilters } from "../../components/QuickFilters";
import { CollectionGroups, Collections } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { creditsField } from "../../fields/creditsField/creditsField";
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
import { getBySlugEndpoint } from "./endpoints/getBySlugEndpoint";

const fields = {
  slug: "slug",
  thumbnail: "thumbnail",
  backgroundImage: "backgroundImage",
  translations: "translations",
  tags: "tags",
  sourceLanguage: "sourceLanguage",
  pretitle: "pretitle",
  title: "title",
  subtitle: "subtitle",
  summary: "summary",
  content: "content",
  credits: "credits",
  collectibles: "collectibles",
  folders: "folders",
} as const satisfies Record<string, string>;

export const Pages = buildVersionedCollectionConfig({
  slug: Collections.Pages,
  labels: {
    singular: "Page",
    plural: "Pages",
  },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [
      fields.slug,
      fields.thumbnail,
      fields.backgroundImage,
      fields.tags,
      fields.translations,
      fields.folders,
    ],
    group: CollectionGroups.Collections,
    preview: ({ slug }) => `https://v3.accords-library.com/en/pages/${slug}`,
    components: {
      BeforeListTable: [
        () =>
          QuickFilters({
            slug: Collections.Pages,
            filterGroups: [publishStatusFilters],
          }),
      ],
    },
    hooks: {
      beforeDuplicate: beforeDuplicatePiping([
        beforeDuplicateUnpublish,
        beforeDuplicateAddCopyTo(fields.slug),
      ]),
    },
  },
  endpoints: [getBySlugEndpoint],
  fields: [
    slugField({ name: fields.slug }),
    rowField([
      imageField({
        name: fields.thumbnail,
        relationTo: Collections.Images,
      }),
      imageField({
        name: fields.backgroundImage,
        relationTo: Collections.Images,
        admin: {
          description:
            "The image used as background from the webpage.\
          If missing, the thumbnail will be used instead.",
        },
      }),
    ]),
    tagsField({ name: fields.tags }),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.title, hasSourceLanguage: true },
      required: true,
      minRows: 1,
      fields: [
        rowField([
          { name: fields.pretitle, type: "text" },
          { name: fields.title, type: "text", required: true },
          { name: fields.subtitle, type: "text" },
        ]),
        {
          name: fields.summary,
          type: "richText",
          editor: createEditor({ inlines: true, lists: true, links: true }),
        },
        {
          name: fields.content,
          type: "richText",
          required: true,
          admin: {
            description:
              "Looking for help? Read the Rich Text Editor guide here: https://accords-library.com/dev/rich-text",
          },
          editor: createEditor({
            images: true,
            inlines: true,
            alignment: true,
            blocks: [sectionBlock, transcriptBlock, breakBlock],
            links: true,
            lists: true,
          }),
        },
        creditsField({ name: fields.credits }),
      ],
    }),
    rowField([
      backPropagationField({
        name: fields.folders,
        relationTo: Collections.Folders,
        hasMany: true,
        where: ({ id }) => ({
          and: [
            { "files.value": { equals: id } },
            { "files.relationTo": { equals: Collections.Pages } },
          ] as Where[],
        }),
      }),
      backPropagationField({
        name: fields.collectibles,
        hasMany: true,
        relationTo: Collections.Collectibles,
        where: ({ id }) => ({
          and: [
            { "contents.content.value": { equals: id } },
            { "contents.content.relationTo": { equals: Collections.Pages } },
          ] as Where[],
        }),
      }),
    ]),
  ],
});
