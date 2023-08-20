import { BlocksConfig, generateBlocks } from "../../../utils/recursiveBlocks";
import { quoteBlock } from "./quoteBlock";
import { textBlock } from "./textBlock";
import { transcriptBlock } from "./transcriptBlock";

const enum BlockName {
  Text = "Text",
  Section = "Section",
  Tabs = "Tabs",
  Tab = "Tab",
  Transcript = "Transcript",
  Quote = "Quote",
}

const blocksConfig: BlocksConfig<BlockName> = {
  Text: {
    root: true,
    block: textBlock,
  },
  Section: {
    root: true,
    block: {
      slug: "section",
      labels: { singular: "Section", plural: "Sections" },
      recursion: {
        name: "content",
        condition: (depth) => depth < 5,
        newDepth: (depth) => depth + 1,
        blocks: [
          BlockName.Section,
          BlockName.Tabs,
          BlockName.Transcript,
          BlockName.Quote,
          BlockName.Text,
        ],
      },
    },
  },
  Tabs: {
    root: true,
    block: {
      slug: "tabs",
      labels: { singular: "Tabs", plural: "Tabs" },
      recursion: {
        name: "tabs",
        newDepth: (depth) => depth,
        condition: (depth, parents) => !parents.includes(BlockName.Tabs) && depth < 5,
        blocks: [BlockName.Tab],
      },
    },
  },
  Tab: {
    root: false,
    block: {
      slug: "tab",
      labels: { singular: "Tab", plural: "Tabs" },
      recursion: {
        name: "content",
        condition: (depth) => depth < 5,
        newDepth: (depth) => depth + 1,
        blocks: [
          BlockName.Section,
          BlockName.Tabs,
          BlockName.Transcript,
          BlockName.Quote,
          BlockName.Text,
        ],
      },
    },
  },
  Transcript: {
    root: true,
    block: transcriptBlock,
  },
  Quote: {
    root: true,
    block: quoteBlock,
  },
};

export const contentBlocks = generateBlocks(blocksConfig);
