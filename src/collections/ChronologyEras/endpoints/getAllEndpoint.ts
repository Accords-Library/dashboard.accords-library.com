import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointEra } from "../../../sdk";
import { ChronologyEra, ChronologyItem } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isDefined, isPayloadArrayType, isPayloadType } from "../../../utils/asserts";
import { handleRecorder } from "../../../utils/endpoints";

export const getAllEndpoint: CollectionEndpoint = {
  method: "get",
  path: "/all",
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

    const eras: ChronologyEra[] = (
      await payload.find({
        collection: Collections.ChronologyEras,
        pagination: false,
      })
    ).docs;

    const result = eras.map<EndpointEra>(
      ({ endingYear, startingYear, slug, translations, events: items }) => ({
        slug,
        startingYear,
        endingYear,
        translations:
          translations?.map(({ language, title, description }) => ({
            language: isPayloadType(language) ? language.id : language,
            title,
            ...(description ? { description } : {}),
          })) ?? [],
        items:
          items
            ?.filter(isPayloadType<ChronologyItem>)
            .sort((a, b) => {
              const aYear = a.date.year;
              const bYear = b.date.year;
              if (aYear !== bYear) return aYear - bYear;
              const aMonth = a.date.month ?? 0;
              const bMonth = b.date.month ?? 0;
              if (aMonth !== bMonth) return aMonth - bMonth;
              const aDay = a.date.day ?? 0;
              const bDay = b.date.day ?? 0;
              if (aDay !== bDay) return aDay - bDay;
              return 0;
            })
            .map(({ events, date: { year, day, month } }) => ({
              date: {
                year,
                ...(isDefined(day) ? { day } : {}),
                ...(isDefined(month) ? { month } : {}),
              },
              events: events.map(({ translations }) => ({
                translations: translations.map(
                  ({
                    language,
                    sourceLanguage,
                    description,
                    notes,
                    proofreaders,
                    transcribers,
                    translators,
                    title,
                  }) => ({
                    language: isPayloadType(language) ? language.id : language,
                    sourceLanguage: isPayloadType(sourceLanguage)
                      ? sourceLanguage.id
                      : sourceLanguage,
                    ...(title ? { title } : {}),
                    ...(description ? { description } : {}),
                    ...(notes ? { notes } : {}),
                    proofreaders: isPayloadArrayType(proofreaders)
                      ? proofreaders.map(handleRecorder)
                      : [],
                    transcribers: isPayloadArrayType(transcribers)
                      ? transcribers.map(handleRecorder)
                      : [],
                    translators: isPayloadArrayType(translators)
                      ? translators.map(handleRecorder)
                      : [],
                  })
                ),
              })),
            })) ?? [],
      })
    );

    res.status(200).json(result);
  },
};
