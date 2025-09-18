"use client";

import { Button } from "@/components/ui";
import { useCopy } from "@siberiacancode/reactuse";
import { Copy, Check } from "lucide-react";

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
    <Button variant="secondary" onClick={onClick} className="flex-shrink-0">
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
