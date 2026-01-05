'use client';

import type { BaseSelection, TextFormatType } from 'lexical';

import { $isTableSelection } from '@lexical/table';
import { $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { BoldIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useToolbarContext } from '@/components/editor/context/toolbar-context';
import { useUpdateToolbarHandler } from '@/components/editor/editor-hooks/use-update-toolbar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const FORMATS = [
  { format: 'bold', icon: BoldIcon, label: 'Bold' },
  { format: 'italic', icon: ItalicIcon, label: 'Italic' },
  { format: 'underline', icon: UnderlineIcon, label: 'Underline' },
  { format: 'strikethrough', icon: StrikethroughIcon, label: 'Strikethrough' }
] as const;

export const FontFormatToolbarPlugin = () => {
  const { activeEditor } = useToolbarContext();
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const $updateToolbar = useCallback((selection: BaseSelection) => {
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      const formats: string[] = [];
      FORMATS.forEach(({ format }) => {
        if (selection.hasFormat(format as TextFormatType)) {
          formats.push(format);
        }
      });
      setActiveFormats((prev) => {
        // Only update if formats have changed
        if (prev.length !== formats.length || !formats.every((f) => prev.includes(f))) {
          return formats;
        }
        return prev;
      });
    }
  }, []);

  useUpdateToolbarHandler($updateToolbar);

  return (
    <ToggleGroup
      size='sm'
      type='multiple'
      value={activeFormats}
      variant='outline'
      onValueChange={setActiveFormats}
    >
      {FORMATS.map(({ format, icon: Icon, label }) => (
        <ToggleGroupItem
          key={format}
          aria-label={label}
          value={format}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format as TextFormatType);
          }}
        >
          <Icon className='size-4' />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
