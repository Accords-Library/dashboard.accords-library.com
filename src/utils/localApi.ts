import payload, { GeneratedTypes } from "payload";
import { StrapiImage } from "../types/strapi";
import { isDefined } from "./asserts";

type UploadStrapiImage = {
  image: StrapiImage;
  collection: keyof GeneratedTypes["collections"];
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
