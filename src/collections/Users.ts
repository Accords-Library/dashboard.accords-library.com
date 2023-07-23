import { CollectionGroup, UserRoles } from "../constants";
import { Recorders } from "./Recorders/Recorders";
import { buildCollectionConfig } from "../utils/collectionConfig";

const fields = {
  recorder: "recorder",
  name: "name",
  email: "email",
  role: "role",
} as const satisfies Record<string, string>;

export const Users = buildCollectionConfig(
  {
    singular: "User",
    plural: "Users",
  },
  () => ({
    auth: true,
    defaultSort: fields.recorder,
    admin: {
      useAsTitle: fields.name,
      defaultColumns: [fields.recorder, fields.name, fields.email, fields.role],
      group: CollectionGroup.Administration,
    },
    timestamps: false,
    fields: [
      {
        type: "row",
        fields: [
          {
            name: fields.recorder,
            type: "relationship",
            relationTo: Recorders.slug,
            admin: { width: "33%" },
          },
          {
            name: fields.name,
            type: "text",
            required: true,
            unique: true,
            admin: { width: "33%" },
          },
          {
            name: fields.role,
            required: true,
            defaultValue: [UserRoles.Recorder],
            type: "select",
            hasMany: true,
            options: Object.entries(UserRoles).map(([value, label]) => ({
              label,
              value,
            })),
            admin: { width: "33%" },
          },
        ],
      },
    ],
  })
);
