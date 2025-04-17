import { SortConfig } from "./SortableHeader";

export function useSortableData<T extends Record<string, unknown>>(
  items: T[],
  sortConfig: SortConfig
): T[] {
  console.log("Sortable data:", items);

  // If items is empty, return empty array
  if (items.length === 0) {
    console.log("NEWSD")
    return [];
  }
  
  // If no sort config is provided, return items as is
  if (!sortConfig.key || !sortConfig.direction) {
    return items;
  }

  return [...items].sort((a, b) => {
    // Function to get nested property value using dot notation
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
      }, obj);
    };

    // Get values using the nested property path
    const aValue = getNestedValue(a, sortConfig.key) as ComparableValue;
    const bValue = getNestedValue(b, sortConfig.key) as ComparableValue;

    // Handle null or undefined values
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return sortConfig.direction === "ascending" ? 1 : -1;
    if (bValue === null) return sortConfig.direction === "ascending" ? -1 : 1;

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === "ascending" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }

    // Handle numeric and other comparisons
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
type ComparableValue = string | number | boolean | null;

export function getNextSortDirection(
  currentKey: string,
  newKey: string,
  currentDirection: "ascending" | "descending" | null
): "ascending" | "descending" | null {
  // If clicking on a different column, always start with ascending
  if (currentKey !== newKey) {
    return "ascending";
  }
  
  // Cycle through the three states for the same column
  if (currentDirection === "ascending") {
    return "descending";
  } else if (currentDirection === "descending") {
    return null; // Reset to original order
  } else {
    return "ascending";
  }
}

export type { SortConfig };
