/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export type CategoryTranslations = {
  language: string | Language;
  name: string;
  short?: string;
  id?: string;
}[];
export type RecorderBiographies = {
  language: string | Language;
  biography: string;
  id?: string;
}[];
export type ContentFoldersTranslation = {
  language: string | Language;
  name: string;
  id?: string;
}[];

export interface Config {
  collections: {
    "library-items": LibraryItem;
    contents: Content;
    "contents-folders": ContentsFolder;
    posts: Post;
    "chronology-items": ChronologyItem;
    "chronology-eras": ChronologyEra;
    weapons: Weapon;
    "weapons-groups": WeaponsGroup;
    "weapons-thumbnails": WeaponsThumbnail;
    "contents-thumbnails": ContentsThumbnail;
    "library-items-thumbnails": LibraryItemThumbnail;
    "library-items-scans": LibraryItemScans;
    "library-items-gallery": LibraryItemGallery;
    "recorders-thumbnails": RecordersThumbnail;
    "posts-thumbnails": PostThumbnail;
    files: File;
    videos: Video;
    "videos-channels": VideosChannel;
    languages: Language;
    currencies: Currency;
    recorders: Recorder;
    keys: Key;
  };
  globals: {};
}
export interface LibraryItem {
  id: string;
  itemType?: "Textual" | "Audio" | "Video" | "Game" | "Other";
  slug: string;
  thumbnail?: string | LibraryItemThumbnail;
  pretitle?: string;
  title: string;
  subtitle?: string;
  rootItem: boolean;
  primary: boolean;
  digital: boolean;
  downloadable: boolean;
  gallery?: {
    image?: string | LibraryItemGallery;
    id?: string;
  }[];
  scans?: {
    cover?: {
      front?: string | LibraryItemScans;
      spine?: string | LibraryItemScans;
      back?: string | LibraryItemScans;
      insideFront?: string | LibraryItemScans;
      flapFront?: string | LibraryItemScans;
      flapBack?: string | LibraryItemScans;
      insideFlapFront?: string | LibraryItemScans;
      insideFlapBack?: string | LibraryItemScans;
      id?: string;
    }[];
    dustjacket?: {
      front?: string | LibraryItemScans;
      spine?: string | LibraryItemScans;
      back?: string | LibraryItemScans;
      insideFront?: string | LibraryItemScans;
      insideSpine?: string | LibraryItemScans;
      insideBack?: string | LibraryItemScans;
      flapFront?: string | LibraryItemScans;
      flapBack?: string | LibraryItemScans;
      insideFlapFront?: string | LibraryItemScans;
      insideFlapBack?: string | LibraryItemScans;
      id?: string;
    }[];
    obi?: {
      front?: string | LibraryItemScans;
      spine?: string | LibraryItemScans;
      back?: string | LibraryItemScans;
      insideFront?: string | LibraryItemScans;
      insideSpine?: string | LibraryItemScans;
      insideBack?: string | LibraryItemScans;
      flapFront?: string | LibraryItemScans;
      flapBack?: string | LibraryItemScans;
      insideFlapFront?: string | LibraryItemScans;
      insideFlapBack?: string | LibraryItemScans;
      id?: string;
    }[];
    pages?: {
      page: number;
      image: string | LibraryItemScans;
      id?: string;
    }[];
    id?: string;
  }[];
  textual?: {
    subtype?: string[] | Key[];
    languages?: string[] | Language[];
    pageCount?: number;
    bindingType?: "Paperback" | "Hardcover";
    pageOrder?: "LeftToRight" | "RightToLeft";
  };
  audio?: {
    audioSubtype?: string[] | Key[];
  };
  releaseDate?: string;
  categories?: string[] | Key[];
  translations?: {
    language: string | Language;
    description: string;
    id?: string;
  }[];
  size?: {
    width: number;
    height: number;
    thickness?: number;
    id?: string;
  }[];
  price?: {
    amount: number;
    currency: string | Currency;
    id?: string;
  }[];
  urls?: {
    url: string;
    id?: string;
  }[];
  contents?: {
    content: string | Content;
    pageStart?: number;
    pageEnd?: number;
    timeStart?: number;
    timeEnd?: number;
    note?: string;
    id?: string;
  }[];
  updatedBy: string | Recorder;
  updatedAt: string;
  createdAt: string;
  _status?: "draft" | "published";
}
export interface LibraryItemThumbnail {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes?: {
    thumb?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    og?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    square?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    max?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
  };
}
export interface LibraryItemGallery {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes?: {
    thumb?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    small?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    max?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
  };
}
export interface LibraryItemScans {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes?: {
    thumb?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    og?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    medium?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    large?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
  };
}
export interface Key {
  id: string;
  name: string;
  type:
    | "Contents"
    | "LibraryAudio"
    | "LibraryVideo"
    | "LibraryTextual"
    | "LibraryGroup"
    | "Library"
    | "Weapons"
    | "GamePlatforms"
    | "Categories"
    | "Wordings";
  translations?: CategoryTranslations;
}
export interface Language {
  id: string;
  name: string;
}
export interface Currency {
  id: string;
}
export interface Content {
  id: string;
  slug: string;
  thumbnail?: string | ContentsThumbnail;
  categories?: string[] | Key[];
  type?: string | Key;
  translations: {
    language: string | Language;
    sourceLanguage: string | Language;
    pretitle?: string;
    title: string;
    subtitle?: string;
    summary?: string;
    textTranscribers?: string[] | Recorder[];
    textTranslators?: string[] | Recorder[];
    textProofreaders?: string[] | Recorder[];
    textContent?: (TextBlock | Section | Tabs | TranscriptBlock | QuoteBlock)[];
    textNotes?: string;
    video?: string | File;
    videoNotes?: string;
    audio?: string | File;
    id?: string;
  }[];
  updatedBy: string | Recorder;
  updatedAt: string;
  createdAt: string;
  _status?: "draft" | "published";
}
export interface ContentsThumbnail {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes?: {
    thumb?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    og?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    medium?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
  };
}
export interface Recorder {
  id: string;
  username: string;
  avatar?: string | RecordersThumbnail;
  languages?: string[] | Language[];
  biographies?: RecorderBiographies;
  role?: ("Admin" | "Recorder")[];
  anonymize: boolean;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  salt?: string;
  hash?: string;
  loginAttempts?: number;
  lockUntil?: string;
  password?: string;
}
export interface RecordersThumbnail {
  id: string;
  recorder?: string | Recorder;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes?: {
    thumb?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    og?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    small?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
  };
}
export interface TextBlock {
  content: {
    [k: string]: unknown;
  }[];
  id?: string;
  blockName?: string;
  blockType: "textBlock";
}
export interface Section {
  content?: (Section_Section | Section_Tabs | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Section_Section {
  content?: (
    | Section_Section_Section
    | Section_Section_Tabs
    | TranscriptBlock
    | QuoteBlock
    | TextBlock
  )[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Section_Section_Section {
  content?: (
    | Section_Section_Section_Section
    | Section_Section_Section_Tabs
    | TranscriptBlock
    | QuoteBlock
    | TextBlock
  )[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Section_Section_Section_Section {
  content?: (Section_Section_Section_Section_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Section_Section_Section_Section_Section {
  content?: (TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface TranscriptBlock {
  lines: (LineBlock | CueBlock)[];
  id?: string;
  blockName?: string;
  blockType: "transcriptBlock";
}
export interface LineBlock {
  content: {
    [k: string]: unknown;
  }[];
  id?: string;
  blockName?: string;
  blockType: "lineBlock";
}
export interface CueBlock {
  content: string;
  id?: string;
  blockName?: string;
  blockType: "cueBlock";
}
export interface QuoteBlock {
  from: string;
  content: {
    [k: string]: unknown;
  }[];
  id?: string;
  blockName?: string;
  blockType: "quoteBlock";
}
export interface Section_Section_Section_Tabs {
  tabs?: Section_Section_Section_Tabs_Tab[];
  id?: string;
  blockName?: string;
  blockType: "tabs";
}
export interface Section_Section_Section_Tabs_Tab {
  content?: (Section_Section_Section_Tabs_Tab_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "tab";
}
export interface Section_Section_Section_Tabs_Tab_Section {
  content?: (TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Section_Section_Tabs {
  tabs?: Section_Section_Tabs_Tab[];
  id?: string;
  blockName?: string;
  blockType: "tabs";
}
export interface Section_Section_Tabs_Tab {
  content?: (Section_Section_Tabs_Tab_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "tab";
}
export interface Section_Section_Tabs_Tab_Section {
  content?: (Section_Section_Tabs_Tab_Section_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Section_Section_Tabs_Tab_Section_Section {
  content?: (TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Section_Tabs {
  tabs?: Section_Tabs_Tab[];
  id?: string;
  blockName?: string;
  blockType: "tabs";
}
export interface Section_Tabs_Tab {
  content?: (Section_Tabs_Tab_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "tab";
}
export interface Section_Tabs_Tab_Section {
  content?: (Section_Tabs_Tab_Section_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Section_Tabs_Tab_Section_Section {
  content?: (Section_Tabs_Tab_Section_Section_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Section_Tabs_Tab_Section_Section_Section {
  content?: (TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Tabs {
  tabs?: Tabs_Tab[];
  id?: string;
  blockName?: string;
  blockType: "tabs";
}
export interface Tabs_Tab {
  content?: (Tabs_Tab_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "tab";
}
export interface Tabs_Tab_Section {
  content?: (Tabs_Tab_Section_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Tabs_Tab_Section_Section {
  content?: (Tabs_Tab_Section_Section_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Tabs_Tab_Section_Section_Section {
  content?: (Tabs_Tab_Section_Section_Section_Section | TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface Tabs_Tab_Section_Section_Section_Section {
  content?: (TranscriptBlock | QuoteBlock | TextBlock)[];
  id?: string;
  blockName?: string;
  blockType: "section";
}
export interface File {
  id: string;
  filename: string;
  type: "LibraryScans" | "LibrarySoundtracks" | "ContentVideo" | "ContentAudio";
  updatedAt: string;
  createdAt: string;
}
export interface ContentsFolder {
  id: string;
  slug: string;
  translations?: ContentFoldersTranslation;
  subfolders?: string[] | ContentsFolder[];
  contents?: string[] | Content[];
}
export interface Post {
  id: string;
  slug: string;
  thumbnail?: string | PostThumbnail;
  authors:
    | {
        value: string;
        relationTo: "recorders";
      }[]
    | {
        value: Recorder;
        relationTo: "recorders";
      }[];
  categories?:
    | {
        value: string;
        relationTo: "keys";
      }[]
    | {
        value: Key;
        relationTo: "keys";
      }[];
  translations: {
    language: string | Language;
    sourceLanguage: string | Language;
    title: string;
    summary?: string;
    translators?: string[] | Recorder[];
    proofreaders?: string[] | Recorder[];
    content?: {
      [k: string]: unknown;
    }[];
    id?: string;
  }[];
  publishedDate: string;
  hidden?: boolean;
  updatedBy: string | Recorder;
  updatedAt: string;
  createdAt: string;
  _status?: "draft" | "published";
}
export interface PostThumbnail {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes?: {
    thumb?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    og?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    medium?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
  };
}
export interface ChronologyItem {
  id: string;
  name?: string;
  date: {
    year: number;
    month?: number;
    day?: number;
  };
  events: {
    source?:
      | {
          value: string | Content;
          relationTo: "contents";
        }
      | {
          value: string | LibraryItem;
          relationTo: "library-items";
        };
    translations: {
      language: string | Language;
      sourceLanguage: string | Language;
      title?: string;
      description?: string;
      notes?: string;
      transcribers?: string[] | Recorder[];
      translators?: string[] | Recorder[];
      proofreaders?: string[] | Recorder[];
      id?: string;
    }[];
    id?: string;
  }[];
  updatedBy: string | Recorder;
  updatedAt: string;
  createdAt: string;
  _status?: "draft" | "published";
}
export interface ChronologyEra {
  id: string;
  slug: string;
  startingYear: number;
  endingYear: number;
  translations?: {
    language: string | Language;
    title: string;
    description?: string;
    id?: string;
  }[];
  events?: string[] | ChronologyItem[];
  updatedAt: string;
  createdAt: string;
}
export interface Weapon {
  id: string;
  slug: string;
  thumbnail?: string | WeaponsThumbnail;
  type: string | Key;
  group?: string | WeaponsGroup;
  appearances: {
    categories: string[] | Key[];
    translations: {
      language: string | Language;
      sourceLanguage: string | Language;
      name: string;
      description?: string;
      level1?: string;
      level2?: string;
      level3?: string;
      level4?: string;
      transcribers?: string[] | Recorder[];
      translators?: string[] | Recorder[];
      proofreaders?: string[] | Recorder[];
      id?: string;
    }[];
    id?: string;
  }[];
  updatedBy: string | Recorder;
  updatedAt: string;
  createdAt: string;
  _status?: "draft" | "published";
}
export interface WeaponsThumbnail {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes?: {
    thumb?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    og?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    small?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    medium?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    max?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
  };
}
export interface WeaponsGroup {
  id: string;
  slug: string;
  translations?: {
    language: string | Language;
    name: string;
    id?: string;
  }[];
  weapons?: string[] | Weapon[];
}
export interface Video {
  id: string;
  uid: string;
  gone: boolean;
  source: "YouTube" | "NicoNico" | "Tumblr";
  title: string;
  description?: string;
  likes?: number;
  views?: number;
  publishedDate: string;
  channel: string | VideosChannel;
}
export interface VideosChannel {
  id: string;
  uid: string;
  title: string;
  subscribers?: number;
}
