import { DateTime } from "luxon";
import { Validate } from "payload/types";
import { ChronologyItem } from "../../../types/collections";
import { isUndefined } from "../../../utils/asserts";

export const validateDate: Validate<ChronologyItem["date"] | undefined> = (date) => {
  if (isUndefined(date)) return "This field is required.";
  const { year, month, day } = date;
  if (isUndefined(day)) return true;
  if (isUndefined(month)) return "A month is required if a day is set.";
  const stringDate = `${year}/${month}/${day}`;
  if (!DateTime.fromObject({ year, month, day }).isValid) {
    return `The given date (${stringDate}) is not a valid date.`;
  }
  return true;
};
