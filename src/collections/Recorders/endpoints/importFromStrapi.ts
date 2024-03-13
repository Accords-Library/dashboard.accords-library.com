import payload from "payload";
import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Recorder } from "../../../types/collections";
import { StrapiImage, StrapiLanguage } from "../../../types/strapi";
import { isDefined, isUndefined } from "../../../utils/asserts";
import { uploadStrapiImage } from "../../../utils/localApi";
import { plainTextToLexical } from "../../../utils/string";

type StrapiRecorder = {
  username: string;
  anonymize: boolean;
  anonymous_code: number;
  languages: { data: { attributes: { code: string } }[] };
  avatar: StrapiImage;
  bio: { language: StrapiLanguage; bio?: string }[];
};

export const importFromStrapi = createStrapiImportEndpoint<StrapiRecorder>({
  strapi: {
    collection: "recorders",
    params: {
      populate: ["bio.language", "languages", "avatar"],
    },
  },
  payload: {
    collection: Collections.Recorders,
    import: async ({ username, anonymize, anonymous_code, languages, avatar, bio: bios }, user) => {
      const avatarId = await uploadStrapiImage({
        collection: Collections.RecordersThumbnails,
        image: avatar,
      });

      const recorder = (
        await payload.find({
          collection: Collections.Recorders,
          where: { username: { equals: username } },
        })
      ).docs[0] as Recorder | undefined;

      if (isDefined(recorder)) {
        await payload.update({
          collection: Collections.Recorders,
          id: recorder.id,
          data: {
            username,
            anonymize,
            languages: languages.data?.map((language) => language.attributes.code),
            avatar: avatarId,
          },
          user,
        });
      } else {
        await payload.create({
          collection: Collections.Recorders,
          data: {
            username,
            anonymize,
            languages: languages.data?.map((language) => language.attributes.code),
            avatar: avatarId,
            biographies: bios?.map(({ language, bio }) => {
              if (isUndefined(language.data))
                throw new Error("A language is required for a Recorder biography");
              if (isUndefined(bio)) throw new Error("A bio is required for a Recorder biography");
              return {
                language: language.data.attributes.code,
                biography: plainTextToLexical(bio),
              };
            }),
            email: `${anonymous_code}@accords-library.com`,
            password: process.env.RECORDER_DEFAULT_PASSWORD,
          },
          user,
        });
      }
    },
  },
});
