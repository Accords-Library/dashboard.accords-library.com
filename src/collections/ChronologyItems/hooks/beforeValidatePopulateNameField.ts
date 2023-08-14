import { FieldHook } from "payload/dist/fields/config/types";
import { ChronologyItem } from "../../../types/collections";
import { isDefined, isUndefined } from "../../../utils/asserts";

export const beforeValidatePopulateNameField: FieldHook<
  ChronologyItem,
  ChronologyItem["name"],
  ChronologyItem
> = ({ data }) => {
  if (isUndefined(data)) {
    return "????-??-??";
  }
  const { date } = data;
  if (isUndefined(date) || isUndefined(date?.year)) return "????-??-??";
  const { year, month, day } = date;
  let result = String(year).padStart(5, " ");
  if (isDefined(month)) {
    result += `-${String(date.month).padStart(2, "0")}`;
    if (isDefined(day)) {
      result += `-${String(date.day).padStart(2, "0")}`;
    }
  }
  return result;
};
