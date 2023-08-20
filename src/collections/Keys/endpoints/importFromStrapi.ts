import payload from "payload";
import { Collections } from "../../../constants";
import {
  getAllStrapiEntries,
  importStrapiEntries,
} from "../../../endpoints/createStrapiImportEndpoint";
import { Key } from "../../../types/collections";
import { CollectionEndpoint, PayloadCreateData } from "../../../types/payload";
import { StrapiLanguage } from "../../../types/strapi";
import { isDefined, isUndefined } from "../../../utils/asserts";
import { formatToCamelCase } from "../../../utils/string";

const importStrapiWordings: typeof importStrapiEntries = async ({
  payload: payloadParams,
  strapi: strapiParams,
  user,
}) => {
  const rawEntries = await getAllStrapiEntries<any>(strapiParams.collection, strapiParams.params);

  const { ui_language, createdAt, updatedAt, ...otherKeys } = rawEntries[0].attributes;

  const entries: PayloadCreateData<Key>[] = Object.keys(otherKeys).map((key) => ({
    name: formatToCamelCase(key),
    type: "Wordings",
    translations: rawEntries
      .map((entry) => ({
        language: entry.attributes.ui_language.data.attributes.code,
        name: entry.attributes[key],
      }))
      .filter(({ name }) => isDefined(name) && name !== ""),
  }));

  const errors: string[] = [];

  await Promise.all(
    entries.map(async (entry) => {
      try {
        await payload.create({
          collection: payloadParams.collection,
          data: entry,
          user,
        });
      } catch (e) {
        console.warn(e);
        if (typeof e === "object" && isDefined(e) && "name" in e) {
          errors.push(`${e.name} with ${entry.name}`);
        }
      }
    })
  );

  return { count: entries.length, errors };
};

