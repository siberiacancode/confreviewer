"use client";

import { useCopy } from "@siberiacancode/reactuse";
import { CheckIcon, ChevronDownIcon, CopyIcon } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/app/(constants)";
import { useAuth } from "@/app/(contexts)/auth";
import { IntlText } from "@/app/(contexts)/intl";
import {
  Button,
  ButtonGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

import { useTalk } from "../../(contexts)";

export const CopyButton = () => {
  const authContext = useAuth();
  const talkContext = useTalk();
  const talk = talkContext.talk!;

  const { copied, copy } = useCopy();

  const onCopyClick = () =>
    copy(
      `**${talk.title} - ${talk.speakers
        .map((speaker) => speaker.name)
        .join(", ")}**\n\n${talk.url}\n\n${talk.description}\n`
    );

  return (
    <ButtonGroup>
      <Button size="sm" variant="secondary" onClick={onCopyClick}>
        {copied ? (
          <>
            <CheckIcon className="size-4" />
            <IntlText path="button.copied" />
          </>
        ) : (
          <>
            <CopyIcon className="size-4" />
            <IntlText path="button.copy" />
          </>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="secondary">
            <a href={talk.url} rel="noopener noreferrer" target="_blank">
              <ChevronDownIcon />
            </a>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <a
              href={ROUTES.TALK_OPENGRAPH_IMAGE(talk.id)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <IntlText path="button.getOgImage" />
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href={ROUTES.CONFERENCE_FEED(talk.conferenceId)}>
              <IntlText path="button.openConference" />
            </Link>
          </DropdownMenuItem>
          {authContext.metadata.isAdmin && (
            <DropdownMenuItem asChild>
              <Link href={ROUTES.ADMIN.EDIT_TALK(talk.id)} target="_blank">
                <IntlText path="button.editTalk" />
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};
