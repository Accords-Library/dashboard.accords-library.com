import {
  CollectibleBindingTypes,
  CollectibleNature,
  CollectiblePageOrders,
  Collections,
  PageType,
  RichTextContent,
} from "./constants";
import { Currency, Language } from "./types/collections";

class NodeCache {
  constructor(_params: any) {}
  getTtl(_key: string): number | undefined {
    return undefined;
  }
  get<T>(_key: string): T | undefined {
    return undefined;
  }
  set<T>(_key: string, _value: T, _ttl: number | string) {}
}

// END MOCKING SECTION

const REFRESH_FREQUENCY_IN_SEC = 60;
const CACHE = new NodeCache({
  checkperiod: REFRESH_FREQUENCY_IN_SEC,
  deleteOnExpire: true,
  forceString: true,
  maxKeys: 1,
});
const TOKEN_KEY = "token";

type PayloadLoginResponse = {
  token: string;
  exp: number;
};

const refreshToken = async () => {
  const loginUrl = payloadApiUrl(Collections.Recorders, "login");
  const loginResult = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.PAYLOAD_USER,
      password: process.env.PAYLOAD_PASSWORD,
    }),
  });
  logResponse(loginResult);

  if (loginResult.status !== 200) {
    throw new Error("Unable to login");
  }

  const loginJson = (await loginResult.json()) as PayloadLoginResponse;
  const { token, exp } = loginJson;
  const now = Math.floor(Date.now() / 1000);
  const ttl = Math.floor(exp - now - REFRESH_FREQUENCY_IN_SEC * 2);
  const ttlInMinutes = Math.floor(ttl / 60);
  console.log("Token was refreshed. TTL is", ttlInMinutes, "minutes.");
  CACHE.set(TOKEN_KEY, token, ttl);
  return token;
};

const getToken = async (): Promise<string> => {
  const cachedToken = CACHE.get<string>(TOKEN_KEY);
  if (cachedToken !== undefined) {
    const cachedTokenTtl = CACHE.getTtl(TOKEN_KEY) as number;
    const diffInMinutes = Math.floor((cachedTokenTtl - Date.now()) / 1000 / 60);
    console.log("Retrieved token from cache. TTL is", diffInMinutes, "minutes.");
    return cachedToken;
  }
  console.log("Refreshing token");
  return await refreshToken();
};

const injectAuth = async (init?: RequestInit): Promise<RequestInit> => ({
  ...init,
  headers: { ...init?.headers, Authorization: `JWT ${await getToken()}` },
});

const logResponse = (res: Response) => console.log(res.status, res.statusText, res.url);

const payloadApiUrl = (collection: Collections, endpoint?: string, isGlobal?: boolean): string =>
  `${process.env.PAYLOAD_API_URL}/${isGlobal === undefined ? "" : "globals/"}${collection}${endpoint === undefined ? "" : `/${endpoint}`}`;

const request = async (url: string, init?: RequestInit): Promise<Response> => {
  const result = await fetch(url, await injectAuth(init));
  logResponse(result);

  if (result.status !== 200) {
    throw new Error("Unhandled fetch error");
  }

  return result;
};

// SDK and Types

export type EndpointFolderPreview = {
  slug: string;
  icon?: string;
  translations: {
    language: string;
    name: string;
    description?: RichTextContent;
  }[];
};

export type EndpointFolder = EndpointFolderPreview & {
  sections:
    | { type: "single"; subfolders: EndpointFolderPreview[] }
    | {
        type: "multiple";
        sections: {
          translations: { language: string; name: string }[];
          subfolders: EndpointFolderPreview[];
        }[];
      };
  files: (
    | {
        relationTo: "collectibles";
        value: EndpointCollectiblePreview;
      }
    | {
        relationTo: "pages";
        value: EndpointPagePreview;
      }
  )[];
  parentPages: EndpointSource[];
};

export type EndpointWebsiteConfig = {
  homeFolders: (EndpointFolderPreview & {
    lightThumbnail?: PayloadImage;
    darkThumbnail?: PayloadImage;
  })[];
  timeline: {
    breaks: number[];
    eventCount: number;
    eras: {
      startingYear: number;
      endingYear: number;
      name: string;
    }[];
  };
};

export type EndpointRecorder = {
  id: string;
  username: string;
  avatar?: PayloadImage;
  languages: string[];
};

export type EndpointWording = {
  name: string;
  translations: {
    language: string;
    name: string;
  }[];
};

export type EndpointTag = {
  slug: string;
  translations: {
    language: string;
    name: string;
  }[];
};

export type EndpointTagsGroup = {
  slug: string;
  icon: string;
  translations: {
    language: string;
    name: string;
  }[];
  tags: EndpointTag[];
};

export type EndpointPagePreview = {
  slug: string;
  type: PageType;
  thumbnail?: PayloadImage;
  authors: EndpointRecorder[];
  tagGroups: EndpointTagsGroup[];
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
  }[];
};

