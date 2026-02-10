// hooks/useSort.ts
export type SortOrder = "ASC" | "DESC"

export function useSort(
  initialSortBy?: string,
  initialSortOrder?: SortOrder,
) {
  let sortBy = initialSortBy
  let sortOrder = initialSortOrder

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      sortOrder = sortOrder === "ASC" ? "DESC" : "ASC"
    } else {
      sortBy = field
      sortOrder = "ASC"
    }

    return { sortBy, sortOrder }
  }

  const clearSort = () => {
    sortBy = undefined
    sortOrder = undefined
    return { sortBy, sortOrder }
  }

  return {
    sortBy,
    sortOrder,
    toggleSort,
    clearSort,
  }
}
