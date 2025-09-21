"use client";

import { useCopy } from "@siberiacancode/reactuse";
import { CheckIcon, CopyIcon, ChevronDownIcon } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

import { htmlToMarkdown } from "../../(actions)";

interface CopyButtonProps {
  talk: any;
}

export const CopyButton = ({ talk }: CopyButtonProps) => {
  const { copied, copy } = useCopy();

  const onCopyClick = async () => {
    const description = await htmlToMarkdown(talk.description);
    copy(
      `**${talk.title} - ${talk.speaker}**\n\n${talk.url}\n\n${description}\n`
    );
  };

  const onGetOgImage = () => window.open(`/api/og?url=${talk.url}`, "_blank");

  return (
    <div className="inline-flex w-fit rounded-md shadow-xs">
      <Button
        variant="secondary"
        className="rounded-none rounded-s-md shadow-none focus-visible:z-10 cursor-pointer"
        onClick={onCopyClick}
      >
        {copied ? (
          <>
            <CheckIcon className="size-4" />
            Copied
          </>
        ) : (
          <>
            <CopyIcon className="size-4" />
            Copy
          </>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-none rounded-e-md shadow-none focus-visible:z-10"
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ChevronDownIcon />
              <span className="sr-only">External link</span>
            </a>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onGetOgImage}>
            Get og image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
