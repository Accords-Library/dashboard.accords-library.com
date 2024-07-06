import {
  AttributeTypes,
  CollectibleBindingTypes,
  CollectibleNature,
  CollectiblePageOrders,
  Collections,
  RichTextContent,
} from "./constants";
import { Currency, Language } from "./types/collections";

// END MOCKING SECTION

export type EndpointFolderPreview = {
  id: string;
  slug: string;
  icon?: string;
  translations: {
    language: string;
    title: string;
  }[];
};

export type EndpointFolder = Omit<EndpointFolderPreview, "translations"> & {
  translations: (EndpointFolderPreview["translations"][number] & {
    description?: RichTextContent;
  })[];
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
        relationTo: Collections.Collectibles;
        value: EndpointCollectiblePreview;
      }
    | {
        relationTo: Collections.Pages;
        value: EndpointPagePreview;
      }
    | {
        relationTo: Collections.Images;
        value: EndpointImagePreview;
      }
    | {
        relationTo: Collections.Audios;
        value: EndpointAudioPreview;
      }
    | {
        relationTo: Collections.Videos;
        value: EndpointVideoPreview;
      }
    | {
        relationTo: Collections.Files;
        value: EndpointFilePreview;
      }
  )[];
  parentPages: EndpointSource[];
};

export type EndpointWebsiteConfig = {
  home: {
    backgroundImage?: EndpointPayloadImage;
    folders: (EndpointFolderPreview & {
      lightThumbnail?: EndpointPayloadImage;
      darkThumbnail?: EndpointPayloadImage;
    })[];
  };
  timeline: {
    backgroundImage?: EndpointPayloadImage;
    breaks: number[];
    eventCount: number;
    eras: {
      startingYear: number;
      endingYear: number;
      name: string;
    }[];
  };
  defaultOpenGraphImage?: EndpointPayloadImage;
};

export type EndpointRecorderPreview = {
  id: string;
  username: string;
};

export type EndpointRecorder = EndpointRecorderPreview & {
  avatar?: EndpointPayloadImage;
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
  id: string;
  slug: string;
  page?: { slug: string };
  translations: {
    language: string;
    name: string;
  }[];
};

export type EndpointGenericAttribute = {
  id: string;
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
  id: string;
  icon: string;
  translations: {
    language: string;
    name: string;
  }[];
};

export type EndpointCredit = {
  role: EndpointRole;
  recorders: EndpointRecorderPreview[];
};

export type EndpointPagePreview = {
  id: string;
  slug: string;
  thumbnail?: EndpointPayloadImage;
  attributes: EndpointAttribute[];
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
  }[];
  updatedAt: string;
};

export type EndpointPage = Omit<EndpointPagePreview, "translations"> & {
  backgroundImage?: EndpointPayloadImage;
  translations: (EndpointPagePreview["translations"][number] & {
    sourceLanguage: string;
    summary?: RichTextContent;
    content: RichTextContent;
    credits: EndpointCredit[];
    toc: TableOfContentEntry[];
  })[];
  createdAt: string;
  updatedBy?: EndpointRecorderPreview;
  parentPages: EndpointSource[];
};

export type EndpointCollectiblePreview = {
  id: string;
  slug: string;
  thumbnail?: EndpointPayloadImage;
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
  }[];
  attributes: EndpointAttribute[];
  releaseDate?: string;
  languages: string[];
  price?: {
    amount: number;
    currency: string;
  };
};

