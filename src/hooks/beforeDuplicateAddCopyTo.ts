import { BeforeDuplicate } from "payload/types";

export const beforeDuplicateAddCopyTo =
  (fieldName: string): BeforeDuplicate =>
  ({ data }) => ({ ...data, [fieldName]: `${data[fieldName]}-copy` });
