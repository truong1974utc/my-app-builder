// hooks/useSearch.ts
import { useState } from "react"
import { useDebounce } from "./useDebounce"

export function useSearch(initialValue = "") {
  const [search, setSearch] = useState(initialValue)
  const debouncedSearch = useDebounce(search, 500)

  return {
    search,
    setSearch,
    debouncedSearch,
  }
}
