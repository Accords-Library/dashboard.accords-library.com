import { CollectionConfig } from "payload/types";
import { CollectionGroups, Collections } from "../../constants";
import { iconField } from "../../fields/iconField/iconField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { getAllEndpoint } from "./endpoints/getAllEndpoint";

const fields = {
  slug: "slug",
  translations: "translations",
  translationsName: "name",
  icon: "icon",
};

export const TagsGroups: CollectionConfig = buildCollectionConfig({
  slug: Collections.TagsGroups,
  labels: { singular: "Tags Group", plural: "Tags Groups" },
  admin: {
    group: CollectionGroups.Meta,
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.translations],
  },
  endpoints: [getAllEndpoint],
  fields: [
    slugField({ name: fields.slug }),
    iconField({ name: fields.icon }),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsName },
      required: true,
      minRows: 1,
      fields: [{ name: fields.translationsName, type: "text", required: true }],
    }),
  ],
});
