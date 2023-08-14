import payload from "payload";
import { CollectionBeforeValidateHook } from "payload/types";
import { Collections } from "../../../constants";
import { ChronologyEra } from "../../../types/collections";
import { hasIntersection, isUndefined } from "../../../utils/asserts";

export const beforeValidateNoIntersection: CollectionBeforeValidateHook<ChronologyEra> = async ({
  data,
}) => {
  if (isUndefined(data)) throw new Error("The data is undefined");
  const { startingYear, endingYear } = data;
  if (isUndefined(endingYear)) throw new Error("Ending year is undefined");
  if (isUndefined(startingYear)) throw new Error("Starting year is undefined");

  const otherEras = await payload.find({
    collection: Collections.ChronologyEras,
    limit: 100,
  });

  otherEras.docs.forEach((otherEra: ChronologyEra) => {
    if (hasIntersection([startingYear, endingYear], [otherEra.startingYear, otherEra.endingYear])) {
      throw new Error(
        `This era (${startingYear} -> ${endingYear}) is intersecting with the era\
           "${otherEra.slug}" (${otherEra.startingYear} -> ${otherEra.endingYear})`
      );
    }
  });
};
