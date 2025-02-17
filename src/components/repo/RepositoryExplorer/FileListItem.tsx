import clsx from "clsx";
import { LuFileJson2, LuFolderCode } from "react-icons/lu";

import { RepoItem } from "@/types/github";

interface FileListItemProps {
  item: RepoItem;
  onClick: (item: RepoItem) => void;
  isLoading: boolean;
}

export default function FileListItem({
  item,
  onClick,
  isLoading,
}: FileListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      disabled={isLoading}
      className={clsx(
        "flex w-full items-center space-x-3 px-4 py-3 text-left",
        isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50",
      )}
    >
      {item.type === "dir" ? (
        <LuFolderCode className="size-15 text-blue-500" />
      ) : (
        <LuFileJson2 className="size-15 text-gray-500" />
      )}
      <span>{item.name}</span>
    </button>
  );
}
