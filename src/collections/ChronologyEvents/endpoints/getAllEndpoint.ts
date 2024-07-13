import payload from "payload";
import { ChronologyEvent, CollectibleBlock } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isDefined, isNotEmpty, isPayloadType } from "../../../utils/asserts";
import { convertCreditsToEndpointCredits, getDomainFromUrl } from "../../../utils/endpoints";
import { convertCollectibleToEndpointCollectiblePreview } from "../../Collectibles/endpoints/getBySlugEndpoint";
import { convertPageToEndpointPagePreview } from "../../Pages/endpoints/getBySlugEndpoint";
import { Collections } from "../../../shared/payload/constants";
import { EndpointChronologyEvent, EndpointSource } from "../../../shared/payload/endpoint-types";

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

    const result = (
      await payload.find({
        collection: Collections.ChronologyEvents,
        pagination: false,
        draft: false,
        where: {
          _status: {
            equals: "published",
          },
        },
      })
    ).docs;

    const events = result
      .sort((a, b) => {
        const aYear = a.date.year;
        const bYear = b.date.year;
        if (aYear !== bYear) return aYear - bYear;
        const aMonth = a.date.month ?? 13;
        const bMonth = b.date.month ?? 13;
        if (aMonth !== bMonth) return aMonth - bMonth;
        const aDay = a.date.day ?? 32;
        const bDay = b.date.day ?? 32;
        if (aDay !== bDay) return aDay - bDay;
        return 0;
      })
      .map<EndpointChronologyEvent>(eventToEndpointEvent);

    res.status(200).json(events);
  },
};

export const eventToEndpointEvent = ({
  date: { year, day, month },
  events,
  id,
}: ChronologyEvent): EndpointChronologyEvent => ({
  id,
  date: {
    year,
    ...(isDefined(month) ? { month } : {}),
    ...(isDefined(day) ? { day } : {}),
  },
  events: events.map<EndpointChronologyEvent["events"][number]>(({ sources, translations }) => ({
    translations: translations.map(
      ({ language, sourceLanguage, description, notes, title, credits }) => ({
        language: isPayloadType(language) ? language.id : language,
        sourceLanguage: isPayloadType(sourceLanguage) ? sourceLanguage.id : sourceLanguage,
        ...(isNotEmpty(title) ? { title } : {}),
        ...(isNotEmpty(description) ? { description } : {}),
        ...(isNotEmpty(notes) ? { notes } : {}),
        credits: convertCreditsToEndpointCredits(credits),
      })
    ),
    sources: handleSources(sources),
  })),
});

const handleSources = (sources: ChronologyEvent["events"][number]["sources"]): EndpointSource[] => {
  return (
    sources?.flatMap<EndpointSource>((source) => {
      switch (source.blockType) {
        case "collectibleBlock":
          const range = handleRange(source.range);
          if (!isPayloadType(source.collectible)) return [];
          return {
            type: "collectible",
            collectible: convertCollectibleToEndpointCollectiblePreview(source.collectible),
            ...(isDefined(range) ? { range } : {}),
          };

        case "pageBlock":
          if (!isPayloadType(source.page)) return [];
          return {
            type: "page",
            page: convertPageToEndpointPagePreview(source.page),
          };

        case "urlBlock":
          return {
            type: "url",
            url: source.url,
            label: getDomainFromUrl(source.url),
          };
      }
    }) ?? []
  );
};

const handleRange = (
  rawRange: CollectibleBlock["range"]
): Extract<EndpointSource, { type: "collectible" }>["range"] => {
  const range = rawRange?.[0];

  switch (range?.blockType) {
    case "page":
      return { type: "page", page: range.page };

    case "timestamp":
      return { type: "timestamp", timestamp: range.timestamp };

    case "other":
      return {
        type: "custom",
        translations: range.translations.map(({ language, note }) => ({
          language: isPayloadType(language) ? language.id : language,
          note,
        })),
      };

    case undefined:
    default:
      return undefined;
  }
};
