import { CollectionBeforeValidateHook } from "payload/types";
import { ChronologyEra } from "../../../types/collections";

export const beforeValidateEndingGreaterThanStarting: CollectionBeforeValidateHook<
  ChronologyEra
> = async ({ data: { startingYear, endingYear } }) => {
  if (endingYear < startingYear) {
    throw new Error("The ending year cannot be before the starting year.");
  }
};
