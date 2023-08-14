import payload from "payload";
import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Recorder } from "../../../types/collections";
import { PayloadCreateData } from "../../../types/payload";
import { StrapiImage, StrapiLanguage } from "../../../types/strapi";
import { isUndefined } from "../../../utils/asserts";
import { uploadStrapiImage } from "../../../utils/localApi";

type StrapiRecorder = {
  username: string;
  anonymize: boolean;
  anonymous_code: number;
  languages: { data: { attributes: { code: string } }[] };
  avatar: StrapiImage;
  bio: { language: StrapiLanguage; bio?: string }[];
};

export const importFromStrapi = createStrapiImportEndpoint<Recorder, StrapiRecorder>({
  strapi: {
    collection: "recorders",
    params: {
      populate: "bio.language,languages,avatar",
    },
  },
  payload: {
    collection: Collections.Recorders,
    import: async ({ username, anonymize, anonymous_code, languages, avatar, bio: bios }, user) => {
      const avatarId = await uploadStrapiImage({
        collection: Collections.RecordersThumbnails,
        image: avatar,
      });

      const data: PayloadCreateData<Recorder> = {
        email: `${anonymous_code}@accords-library.com`,
        password: process.env.RECORDER_DEFAULT_PASSWORD,
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
            biography: bio,
          };
        }),
      };

      await payload.create({ collection: Collections.Recorders, data, user });
    },
  },
});
