import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@siberiacancode/reactuse';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import type { TalkSpeaker } from '@/app/api/types';

import { updateTalk } from '@/app/(admin)/(actions)/updateTalk';

import type { TalkUpdateFormValues } from '../../SpeakerTalkUpdateDialog/hooks';

import { useConference } from '../../../(contexts)/conference';
import { useTalk } from '../../../(contexts)/talk';

const editTalkFormSchema = z.object({
  title: z.string(),
  description: z.string()
});

export type EditTalkFormValues = z.infer<typeof editTalkFormSchema>;

export const useEditTalkForm = () => {
  const router = useRouter();
  const talkContext = useTalk();
  const conferenceContext = useConference();

  const talk = talkContext.talk;
  const conference = conferenceContext.conference;

  const [speakers, setSpeakers] = useState<TalkSpeaker[]>(talk.speakers);
  const [selectedSpeaker, setSelectedSpeaker] = useState<TalkSpeaker>();

  const [isPending, startTransition] = useTransition();

  const speakerDialogDisclosure = useDisclosure();

  const editTalkForm = useForm<EditTalkFormValues>({
    defaultValues: {
      title: talk.title,
      description: talk.description
    },
    resolver: zodResolver(editTalkFormSchema)
  });

  const onSpeakerEdit = (speaker: TalkSpeaker) => {
    setSelectedSpeaker(speaker);
    speakerDialogDisclosure.open();
  };

  const onSpeakerAdd = () => speakerDialogDisclosure.open();

  const onSpeakerDialogClose = () => {
    setSelectedSpeaker(undefined);
    speakerDialogDisclosure.close();
  };

  const onSpeakerSubmit = (updatedSpeaker: TalkUpdateFormValues) => {
    if (selectedSpeaker) {
      setSpeakers(
        speakers.map((speaker) =>
          speaker.id === selectedSpeaker.id ? { ...speaker, ...updatedSpeaker } : speaker
        )
      );
      setSelectedSpeaker(undefined);
    } else {
      setSpeakers([...speakers, updatedSpeaker as TalkSpeaker]);
    }
  };

  const onSpeakerDelete = (speakerId: string) =>
    setSpeakers(speakers.filter((speaker) => speaker.id !== speakerId));

  const onSubmit = editTalkForm.handleSubmit(async (values) => {
    startTransition(async () => {
      await updateTalk({
        id: talk.id,
        title: values.title,
        description: values.description,
        speakers: speakers.map((speaker) => ({
          name: speaker.name,
          company: speaker.company,
          avatar: speaker.avatar
        }))
      });
      editTalkForm.reset(values);
      router.refresh();
      toast.success('Talk updated');
    });
  });

  const isDirty = editTalkForm.formState.isDirty || talk.speakers.length !== speakers.length;

  return {
    form: editTalkForm,
    features: {
      speakerDialogDisclosure
    },
    state: {
      isDirty,
      loading: isPending,
      speakers,
      talk,
      conference,
      selectedSpeaker
    },
    functions: {
      onSpeakerEdit,
      onSpeakerAdd,
      onSubmit,
      onSpeakerSubmit,
      onSpeakerDialogClose,
      onSpeakerDelete
    }
  };
};
