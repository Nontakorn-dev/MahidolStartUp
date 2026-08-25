import { cn } from '../../lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden />
}

/** โครงการ์ดระหว่างโหลด — ลดอาการหน้ากระตุกตอนข้อมูลเข้า */
export function CardSkeleton() {
  return (
    <div className="listing-card__inner">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="listing-card__body gap-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="listing-grid" role="status" aria-label="กำลังโหลดข้อมูล">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="กำลังโหลดข้อมูล">
      <Skeleton className="h-64 w-full rounded-2xl sm:h-80" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
