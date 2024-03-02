import { Collections, PageType, RichTextContent } from "./constants";
import { Currency, Key, Language, LibraryItem, Page } from "./types/collections";

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
      email: import.meta.env.PAYLOAD_USER,
      password: import.meta.env.PAYLOAD_PASSWORD,
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

const payloadApiUrl = (collection: Collections, endpoint?: string): string =>
  `${import.meta.env.PAYLOAD_API_URL}/${collection}${endpoint === undefined ? "" : `/${endpoint}`}`;

const request = async (url: string, init?: RequestInit): Promise<Response> => {
  const result = await fetch(url, await injectAuth(init));
  logResponse(result);

  if (result.status !== 200) {
    throw new Error("Unhandled fetch error");
  }

  return result;
};

// SDK and Types

export type EndpointWeapon = EndpointBasicWeapon & {
  appearances: {
    categories: string[];
    translations: {
      language: string;
      sourceLanguage: string;
      name: string;
      description?: string;
      level1?: string;
      level2?: string;
      level3?: string;
      level4?: string;
      transcribers: string[];
      translators: string[];
      proofreaders: string[];
    }[];
  }[];
  group?: {
    slug: string;
    translations: { language: string; name: string }[];
    weapons: EndpointBasicWeapon[];
  };
};

export type EndpointBasicWeapon = {
  slug: string;
  type: string;
  categories: string[];
  translations: { language: string; name: string; aliases: string[] }[];
  images?: {
    previewCard: PayloadImage;
    thumbnailHeader: PayloadImage;
    lightBox: PayloadImage;
    openGraph: PayloadImage;
  };
};

export type EndpointEra = {
  slug: string;
  startingYear: number;
  endingYear: number;
  translations: {
    language: string;
    title: string;
    description?: string;
  }[];
  items: {
    date: {
      year: number;
      month?: number;
      day?: number;
    };
    events: {
      translations: {
        language: string;
        sourceLanguage: string;
        title?: string;
        description?: string;
        notes?: string;
        transcribers: string[];
        translators: string[];
        proofreaders: string[];
      }[];
    }[];
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
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
        relationTo: "library-items";
        value: LibraryItem;
      }
    | {
        relationTo: "pages";
        value: Page;
      }
  )[];
};

export type EndpointFolderPreview = {
  slug: string;
  icon?: string;
  translations: {
    language: string;
    name: string;
    description?: RichTextContent;
  }[];
  lightThumbnail?: PayloadImage;
  darkThumbnail?: PayloadImage;
};

export type EndpointRecorder = {
  id: string;
  username: string;
  avatar?: PayloadImage;
  languages: string[];
  biographies: {
    language: string;
    biography: RichTextContent;
  }[];
};

export type EndpointKey = {
  id: string;
  name: string;
  type: Key["type"];
  translations: {
    language: string;
    name: string;
    short: string;
  }[];
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
  group: string;
};

export type EndpointTagsGroup = {
  slug: string;
  icon?: string;
  translations: {
    language: string;
    name: string;
  }[];
  tags: EndpointTag[];
};

export type EndpointPage = {
  slug: string;
  type: PageType;
  thumbnail?: PayloadImage;
  authors: string[];
  tagGroups: TagGroup[];
  translations: {
    language: string;
    sourceLanguage: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    summary?: RichTextContent;
    content: RichTextContent;
    transcribers: string[];
    translators: string[];
    proofreaders: string[];
    toc: TableOfContentEntry[];
  }[];
  status: "draft" | "published";
  parentPages: ParentPage[];
};

export type ParentPage = {
  slug: string;
  collection: Collections;
  translations: { language: string; name: string }[];
  tag: string;
};

export type TagGroup = { slug: string; icon: string; values: string[] };

export type TableOfContentEntry = {
  prefix: string;
  title: string;
  children: TableOfContentEntry[];
};

export type PayloadImage = {
  url: string;
  width: number;
  height: number;
  mimeType: string;
  filename: string;
};

export const payload = {
  getWeapon: async (slug: string): Promise<EndpointWeapon> =>
    await (await request(payloadApiUrl(Collections.Weapons, `slug/${slug}`))).json(),
  getEras: async (): Promise<EndpointEra[]> =>
    await (await request(payloadApiUrl(Collections.ChronologyEras, `all`))).json(),
  getRootFolders: async (): Promise<EndpointFolderPreview[]> =>
    await (await request(payloadApiUrl(Collections.Folders, `root`))).json(),
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
  getTags: async (): Promise<EndpointTag[]> =>
    await (await request(payloadApiUrl(Collections.Tags, `all`))).json(),
  getTagsGroups: async (): Promise<EndpointTagsGroup[]> =>
    await (await request(payloadApiUrl(Collections.TagsGroups, `all`))).json(),
  getPage: async (slug: string): Promise<EndpointPage> =>
    await (await request(payloadApiUrl(Collections.Pages, `slug/${slug}`))).json(),
};
