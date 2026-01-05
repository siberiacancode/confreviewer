import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useState } from 'react';

import { ContentEditable } from '@/components/editor/editor-ui/content-editable';
import { ActionsPlugin } from '@/components/editor/plugins/actions/actions-plugin';
import { EditModeTogglePlugin } from '@/components/editor/plugins/actions/edit-mode-toggle-plugin';
import { FloatingTextFormatToolbarPlugin } from '@/components/editor/plugins/floating-text-format-plugin';
import { FontFormatToolbarPlugin } from '@/components/editor/plugins/toolbar/font-format-toolbar-plugin';
import { HistoryToolbarPlugin } from '@/components/editor/plugins/toolbar/history-toolbar-plugin';
import { ToolbarPlugin } from '@/components/editor/plugins/toolbar/toolbar-plugin';

export const Plugins = () => {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [_isLinkEditMode, setIsLinkEditMode] = useState(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className='relative'>
      <ToolbarPlugin>
        {() => (
          <div className='vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1'>
            <HistoryToolbarPlugin />
            <FontFormatToolbarPlugin />
          </div>
        )}
      </ToolbarPlugin>
      <div className='relative'>
        <RichTextPlugin
          contentEditable={
            <div className=''>
              <div ref={onRef} className=''>
                <ContentEditable placeholder={'Start typing ...'} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
      </div>
      <ActionsPlugin>
        <div className='clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1'>
          <div className='flex flex-1 justify-start'>{/* left side action buttons */}</div>
          <div>{/* center action buttons */}</div>
          <div className='flex flex-1 justify-end'>
            {/* right side action buttons */}
            <EditModeTogglePlugin />
          </div>
        </div>
      </ActionsPlugin>

      <FloatingTextFormatToolbarPlugin
        anchorElem={floatingAnchorElem}
        setIsLinkEditMode={setIsLinkEditMode}
      />
    </div>
  );
};
