import { FieldHook } from "payload/dist/fields/config/types";
import { ChronologyEvent } from "src/types/collections";
import { isUndefined, isDefined } from "src/utils/asserts";

export const beforeValidatePopulateNameField: FieldHook<
  ChronologyEvent,
  ChronologyEvent["name"],
  ChronologyEvent
> = ({ data }) => {
  if (isUndefined(data) || isUndefined(data.date) || isUndefined(data.date.year))
    return "????-??-??";
  const { year, month, day } = data.date;
  let result = String(year).padStart(5, " ");
  if (isDefined(month)) {
    result += `-${String(month).padStart(2, "0")}`;
    if (isDefined(day)) {
      result += `-${String(day).padStart(2, "0")}`;
    }
  }
  return result;
};
