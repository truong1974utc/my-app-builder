// hooks/usePagination.ts
import { useState } from "react"
import { PaginationLimit } from "@/enums/pagination.enum"

export function usePagination(
  initialPage = 1,
  initialLimit = PaginationLimit.TEN,
) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  return {
    page,
    limit,
    setPage,
    setLimit,
  }
}
