import clsx from "clsx";
import { LuChevronRight, LuFileJson2, LuFolderCode } from "react-icons/lu";

import { RepoItem } from "@/types/github";

interface FileListItemProps {
  item: RepoItem;
  onClick: (item: RepoItem) => void;
  isLoading: boolean;
  isSelected?: boolean;
}

export default function FileListItem({
  item,
  onClick,
  isLoading,
  isSelected = false,
}: FileListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      disabled={isLoading}
      className={clsx(
        "flex w-full items-center justify-between px-4 py-3 text-left",
        isSelected && "bg-blue-50",
        isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50",
      )}
    >
      <div className="flex items-center">
        {item.type === "dir" ? (
          <LuFolderCode className="size-15 text-blue-500" />
        ) : (
          <LuFileJson2 className="size-15 text-gray-500" />
        )}
        <span className="ml-3 text-14-500 text-gray-900">{item.name}</span>
      </div>
      {item.type === "dir" && (
        <LuChevronRight className="size-15 text-gray-400" />
      )}
    </button>
  );
}
