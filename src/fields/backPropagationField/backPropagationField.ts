import payload from "payload";
import { FieldBase } from "payload/dist/fields/config/types";
import { RelationshipField, Where } from "payload/types";
import { isNotEmpty } from "../../utils/asserts";

type BackPropagationField = FieldBase & {
  where: (id: string) => Where;
  relationTo: string;
  hasMany: boolean;
};
export const backPropagationField = ({
  admin,
  hooks: { beforeChange = [], afterRead = [], ...otherHooks } = {},
  where,
  ...params
}: BackPropagationField): RelationshipField => ({
  ...params,
  type: "relationship",
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
        if (isNotEmpty(data.id)) {
          const result = await payload.find({
            collection: params.relationTo,
            where: where(data.id),
            limit: 100,
            depth: 0,
          });
          if (params.hasMany) {
            return result.docs.map((doc) => doc.id);
          } else {
            return result.docs[0].id;
          }
        }
        return params.hasMany ? [] : undefined;
      },
    ],
  },
});
