import { FieldBase, RelationshipField } from "payload/dist/fields/config/types";
import { Collections, KeysTypes } from "../../constants";

type KeysField = FieldBase & {
  relationTo: KeysTypes;
  hasMany?: boolean;
  admin?: RelationshipField["admin"];
};

export const keysField = ({
  relationTo,
  hasMany = false,
  ...props
}: KeysField): RelationshipField => ({
  ...props,
  type: "relationship",
  hasMany: hasMany,
  relationTo: Collections.Keys,
  filterOptions: { type: { equals: getKeysTypesKey(relationTo) } },
});

const getKeysTypesKey = (keyType: KeysTypes): string | undefined =>
  Object.entries(KeysTypes).find(([, value]) => value === keyType)?.[0];
