import payload from "payload";
import { Collections, KeysTypes } from "../constants";
import { StrapiImage } from "../types/strapi";
import { isDefined } from "./asserts";

export const findWeaponType = async (name: string): Promise<string> => {
  const key = await payload.find({
    collection: Collections.Keys,
    where: { name: { equals: name }, type: { equals: KeysTypes.Weapons } },
    depth: 0,
  });
  if (!key.docs[0]) throw new Error(`Weapon type ${name} wasn't found`);
  return key.docs[0].id;
};

export const findCategory = async (name: string): Promise<string> => {
  const key = await payload.find({
    collection: Collections.Keys,
    where: { name: { equals: name }, type: { equals: KeysTypes.Categories } },
    depth: 0,
  });
  if (!key.docs[0]) throw new Error(`Category ${name} wasn't found`);
  return key.docs[0].id;
};

export const findRecorder = async (name: string): Promise<string> => {
  const recorder = await payload.find({
    collection: Collections.Recorders,
    where: { username: { equals: name } },
    depth: 0,
  });
  if (!recorder.docs[0]) throw new Error(`Recorder ${name} wasn't found`);
  return recorder.docs[0].id;
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
    const filename = image.data.attributes.hash + image.data.attributes.ext;

    const existingImage = await payload.find({
      collection,
      where: { filename: { equals: filename } },
    });
    if (existingImage.docs[0]) {
      return existingImage.docs[0].id;
    }

    const url = `${process.env.STRAPI_URI}${image.data.attributes.url}`;

    const blob = await (await fetch(url)).blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    const result = await payload.create({
      collection,
      file: {
        data: buffer,
        mimetype: image.data.attributes.mime,
        name: filename,
        size: image.data.attributes.size,
      },
      data: {},
    });

    return result.id;
  }
};
