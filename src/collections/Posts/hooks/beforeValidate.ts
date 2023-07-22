import { CollectionBeforeValidateHook } from "payload/types";
import { Post } from "../../../types/collections";

export const removeTranslatorsForTranscripts: CollectionBeforeValidateHook<Post> = async ({
  data: { translations, ...data },
}) => ({
  ...data,
  translations: translations?.map(({ translators, ...translation }) => {
    if (translation.language === translation.sourceLanguage) {
      return { ...translation, translators: [] };
    }
    return { ...translation, translators };
  }),
});
