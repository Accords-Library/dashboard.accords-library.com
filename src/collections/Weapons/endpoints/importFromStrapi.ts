import payload from "payload";
import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Weapon, WeaponsGroup } from "../../../types/collections";
import { PayloadCreateData } from "../../../types/payload";
import { StrapiImage, StrapiLanguage } from "../../../types/strapi";
import { isDefined, isUndefined } from "../../../utils/asserts";
import { findCategory, findWeaponType, uploadStrapiImage } from "../../../utils/localApi";

type StrapiWeapon = {
  slug: string;
  name: { name: string; language: StrapiLanguage }[];
  weapon_group: { data?: { attributes: { slug: string } } };
  thumbnail: StrapiImage;
  type: { data?: { attributes: { slug: string } } };
  stories: {
    categories: { data: { attributes: { slug: string } }[] };
    translations: {
      language: StrapiLanguage;
      description?: string;
      level_1?: string;
      level_2?: string;
      level_3?: string;
      level_4?: string;
    }[];
  }[];
};

export const importFromStrapi = createStrapiImportEndpoint<Weapon, StrapiWeapon>({
  strapi: {
    collection: "weapon-stories",
    params: {
      populate: [
        "name.language",
        "type",
        "weapon_group",
        "stories.categories",
        "stories.translations.language",
        "thumbnail",
      ].join(),
    },
  },
  payload: {
    collection: Collections.Weapons,
    import: async ({ slug, type, stories, name: names, weapon_group, thumbnail }, user) => {
      let groupId: string | undefined;
      if (isDefined(weapon_group.data)) {
        try {
          const groupData: PayloadCreateData<WeaponsGroup> = {
            slug: weapon_group.data.attributes.slug,
          };
          await payload.create({
            collection: Collections.WeaponsGroups,
            data: groupData,
            user,
          });
        } catch (e) {}

        const result = await payload.find({
          collection: Collections.WeaponsGroups,
          where: { slug: { equals: weapon_group.data.attributes.slug } },
        });

        if (result.docs.length > 0) {
          groupId = result.docs[0].id;
        }
      }

      const thumbnailId = await uploadStrapiImage({
        collection: Collections.WeaponsThumbnails,
        image: thumbnail,
      });

      if (isUndefined(type.data)) throw new Error("A type is required to create a Weapon");

      const data: PayloadCreateData<Weapon> = {
        slug,
        type: await findWeaponType(type.data.attributes.slug),
        group: groupId,
        thumbnail: thumbnailId,
        appearances: await Promise.all(
          stories.map(async ({ categories, translations }) => ({
            categories: await Promise.all(
              categories.data.map(({ attributes }) => findCategory(attributes.slug))
            ),
            translations: translations.map(
              ({ language, description, level_1, level_2, level_3, level_4 }) => {
                if (isUndefined(language.data))
                  throw new Error("A language is required to create a Weapon translation");
                const name = names.find(
                  (name) => name.language.data?.attributes.code === language.data?.attributes.code
                )?.name;
                if (isUndefined(name))
                  throw new Error("A name is required to create a Weapon translation");
                return {
                  language: language.data?.attributes.code,
                  sourceLanguage: language.data?.attributes.code,
                  name,
                  description,
                  level1: level_1,
                  level2: level_2,
                  level3: level_3,
                  level4: level_4,
                  transcribers: [user.id],
                };
              }
            ),
          }))
        ),
      };

      await payload.create({ collection: Collections.Weapons, data, user });
    },
  },
});
