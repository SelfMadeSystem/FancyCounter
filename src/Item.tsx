import { $fields, $filter, $items, $selectedId, removeItem } from './store';
import { filterMatches } from './utils';
import { useStore } from '@nanostores/react';
import clsx from 'clsx';
import { motion } from 'motion/react';
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <motion.tr
      className={clsx(
        !hidden && 'border-b border-gray-300',
        hidden && 'collapse',
        selected && 'bg-green-200',
      )}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
    >
      {fields.map((_, i) => (
        <td
          className="border-r border-b border-gray-300 px-4 py-2 text-left text-gray-800"
          key={i}
          contentEditable="plaintext-only"
          suppressContentEditableWarning
          onBlur={e => onValueBlur(e, i)}
        >
          {values[i] || ''}
        </td>
      ))}
      <td className="border-b border-gray-300 text-left text-gray-800 print:px-4">
        <input
          type="number"
          value={count}
          onChange={e => setCount(e.target.value)}
          onBlur={commitCount}
          className="w-18 px-2 py-1 print:hidden"
        />
        <div className="w-full not-print:hidden">{count}</div>
      </td>
      <td className="h-1 border-b border-gray-300 text-left text-gray-800 print:hidden">
        <button
          onClick={onDelete}
          className="h-full w-full cursor-pointer rounded bg-red-500 text-white select-none hover:bg-red-600"
        >
          -
        </button>
      </td>
    </motion.tr>
  );
}
