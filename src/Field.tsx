import { useStore } from "@nanostores/react";
import { $fields, onSortSelect, $sort } from "./store";

export default function Field({
  name,
  index,
}: {
  name: string;
  index: number;
}) {
  const fields = useStore($fields);
  const sort = useStore($sort);

  function onNameBlur(e: React.FocusEvent<HTMLSpanElement>) {
    const newName = e.currentTarget.textContent || "";

    if (!newName.trim()) {
      $fields.set(fields.filter((_, i) => i !== index));
      return;
    }

    $fields.set(fields.map((f, i) => (i === index ? { name: newName } : f)));
    e.currentTarget.textContent = newName;
  }

  function toggleFieldSort(e: React.MouseEvent) {
    e.stopPropagation();
    onSortSelect(index);
  }

  return (
    <th className="pl-4 border-b border-gray-300 text-left text-gray-600 uppercase text-sm focus-within:outline-1">
      <div className="flex justify-between items-center">
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={onNameBlur}
          className="outline-none w-full"
        >
          {name}
        </span>
        <span
          contentEditable={false}
          onClick={toggleFieldSort}
          className="text-xs px-2 py-2 text-gray-500 cursor-pointer font-mono"
          title="Sort by this field"
        >
          {sort.by === index ? (sort.dir === "asc" ? " ▲" : " ▼") : " ⤓"}
        </span>
      </div>
    </th>
  );
}
