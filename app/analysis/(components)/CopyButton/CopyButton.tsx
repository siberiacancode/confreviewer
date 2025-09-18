"use client";

import { useCopy } from "@siberiacancode/reactuse";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui";

interface CopyButtonProps {
  talk: any;
}

export const CopyButton = ({ talk }: CopyButtonProps) => {
  const { copied, copy } = useCopy();

  const onClick = () =>
    copy(
      `**${talk.title} - ${talk.speaker}**\n\n${talk.link}\n\n${talk.description}\n`
    );

  return (
    <Button className="flex-shrink-0" variant="secondary" onClick={onClick}>
      {copied ? (
        <>
          <Check className="size-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-4" />
          Copy
        </>
      )}
    </Button>
  );
};
