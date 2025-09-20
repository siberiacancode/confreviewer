import { ExternalLinkIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { Button } from "@/components/ui";

import { CopyButton } from "./(components)";
import { getConferenceType, parseConferenceData } from "./(helpers)";

interface AnalysisPageProps {
  searchParams: Promise<{ url: string }>;
}

export async function generateMetadata({
  searchParams,
}: AnalysisPageProps): Promise<Metadata> {
  const { url } = await searchParams;

  if (!url) {
    return {
      title: "Conference Analysis",
      description: "Analyze conference talks and presentations",
    };
  }

  try {
    const conferenceData = await fetch(decodeURIComponent(url));
    const conferenceType = getConferenceType(url);

    const result = await parseConferenceData(
      conferenceType,
      await conferenceData.text(),
      url
    );

    const title = result.title || "Conference Talk";
    const description = `Analysis of "${title}" by ${
      result.speaker || "Unknown Speaker"
    }`;
    const ogImageUrl = `/api/og?url=${encodeURIComponent(url)}`;

    return {
      title: `${title} - ConfReviewer`,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Conference Analysis - ConfReviewer",
      description: "Analyze conference talks and presentations",
    };
  }
}

const AnalysisPage = async ({ searchParams }: AnalysisPageProps) => {
  const { url } = await searchParams;
  if (!url) return notFound();

  const conferenceData = await fetch(decodeURIComponent(url));
  const conferenceType = getConferenceType(url);

  const result = await parseConferenceData(
    conferenceType,
    await conferenceData.text(),
    url
  );

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-col items-start justify-between gap-4">
          <div className="flex justify-between w-full gap-2">
            <h1 className="text-3xl font-medium">{result.title}</h1>

            <div className="flex gap-2 justify-between">
              <CopyButton talk={result} />
              <Button asChild size="icon" variant="secondary">
                <a href={url} rel="noopener noreferrer" target="_blank">
                  <ExternalLinkIcon className="size-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {result.description}
            </ReactMarkdown>
          </div>

          <div className="flex justify-between gap-4 items-center">
            <div className="bg-card text-card-foreground flex gap-4 rounded-xl border p-2 shadow-sm">
              <img
                alt={`${result.speaker} avatar`}
                className="size-10 rounded-full object-cover"
                src={result.speakerAvatar}
              />

              <div className="flex flex-col">
                <span className="font-medium text-sm">{result.speaker}</span>
                <p className="text-xs">{result.company ?? "unknown"}</p>
              </div>
            </div>

            <img
              alt={`${result.title} logo`}
              className="h-10 object-cover"
              src={result.logo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
