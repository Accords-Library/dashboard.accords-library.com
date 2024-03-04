import type {
  CueBlock,
  LineBlock,
  SectionBlock,
  SpacerBlock,
  TranscriptBlock,
} from "./types/collections";

// END MOCKING SECTION

export enum Collections {
  ChronologyEras = "chronology-eras",
  ChronologyItems = "chronology-items",
  Currencies = "currencies",
  Files = "files",
  Languages = "languages",
  Notes = "notes",
  Pages = "pages",
  PagesThumbnails = "pages-thumbnails",
  Recorders = "recorders",
  RecordersThumbnails = "recorders-thumbnails",
  VideosChannels = "videos-channels",
  Videos = "videos",
  Weapons = "weapons",
  WeaponsGroups = "weapons-groups",
  WeaponsThumbnails = "weapons-thumbnails",
  Folders = "folders",
  FoldersThumbnails = "folders-thumbnails",
  Tags = "tags",
  TagsGroups = "tags-groups",
  Images = "images",
  Wordings = "wordings",
  Collectibles = "collectibles",
  GenericContents = "generic-contents",
}

export enum CollectionGroups {
  Collections = "Collections",
  Media = "Media",
  Meta = "Meta",
}

export enum LanguageCodes {
  en = "English",
  fr = "French",
  ja = "Japan",
  es = "Spanish",
  "pt-br" = "Portuguese",
  "zh" = "Chinese",
}

export enum CollectibleBindingTypes {
  Paperback = "Paperback",
  Hardcover = "Hardcover",
}

export enum CollectiblePageOrders {
  LeftToRight = "Left to right",
  RightToLeft = "Right to left",
}

export enum CollectibleNature {
  Physical = "Physical",
  Digital = "Digital",
}

export enum CollectibleContentType {
  None = "None",
  Indexes = "Index-based",
  Pages = "Page-based",
}

export enum RecordersRoles {
  Admin = "Admin",
  Recorder = "Recorder",
  Api = "Api",
}

export enum CollectionStatus {
  Draft = "draft",
  Published = "published",
}

export enum VideoSources {
  YouTube = "YouTube",
  NicoNico = "NicoNico",
  Tumblr = "Tumblr",
}

export enum PageType {
  Content = "Content",
  Post = "Post",
  Generic = "Generic",
}

export enum SpacerSizes {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
  XLarge = "Extra Large",
}

/* RICH TEXT */

export type RichTextContent = {
  root: {
    children: RichTextNode[];
    direction: ("ltr" | "rtl") | null;
    format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
    indent: number;
    type: string;
    version: number;
  };
  [k: string]: unknown;
};

export type RichTextNode = {
  type: string;
  version: number;
  [k: string]: unknown;
};

export interface RichTextNodeWithChildren extends RichTextNode {
  children: RichTextNode[];
}

export interface RichTextParagraphNode extends RichTextNodeWithChildren {
  type: "paragraph";
  format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
}

export interface RichTextListNode extends RichTextNode {
  type: "list";
  children: RichTextNodeWithChildren[];
  listType: string;
}

export interface RichTextListNumberNode extends RichTextListNode {
  listType: "number";
}

export interface RichTextListBulletNode extends RichTextListNode {
  listType: "bullet";
}

export interface RichTextListCheckNode extends RichTextListNode {
  listType: "check";
}

export interface RichTextTextNode extends RichTextNode {
  type: "text";
  format: number;
  text: string;
}

export interface RichTextTabNode extends RichTextNode {
  type: "tab";
  format: number;
}

export interface RichTextLinkNode extends RichTextNodeWithChildren {
  type: "link";
  fields: {
    linkType: "internal" | "custom";
  };
}

export interface RichTextLinkInternalNode extends RichTextLinkNode {
  fields: {
    linkType: "internal";
    newTab: boolean;
    doc: {
      relationTo: string;
      value: any;
    };
  };
}

export interface RichTextLinkCustomNode extends RichTextLinkNode {
  fields: {
    linkType: "custom";
    newTab: boolean;
    url: string;
  };
}

export interface RichTextBlockNode extends RichTextNode {
  type: "block";
  fields: {
    blockType: string;
  };
}

export interface RichTextSectionBlock extends RichTextBlockNode {
  fields: SectionBlock & { anchorHash: string };
}

export interface RichTextTranscriptBlock extends RichTextBlockNode {
  fields: TranscriptBlock;
}

export interface RichTextSpacerBlock extends RichTextBlockNode {
  fields: SpacerBlock;
}

export const isNodeParagraphNode = (node: RichTextNode): node is RichTextParagraphNode =>
  node.type === "paragraph";

export const isNodeListNode = (node: RichTextNode): node is RichTextListNode =>
  node.type === "list";

export const isListNodeNumberListNode = (node: RichTextListNode): node is RichTextListNumberNode =>
  node.listType === "number";

export const isListNodeBulletListNode = (node: RichTextListNode): node is RichTextListBulletNode =>
  node.listType === "bullet";

export const isListNodeCheckListNode = (node: RichTextListNode): node is RichTextListCheckNode =>
  node.listType === "check";

export const isNodeTextNode = (node: RichTextNode): node is RichTextTextNode =>
  node.type === "text";

export const isNodeTabNode = (node: RichTextNode): node is RichTextTabNode => node.type === "tab";

export const isNodeLinkNode = (node: RichTextNode): node is RichTextLinkNode =>
  node.type === "link";

export const isLinkNodeInternalLinkNode = (
  node: RichTextLinkNode
): node is RichTextLinkInternalNode => node.fields.linkType === "internal";

export const isLinkNodeCustomLinkNode = (node: RichTextLinkNode): node is RichTextLinkCustomNode =>
  node.fields.linkType === "custom";

export const isNodeBlockNode = (node: RichTextNode): node is RichTextBlockNode =>
  node.type === "block";

export const isBlockNodeSectionBlock = (node: RichTextBlockNode): node is RichTextSectionBlock =>
  node.fields.blockType === "sectionBlock";

export const isBlockNodeTranscriptBlock = (
  node: RichTextBlockNode
): node is RichTextTranscriptBlock => node.fields.blockType === "transcriptBlock";

export const isBlockNodeSpacerBlock = (node: RichTextBlockNode): node is RichTextSpacerBlock =>
  node.fields.blockType === "spacerBlock";

/* BLOCKS */

/* TODO: TO BE REMOVED WHEN https://github.com/payloadcms/payload/issues/5216 is closed */
export interface CueBlock {
  id?: string | null;
  blockName?: string | null;
}

export interface LineBlock {
  id?: string | null;
  blockName?: string | null;
}

export interface GenericBlock {
  id?: string | null;
  blockName?: string | null;
  blockType: string;
}

export const isBlockCueBlock = (block: GenericBlock): block is CueBlock =>
  block.blockType === "cueBlock";

export const isBlockLineBlock = (block: GenericBlock): block is LineBlock =>
  block.blockType === "lineBlock";

export const isBlockSpacerBlock = (block: GenericBlock): block is SpacerBlock =>
  block.blockType === "spacerBlock";
