'use client';

import type { DialogProps } from '@radix-ui/react-dialog';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { TalkSpeaker } from '@/app/api/types';

const TalkUpdateFormSchema = z.object({
  name: z.string().min(1, { message: 'Укажите название доклада' }),
  company: z.string().min(1, { message: 'Укажите название компании' }),
  avatar: z.url().optional().describe('Speaker avatar')
});

export type TalkUpdateFormValues = z.infer<typeof TalkUpdateFormSchema>;

type UseTalkUpdateTaskDialogParams = DialogProps & {
  speaker?: TalkSpeaker;
  onSubmit?: (values: TalkUpdateFormValues) => Promise<void> | void;
};

export const useSpeakerTalkUpdateDialog = (params: UseTalkUpdateTaskDialogParams) => {
  const talkUpdateForm = useForm<TalkUpdateFormValues>({
    resolver: zodResolver(TalkUpdateFormSchema),
    defaultValues: {
      name: params.speaker?.name ?? '',
      company: params.speaker?.company ?? '',
      avatar: params.speaker?.avatar ?? undefined
    }
  });

  const onSubmit = talkUpdateForm.handleSubmit(async (values) => {
    await params.onSubmit?.(values);
    params.onOpenChange?.(false);
  });

  return {
    form: talkUpdateForm,
    functions: {
      onSubmit
    },
    state: {
      loading: talkUpdateForm.formState.isSubmitting
    }
  };
};
