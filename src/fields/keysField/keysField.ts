import { FieldBase, SingleRelationshipField } from "payload/dist/fields/config/types";
import { Collections, KeysTypes } from "../../constants";

type KeysField = FieldBase & {
  relationTo: KeysTypes;
  hasMany?: boolean;
  admin?: SingleRelationshipField["admin"];
};

export const keysField = ({
  relationTo,
  hasMany = false,
  admin,
  ...props
}: KeysField): SingleRelationshipField => ({
  ...props,
  admin: {
    allowCreate: false,
    ...admin,
  },
  type: "relationship",
  hasMany: hasMany,
  relationTo: Collections.Keys,
  filterOptions: { type: { equals: getKeysTypesKey(relationTo) } },
});

const getKeysTypesKey = (keyType: KeysTypes): string | undefined =>
  Object.entries(KeysTypes).find(([, value]) => value === keyType)?.[0];
