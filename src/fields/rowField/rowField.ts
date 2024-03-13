import { Field, RowField } from "payload/types";

export const rowField = (fields: Field[]): RowField => ({
  type: "row",
  fields: fields.map(({ admin, ...otherConfig }) => ({
    ...otherConfig,
    admin: { width: "0%", ...admin },
  })) as Field[],
});
