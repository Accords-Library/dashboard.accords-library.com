import { FieldBase, RelationshipField } from "payload/dist/fields/config/types";
import { Collections, FileTypes } from "../../constants";

type FileField = FieldBase & {
  relationTo: FileTypes;
  hasMany?: boolean;
  admin?: RelationshipField["admin"];
};

export const fileField = ({
  relationTo,
  hasMany = false,
  ...props
}: FileField): RelationshipField => ({
  ...props,
  type: "relationship",
  hasMany: hasMany,
  relationTo: Collections.Files,
  filterOptions: { type: { equals: getFileTypesKey(relationTo) } },
});

const getFileTypesKey = (fileType: FileTypes): string | undefined =>
  Object.entries(FileTypes).find(([, value]) => value === fileType)?.[0];
