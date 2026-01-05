import type { Klass, LexicalNode, LexicalNodeReplacement } from 'lexical';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ParagraphNode, TextNode } from 'lexical';

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> = [
  HeadingNode,
  ParagraphNode,
  TextNode,
  QuoteNode
];
