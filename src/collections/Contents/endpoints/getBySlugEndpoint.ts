import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointContent } from "../../../sdk";
import { Content } from "../../../types/collections";
import { isPayloadArrayType, isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import { convertTagsToGroups } from "../../../utils/tags";

export const getBySlugEndpoint = createGetByEndpoint(
  Collections.Contents,
  "slug",
  ({ thumbnail, slug, translations, tags }: Content): EndpointContent => ({
    slug,
    ...(isValidPayloadImage(thumbnail) ? { thumbnail } : {}),
    tagGroups: convertTagsToGroups(tags),
    translations: translations.map((translation) => {
      const { language, sourceLanguage, title, subtitle, pretitle, summary } = translation;
      const text = handleTextContent(translation);

      return {
        language: isPayloadType(language) ? language.id : language,
        sourceLanguage: isPayloadType(sourceLanguage) ? sourceLanguage.id : sourceLanguage,
        ...(pretitle ? { pretitle } : {}),
        title,
        ...(subtitle ? { subtitle } : {}),
        ...(summary ? { summary } : {}),
        format: { ...(text ? { text } : {}) },
      };
    }),
  })
);


const handleTextContent = ({
  textContent,
  textNotes,
  textProofreaders,
  textTranscribers,
  textTranslators,
}: Content["translations"][number]): EndpointContent["translations"][number]["format"]["text"] => {
  if (!textContent) return undefined;

  return {
    content: textContent,
    toc: [],
    translators: isPayloadArrayType(textTranslators) ? textTranslators.map(({ id }) => id) : [],
    transcribers: isPayloadArrayType(textTranscribers) ? textTranscribers.map(({ id }) => id) : [],
    proofreaders: isPayloadArrayType(textProofreaders) ? textProofreaders.map(({ id }) => id) : [],
    ...(textNotes ? { notes: textNotes } : {}),
  };
};
