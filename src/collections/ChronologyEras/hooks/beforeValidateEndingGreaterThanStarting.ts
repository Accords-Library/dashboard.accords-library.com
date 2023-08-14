import { CollectionBeforeValidateHook } from "payload/types";
import { ChronologyEra } from "../../../types/collections";
import { isUndefined } from "../../../utils/asserts";

export const beforeValidateEndingGreaterThanStarting: CollectionBeforeValidateHook<
  ChronologyEra
> = async ({ data }) => {
  if (isUndefined(data)) throw new Error("The data is undefined");
  const { startingYear, endingYear } = data;
  if (isUndefined(endingYear)) throw new Error("Ending year is undefined");
  if (isUndefined(startingYear)) throw new Error("Starting year is undefined");
  if (endingYear < startingYear) {
    throw new Error("The ending year cannot be before the starting year.");
  }
};
