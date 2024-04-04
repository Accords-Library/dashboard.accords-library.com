import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointFolder, EndpointFolderPreview } from "../../../sdk";
import { Folder, Language } from "../../../types/collections";
import { isDefined, isNotEmpty, isPayloadType, isPublished } from "../../../utils/asserts";
import { handleParentPages } from "../../../utils/endpoints";
import { convertCollectibleToPreview } from "../../Collectibles/endpoints/getBySlugEndpoint";
import { convertPageToPreview } from "../../Pages/endpoints/getBySlugEndpoint";

export const getBySlugEndpoint = createGetByEndpoint({
  collection: Collections.Folders,
  attribute: "slug",
  depth: 3,
  handler: (folder: Folder): EndpointFolder => {
    const { sections, files, parentFolders } = folder;
    return {
      ...convertFolderToPreview(folder),
      sections:
        sections?.length === 1
          ? {
              type: "single",
              subfolders:
                sections[0]?.subfolders?.filter(isPayloadType).map(convertFolderToPreview) ?? [],
            }
          : {
              type: "multiple",
              sections:
                sections?.filter(isValidSection).map(({ translations, subfolders }) => ({
                  translations: translations.map(({ language, name }) => ({
                    language: getLanguageId(language),
                    name,
                  })),
                  subfolders: subfolders.map(convertFolderToPreview),
                })) ?? [],
            },
      files:
        files?.flatMap<EndpointFolder["files"][number]>(({ relationTo, value }) => {
          if (!isPayloadType(value) || !isPublished(value)) {
            return [];
          }

          switch (relationTo) {
            case "collectibles":
              return [{ relationTo, value: convertCollectibleToPreview(value) }];
            case "pages":
              return [{ relationTo, value: convertPageToPreview(value) }];
          }
        }) ?? [],
      parentPages: handleParentPages({ folders: parentFolders }),
    };
  },
});

export const convertFolderToPreview = ({
  slug,
  translations,
  icon,
}: Folder): EndpointFolderPreview => {
  return {
    slug,
    ...(isDefined(icon) ? { icon } : {}),
    translations:
      translations?.map(({ language, name, description }) => ({
        language: getLanguageId(language),
        name,
        ...(isNotEmpty(description) ? { description } : {}),
      })) ?? [],
  };
};

const isValidSection = (section: {
  translations?:
    | {
        language: string | Language;
        name: string;
        id?: string | null;
      }[]
    | null;
  subfolders?: (string | Folder)[] | null | undefined;
}): section is {
  translations: {
    language: string | Language;
    name: string;
    id?: string | null;
  }[];
  subfolders: Folder[];
} => {
  if (!section.translations) {
    return false;
  }
  if (!section.subfolders) {
    return false;
  }
  return section.subfolders.every(isPayloadType);
};

const getLanguageId = (language: string | Language) =>
  typeof language === "object" ? language.id : language;
