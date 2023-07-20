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
  id?: string;
}[];
export type RecorderBiographies = {
  language: string | Language;
  biography?: string;
  id?: string;
}[];

export interface Config {
  collections: {
    'library-items': LibraryItem;
    contents: Content;
    posts: Post;
    images: Image;
    files: File;
    languages: Language;
    recorders: Recorder;
    tags: Tag;
    users: User;
  };
  globals: {};
}
export interface LibraryItem {
  id: string;
  slug: string;
  thumbnail?: string | Image;
  pretitle?: string;
  title: string;
  subtitle?: string;
  rootItem: boolean;
  primary: boolean;
  digital: boolean;
  downloadable: boolean;
  size?: {
    width?: number;
    height?: number;
    thickness?: number;
  };
  updatedAt: string;
  createdAt: string;
  _status?: 'draft' | 'published';
}
export interface Image {
  id: string;
  alt?: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}
export interface Content {
  id: string;
  slug: string;
  thumbnail?: string | Image;
  testing?: (Section_1 | Collapsible_1 | Columns_1 | Tabs_1 | Accordion_1 | TextBlock | TranscriptBlock)[];
  categories?:
    | {
        value: string;
        relationTo: 'tags';
      }[]
    | {
        value: Tag;
        relationTo: 'tags';
      }[];
  type?: {
    value: string | Tag;
    relationTo: 'tags';
  };
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
    textContent?: {
      [k: string]: unknown;
    }[];
    textNotes?: string;
    video?: string | File;
    videoNotes?: string;
    audio?: string | File;
    id?: string;
  }[];
  updatedAt: string;
  createdAt: string;
  _status?: 'draft' | 'published';
}
export interface Section_1 {
  content?: (Section_2 | Collapsible_2 | Columns_2 | Tabs_2 | Accordion_2 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'section_1';
}
export interface Section_2 {
  content?: (Section_3 | Collapsible_3 | Columns_3 | Tabs_3 | Accordion_3 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'section_2';
}
export interface Section_3 {
  content?: (Section_4 | Collapsible_4 | Columns_4 | Tabs_4 | Accordion_4 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'section_3';
}
export interface Section_4 {
  content?: (TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'section_4';
}
export interface TextBlock {
  content: {
    [k: string]: unknown;
  }[];
  id?: string;
  blockName?: string;
  blockType: 'textBlock';
}
export interface TranscriptBlock {
  lines: (LineBlock | CueBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'transcriptBlock';
}
export interface LineBlock {
  content: {
    [k: string]: unknown;
  }[];
  id?: string;
  blockName?: string;
  blockType: 'lineBlock';
}
export interface CueBlock {
  content: string;
  id?: string;
  blockName?: string;
  blockType: 'cueBlock';
}
export interface Collapsible_4 {
  content?: (TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'collapsible_4';
}
export interface Columns_4 {
  columns?: Column_4[];
  id?: string;
  blockName?: string;
  blockType: 'columns_4';
}
export interface Column_4 {
  content?: (TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'column_4';
}
export interface Tabs_4 {
  tabs?: Tab_4[];
  id?: string;
  blockName?: string;
  blockType: 'tabs_4';
}
export interface Tab_4 {
  content?: (TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'tab_4';
}
export interface Accordion_4 {
  content?: Collapsible_5[];
  id?: string;
  blockName?: string;
  blockType: 'accordion_4';
}
export interface Collapsible_5 {
  content?: (TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'collapsible_5';
}
export interface Collapsible_3 {
  content?: (Section_4 | Collapsible_4 | Columns_4 | Tabs_4 | Accordion_4 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'collapsible_3';
}
export interface Columns_3 {
  columns?: Column_3[];
  id?: string;
  blockName?: string;
  blockType: 'columns_3';
}
export interface Column_3 {
  content?: (Section_4 | Collapsible_4 | Columns_4 | Tabs_4 | Accordion_4 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'column_3';
}
export interface Tabs_3 {
  tabs?: Tab_3[];
  id?: string;
  blockName?: string;
  blockType: 'tabs_3';
}
export interface Tab_3 {
  content?: (Section_4 | Collapsible_4 | Columns_4 | Tabs_4 | Accordion_4 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'tab_3';
}
export interface Accordion_3 {
  content?: Collapsible_4[];
  id?: string;
  blockName?: string;
  blockType: 'accordion_3';
}
export interface Collapsible_2 {
  content?: (Section_3 | Collapsible_3 | Columns_3 | Tabs_3 | Accordion_3 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'collapsible_2';
}
export interface Columns_2 {
  columns?: Column_2[];
  id?: string;
  blockName?: string;
  blockType: 'columns_2';
}
export interface Column_2 {
  content?: (Section_3 | Collapsible_3 | Columns_3 | Tabs_3 | Accordion_3 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'column_2';
}
export interface Tabs_2 {
  tabs?: Tab_2[];
  id?: string;
  blockName?: string;
  blockType: 'tabs_2';
}
export interface Tab_2 {
  content?: (Section_3 | Collapsible_3 | Columns_3 | Tabs_3 | Accordion_3 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'tab_2';
}
export interface Accordion_2 {
  content?: Collapsible_3[];
  id?: string;
  blockName?: string;
  blockType: 'accordion_2';
}
export interface Collapsible_1 {
  content?: (Section_2 | Collapsible_2 | Columns_2 | Tabs_2 | Accordion_2 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'collapsible_1';
}
export interface Columns_1 {
  columns?: Column_1[];
  id?: string;
  blockName?: string;
  blockType: 'columns_1';
}
export interface Column_1 {
  content?: (Section_2 | Collapsible_2 | Columns_2 | Tabs_2 | Accordion_2 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'column_1';
}
export interface Tabs_1 {
  tabs?: Tab_1[];
  id?: string;
  blockName?: string;
  blockType: 'tabs_1';
}
export interface Tab_1 {
  content?: (Section_2 | Collapsible_2 | Columns_2 | Tabs_2 | Accordion_2 | TextBlock | TranscriptBlock)[];
  id?: string;
  blockName?: string;
  blockType: 'tab_1';
}
export interface Accordion_1 {
  content?: Collapsible_2[];
  id?: string;
  blockName?: string;
  blockType: 'accordion_1';
}
export interface Tag {
  id: string;
  slug: string;
  type:
    | 'Contents'
    | 'LibraryAudio'
    | 'LibraryVideo'
    | 'LibraryTextual'
    | 'LibraryGroup'
    | 'Library'
    | 'Weapons'
    | 'GamePlatforms'
    | 'Categories';
  translations?: CategoryTranslations;
}
export interface Language {
  id: string;
  name: string;
}
export interface Recorder {
  id: string;
  avatar?: string | Image;
  username: string;
  anonymize: boolean;
  languages?: string[] | Language[];
  biographies?: RecorderBiographies;
}
export interface File {
  id: string;
  filename: string;
  type: 'LibraryScans' | 'LibrarySoundtracks' | 'ContentVideo' | 'ContentAudio';
  updatedAt: string;
  createdAt: string;
}
export interface Post {
  id: string;
  slug: string;
  thumbnail?: string | Image;
  authors:
    | {
        value: string;
        relationTo: 'recorders';
      }[]
    | {
        value: Recorder;
        relationTo: 'recorders';
      }[];
  categories?:
    | {
        value: string;
        relationTo: 'tags';
      }[]
    | {
        value: Tag;
        relationTo: 'tags';
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
  updatedAt: string;
  createdAt: string;
  _status?: 'draft' | 'published';
}
export interface User {
  id: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  salt?: string;
  hash?: string;
  loginAttempts?: number;
  lockUntil?: string;
  password?: string;
}
