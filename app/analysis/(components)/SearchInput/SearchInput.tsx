"use client";

import { Input } from "@/components/ui";
import { useActionState } from "react";
import { analyzeConference } from "@/app/(main)/actions";
import { SearchIcon, SendIcon } from "lucide-react";

export const SearchInput = () => {
  const [analyzeConferenceState, analyzeConferenceAction, isPending] =
    useActionState(analyzeConference, {
      success: false,
      error: "",
    });

  return (
    <div className="relative mx-auto w-full max-w-xs">
      <form action={analyzeConferenceAction}>
        <Input
          id="search"
          name="url"
          className="h-8 px-8"
          placeholder="Search..."
          disabled={isPending}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Press to speak"
          type="submit"
        >
          <SendIcon size={16} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};
