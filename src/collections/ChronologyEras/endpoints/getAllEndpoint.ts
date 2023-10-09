import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointEra } from "../../../sdk";
import { ChronologyEra, ChronologyItem, Recorder } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import {
  isEmpty,
  isPayloadArrayType,
  isPayloadType,
  isString,
  isUndefined,
} from "../../../utils/asserts";

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
        limit: 100,
      })
    ).docs;

    const result = eras.map<EndpointEra>(
      ({ endingYear, startingYear, slug, translations, events: items }) => ({
        slug,
        startingYear,
        endingYear,
        translations:
          translations?.flatMap(({ language, title, description }) => {
            if (isString(language)) return [];
            const translation = {
              language: language.id,
              title,
              description,
            };
            if (isEmpty(translation.description)) delete translation.description;
            return translation;
          }) ?? [],
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
            .flatMap(({ date, events, createdAt, updatedAt, updatedBy }) => {
              if (isString(updatedBy)) return [];
              const item = {
                date,
                events: events.map(({ translations }) => ({
                  translations: translations.flatMap(
                    ({
                      language,
                      sourceLanguage,
                      description,
                      notes,
                      proofreaders = [],
                      transcribers = [],
                      translators = [],
                      title,
                    }) => {
                      if (isString(language)) return [];
                      if (isString(sourceLanguage)) return [];
                      if (!isPayloadArrayType<Recorder>(proofreaders)) return [];
                      if (!isPayloadArrayType<Recorder>(transcribers)) return [];
                      if (!isPayloadArrayType<Recorder>(translators)) return [];
                      const event = {
                        language: language.id,
                        sourceLanguage: sourceLanguage.id,
                        title,
                        description,
                        notes,
                        proofreaders: proofreaders.map(({ id }) => id),
                        transcribers: transcribers.map(({ id }) => id),
                        translators: translators.map(({ id }) => id),
                      };
                      if (isEmpty(title)) delete event.title;
                      if (isEmpty(description)) delete event.description;
                      if (isEmpty(notes)) delete event.notes;
                      return event;
                    }
                  ),
                })),
                createdAt: new Date(createdAt),
                updatedAt: new Date(updatedAt),
                updatedBy: updatedBy.id,
              };
              if (isUndefined(item.date.month)) delete item.date.month;
              if (isUndefined(item.date.day)) delete item.date.day;
              return item;
            }) ?? [],
      })
    );

    res.status(200).json(result);
  },
};
