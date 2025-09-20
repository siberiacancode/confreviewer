import { Skeleton } from "@/components/ui";

const AnalysisLoading = () => (
  <div>
    <div className="flex gap-2">
      <div className="flex flex-col items-start justify-between gap-4 w-full">
        <div className="flex justify-between w-full">
          <Skeleton className="h-15 w-2/3" />
          <div className="flex gap-2 justify-between">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="size-9" />
          </div>
        </div>

        <div className="w-full gap-3 flex flex-col">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-4/6" />
          <Skeleton className="h-15 w-4/5" />
        </div>

        <div className="flex gap-4 items-center w-full">
          <div className="bg-card border rounded-xl p-2 flex gap-4 items-center">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  </div>
);

export default AnalysisLoading;
