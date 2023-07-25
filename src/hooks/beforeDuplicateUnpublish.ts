import { BeforeDuplicate } from "payload/types";
import { CollectionStatus } from "../constants";

export const beforeDuplicateUnpublish: BeforeDuplicate = ({ data }) => ({
  ...data,
  _status: CollectionStatus.Draft,
});
