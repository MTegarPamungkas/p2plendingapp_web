import { Skeleton } from "@/components/ui/skeleton"

export default function TermsLoading() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>

        {Array(6)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="space-y-2 border rounded-lg p-6">
              <Skeleton className="h-6 w-[250px] mb-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
      </div>
    </div>
  )
}
