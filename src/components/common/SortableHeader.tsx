import React from "react";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export type SortDirection = "ascending" | "descending" | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface SortableHeaderProps {
  label: string;
  columnKey: string;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  columnKey,
  sortConfig,
  onSort,
}) => {
  const renderSortIcon = () => {
    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === "ascending") {
        return <ArrowUpwardIcon fontSize="small" />;
      } else if (sortConfig.direction === "descending") {
        return <ArrowDownwardIcon fontSize="small" />;
      }
    }
    return (
      <div className="flex flex-col gap-0">
        <SwapVertIcon fontSize="small" />
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center">
      <span>{label}</span>
      <div
        className="flex flex-col ml-1 cursor-pointer"
        onClick={() => onSort(columnKey)}
      >
        {renderSortIcon()}
      </div>
    </div>
  );
};

export default SortableHeader;
