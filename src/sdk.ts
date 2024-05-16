import {
  AttributeTypes,
  CollectibleBindingTypes,
  CollectibleNature,
  CollectiblePageOrders,
  Collections,
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
  headers: {
    ...init?.headers,
    Authorization: `JWT ${await getToken()}`,
  },
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

export type EndpointFolder = {
  slug: string;
  icon?: string;
  translations: {
    language: string;
    name: string;
    description?: RichTextContent;
  }[];
  sections:
    | { type: "single"; subfolders: EndpointFolder[] }
    | {
        type: "multiple";
        sections: {
          translations: { language: string; name: string }[];
          subfolders: EndpointFolder[];
        }[];
      };
  files: (
    | {
        relationTo: Collections.Collectibles;
        value: EndpointCollectible;
      }
    | {
        relationTo: Collections.Pages;
        value: EndpointPage;
      }
    | {
        relationTo: Collections.Images;
        value: EndpointImage;
      }
    | {
        relationTo: Collections.Audios;
        value: EndpointAudio;
      }
    | {
        relationTo: Collections.Videos;
        value: EndpointVideo;
      }
  )[];
  parentPages: EndpointSource[];
};

export type EndpointWebsiteConfig = {
  homeFolders: (EndpointFolder & {
    lightThumbnail?: EndpointImage;
    darkThumbnail?: EndpointImage;
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
  avatar?: EndpointImage;
  translations: {
    language: string;
    biography: RichTextContent;
  }[];
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
  page?: EndpointPage;
  translations: {
    language: string;
    name: string;
  }[];
};

export type EndpointGenericAttribute = {
  slug: string;
  icon: string;
  translations: {
    language: string;
    name: string;
  }[];
};

export type EndpointNumberAttribute = EndpointGenericAttribute & {
  type: AttributeTypes.Number;
  value: number;
};

export type EndpointTextAttribute = EndpointGenericAttribute & {
  type: AttributeTypes.Text;
  value: string;
};

export type EndpointTagsAttribute = EndpointGenericAttribute & {
  type: AttributeTypes.Tags;
  value: EndpointTag[];
};

export type EndpointAttribute =
  | EndpointNumberAttribute
  | EndpointTextAttribute
  | EndpointTagsAttribute;

export type EndpointRole = {
  icon: string;
  translations: {
    language: string;
    name: string;
  }[];
};

export type EndpointCredit = {
  role: EndpointRole;
  recorders: EndpointRecorder[];
};

export type EndpointPage = {
  slug: string;
  thumbnail?: EndpointImage;
  attributes: EndpointAttribute[];
  backgroundImage?: EndpointImage;
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    sourceLanguage: string;
    summary?: RichTextContent;
    content: RichTextContent;
    credits: EndpointCredit[];
    toc: TableOfContentEntry[];
  }[];
  createdAt: string;
  updatedAt: string;
  updatedBy?: EndpointRecorder;
  parentPages: EndpointSource[];
};

export type EndpointCollectible = {
  slug: string;
  thumbnail?: EndpointImage;
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    description?: RichTextContent;
  }[];
  attributes: EndpointAttribute[];
  releaseDate?: string;
  languages: string[];
  backgroundImage?: EndpointImage;
  nature: CollectibleNature;
  gallery?: { count: number; thumbnail: EndpointImage };
  scans?: { count: number; thumbnail: PayloadImage };
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
  subitems: EndpointCollectible[];
  contents: {
    content:
      | {
          relationTo: Collections.Pages;
          value: EndpointPage;
        }
      | {
          relationTo: Collections.Audios;
          value: EndpointAudio;
        }
      | {
          relationTo: Collections.Videos;
          value: EndpointVideo;
        }
      | {
          relationTo: Collections.GenericContents;
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
  createdAt: string;
  updatedAt: string;
  updatedBy?: EndpointRecorder;
  parentPages: EndpointSource[];
};

export type EndpointCollectibleScans = {
  slug: string;
  thumbnail?: EndpointImage;
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    description?: RichTextContent;
  }[];
  credits: EndpointCredit[];
  cover?: {
    front?: EndpointScanImage;
    spine?: EndpointScanImage;
    back?: EndpointScanImage;
    insideFront?: EndpointScanImage;
    insideBack?: EndpointScanImage;
    flapFront?: EndpointScanImage;
    flapBack?: EndpointScanImage;
    insideFlapFront?: EndpointScanImage;
    insideFlapBack?: EndpointScanImage;
  };
  dustjacket?: {
    front?: EndpointScanImage;
    spine?: EndpointScanImage;
    back?: EndpointScanImage;
    insideFront?: EndpointScanImage;
    insideSpine?: EndpointScanImage;
    insideBack?: EndpointScanImage;
    flapFront?: EndpointScanImage;
    flapBack?: EndpointScanImage;
    insideFlapFront?: EndpointScanImage;
    insideFlapBack?: EndpointScanImage;
  };
  obi?: {
    front?: EndpointScanImage;
    spine?: EndpointScanImage;
    back?: EndpointScanImage;
    insideFront?: EndpointScanImage;
    insideSpine?: EndpointScanImage;
    insideBack?: EndpointScanImage;
    flapFront?: EndpointScanImage;
    flapBack?: EndpointScanImage;
    insideFlapFront?: EndpointScanImage;
    insideFlapBack?: EndpointScanImage;
  };
  pages: EndpointScanImage[];
  parentPages: EndpointSource[];
};

export type EndpointCollectibleGallery = {
  slug: string;
  thumbnail?: EndpointImage;
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    description?: RichTextContent;
  }[];
  images: EndpointImage[];
  parentPages: EndpointSource[];
};

export type EndpointCollectibleGalleryImage = {
  slug: string;
  thumbnail?: EndpointImage;
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    description?: RichTextContent;
  }[];
  image: EndpointImage;
  previousIndex?: string;
  nextIndex?: string;
  parentPages: EndpointSource[];
};

