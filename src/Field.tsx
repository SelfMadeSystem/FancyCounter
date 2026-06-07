import { $fields, $sort, onSortSelect } from './store';
import { useStore } from '@nanostores/react';

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
    const newName = e.currentTarget.textContent || '';

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
    <th className="border-r border-b border-gray-300 px-4 text-left text-sm text-gray-600 uppercase not-print:pr-0 focus-within:outline-1">
      <div className="flex items-center justify-between">
        <span
          contentEditable="plaintext-only"
          suppressContentEditableWarning
          onBlur={onNameBlur}
          className="w-full py-2 outline-none"
        >
          {name}
        </span>
        <span
          contentEditable={false}
          onClick={toggleFieldSort}
          className="cursor-pointer px-2 py-2 font-mono text-xs text-gray-500 select-none print:hidden"
          title="Sort by this field"
        >
          {sort.by === index ? (sort.dir === 'asc' ? '▲' : '▼') : '⤓'}
        </span>
      </div>
    </th>
  );
}
