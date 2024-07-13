import { Validate } from "payload/types";
import { ChronologyEvent } from "src/types/collections";
import { isEmpty } from "src/utils/asserts";

export const validateEventsTranslationsTitle: Validate<
  string | undefined,
  ChronologyEvent,
  ChronologyEvent["events"][number]["translations"][number],
  unknown
> = (_, { siblingData: { description, title } }) => {
  if (!description && isEmpty(title)) {
    return "This field is required if no description is set.";
  }
  return true;
};