export type EndpointCollectibleScanPage = {
  slug: string;
  thumbnail?: EndpointImage;
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    description?: RichTextContent;
  }[];
  image: EndpointScanImage;
  previousIndex?: string;
  nextIndex?: string;
  parentPages: EndpointSource[];
};

export type EndpointScanImage = PayloadImage & {
  index: string;
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
      credits: EndpointCredit[];
    }[];
  }[];
};

export type EndpointSource =
  | { type: "url"; url: string; label: string }
  | {
      type: "collectible";
      collectible: EndpointCollectible;
      range?:
        | { type: "page"; page: number }
        | { type: "timestamp"; timestamp: string }
        | { type: "custom"; translations: { language: string; note: string }[] };
    }
  | { type: "page"; page: EndpointPage }
  | { type: "folder"; folder: EndpointFolder }
  | { type: "scans"; collectible: EndpointCollectible }
  | { type: "gallery"; collectible: EndpointCollectible };

export type EndpointMedia = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  updatedAt: string;
  createdAt: string;
  attributes: EndpointAttribute[];
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    description?: RichTextContent;
  }[];
  credits: EndpointCredit[];
};

export type EndpointImage = EndpointMedia & {
  width: number;
  height: number;
};

export type EndpointAudio = EndpointMedia & {
  thumbnail?: PayloadImage;
  duration: number;
};

export type EndpointVideo = EndpointMedia & {
  thumbnail?: PayloadImage;
  subtitles: {
    language: string;
    url: string;
  }[];
  platform?: {
    channel: {
      url: string;
      title: string;
      subscribers: number;
    };
    views?: number;
    likes?: number;
    dislikes?: number;
    url: string;
    publishedDate: string;
  };
  duration: number;
};

export type PayloadMedia = {
  url: string;
  mimeType: string;
  filename: string;
  filesize: number;
};

export type PayloadImage = PayloadMedia & {
  width: number;
  height: number;
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
  getPage: async (slug: string): Promise<EndpointPage> =>
    await (await request(payloadApiUrl(Collections.Pages, `slug/${slug}`))).json(),
  getCollectible: async (slug: string): Promise<EndpointCollectible> =>
    await (await request(payloadApiUrl(Collections.Collectibles, `slug/${slug}`))).json(),
  getCollectibleScans: async (slug: string): Promise<EndpointCollectibleScans> =>
    await (await request(payloadApiUrl(Collections.Collectibles, `slug/${slug}/scans`))).json(),
  getCollectibleScanPage: async (
    slug: string,
    index: string
  ): Promise<EndpointCollectibleScanPage> =>
    await (
      await request(payloadApiUrl(Collections.Collectibles, `slug/${slug}/scans/${index}`))
    ).json(),
  getCollectibleGallery: async (slug: string): Promise<EndpointCollectibleGallery> =>
    await (await request(payloadApiUrl(Collections.Collectibles, `slug/${slug}/gallery`))).json(),
  getCollectibleGalleryImage: async (
    slug: string,
    index: string
  ): Promise<EndpointCollectibleGalleryImage> =>
    await (
      await request(payloadApiUrl(Collections.Collectibles, `slug/${slug}/gallery/${index}`))
    ).json(),
  getChronologyEvents: async (): Promise<EndpointChronologyEvent[]> =>
    await (await request(payloadApiUrl(Collections.ChronologyEvents, `all`))).json(),
  getChronologyEventByID: async (id: string): Promise<EndpointChronologyEvent> =>
    await (await request(payloadApiUrl(Collections.ChronologyEvents, `id/${id}`))).json(),
  getImageByID: async (id: string): Promise<EndpointImage> =>
    await (await request(payloadApiUrl(Collections.Images, `id/${id}`))).json(),
  getAudioByID: async (id: string): Promise<EndpointAudio> =>
    await (await request(payloadApiUrl(Collections.Audios, `id/${id}`))).json(),
  getVideoByID: async (id: string): Promise<EndpointVideo> =>
    await (await request(payloadApiUrl(Collections.Videos, `id/${id}`))).json(),
  getRecorderByID: async (id: string): Promise<EndpointRecorder> =>
    await (await request(payloadApiUrl(Collections.Recorders, `id/${id}`))).json(),
};
