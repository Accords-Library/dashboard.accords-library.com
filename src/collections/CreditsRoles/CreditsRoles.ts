import { CollectionConfig } from "payload/types";
import { iconField } from "src/fields/iconField/iconField";
import { slugField } from "src/fields/slugField/slugField";
import { translatedFields } from "src/fields/translatedFields/translatedFields";
import { Collections, CollectionGroups } from "src/shared/payload/constants";
import { buildCollectionConfig } from "src/utils/collectionConfig";

const fields = {
  slug: "slug",
  translations: "translations",
  translationsName: "name",
  icon: "icon",
};

export const CreditsRoles: CollectionConfig = buildCollectionConfig({
  slug: Collections.CreditsRole,
  labels: { singular: "Credits Role", plural: "Credits Roles" },
  admin: {
    group: CollectionGroups.Meta,
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.translations],
  },
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
