import { $fields, $filter, $items, $selectedId, removeItem } from './store';
import { filterMatches } from './utils';
import { useStore } from '@nanostores/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function ItemWrapper({ id }: { id: string }) {
  const items = useStore($items);
  const filter = useStore($filter);
  const selectedId = useStore($selectedId);
  const item = items[id];

  if (!item) {
    return null;
  }

  const hidden = !filterMatches(item.values, filter);

  return (
    <Item id={id} {...item} hidden={hidden} selected={selectedId === id} />
  );
}

function Item({
  id,
  values,
  count: initialCount,
  hidden,
  selected,
}: {
  id: string;
  values: string[];
  count: number;
  hidden: boolean;
  selected: boolean;
}) {
  const fields = useStore($fields);
  const [count, setCount] = useState(initialCount.toString());

  useEffect(() => {
    setCount(initialCount.toString());
  }, [initialCount]);

  function commitCount() {
    $items.setKey(id, {
      values,
      count: count === '' ? initialCount : Number(count),
    });
    setCount(count === '' ? initialCount.toString() : count);
  }

  function onValueBlur(e: React.FocusEvent<HTMLTableCellElement>, i: number) {
    const newValue = e.currentTarget.textContent || '';

    $items.setKey(id, {
      values: values.map((v, index) => (index === i ? newValue : v)),
      count: count === '' ? 0 : Number(count),
    });
  }

  function onDelete() {
    removeItem(id);
  }

  return (
    <tr
      className={clsx(
        !hidden && 'border-b border-gray-300',
        hidden && 'collapse',
        selected && 'bg-green-200',
      )}
    >
      {fields.map((_, i) => (
        <td
          className="border-b border-gray-300 px-4 py-2 text-left text-gray-800"
          key={i}
          contentEditable="plaintext-only"
          suppressContentEditableWarning
          onBlur={e => onValueBlur(e, i)}
        >
          {values[i] || ''}
        </td>
      ))}
      <td className="border-b border-gray-300 text-left text-gray-800">
        <input
          type="number"
          value={count}
          onChange={e => setCount(e.target.value)}
          onBlur={commitCount}
          className="w-18 rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border-b border-gray-300 text-left text-gray-800">
        <button
          onClick={onDelete}
          className="cursor-pointer rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
