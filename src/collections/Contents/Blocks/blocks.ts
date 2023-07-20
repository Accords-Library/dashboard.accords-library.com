import { Block, BlockField } from "payload/types";
import { cueBlock } from "./cueBlock";
import { textBlock } from "./textBlock";
import { transcriptBlock } from "./transcriptBlock";
import { lineBlock } from "./lineBlock";

const INITIAL_DEPTH = 1;
const MAX_DEPTH = 4;

enum BlockName {
  Text = "Text",
  Section = "Section",
  Tabs = "Tabs",
  Tab = "Tab",
  Columns = "Columns",
  Column = "Column",
  Transcript = "Transcript",
  Collapsible = "Collapsible",
  Accordion = "Accordion",
  Line = "Line",
  Cue = "Cue",
}

const rootBlocksNames: BlockName[] = [
  BlockName.Section,
  BlockName.Collapsible,
  BlockName.Columns,
  BlockName.Tabs,
  BlockName.Accordion,
  BlockName.Text,
  BlockName.Transcript,
];


const recursiveBlocks: BlockName[] = [
  BlockName.Section,
  BlockName.Collapsible,
  BlockName.Accordion,
  BlockName.Tabs,
  BlockName.Tab,
  BlockName.Column,
  BlockName.Columns,
];

const blocksChildren: Record<BlockName, BlockName[]> = {
  Tabs: [BlockName.Tab],
  Columns: [BlockName.Column],
  Section: rootBlocksNames,
  Collapsible: rootBlocksNames,
  Tab: rootBlocksNames,
  Column: rootBlocksNames,
  Accordion: [BlockName.Collapsible],
  Text: [],
  Transcript: [BlockName.Line, BlockName.Cue],
  Cue: [],
  Line: [],
};

export type RecursiveBlock = Omit<Block, "fields"> & {
  fields: Omit<BlockField, "blocks" | "type"> & {
    newDepth: (currentDepth: number) => number;
    blocks: BlockName[];
  };
};

// TODO: Check for loops in the block graph instead of manually defining recursive blocks 
const isNotRecursiveBlock = (name: BlockName): boolean => !recursiveBlocks.includes(name);

const implementationForRecursiveBlocks = (
  currentDepth: number,
  { slug, interfaceName, labels, fields: { newDepth, blocks, ...fieldsProps } }: RecursiveBlock
): Block => ({
  slug: [slug, currentDepth].join("_"),
  interfaceName: [interfaceName, currentDepth].join("_"),
  labels,
  fields: [
    {
      ...fieldsProps,
      type: "blocks",
      blocks: blocks
        .filter((block) => {
          if (currentDepth < MAX_DEPTH) return true;
          if (blocks.filter(isNotRecursiveBlock).length === 0) return true;
          return isNotRecursiveBlock(block);
        })
        .map((block) => implementations[block](newDepth(currentDepth))),
    },
  ],
});

const implementations: Record<BlockName, (currentDepth: number) => Block> = {
  Cue: () => cueBlock,
  Text: () => textBlock,
  Transcript: () => transcriptBlock,
  Line: () => lineBlock,
  Section: (currentDepth) =>
    implementationForRecursiveBlocks(currentDepth, {
      slug: "section",
      interfaceName: "Section",
      labels: { singular: "Section", plural: "Sections" },
      fields: {
        name: "content",
        newDepth: (depth) => depth + 1,
        blocks: blocksChildren.Section,
      },
    }),
  Accordion: (currentDepth) =>
    implementationForRecursiveBlocks(currentDepth, {
      slug: "accordion",
      interfaceName: "Accordion",
      labels: { singular: "Accordion", plural: "Accordions" },
      fields: {
        name: "content",
        newDepth: (depth) => depth + 1,
        blocks: blocksChildren.Accordion,
      },
    }),
  Collapsible: (currentDepth) =>
    implementationForRecursiveBlocks(currentDepth, {
      slug: "collapsible",
      interfaceName: "Collapsible",
      labels: { singular: "Collapsible", plural: "Collapsibles" },
      fields: {
        name: "content",
        newDepth: (depth) => depth + 1,
        blocks: blocksChildren.Collapsible,
      },
    }),
  Tabs: (currentDepth) =>
    implementationForRecursiveBlocks(currentDepth, {
      slug: "tabs",
      interfaceName: "Tabs",
      labels: { singular: "Tabs", plural: "Tabs" },
      fields: { name: "tabs", newDepth: (depth) => depth, blocks: blocksChildren.Tabs },
    }),
  Tab: (currentDepth) =>
    implementationForRecursiveBlocks(currentDepth, {
      slug: "tab",
      interfaceName: "Tab",
      labels: { singular: "Tab", plural: "Tabs" },
      fields: {
        name: "content",
        newDepth: (depth) => depth + 1,
        blocks: blocksChildren.Tab,
      },
    }),
  Columns: (currentDepth) =>
    implementationForRecursiveBlocks(currentDepth, {
      slug: "columns",
      interfaceName: "Columns",
      labels: { singular: "Columns", plural: "Columns" },
      fields: {
        name: "columns",
        newDepth: (depth) => depth,
        blocks: blocksChildren.Columns,
      },
    }),
  Column: (currentDepth) =>
    implementationForRecursiveBlocks(currentDepth, {
      slug: "column",
      interfaceName: "Column",
      labels: { singular: "Column", plural: "Columns" },
      fields: { name: "content", newDepth: (depth) => depth + 1, blocks: blocksChildren.Column },
    }),
};

export const rootBlocks: Block[] = rootBlocksNames
  .filter((block) => block in implementations)
  .map((block) => implementations[block](INITIAL_DEPTH));
