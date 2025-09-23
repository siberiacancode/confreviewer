import { ExternalLinkIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { Button } from "@/components/ui";
import { CopyButton } from "../(components)";
import { prisma } from "@/lib/prisma";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: AnalysisPageProps): Promise<Metadata> => {
  const { id } = await params;

  const talk = (await prisma.talk.findUnique({
    where: { id },
  }))!;

  const title = talk.title;
  const description = talk.description;

  return {
    title: `${title} - ConfReviewer`,
    description,
  };
};

const AnalysisPage = async ({ params }: AnalysisPageProps) => {
  const { id } = await params;

  const talk = await prisma.talk.findUnique({
    where: { id },
  });

  if (!talk) notFound();

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-col items-start justify-between gap-4">
          <div className="flex justify-between w-full gap-2">
            <h1 className="text-3xl font-medium">{talk.title}</h1>

            <div className="flex gap-2 justify-between">
              <CopyButton talk={talk} />
              <Button asChild size="icon" variant="secondary">
                <a href={talk.url} rel="noopener noreferrer" target="_blank">
                  <ExternalLinkIcon className="size-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {talk.description}
            </ReactMarkdown>
          </div>

          <div className="flex justify-between gap-4 items-center">
            <div className="bg-card text-card-foreground flex gap-4 rounded-xl border p-2 shadow-sm">
              {talk.speakerAvatar && (
                <img
                  alt={`${talk.speaker} avatar`}
                  className="size-10 rounded-full object-cover"
                  src={talk.speakerAvatar}
                />
              )}

              <div className="flex flex-col">
                <span className="font-medium text-sm">{talk.speaker}</span>
                <p className="text-xs">{talk.company ?? "unknown"}</p>
              </div>
            </div>

            {talk.logo && (
              <img
                alt={`${talk.title} logo`}
                className="h-10 object-cover"
                src={talk.logo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
