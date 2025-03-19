import { SortConfig } from "./SortableHeader";

export function useSortableData<T extends Record<string, unknown>>(
  items: T[],
  sortConfig: SortConfig
): T[] {
  if (!sortConfig.key || !sortConfig.direction) {
    return items;
  }

  return [...items].sort((a, b) => {
    const aValue = a[sortConfig.key] as ComparableValue; // Use a type assertion
    const bValue = b[sortConfig.key] as ComparableValue; // Use a type assertion

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
}

// A type that encompasses all values that can be compared
type ComparableValue = string | number | boolean;

export function getNextSortDirection(
  currentKey: string,
  newKey: string,
  currentDirection: "ascending" | "descending" | null
): "ascending" | "descending" | null {
  if (currentKey !== newKey) {
    return "ascending";
  }

  if (currentDirection === "ascending") {
    return "descending";
  } else if (currentDirection === "descending") {
    return null;
  }

  return "ascending";
}
