'use client';

import type { Extension, UseEditorOptions } from '@tiptap/react';

import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Markdown } from '@tiptap/markdown';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Separator } from '@/components/ui/separator';
import { BoldToolbar } from '@/components/ui/toolbars/bold';
import { BulletListToolbar } from '@/components/ui/toolbars/bullet-list';
import { ItalicToolbar } from '@/components/ui/toolbars/italic';
// import { LinkToolbar } from '@/components/ui/toolbars/link';
import { OrderedListToolbar } from '@/components/ui/toolbars/ordered-list';
import { RedoToolbar } from '@/components/ui/toolbars/redo';
import { SubscriptToolbar } from '@/components/ui/toolbars/subscript';
import { SuperscriptToolbar } from '@/components/ui/toolbars/superscript';
import { ToolbarProvider } from '@/components/ui/toolbars/toolbar-provider';
import { UnderlineToolbar } from '@/components/ui/toolbars/underline';
import { UndoToolbar } from '@/components/ui/toolbars/undo';

const extensions = [
  Markdown,
  Subscript,
  Superscript,
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal'
      }
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc'
      }
    },
    heading: {
      levels: [1, 2, 3, 4],
      HTMLAttributes: {
        class: 'tiptap-heading'
      }
    }
  })
];

export type TiptapProps = Partial<UseEditorOptions>;

export const Tiptap = (props: TiptapProps) => {
  const editor = useEditor({
    ...props,
    immediatelyRender: false,
    extensions: extensions as Extension[],
    contentType: 'markdown',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert !max-w-none focus:outline-none p-4'
      }
    }
  });

  if (!editor) {
    return null;
  }
  return (
    <div className='relative overflow-hidden rounded-md border pb-3'>
      <div className='bg-background sticky top-0 left-0 z-20 flex w-full items-center justify-between border-b px-2 py-2'>
        <ToolbarProvider editor={editor}>
          <div className='flex items-center gap-2'>
            <UndoToolbar />
            <RedoToolbar />
            <Separator className='h-7' orientation='vertical' />
            <BoldToolbar />
            <ItalicToolbar />
            {/* <LinkToolbar /> */}
            <UnderlineToolbar />
            <BulletListToolbar />
            <OrderedListToolbar />
            <SubscriptToolbar />
            <SuperscriptToolbar />
          </div>
        </ToolbarProvider>
      </div>
      <div
        className='bg-background min-h-[18rem] cursor-text'
        onClick={() => {
          editor?.chain().focus().run();
        }}
      >
        <EditorContent className='outline-none' editor={editor} />
      </div>
    </div>
  );
};
