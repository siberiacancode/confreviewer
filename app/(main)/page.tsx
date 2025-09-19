"use client";

import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useActionState } from "react";

import { Button, ShineBorder } from "@/components/ui";

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
          <form className="space-y-4" action={analyzeConferenceAction}>
            <div className="bg-secondary/70 relative flex gap-2 rounded-3xl px-3 py-2 shadow-xl shadow-white/10">
              <ShineBorder
                borderWidth={3}
                shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              />

              <input
                className="w-full border-none bg-transparent px-2 py-1 outline-none placeholder:text-neutral-400"
                disabled={isPending}
                name="url"
                type="url"
                placeholder="Paste link to talk"
              />

              <Button
                className="rounded-full"
                disabled={isPending}
                size="icon"
                type="submit"
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
