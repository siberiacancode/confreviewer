'use client';

import type { ChangeEvent } from 'react';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { insertConference } from '@/app/api/actions';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input
} from '@/components/ui';
import { cn } from '@/lib/utils';

const EXAMPLE_JSON = `{
  "conference": {
    "id": "techtrain_2025",
    "name": "TechTrain 2025",
    "description": "Краткое описание конференции",
    "logo": "https://example.com/logo.png",
    "url": "https://techtrain.ru"
  },
  "talks": [
    {
      "title": "State of JS",
      "description": "Доклад про JavaScript и экосистему",
      "url": "https://techtrain.ru/talks/state-of-js",
      "logo": "https://example.com/talk.png",
      "speakers": [
        {
          "name": "Иван Иванов",
          "company": "ACME Corp",
          "avatar": "https://example.com/avatar.png"
        }
      ]
    }
  ]
}`;

const AdminInsertConferencePage = () => {
  const [jsonText, setJsonText] = useState('');
  const [fileName, setFileName] = useState<string>();
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setJsonText(text);
    setFileName(file.name);
  };

  const handleUpload = () => {
    if (!jsonText.trim()) {
      toast.error('Загрузите JSON-файл или вставьте данные вручную');
      return;
    }

    startTransition(async () => {
      const result = await insertConference(jsonText as any);

      if (!result.success) {
        toast.error(result.error ?? 'Не удалось создать конференцию');
        return;
      }

      toast.success(`Конференция сохранена. Создано: ${result.createdTalks ?? 0}`);
      setJsonText('');
      setFileName(undefined);
      setFileInputKey((key) => key + 1);
    });
  };

  return (
    <div className='mx-auto flex max-w-5xl flex-col gap-6 py-10'>
      <Card>
        <CardHeader className='gap-2'>
          <CardTitle>Загрузка конференции из JSON</CardTitle>
          <CardDescription>
            Выберите JSON-файл или вставьте данные вручную. Формат примера ниже.
          </CardDescription>
        </CardHeader>

        <CardContent className='flex flex-col gap-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <Input
              key={fileInputKey}
              accept='application/json'
              disabled={isPending}
              type='file'
              onChange={handleFileChange}
            />
            {fileName && <span className='text-muted-foreground text-sm'>{fileName}</span>}
            <Button disabled={isPending} type='button' onClick={handleUpload}>
              {isPending ? 'Загружаем...' : 'Загрузить'}
            </Button>
          </div>

          <textarea
            className={cn(
              'border-input bg-background ring-offset-background placeholder:text-muted-foreground',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'min-h-[280px] w-full rounded-md border px-3 py-2 font-mono text-sm shadow-xs outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            disabled={isPending}
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            placeholder='Вставьте JSON, если не хотите загружать файл'
          />

          <div className='bg-muted/40 rounded-lg border p-4'>
            <p className='text-sm font-medium'>Пример формата</p>
            <pre className='text-muted-foreground mt-2 text-xs leading-relaxed whitespace-pre-wrap'>
              {EXAMPLE_JSON}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInsertConferencePage;
