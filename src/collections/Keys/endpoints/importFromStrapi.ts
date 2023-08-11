import payload from "payload";
import { CollectionConfig } from "payload/types";
import { Collections } from "../../../constants";
import {
  getAllStrapiEntries,
  importStrapiEntries,
} from "../../../endpoints/createStrapiImportEndpoint";
import { Key } from "../../../types/collections";
import { isDefined } from "../../../utils/asserts";
import { formatToCamelCase } from "../../../utils/string";
import { PayloadCreateData } from "../../../utils/types";

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

  const errors = [];

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
        errors.push(`${e.name} with ${entry.name}`);
      }
    })
  );

  return { count: entries.length, errors };
};

export const importFromStrapi: CollectionConfig["endpoints"][number] = {
  method: "get",
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

    const { count: categoriesCount, errors: categoriesErrors } = await importStrapiEntries<Key>({
      strapi: {
        collection: "categories",
        params: { populate: { titles: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, titles }) => ({
          name: slug,
          type: "Categories",
          translations: titles.map(({ title, short, language }) => ({
            name: title,
            short,
            language: language.data.attributes.code,
          })),
        }),
      },
      user: req.user,
    });

    const { count: contentTypesCount, errors: contentTypesErrors } = await importStrapiEntries<Key>(
      {
        strapi: {
          collection: "content-types",
          params: { populate: { titles: { populate: "language" } } },
        },
        payload: {
          collection: Collections.Keys,
          convert: ({ slug, titles }) => ({
            name: slug,
            type: "Contents",
            translations: titles.map(({ title, language }) => ({
              name: title,
              language: language.data.attributes.code,
            })),
          }),
        },
        user: req.user,
      }
    );

    const { count: gamePlatformsCount, errors: gamePlatformsErrors } =
      await importStrapiEntries<Key>({
        strapi: {
          collection: "game-platforms",
          params: { populate: { titles: { populate: "language" } } },
        },
        payload: {
          collection: Collections.Keys,
          convert: ({ slug, titles }) => ({
            name: slug,
            type: "GamePlatforms",
            translations: titles.map(({ title, short, language }) => ({
              name: title,
              short,
              language: language.data.attributes.code,
            })),
          }),
        },
        user: req.user,
      });

    const { count: libraryCount, errors: libraryErrors } = await importStrapiEntries<Key>({
      strapi: {
        collection: "metadata-types",
        params: { populate: { titles: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, titles }) => ({
          name: slug,
          type: "Library",
          translations: titles.map(({ title, language }) => ({
            name: title,
            language: language.data.attributes.code,
          })),
        }),
      },
      user: req.user,
    });

    const { count: libraryAudioCount, errors: libraryAudioErrors } = await importStrapiEntries<Key>(
      {
        strapi: {
          collection: "audio-subtypes",
          params: { populate: { titles: { populate: "language" } } },
        },
        payload: {
          collection: Collections.Keys,
          convert: ({ slug, titles }) => ({
            name: slug,
            type: "LibraryAudio",
            translations: titles.map(({ title, language }) => ({
              name: title,
              language: language.data.attributes.code,
            })),
          }),
        },
        user: req.user,
      }
    );

    const { count: libraryGroupCount, errors: libraryGroupErrors } = await importStrapiEntries<Key>(
      {
        strapi: {
          collection: "group-subtypes",
          params: { populate: { titles: { populate: "language" } } },
        },
        payload: {
          collection: Collections.Keys,
          convert: ({ slug, titles }) => ({
            name: slug,
            type: "LibraryGroup",
            translations: titles.map(({ title, language }) => ({
              name: title,
              language: language.data.attributes.code,
            })),
          }),
        },
        user: req.user,
      }
    );

    const { count: libraryTextualCount, errors: libraryTextualErrors } =
      await importStrapiEntries<Key>({
        strapi: {
          collection: "textual-subtypes",
          params: { populate: { titles: { populate: "language" } } },
        },
        payload: {
          collection: Collections.Keys,
          convert: ({ slug, titles }) => ({
            name: slug,
            type: "LibraryTextual",
            translations: titles.map(({ title, language }) => ({
              name: title,
              language: language.data.attributes.code,
            })),
          }),
        },
        user: req.user,
      });

    const { count: libraryVideoCount, errors: libraryVideoErrors } = await importStrapiEntries<Key>(
      {
        strapi: {
          collection: "video-subtypes",
          params: { populate: { titles: { populate: "language" } } },
        },
        payload: {
          collection: Collections.Keys,
          convert: ({ slug, titles }) => ({
            name: slug,
            type: "LibraryVideo",
            translations: titles.map(({ title, language }) => ({
              name: title,
              language: language.data.attributes.code,
            })),
          }),
        },
        user: req.user,
      }
    );

    const { count: weaponsCount, errors: weaponsErrors } = await importStrapiEntries<Key>({
      strapi: {
        collection: "weapon-story-types",
        params: { populate: { translations: { populate: "language" } } },
      },
      payload: {
        collection: Collections.Keys,
        convert: ({ slug, translations }) => ({
          name: slug,
          type: "Weapons",
          translations: translations.map(({ name, language }) => ({
            name,
            language: language.data.attributes.code,
          })),
        }),
      },
      user: req.user,
    });

    const { count: wordingsCount, errors: wordingsErrors } = await importStrapiWordings({
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
