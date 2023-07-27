import { LibraryItems } from "../LibraryItems";
import { LibraryItem } from "../../../types/collections";
import cleanDeep from "clean-deep";
import { createBySlugEndpoint } from "../../../endpoints/createBySlugEndpoint";

type ProcessedLibraryItem = Omit<LibraryItem, "size" | "price" | "scans" | "id"> & {
  size?: Omit<LibraryItem["size"][number], "id">;
  price?: Omit<LibraryItem["price"][number], "id" | "currency"> & { currency: string };
  scans?: Omit<LibraryItem["scans"][number], "id" | "obibelt" | "cover" | "dustjacket"> & {
    obibelt: Omit<LibraryItem["scans"][number]["obibelt"][number], "id">;
    cover: Omit<LibraryItem["scans"][number]["obibelt"][number], "id">;
    dustjacket: Omit<LibraryItem["scans"][number]["obibelt"][number], "id">;
  };
};

export const getSlug = (collectionSlug: string) =>
  createBySlugEndpoint<LibraryItem>(collectionSlug, ({ id, size, price, scans, ...otherProps }) => {
    const processedLibraryItem: ProcessedLibraryItem = {
      size: processOptionalGroup(size),
      price: processPrice(price),
      scans: processScans(scans),
      ...otherProps,
    };

    return cleanDeep(processedLibraryItem, {
      emptyStrings: false,
      emptyArrays: false,
      emptyObjects: false,
      nullValues: true,
      undefinedValues: true,
      NaNValues: false,
    });
  });

const processScans = (scans: LibraryItem["scans"]): ProcessedLibraryItem["scans"] => {
  if (!scans || scans.length === 0) return undefined;
  const { cover, dustjacket, id, obibelt, ...otherProps } = scans[0];
  return {
    cover: processOptionalGroup(cover),
    dustjacket: processOptionalGroup(dustjacket),
    obibelt: processOptionalGroup(obibelt),
    ...otherProps,
  };
};

const processPrice = (price: LibraryItem["price"]): ProcessedLibraryItem["price"] => {
  if (!price || price.length === 0) return undefined;
  const { currency, ...otherProps } = processOptionalGroup(price);
  return { ...otherProps, currency: typeof currency === "string" ? currency : currency.id };
};

const processOptionalGroup = <T extends { id?: string }>(group: T[] | null | undefined) => {
  if (!group || group.length === 0) return undefined;
  const { id, ...otherProps } = group[0];
  return otherProps;
};
