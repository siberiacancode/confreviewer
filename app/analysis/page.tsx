import { notFound } from "next/navigation";

import { getConferenceType, parseConferenceData } from "./(helpers)";
import { CopyButton } from "./(components)";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui";
import { ExternalLinkIcon } from "lucide-react";

interface AnalysisPageProps {
  searchParams: Promise<{ url: string }>;
}

const AnalysisPage = async ({ searchParams }: AnalysisPageProps) => {
  const { url } = await searchParams;
  if (!url) return notFound();

  const conferenceData = await fetch(decodeURIComponent(url));
  const conferenceType = getConferenceType(url);

  const result = await parseConferenceData(
    conferenceType,
    await conferenceData.text()
  );

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-col items-start justify-between gap-4">
          <div className="flex justify-between w-full">
            <h1 className="text-3xl font-medium">{result.title}</h1>

            <div className="flex gap-2 justify-between">
              <CopyButton talk={result} />
              <Button asChild variant="secondary" size="icon">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="size-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {result.description}
            </ReactMarkdown>
          </div>

          <div className="flex justify-between gap-4 items-center">
            <div className="bg-card text-card-foreground flex gap-4 rounded-xl border p-2 shadow-sm">
              <img
                src={result.speakerAvatar}
                alt={`${result.speaker} avatar`}
                className="size-10 rounded-full object-cover"
              />

              <div className="flex flex-col">
                <span className="font-medium text-sm">{result.speaker}</span>
                {result.company && <p className="text-xs">{result.company}</p>}
              </div>
            </div>

            <img
              src={result.logo}
              alt={`${result.title} logo`}
              className="h-10 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
