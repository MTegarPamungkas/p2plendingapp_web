import { Skeleton } from "@/components/ui/skeleton"

export default function SecurityLoading() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="border rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-[150px]" />
                    <Skeleton className="h-4 w-[100px] mt-1" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </div>
            ))}
        </div>

        <div className="border rounded-lg p-6">
          <Skeleton className="h-6 w-[250px] mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              ))}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <Skeleton className="h-6 w-[200px] mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
          <div className="mt-4 space-y-2">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
