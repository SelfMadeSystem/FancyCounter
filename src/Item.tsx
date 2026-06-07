import { useStore } from "@nanostores/react";
import { fieldsAtom, filterAtom, itemsAtom, removeItem } from "./store";
import { useState } from "react";
import clsx from "clsx";
import { filterMatches } from "./utils";

export default function ItemWrapper({ id }: { id: string }) {
  const items = useStore(itemsAtom);
  const filter = useStore(filterAtom);
  const item = items[id];

  if (!item) {
    return null;
  }

  const hidden = !filterMatches(item.values, filter);

  return <Item id={id} {...item} hidden={hidden} />;
}

function Item({
  id,
  values,
  count: initialCount,
  hidden,
}: {
  id: string;
  values: string[];
  count: number;
  hidden: boolean;
}) {
  const fields = useStore(fieldsAtom);
  const [count, setCount] = useState(initialCount.toString());

  function commitCount() {
    itemsAtom.setKey(id, {
      values,
      count: count === "" ? initialCount : Number(count),
    });
    setCount(count === "" ? initialCount.toString() : count);
  }

  function onValueBlur(e: React.FocusEvent<HTMLTableCellElement>, i: number) {
    const newValue = e.currentTarget.textContent || "";

    itemsAtom.setKey(id, {
      values: values.map((v, index) => (index === i ? newValue : v)),
      count: count === "" ? 0 : Number(count),
    });
  }

  function onDelete() {
    removeItem(id);
  }

  return (
    <tr
      className={clsx(
        !hidden && "border-b border-gray-300",
        hidden && "invisible",
      )}
    >
      {fields.map((_, i) => (
        <td
          className="px-4 py-2 border-b border-gray-300 text-left text-gray-800"
          key={i}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onValueBlur(e, i)}
        >
          {values[i] || ""}
        </td>
      ))}
      <td className="border-b border-gray-300 text-left text-gray-800">
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          onBlur={commitCount}
          className="w-18 border border-gray-300 rounded px-2 py-1"
        />
      </td>
      <td className="border-b border-gray-300 text-left text-gray-800">
        <button
          onClick={onDelete}
          className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
