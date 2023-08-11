import payload from "payload";
import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Recorder } from "../../../types/collections";
import { uploadStrapiImage } from "../../../utils/localApi";
import { PayloadCreateData } from "../../../utils/types";

export const importFromStrapi = createStrapiImportEndpoint<Recorder>({
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
        biographies: bios?.map(({ language, bio }) => ({
          language: language.data.attributes.code,
          biography: bio,
        })),
      };

      await payload.create({ collection: Collections.Recorders, data, user });
    },
  },
});
