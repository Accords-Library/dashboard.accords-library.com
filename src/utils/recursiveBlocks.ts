import { Block, BlockField } from "payload/types";

const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

const recursionFieldName = "recursion" as const;

type BlockConfig<T extends string> = {
  root: boolean;
  block: RecursiveBlock<T> | Block;
};

type RecursiveBlock<T extends string> = Omit<Block, "fields" | "interfaceName"> & {
  [recursionFieldName]: Omit<BlockField, "blocks" | "type"> & {
    newDepth: (currentDepth: number) => number;
    condition: (currentDepth: number, parents: T[]) => boolean;
    blocks: T[];
  };
  fields?: Block["fields"];
};

export type BlocksConfig<T extends string> = Record<T, BlockConfig<T>>;

export const generateBlocks = <T extends string>(blocksConfig: BlocksConfig<T>): Block[] => {
  const isRecursiveBlock = (block: RecursiveBlock<T> | Block): block is RecursiveBlock<T> =>
    recursionFieldName in block;

  const getInterfaceName = (parents: T[], currentBlockName: T): string => {
    const capitalize = (text: string): string => {
      if (text.length === 0) return text;
      const [firstLetter, ...rest] = text;
      return [firstLetter.toUpperCase(), ...rest].join("");
    };
    return [...parents, currentBlockName]
      .map((blockName) => blocksConfig[blockName].block.slug)
      .map(capitalize)
      .join("_");
  };

  const getCurrentDepth = (parents: T[]): number =>
    parents.reduce((acc, blockName) => {
      const block = blocksConfig[blockName].block;
      if (!isRecursiveBlock(block)) return acc;
      return block[recursionFieldName].newDepth(acc);
    }, 1);

  const generateRecursiveBlocks = (parents: T[], blockName: T): Block | undefined => {
    const currentDepth = getCurrentDepth(parents);
    const block = blocksConfig[blockName].block;
    if (!isRecursiveBlock(block)) return block;

    const {
      slug,
      labels,
      fields = [],
      recursion: { newDepth, blocks, condition, ...fieldsProps },
    } = block;

    const generatedBlocks = blocks
      .filter((blockName) => {
        const block = blocksConfig[blockName].block;
        if (!isRecursiveBlock(block)) return true;
        return block[recursionFieldName].condition(currentDepth, parents);
      })
      .map((nextBlockName) => generateRecursiveBlocks([...parents, blockName], nextBlockName))
      .filter(isDefined);

    // Cut dead branches (branches without leafs)
    if (generatedBlocks.length === 0) {
      return undefined;
    }

    return {
      slug,
      interfaceName: getInterfaceName(parents, blockName),
      labels,
      fields: [
        ...fields,
        {
          ...fieldsProps,
          type: "blocks",
          blocks: generatedBlocks,
        },
      ],
    };
  };

  const rootBlockNames = Object.entries<BlockConfig<T>>(blocksConfig)
    .filter(([_, blockConfig]) => blockConfig.root)
    .map(([blockName]) => blockName as T);

  return rootBlockNames
    .map((blockName) => generateRecursiveBlocks([], blockName))
    .filter(isDefined);
};
