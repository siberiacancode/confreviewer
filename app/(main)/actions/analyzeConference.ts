"use server";

import { CONFERENCE_NAME } from "@/app/(constants)";
import { redirect } from "next/navigation";
import { z } from "zod";

const conferenceUrlSchema = z.object({
  url: z
    .url("Enter a valid url")
    .refine(
      (url) => CONFERENCE_NAME.some((domain) => url.includes(domain)),
      "Url should be a valid conference url"
    ),
});

export interface AnalyzeConferenceResult {
  success: boolean;
  error?: string;
}

export const analyzeConference = async (
  state: AnalyzeConferenceResult,
  formData: FormData
): Promise<AnalyzeConferenceResult> => {
  const url = formData.get("url") as string;
  const validatedData = conferenceUrlSchema.safeParse({ url });

  if (!validatedData.success) {
    return { ...state, success: false, error: validatedData.error.message };
  }

  const encodedUrl = encodeURIComponent(validatedData.data.url);

  redirect(`/analysis?url=${encodedUrl}`);

  return { ...state, success: true };
};