export type EndpointPage = EndpointPagePreview & {
  backgroundImage?: PayloadImage;
  translations: (EndpointPagePreview["translations"][number] & {
    sourceLanguage: string;
    summary?: RichTextContent;
    content: RichTextContent;
    transcribers: EndpointRecorder[];
    translators: EndpointRecorder[];
    proofreaders: EndpointRecorder[];
    toc: TableOfContentEntry[];
  })[];
  parentPages: EndpointSource[];
};

export type EndpointCollectiblePreview = {
  slug: string;
  thumbnail?: PayloadImage;
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    description?: RichTextContent;
  }[];
  tagGroups: EndpointTagsGroup[];
  releaseDate?: string;
  languages: string[];
};

export type EndpointCollectible = EndpointCollectiblePreview & {
  backgroundImage?: PayloadImage;
  nature: CollectibleNature;
  gallery: PayloadImage[];
  scans: PayloadImage[];
  urls: { url: string; label: string }[];
  price?: {
    amount: number;
    currency: string;
  };
  size?: {
    width: number;
    height: number;
    thickness?: number;
  };
  weight?: number;
  pageInfo?: {
    pageCount: number;
    bindingType?: CollectibleBindingTypes;
    pageOrder?: CollectiblePageOrders;
  };
  subitems: EndpointCollectiblePreview[];
  contents: {
    content:
      | {
          relationTo: "pages";
          value: EndpointPagePreview;
        }
      | {
          relationTo: "generic-contents";
          value: {
            translations: {
              language: string;
              name: string;
            }[];
          };
        };

    range?:
      | {
          type: "pageRange";
          start: number;
          end: number;
        }
      | {
          type: "timeRange";
          start: string;
          end: string;
        }
      | {
          type: "other";
          translations: {
            language: string;
            note: RichTextContent;
          }[];
        };
  }[];
  parentPages: EndpointSource[];
};

export type TableOfContentEntry = {
  prefix: string;
  title: string;
  type: "sceneBreak" | "break" | "section";
  index: number;
  children: TableOfContentEntry[];
};

export type EndpointChronologyEvent = {
  id: string;
  date: {
    year: number;
    month?: number;
    day?: number;
  };
  events: {
    sources: EndpointSource[];
    translations: {
      language: string;
      sourceLanguage: string;
      title?: string;
      description?: RichTextContent;
      notes?: RichTextContent;
      transcribers: EndpointRecorder[];
      translators: EndpointRecorder[];
      proofreaders: EndpointRecorder[];
    }[];
  }[];
};

export type EndpointSource =
  | { type: "url"; url: string; label: string }
  | {
      type: "collectible";
      collectible: EndpointCollectiblePreview;
      range?:
        | { type: "page"; page: number }
        | { type: "timestamp"; timestamp: string }
        | { type: "custom"; translations: { language: string; note: string }[] };
    }
  | { type: "page"; page: EndpointPagePreview }
  | { type: "folder"; folder: EndpointFolderPreview };

export type PayloadImage = {
  url: string;
  width: number;
  height: number;
  mimeType: string;
  filename: string;
};

export const payload = {
  getConfig: async (): Promise<EndpointWebsiteConfig> =>
    await (await request(payloadApiUrl(Collections.WebsiteConfig, `config`, true))).json(),
  getFolder: async (slug: string): Promise<EndpointFolder> =>
    await (await request(payloadApiUrl(Collections.Folders, `slug/${slug}`))).json(),
  getLanguages: async (): Promise<Language[]> =>
    await (await request(payloadApiUrl(Collections.Languages, `all`))).json(),
  getCurrencies: async (): Promise<Currency[]> =>
    await (await request(payloadApiUrl(Collections.Currencies, `all`))).json(),
  getWordings: async (): Promise<EndpointWording[]> =>
    await (await request(payloadApiUrl(Collections.Wordings, `all`))).json(),
  getRecorders: async (): Promise<EndpointRecorder[]> =>
    await (await request(payloadApiUrl(Collections.Recorders, `all`))).json(),
  getPage: async (slug: string): Promise<EndpointPage> =>
    await (await request(payloadApiUrl(Collections.Pages, `slug/${slug}`))).json(),
  getCollectible: async (slug: string): Promise<EndpointCollectible> =>
    await (await request(payloadApiUrl(Collections.Collectibles, `slug/${slug}`))).json(),
  getChronologyEvents: async (): Promise<EndpointChronologyEvent[]> =>
    await (await request(payloadApiUrl(Collections.ChronologyEvents, `all`))).json(),
  getChronologyEventByID: async (id: string): Promise<EndpointChronologyEvent> =>
    await (await request(payloadApiUrl(Collections.ChronologyEvents, `id/${id}`))).json(),
};
