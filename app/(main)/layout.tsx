import { AnimatedShinyText, DotPattern, HyperText } from "@/components/ui";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="relative min-h-screen overflow-hidden bg-white dark:bg-black transition-colors">
    <DotPattern
      className={cn(
        "fill-gray-400/20 dark:fill-white/10",
        "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
      )}
      cr={1}
      cx={1}
      cy={1}
      height={20}
      width={20}
    />

    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-8">
      <div
        className={cn(
          "group rounded-full border transition-all ease-in hover:cursor-pointer",
          "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200",
          "dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-gray-600 hover:duration-300 dark:hover:text-neutral-400">
          <span>✨ introducing speakers</span>
        </AnimatedShinyText>
      </div>

      <div className="mx-auto max-w-3xl space-y-12 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white transition-colors">
            Easy to generate information about conferences
          </h1>

          <HyperText
            className="font-light text-gray-600 dark:text-gray-400 text-sm transition-colors"
            animateOnHover={false}
            duration={1000}
          >
            analyze conferences automatically
          </HyperText>
        </div>

        {children}
      </div>
    </div>
  </div>
);

export default MainLayout;
