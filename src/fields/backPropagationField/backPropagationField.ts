import payload from "payload";
import { FieldBase } from "payload/dist/fields/config/types";
import { RelationshipField, Where } from "payload/types";
import { isNotEmpty } from "../../utils/asserts";

type BackPropagationField = FieldBase & {
  where: (data: any) => Where;
  relationTo: string;
  hasMany?: boolean;
};
export const backPropagationField = ({
  admin,
  hooks: { beforeChange = [], afterRead = [], ...otherHooks } = {},
  where,
  hasMany = false,
  ...params
}: BackPropagationField): RelationshipField => ({
  ...params,
  type: "relationship",
  hasMany: hasMany,
  admin: { ...admin, readOnly: true },
  hooks: {
    ...otherHooks,
    beforeChange: [
      ...beforeChange,
      ({ siblingData }) => {
        delete siblingData[params.name];
      },
    ],
    afterRead: [
      ...afterRead,
      async ({ data }) => {
        if (isNotEmpty(data?.id)) {
          const result = await payload.find({
            collection: params.relationTo,
            where: where(data),
            limit: 100,
            depth: 0,
          });
          if (hasMany) {
            return result.docs.map((doc) => doc.id);
          } else {
            return result.docs[0]?.id;
          }
        }
        return hasMany ? [] : undefined;
      },
    ],
  },
});