export const importFromStrapi: CollectionEndpoint = {
  method: "post",
  path: "/strapi",
  handler: async (req, res) => {
    if (!req.user) {
      return res.status(403).send({
        errors: [
          {
            message: "You are not allowed to perform this action.",
          },
        ],
      });
    }

    type StrapiCategories = {
      slug: string;
      titles: { title?: string; short?: string; language: StrapiLanguage }[];
    };

    const { count: categoriesCount, errors: categoriesErrors } = await importStrapiEntries<
      Key,
      StrapiCategories
    >({
      strapi: {
        collection: "categories",
        params: { populate: { titles: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, titles }) => ({
          name: slug,
          type: "Categories",
          translations: titles.map(({ title, short, language }) => {
            if (isUndefined(language.data))
              throw new Error("A language is required for a Keys title translation");
            if (isUndefined(title))
              throw new Error("A title is required for a Keys title translation");
            return {
              name: title,
              short,
              language: language.data.attributes.code,
            };
          }),
        }),
      },
      user: req.user,
    });

    type StrapiContentType = {
      slug: string;
      titles: { title: string; language: StrapiLanguage }[];
    };

    const { count: contentTypesCount, errors: contentTypesErrors } = await importStrapiEntries<
      Key,
      StrapiContentType
    >({
      strapi: {
        collection: "content-types",
        params: { populate: { titles: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, titles }) => ({
          name: slug,
          type: "Contents",
          translations: titles.map(({ title, language }) => {
            if (isUndefined(language.data))
              throw new Error("A language is required for a Keys title translation");
            return {
              name: title,
              language: language.data.attributes.code,
            };
          }),
        }),
      },
      user: req.user,
    });

    type StrapiGamePlatform = {
      slug: string;
      titles: { title?: string; short?: string; language: StrapiLanguage }[];
    };

    const { count: gamePlatformsCount, errors: gamePlatformsErrors } = await importStrapiEntries<
      Key,
      StrapiGamePlatform
    >({
      strapi: {
        collection: "game-platforms",
        params: { populate: { titles: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, titles }) => ({
          name: slug,
          type: "GamePlatforms",
          translations: titles.map(({ title, short, language }) => {
            if (isUndefined(language.data))
              throw new Error("A language is required for a Keys title translation");
            if (isUndefined(title))
              throw new Error("A title is required for a Keys title translation");
            return {
              name: title,
              short,
              language: language.data.attributes.code,
            };
          }),
        }),
      },
      user: req.user,
    });

    type StrapiMetadataTypes = {
      slug: string;
      titles: { title: string; language: StrapiLanguage }[];
    };

    const { count: libraryCount, errors: libraryErrors } = await importStrapiEntries<
      Key,
      StrapiMetadataTypes
    >({
      strapi: {
        collection: "metadata-types",
        params: { populate: { titles: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, titles }) => ({
          name: slug,
          type: "Library",
          translations: titles.map(({ title, language }) => {
            if (isUndefined(language.data))
              throw new Error("A language is required for a Keys title translation");
            return {
              name: title,
              language: language.data.attributes.code,
            };
          }),
        }),
      },
      user: req.user,
    });

    type StrapiAudioSubtypes = {
      slug: string;
      titles: { title: string; language: StrapiLanguage }[];
    };

    const { count: libraryAudioCount, errors: libraryAudioErrors } = await importStrapiEntries<
      Key,
      StrapiAudioSubtypes
    >({
      strapi: {
        collection: "audio-subtypes",
        params: { populate: { titles: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, titles }) => ({
          name: slug,
          type: "LibraryAudio",
          translations: titles.map(({ title, language }) => {
            if (isUndefined(language.data))
              throw new Error("A language is required for a Keys title translation");
            return {
              name: title,
              language: language.data.attributes.code,
            };
          }),
        }),
      },
      user: req.user,
    });

    type StrapiGroupSubtypes = {
      slug: string;
      titles: { title: string; language: StrapiLanguage }[];
    };

    const { count: libraryGroupCount, errors: libraryGroupErrors } = await importStrapiEntries<
      Key,
      StrapiGroupSubtypes
    >({
      strapi: {
        collection: "group-subtypes",
        params: { populate: { titles: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, titles }) => ({
          name: slug,
          type: "LibraryGroup",
          translations: titles.map(({ title, language }) => {
            if (isUndefined(language.data))
              throw new Error("A language is required for a Keys title translation");
            return {
              name: title,
              language: language.data.attributes.code,
            };
          }),
        }),
      },
      user: req.user,
    });

    type StrapiTextualSubtypes = {
      slug: string;
      titles: { title: string; language: StrapiLanguage }[];
    };

    const { count: libraryTextualCount, errors: libraryTextualErrors } = await importStrapiEntries<
      Key,
      StrapiTextualSubtypes
    >({
      strapi: {
        collection: "textual-subtypes",
        params: { populate: { titles: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, titles }) => ({
          name: slug,
          type: "LibraryTextual",
          translations: titles.map(({ title, language }) => {
            if (isUndefined(language.data))
              throw new Error("A language is required for a Keys title translation");
            return {
              name: title,
              language: language.data.attributes.code,
            };
          }),
        }),
      },
      user: req.user,
    });

    type StrapiVideoSubtypes = {
      slug: string;
      titles: { title: string; language: StrapiLanguage }[];
    };

    const { count: libraryVideoCount, errors: libraryVideoErrors } = await importStrapiEntries<
      Key,
      StrapiVideoSubtypes
    >({
      strapi: {
        collection: "video-subtypes",
        params: { populate: { titles: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, titles }) => ({
          name: slug,
          type: "LibraryVideo",
          translations: titles.map(({ title, language }) => {
            if (isUndefined(language.data))
              throw new Error("A language is required for a Keys title translation");
            return {
              name: title,
              language: language.data.attributes.code,
            };
          }),
        }),
      },
      user: req.user,
    });

    type StrapiWeaponTypes = {
      slug: string;
      translations: { name?: string; language: StrapiLanguage }[];
    };

    const { count: weaponsCount, errors: weaponsErrors } = await importStrapiEntries<
      Key,
      StrapiWeaponTypes
    >({
      strapi: {
        collection: "weapon-story-types",
        params: { populate: { translations: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, translations }) => ({
          name: slug,
          type: "Weapons",
          translations: translations.map(({ name, language }) => {
            if (isUndefined(language.data))
              throw new Error("A language is required for a Keys title translation");
            if (isUndefined(name))
              throw new Error("A name is required for a Keys title translation");
            return {
              name,
              language: language.data.attributes.code,
            };
          }),
        }),
      },
      user: req.user,
    });

    const { count: wordingsCount, errors: wordingsErrors } = await importStrapiWordings<Key, Key>({
      strapi: { collection: "website-interfaces", params: { populate: "ui_language" } },
      payload: { collection: Collections.Keys, convert: (strapiObject) => strapiObject },
      user: req.user,
    });

    res.status(200).json({
      message: `${
        categoriesCount +
        contentTypesCount +
        gamePlatformsCount +
        libraryCount +
        libraryAudioCount +
        libraryGroupCount +
        libraryTextualCount +
        libraryVideoCount +
        weaponsCount +
        wordingsCount
      } entries have been added successfully.`,
      errors: {
        categoriesErrors,
        contentTypesErrors,
        gamePlatformsErrors,
        libraryErrors,
        libraryAudioErrors,
        libraryGroupErrors,
        libraryTextualErrors,
        libraryVideoErrors,
        weaponsErrors,
        wordingsErrors,
      },
    });
  },
};
