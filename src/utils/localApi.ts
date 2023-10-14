import payload from "payload";
import { Collections, KeysTypes } from "../constants";
import { StrapiImage } from "../types/strapi";
import { isDefined } from "./asserts";

export const findWeaponType = async (name: string): Promise<string> => {
  const key = await payload.find({
    collection: Collections.Keys,
    where: { name: { equals: name }, type: { equals: KeysTypes.Weapons } },
  });
  if (!key.docs[0]) throw new Error(`Weapon type ${name} wasn't found`);
  return key.docs[0].id;
};

export const findCategory = async (name: string): Promise<string> => {
  const key = await payload.find({
    collection: Collections.Keys,
    where: { name: { equals: name }, type: { equals: KeysTypes.Categories } },
  });
  if (!key.docs[0]) throw new Error(`Category ${name} wasn't found`);
  return key.docs[0]?.id;
};

type UploadStrapiImage = {
  image: StrapiImage;
  collection: Collections;
};

export const uploadStrapiImage = async ({
  collection,
  image,
}: UploadStrapiImage): Promise<string | undefined> => {
  if (isDefined(image.data)) {
    const url = `${process.env.STRAPI_URI}${image.data.attributes.url}`;

    const blob = await (await fetch(url)).blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    const result = await payload.create({
      collection,
      file: {
        data: buffer,
        mimetype: image.data.attributes.mime,
        name: image.data.attributes.name,
        size: image.data.attributes.size,
      },
      data: {},
    });

    return result.id;
  }
};
