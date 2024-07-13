import { BeforeDuplicate } from "payload/types";
import { CollectionStatus } from "../shared/payload/constants";

export const beforeDuplicateUnpublish: BeforeDuplicate = ({ data }) => ({
  ...data,
  _status: CollectionStatus.Draft,
});
