import payload, { GeneratedTypes } from "payload";
import { FieldBase, SingleRelationshipField } from "payload/dist/fields/config/types";
import { Where } from "payload/types";
import { isEmpty } from "../../utils/asserts";

type BackPropagationField = FieldBase & {
  where: (data: any) => Where;
  relationTo: keyof GeneratedTypes["collections"];
  hasMany?: boolean;
};
export const backPropagationField = ({
  admin,
  hooks: { beforeChange = [], afterRead = [], ...otherHooks } = {},
  where,
  hasMany = false,
  ...params
}: BackPropagationField): SingleRelationshipField => ({
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
      async ({ data, context }) => {
        if (isEmpty(data?.id) || context.stopPropagation) {
          return hasMany ? [] : undefined;
        }
        const result = await payload.find({
          collection: params.relationTo,
          where: where(data),
          limit: 100,
          depth: 0,
          context: { stopPropagation: true },
        });
        if (hasMany) {
          return result.docs.map((doc) => doc.id);
        } else {
          return result.docs[0]?.id;
        }
      },
    ],
  },
});
