import { Validate } from "payload/types";
import { ChronologyItem } from "../../../types/collections";
import { isEmpty } from "../../../utils/asserts";

export const validateEventsTranslationsTitle: Validate<
  string | undefined,
  ChronologyItem,
  ChronologyItem["events"][number]["translations"][number],
  unknown
> = (_, { siblingData: { description, title } }) => {
  if (!description && isEmpty(title)) {
    return "This field is required if no description is set.";
  }
  return true;
};
