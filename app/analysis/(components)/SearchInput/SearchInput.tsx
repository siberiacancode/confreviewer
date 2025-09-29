"use client";

import {
  useClickOutside,
  useDebounceValue,
  useDisclosure,
  useField,
  useQuery,
} from "@siberiacancode/reactuse";
import { SearchIcon, SendIcon } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import type { SearchResponse } from "@/app/api/search/route";

import { analyzeConference } from "@/app/(main)/actions";
import { api } from "@/app/api/instance";
import { Input } from "@/components/ui";

export const SearchInput = () => {
  const selectMenu = useDisclosure();
  const selectRef = useClickOutside<HTMLDivElement>(() => selectMenu.close());
  const searchField = useField({ initialValue: "" });
  const search = searchField.watch();

  const debouncedSearch = useDebounceValue(search, 1000);
  const searchQuery = useQuery(
    () =>
      api.get<SearchResponse>("/search", {
        query: {
          search,
          limit: 3,
        },
      }),
    {
      keys: [debouncedSearch],
    }
  );

  const [_analyzeConferenceState, analyzeConferenceAction, isPending] =
    useActionState(analyzeConference, {
      success: false,
      error: "",
    });

  const talks = searchQuery.data?.data.talks ?? [];

  return (
    <div
      ref={selectRef}
      className="relative mx-auto w-full max-w-xs"
      onClick={selectMenu.open}
    >
      <form action={analyzeConferenceAction}>
        <Input
          {...searchField.register()}
          className="h-8 px-8"
          disabled={isPending}
          id="search"
          name="url"
          autoComplete="off"
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

      {!!talks.length && selectMenu.opened && (
        <div className="bg-background absolute top-10 w-full rounded-xl border border-gray-200 p-2 dark:border-white/10">
          {talks.map((talk) => (
            <div
              key={talk.id}
              className="text-xs text-gray-600 dark:text-gray-400"
            >
              <Link href={`/analysis/${talk.id}`}>
                <div className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10">
                  <div className="size-7 flex-shrink-0">
                    <img
                      alt={talk.speaker}
                      className="size-7 rounded-full object-cover"
                      src={talk.speakerAvatar!}
                    />
                  </div>

                  <div className="flex flex-col items-start justify-start gap-1 overflow-hidden">
                    <div className="text-md w-full truncate font-medium dark:text-white">
                      {talk.title}
                    </div>
                    <div className="text-xs">{talk.speaker}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
