import payload from "payload";
import { CollectionBeforeChangeHook, CollectionConfig } from "payload/types";
import { CollectionGroups, Collections } from "../../constants";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const beforeChangeUpdateName: CollectionBeforeChangeHook = async ({ data }) => {
  let name = data.slug;

  const parentId = data[fields.group];

  if (parentId) {
    const parent = await payload.findByID({
      collection: Collections.TagsGroups,
      id: data[fields.group],
    });
    name = `${parent.slug} / ${data.slug}`;
  }

  return {
    ...data,
    [fields.name]: name,
  };
};

const fields = {
  slug: "slug",
  name: "name",
  translations: "translations",
  translationsName: "name",
  group: "group",
};

export const Tags: CollectionConfig = buildCollectionConfig({
  slug: Collections.Tags,
  labels: { singular: "Tag", plural: "Tags" },
  admin: {
    group: CollectionGroups.Meta,
    useAsTitle: fields.name,
    defaultColumns: [fields.slug, fields.group, fields.translations],
    hooks: {
      beforeDuplicate: beforeDuplicateAddCopyTo(fields.slug),
    },
  },
  hooks: { beforeChange: [beforeChangeUpdateName] },
  fields: [
    { name: fields.name, type: "text", admin: { readOnly: true, hidden: true } },
    slugField({ name: fields.slug }),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsName },
      required: true,
      minRows: 1,
      fields: [{ name: fields.translationsName, type: "text", required: true }],
    }),
    {
      name: fields.group,
      type: "relationship",
      required: true,
      relationTo: Collections.TagsGroups,
    },
  ],
});
