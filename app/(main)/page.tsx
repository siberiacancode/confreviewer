"use client";

import { useActionState } from "react";
import { Button, ShineBorder } from "@/components/ui";

import { ArrowUpIcon, Loader2Icon } from "lucide-react";

import { analyzeConference } from "./actions";

interface HomeProps {}

const Home = ({}: HomeProps) => {
  const [analyzeConferenceState, analyzeConferenceAction, isPending] =
    useActionState(analyzeConference, {
      success: false,
      error: "",
    });

  return (
    <div>
      <div className="mx-auto max-w-3xl space-y-12 text-center">
        <div className="relative mx-auto max-w-lg">
          <form action={analyzeConferenceAction} className="space-y-4">
            <div className="bg-secondary/70 relative flex gap-2 rounded-3xl px-3 py-2 shadow-xl shadow-white/10">
              <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />

              <input
                type="url"
                name="url"
                className="w-full border-none bg-transparent px-2 py-1 outline-none placeholder:text-neutral-400"
                placeholder="Paste link to talk"
                disabled={isPending}
              />

              <Button
                type="submit"
                size="icon"
                className="rounded-full"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <ArrowUpIcon className="size-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
