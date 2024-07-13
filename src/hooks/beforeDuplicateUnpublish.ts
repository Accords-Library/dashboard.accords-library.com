import { BeforeDuplicate } from "payload/types";
import { CollectionStatus } from "src/shared/payload/constants";

export const beforeDuplicateUnpublish: BeforeDuplicate = ({ data }) => ({
  ...data,
  _status: CollectionStatus.Draft,
});
