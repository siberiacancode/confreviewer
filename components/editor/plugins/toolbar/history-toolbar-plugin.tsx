'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IS_APPLE, mergeRegister } from '@lexical/utils';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  REDO_COMMAND,
  UNDO_COMMAND
} from 'lexical';
import { RedoIcon, UndoIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useToolbarContext } from '@/components/editor/context/toolbar-context';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export const HistoryToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const { activeEditor, $updateToolbar } = useToolbarContext();
  const [isEditable, setIsEditable] = useState(editor.isEditable());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  return (
    <ButtonGroup>
      <Button
        aria-label='Undo'
        className='!h-8 !w-8'
        disabled={!canUndo || !isEditable}
        size='icon'
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        type='button'
        variant={'outline'}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <UndoIcon className='size-4' />
      </Button>
      <Button
        aria-label='Redo'
        className='!h-8 !w-8'
        disabled={!canRedo || !isEditable}
        size='icon'
        title={IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)'}
        type='button'
        variant={'outline'}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        <RedoIcon className='size-4' />
      </Button>
    </ButtonGroup>
  );
};
