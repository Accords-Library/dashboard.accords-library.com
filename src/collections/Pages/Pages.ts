import { breakBlock } from "../../blocks/breakBlock";
import { sectionBlock } from "../../blocks/sectionBlock";
import { transcriptBlock } from "../../blocks/transcriptBlock";
import { QuickFilters, publishStatusFilters } from "../../components/QuickFilters";
import { attributesField } from "../../fields/attributesField/attributesField";
import { creditsField } from "../../fields/creditsField/creditsField";
import { imageField } from "../../fields/imageField/imageField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { createEditor } from "../../utils/editor";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { getBySlugEndpoint } from "./endpoints/getBySlugEndpoint";
import { Collections, CollectionGroups } from "../../shared/payload/constants";

const fields = {
  slug: "slug",
  thumbnail: "thumbnail",
  backgroundImage: "backgroundImage",
  translations: "translations",
  attributes: "attributes",
  sourceLanguage: "sourceLanguage",
  pretitle: "pretitle",
  title: "title",
  subtitle: "subtitle",
  summary: "summary",
  content: "content",
  credits: "credits",
  sourceUrls: "sourceUrls",
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
    defaultColumns: [fields.slug, fields.thumbnail, fields.backgroundImage, fields.translations],
    group: CollectionGroups.Collections,
    preview: ({ slug }) => `${process.env.PAYLOAD_PUBLIC_FRONTEND_BASE_URL}/en/pages/${slug}`,
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
    attributesField({ name: fields.attributes }),
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
            relations: true,
            inlines: true,
            alignment: true,
            blocks: [sectionBlock, transcriptBlock, breakBlock],
            links: true,
            lists: true,
          }),
        },
        creditsField({ name: fields.credits }),
        {
          name: fields.sourceUrls,
          label: "Source URLs",
          type: "text",
          hasMany: true,
          admin: {
            description:
              "If the content originates from an external source (e.g: fandom.com, an online interview...) you can add a link to the original page(s) here",
            width: "50%",
          },
        },
      ],
    }),
  ],
});
