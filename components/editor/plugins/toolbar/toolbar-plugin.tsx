'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical';
import { useEffect, useState } from 'react';

import { ToolbarContext } from '@/components/editor/context/toolbar-context';
import { useEditorModal } from '@/components/editor/editor-hooks/use-modal';

export const ToolbarPlugin = ({
  children
}: {
  children: (props: { blockType: string }) => React.ReactNode;
}) => {
  const [editor] = useLexicalComposerContext();

  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<string>('paragraph');

  const [modal, showModal] = useEditorModal();

  const $updateToolbar = () => {};

  useEffect(() => {
    return activeEditor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);

  return (
    <ToolbarContext
      $updateToolbar={$updateToolbar}
      activeEditor={activeEditor}
      blockType={blockType}
      setBlockType={setBlockType}
      showModal={showModal}
    >
      {modal}

      {children({ blockType })}
    </ToolbarContext>
  );
};
