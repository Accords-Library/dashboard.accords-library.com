import payload from "payload";
import { CollectionBeforeValidateHook } from "payload/types";
import { Collections } from "../../../constants";
import { ChronologyEra } from "../../../types/collections";
import { hasIntersection } from "../../../utils/asserts";

export const beforeValidateNoIntersection: CollectionBeforeValidateHook<ChronologyEra> = async ({
  data: { startingYear, endingYear },
}) => {
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
