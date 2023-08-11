import cleanDeep from "clean-deep";
import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createByEndpoint";
import { LibraryItem } from "../../../types/collections";

type ProcessedLibraryItem = Omit<LibraryItem, "size" | "price" | "scans" | "id"> & {
  size?: Omit<LibraryItem["size"][number], "id">;
  price?: Omit<LibraryItem["price"][number], "id" | "currency"> & { currency: string };
  scans?: Omit<LibraryItem["scans"][number], "id" | "obi" | "cover" | "dustjacket"> & {
    obi: Omit<LibraryItem["scans"][number]["obi"][number], "id">;
    cover: Omit<LibraryItem["scans"][number]["obi"][number], "id">;
    dustjacket: Omit<LibraryItem["scans"][number]["obi"][number], "id">;
  };
};

export const getBySlug = createGetByEndpoint<LibraryItem, Partial<ProcessedLibraryItem>>(
  Collections.LibraryItems,
  "slug",
  async ({ id, size, price, scans, ...otherProps }) => {
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
  }
);

const processScans = (scans: LibraryItem["scans"]): ProcessedLibraryItem["scans"] => {
  if (!scans || scans.length === 0) return undefined;
  const { cover, dustjacket, id, obi, ...otherProps } = scans[0];
  return {
    cover: processOptionalGroup(cover),
    dustjacket: processOptionalGroup(dustjacket),
    obi: processOptionalGroup(obi),
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