export type EndpointCollectible = Omit<EndpointCollectiblePreview, "translations"> & {
  translations: (EndpointCollectiblePreview["translations"][number] & {
    description?: RichTextContent;
  })[];
  backgroundImage?: EndpointPayloadImage;
  nature: CollectibleNature;
  gallery?: { count: number; thumbnail: EndpointPayloadImage };
  scans?: { count: number; thumbnail: EndpointPayloadImage };
  urls: { url: string; label: string }[];
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
  files: EndpointFilePreview[];
  contents: {
    content:
      | {
          relationTo: Collections.Pages;
          value: EndpointPagePreview;
        }
      | {
          relationTo: Collections.Audios;
          value: EndpointAudioPreview;
        }
      | {
          relationTo: Collections.Videos;
          value: EndpointVideoPreview;
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
  updatedBy?: EndpointRecorderPreview;
  parentPages: EndpointSource[];
};

export type EndpointCollectibleScans = {
  slug: string;
  thumbnail?: EndpointPayloadImage;
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
  thumbnail?: EndpointPayloadImage;
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    description?: RichTextContent;
  }[];
  images: EndpointPayloadImage[];
  parentPages: EndpointSource[];
};

export type EndpointCollectibleGalleryImage = {
  slug: string;
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
  sizes: PayloadImage[];
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

export type EndpointSourcePreview = {
  id: string;
  slug: string;
  translations: { language: string; pretitle?: string; title: string; subtitle?: string }[];
};

export type EndpointSource =
  | { type: "url"; url: string; label: string }
  | {
      type: "collectible";
      collectible: EndpointSourcePreview;
      range?:
        | { type: "page"; page: number }
        | { type: "timestamp"; timestamp: string }
        | { type: "custom"; translations: { language: string; note: string }[] };
    }
  | { type: "page"; page: EndpointSourcePreview }
  | { type: "folder"; folder: EndpointSourcePreview }
  | { type: "scans"; collectible: EndpointSourcePreview }
  | { type: "gallery"; collectible: EndpointSourcePreview };

export type EndpointMediaPreview = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  attributes: EndpointAttribute[];
  translations: {
    language: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
  }[];
};

export type EndpointMedia = Omit<EndpointMediaPreview, "translations"> & {
  filesize: number;
  updatedAt: string;
  createdAt: string;
  translations: (EndpointMediaPreview["translations"][number] & {
    description?: RichTextContent;
  })[];
  credits: EndpointCredit[];
};

export type EndpointImagePreview = EndpointMediaPreview & {
  width: number;
  height: number;
  sizes: PayloadImage[];
  openGraph?: PayloadImage;
};

export type EndpointImage = EndpointMedia & {
  width: number;
  height: number;
  sizes: PayloadImage[];
  openGraph?: PayloadImage;
};

export type EndpointAudioPreview = EndpointMediaPreview & {
  thumbnail?: EndpointPayloadImage;
  duration: number;
};

export type EndpointAudio = EndpointMedia & {
  thumbnail?: EndpointPayloadImage;
  duration: number;
};

export type EndpointVideoPreview = EndpointMediaPreview & {
  thumbnail?: EndpointPayloadImage;
  subtitles: {
    language: string;
    url: string;
  }[];
  duration: number;
};

export type EndpointVideo = EndpointMedia & {
  thumbnail?: EndpointPayloadImage;
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

export type EndpointFilePreview = EndpointMediaPreview & {
  filesize: number;
  thumbnail?: EndpointPayloadImage;
};

export type EndpointFile = EndpointMedia & {
  filesize: number;
  thumbnail?: EndpointPayloadImage;
};

export type EndpointPayloadImage = PayloadImage & {
  sizes: PayloadImage[];
  openGraph?: PayloadImage;
};

export type PayloadMedia = {
  id: string;
  url: string;
  mimeType: string;
  filename: string;
  filesize: number;
};

export type PayloadImage = PayloadMedia & {
  width: number;
  height: number;
};

export type EndpointAllSDKUrls = {
  urls: string[];
};

export type EndpointAllIds = {
  collectibles: { slugs: string[] };
  pages: { slugs: string[] };
  folders: { slugs: string[] };
  videos: { ids: string[] };
  audios: { ids: string[] };
  images: { ids: string[] };
  files: { ids: string[] };
  recorders: { ids: string[] };
  chronologyEvents: { ids: string[] };
};

// SDK

export const getSDKEndpoint = {
  getConfigEndpoint: () => `/globals/${Collections.WebsiteConfig}/config`,
  getFolderEndpoint: (slug: string) => `/${Collections.Folders}/slug/${slug}`,
  getLanguagesEndpoint: () => `/${Collections.Languages}/all`,
  getCurrenciesEndpoint: () => `/${Collections.Currencies}/all`,
  getWordingsEndpoint: () => `/${Collections.Wordings}/all`,
  getPageEndpoint: (slug: string) => `/${Collections.Pages}/slug/${slug}`,
  getCollectibleEndpoint: (slug: string) => `/${Collections.Collectibles}/slug/${slug}`,
  getCollectibleScansEndpoint: (slug: string) => `/${Collections.Collectibles}/slug/${slug}/scans`,
  getCollectibleScanPageEndpoint: (slug: string, index: string) =>
    `/${Collections.Collectibles}/slug/${slug}/scans/${index}`,
  getCollectibleGalleryEndpoint: (slug: string) =>
    `/${Collections.Collectibles}/slug/${slug}/gallery`,
  getCollectibleGalleryImageEndpoint: (slug: string, index: string) =>
    `/${Collections.Collectibles}/slug/${slug}/gallery/${index}`,
  getChronologyEventsEndpoint: () => `/${Collections.ChronologyEvents}/all`,
  getChronologyEventByIDEndpoint: (id: string) => `/${Collections.ChronologyEvents}/id/${id}`,
  getImageByIDEndpoint: (id: string) => `/${Collections.Images}/id/${id}`,
  getAudioByIDEndpoint: (id: string) => `/${Collections.Audios}/id/${id}`,
  getVideoByIDEndpoint: (id: string) => `/${Collections.Videos}/id/${id}`,
  getFileByIDEndpoint: (id: string) => `/${Collections.Files}/id/${id}`,
  getRecorderByIDEndpoint: (id: string) => `/${Collections.Recorders}/id/${id}`,
  getAllSDKUrlsEndpoint: () => `/all-sdk-urls`,
  getAllIds: () => `/all-ids`,
  getLoginEndpoint: () => `/${Collections.Recorders}/login`,
};

type PayloadSDKResponse<T> = {
  data: T;
  endpointCalled: string;
};

type PayloadTokenCache = {
  set: (token: string, expirationTimestamp: number) => void;
  get: () => string | undefined;
};

type PayloadDataCache = {
  set: (url: string, response: any) => void;
  get: (url: string) => any | undefined;
};

export class PayloadSDK {
  private tokenCache: PayloadTokenCache | undefined;
  private dataCache: PayloadDataCache | undefined;

  constructor(
    private readonly apiURL: string,
    private readonly email: string,
    private readonly password: string
  ) {}

  addTokenCache(tokenCache: PayloadTokenCache) {
    this.tokenCache = tokenCache;
  }

  addDataCache(dataCache: PayloadDataCache) {
    this.dataCache = dataCache;
  }

  private logResponse(res: Response) {
    console.log(res.status, res.statusText, res.url);
  }

  private async refreshToken() {
    const loginUrl = `${this.apiURL}${getSDKEndpoint.getLoginEndpoint()}`;
    const loginResult = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.email, password: this.password }),
    });
    this.logResponse(loginResult);

    if (loginResult.status !== 200) {
      throw new Error("Unable to login");
    }

    const { token, exp } = (await loginResult.json()) as {
      token: string;
      exp: number;
    };
    this.tokenCache?.set(token, exp);
    return token;
  }

  async request<T>(endpoint: string): Promise<PayloadSDKResponse<T>> {
    const cachedResponse = this.dataCache?.get(endpoint);
    if (cachedResponse) {
      return cachedResponse;
    }

    const result = await fetch(`${this.apiURL}${endpoint}`, {
      headers: {
        Authorization: `JWT ${this.tokenCache?.get() ?? (await this.refreshToken())}`,
      },
    });
    this.logResponse(result);

    if (!result.ok) {
      throw new Error("Unhandled fetch error");
    }

    const response = { data: await result.json(), endpointCalled: endpoint };
    this.dataCache?.set(endpoint, response);
    return response;
  }

  async getConfig(): Promise<PayloadSDKResponse<EndpointWebsiteConfig>> {
    return await this.request(getSDKEndpoint.getConfigEndpoint());
  }
  async getFolder(slug: string): Promise<PayloadSDKResponse<EndpointFolder>> {
    return await this.request(getSDKEndpoint.getFolderEndpoint(slug));
  }
  async getLanguages(): Promise<PayloadSDKResponse<Language[]>> {
    return await this.request(getSDKEndpoint.getLanguagesEndpoint());
  }
  async getCurrencies(): Promise<PayloadSDKResponse<Currency[]>> {
    return await this.request(getSDKEndpoint.getCurrenciesEndpoint());
  }
  async getWordings(): Promise<PayloadSDKResponse<EndpointWording[]>> {
    return await this.request(getSDKEndpoint.getWordingsEndpoint());
  }
  async getPage(slug: string): Promise<PayloadSDKResponse<EndpointPage>> {
    return await this.request(getSDKEndpoint.getPageEndpoint(slug));
  }
  async getCollectible(slug: string): Promise<PayloadSDKResponse<EndpointCollectible>> {
    return await this.request(getSDKEndpoint.getCollectibleEndpoint(slug));
  }
  async getCollectibleScans(slug: string): Promise<PayloadSDKResponse<EndpointCollectibleScans>> {
    return await this.request(getSDKEndpoint.getCollectibleScansEndpoint(slug));
  }
  async getCollectibleScanPage(
    slug: string,
    index: string
  ): Promise<PayloadSDKResponse<EndpointCollectibleScanPage>> {
    return await this.request(getSDKEndpoint.getCollectibleScanPageEndpoint(slug, index));
  }
  async getCollectibleGallery(
    slug: string
  ): Promise<PayloadSDKResponse<EndpointCollectibleGallery>> {
    return await this.request(getSDKEndpoint.getCollectibleGalleryEndpoint(slug));
  }
  async getCollectibleGalleryImage(
    slug: string,
    index: string
  ): Promise<PayloadSDKResponse<EndpointCollectibleGalleryImage>> {
    return await this.request(getSDKEndpoint.getCollectibleGalleryImageEndpoint(slug, index));
  }
  async getChronologyEvents(): Promise<PayloadSDKResponse<EndpointChronologyEvent[]>> {
    return await this.request(getSDKEndpoint.getChronologyEventsEndpoint());
  }
  async getChronologyEventByID(id: string): Promise<PayloadSDKResponse<EndpointChronologyEvent>> {
    return await this.request(getSDKEndpoint.getChronologyEventByIDEndpoint(id));
  }
  async getImageByID(id: string): Promise<PayloadSDKResponse<EndpointImage>> {
    return await this.request(getSDKEndpoint.getImageByIDEndpoint(id));
  }
  async getAudioByID(id: string): Promise<PayloadSDKResponse<EndpointAudio>> {
    return await this.request(getSDKEndpoint.getAudioByIDEndpoint(id));
  }
  async getVideoByID(id: string): Promise<PayloadSDKResponse<EndpointVideo>> {
    return await this.request(getSDKEndpoint.getVideoByIDEndpoint(id));
  }
  async getFileByID(id: string): Promise<PayloadSDKResponse<EndpointFile>> {
    return await this.request(getSDKEndpoint.getFileByIDEndpoint(id));
  }
  async getRecorderByID(id: string): Promise<PayloadSDKResponse<EndpointRecorder>> {
    return await this.request(getSDKEndpoint.getRecorderByIDEndpoint(id));
  }
  async getAllSdkUrls(): Promise<PayloadSDKResponse<EndpointAllSDKUrls>> {
    return await this.request(getSDKEndpoint.getAllSDKUrlsEndpoint());
  }
  async getAllIds(): Promise<PayloadSDKResponse<EndpointAllIds>> {
    return await this.request(getSDKEndpoint.getAllIds());
  }
}
