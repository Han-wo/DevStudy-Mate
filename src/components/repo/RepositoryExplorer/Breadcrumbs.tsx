interface BreadcrumbsProps {
  items: string[];
  onNavigate: (index: number) => void;
}

export default function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  const getItemPath = (index: number) => items.slice(0, index + 1).join("/");

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center space-x-2 text-16-500">
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          className="text-blue-500 hover:text-blue-600"
        >
          root
        </button>
        {items.map((item, index) => (
          <div key={getItemPath(index)} className="flex items-center">
            /
            <button
              type="button"
              onClick={() => onNavigate(index)}
              className="text-blue-500 hover:text-blue-700"
            >
              {item}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
