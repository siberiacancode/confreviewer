'use server';

import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

export const htmlToMarkdown = async (html: string) => {
  const result = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRemark)
    .use(remarkStringify, {
      tightDefinitions: true,
      wrap: false
    })
    .process(html);

  return String(result).trim();
};
