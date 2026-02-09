import { useSearchParams } from "react-router-dom"
import { PaginationLimit } from "@/enums/pagination.enum"
import { useDebounce } from "./useDebounce"
import { useState, useEffect } from "react"

export function usePagination(defaultLimit = PaginationLimit.TEN) {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || defaultLimit
  const searchParam = searchParams.get("search") || ""
  

  // ✅ state cho input (KHÔNG đụng URL)
  const [searchInput, setSearchInput] = useState(searchParam)

  // debounce
  const debouncedSearch = useDebounce(searchInput, 500)

  // ✅ sync debounce → URL
  useEffect(() => {
    const params: Record<string, string> = {
      page: "1",
      limit: String(limit),
    }

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim()
    }

    setSearchParams(params)
  }, [debouncedSearch, limit])
  
  const setPage = (newPage: number) => {
    const params: Record<string, string> = {
      page: String(newPage),
      limit: String(limit),
    }

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim()
    }

    setSearchParams(params)
  }

  const setLimit = (newLimit: PaginationLimit) => {
    const params: Record<string, string> = {
      page: "1",
      limit: String(newLimit),
    }

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim()
    }

    setSearchParams(params)
  }

  return {
    page,
    limit,
    setPage,
    setLimit,
    search: searchInput,
    setSearch: setSearchInput,
    debouncedSearch,
  }
}
