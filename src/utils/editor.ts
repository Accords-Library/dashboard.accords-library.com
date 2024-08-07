import {
  AlignFeature,
  BlocksFeature,
  BoldTextFeature,
  CheckListFeature,
  FeatureProvider,
  // IndentFeature,
  HeadingFeature,
  InlineCodeTextFeature,
  ItalicTextFeature,
  LinkFeature,
  // BlockQuoteFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  StrikethroughTextFeature,
  SubscriptTextFeature,
  SuperscriptTextFeature,
  TreeViewFeature,
  UnderlineTextFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { Block, RichTextAdapter } from "payload/types";

interface EditorOptions {
  debugs: boolean;
  blocks: Block[];
  headings: boolean;
  lists: boolean;
  inlines: boolean;
  images: boolean;
  relations: boolean;
  links: boolean;
  alignment: boolean;
}

export const createEditor = ({
  debugs = false,
  blocks = [],
  headings = false,
  images = false,
  inlines = false,
  lists = false,
  links = false,
  relations = false,
  alignment = false,
}: Partial<EditorOptions>): RichTextAdapter<any, any, any> => {
  const enabledFeatures: FeatureProvider[] = [];

  if (lists) enabledFeatures.push(OrderedListFeature(), UnorderedListFeature(), CheckListFeature());
  if (blocks.length > 0) enabledFeatures.push(BlocksFeature({ blocks }));
  if (headings) enabledFeatures.push(ParagraphFeature(), HeadingFeature({}));
  if (debugs) enabledFeatures.push(TreeViewFeature());
  if (images) enabledFeatures.push(UploadFeature());
  if (links) enabledFeatures.push(LinkFeature({}));
  if (relations) enabledFeatures.push(RelationshipFeature());
  if (alignment) enabledFeatures.push(AlignFeature());
  if (inlines)
    enabledFeatures.push(
      BoldTextFeature(),
      ItalicTextFeature(),
      UnderlineTextFeature(),
      StrikethroughTextFeature(),
      SubscriptTextFeature(),
      SuperscriptTextFeature(),
      InlineCodeTextFeature()
    );

  return lexicalEditor({
    features: enabledFeatures,
  });
};
