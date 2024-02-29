import { FieldBase, SingleRelationshipField } from "payload/dist/fields/config/types";
import { Collections } from "../../constants";

type KeysField = FieldBase & {
  admin?: SingleRelationshipField["admin"];
};

export const tagsField = ({ admin, ...props }: KeysField): SingleRelationshipField => ({
  ...props,
  admin: {
    allowCreate: false,
    ...admin,
  },
  type: "relationship",
  hasMany: true,
  relationTo: Collections.Tags,
});
