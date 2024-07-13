import { CollectionConfig } from "payload/types";
import { iconField } from "../../fields/iconField/iconField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { Collections, CollectionGroups } from "../../shared/payload/constants";

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
