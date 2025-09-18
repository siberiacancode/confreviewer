import { Button } from "@/components/ui";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { SearchInput, ThemeButton } from "./(components)";

interface AnalysisLayoutProps {
  children: React.ReactNode;
}

const AnalysisLayout = ({ children }: AnalysisLayoutProps) => (
  <div className="max-w-4xl mx-auto px-4">
    <header>
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex-1">
          <Link href="/" className="text-primary hover:text-primary/90">
            <LoaderIcon className="size-6" />
          </Link>
        </div>

        <div className="grow max-sm:hidden">
          <SearchInput />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button asChild variant="ghost" size="sm" className="text-sm">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/siberiacancode"
            >
              Community
            </a>
          </Button>
          <div className="flex items-center gap-1">
            <ThemeButton />
          </div>
        </div>
      </div>
    </header>

    <div className="mt-4">{children}</div>
  </div>
);

export default AnalysisLayout;
