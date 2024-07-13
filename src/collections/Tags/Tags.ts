import { CollectionConfig } from "payload/types";
import { rowField } from "src/fields/rowField/rowField";
import { slugField } from "src/fields/slugField/slugField";
import { translatedFields } from "src/fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "src/hooks/beforeDuplicateAddCopyTo";
import { Collections, CollectionGroups } from "src/shared/payload/constants";
import { buildCollectionConfig } from "src/utils/collectionConfig";

const fields = {
  slug: "slug",
  translations: "translations",
  translationsName: "name",
  page: "page",
};

export const Tags: CollectionConfig = buildCollectionConfig({
  slug: Collections.Tags,
  labels: { singular: "Tag", plural: "Tags" },
  admin: {
    group: CollectionGroups.Meta,
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.translations],
    hooks: {
      beforeDuplicate: beforeDuplicateAddCopyTo(fields.slug),
    },
  },
  fields: [
    rowField([
      slugField({ name: fields.slug }),
      {
        name: fields.page,
        type: "relationship",
        relationTo: Collections.Pages,
        admin: {
          description:
            "You can declare a 'definition' page where more information of the tag will be presented.\
          The selected page will then feature a new section\
          where elements tagged with this tag will be listed.",
        },
      },
    ]),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsName },
      required: true,
      minRows: 1,
      fields: [{ name: fields.translationsName, type: "text", required: true }],
    }),
  ],
});
