"use client";

import { SearchIcon, SendIcon } from "lucide-react";
import { useActionState } from "react";

import { analyzeConference } from "@/app/(main)/actions";
import { Input } from "@/components/ui";

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
          className="h-8 px-8"
          disabled={isPending}
          id="search"
          name="url"
          placeholder="Search..."
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
        <button
          aria-label="Press to speak"
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
        >
          <SendIcon aria-hidden="true" size={16} />
        </button>
      </form>
    </div>
  );
};
