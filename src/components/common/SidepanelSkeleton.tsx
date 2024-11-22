import { Skeleton } from "@/components/ui/skeleton";

export const SidepanelSkeleton = () => {
  return (
    <div className="p-4  mx-auto space-y-6 bg-white">
      {/* Project State and Title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
      </div>

      {/* Type and Priority */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-6 w-1/6 rounded-full" />
        <Skeleton className="h-6 w-1/6 rounded-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* Time Spent */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Attachments Table */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <div className="border rounded-md p-2">
          <Skeleton className="h-8 w-full" />
        </div>
      </div>

      {/* Hash Table */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <div className="border rounded-md p-2 space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-1/3" />
      </div>
    </div>
  );
};
