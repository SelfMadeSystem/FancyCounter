import { useStore } from "@nanostores/react";
import { addItem, fieldsAtom, itemsAtom } from "./store";
import { useRef, useState } from "react";

export function Input() {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const fields = useStore(fieldsAtom);

  function onValueBlur(e: React.FocusEvent<HTMLTableCellElement>, i: number) {
    const newValue = e.currentTarget.textContent || "";
    setValues((prev) => {
      prev.length = fields.length; // Ensure the array length matches the number of fields
      const newValues = [...prev];
      newValues[i] = newValue;
      return newValues;
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTableCellElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = refs.current.findIndex((ref) => ref === e.currentTarget) + 1;
      if (nextIndex < refs.current.length) {
        refs.current[nextIndex]?.focus();
      } else {
        values[refs.current.length - 1] = e.currentTarget.textContent || "";
        onAddItem();
        const firstRef = refs.current[0];
        if (firstRef) {
          firstRef.focus();
        }
      }
    }
  }

  function onAddItem() {
    addItem(values, count);
    setValues([]);

    // Clear the content of the input cells
    refs.current.forEach((ref) => {
      if (ref) {
        ref.textContent = "";
      }
    });
  }

  return (
    <>
      {fields.map((_, i) => (
        <td
          className="px-4 py-2 border border-gray-300 text-left text-gray-800"
          key={i}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onValueBlur(e, i)}
          onKeyDown={onKeyDown}
          ref={(el) => {
            refs.current[i] = el;
          }}
        />
      ))}
      <td className="border-b border-gray-300 text-left text-gray-800">
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value, 10))}
          className="w-18 px-2 py-2 border border-gray-300 rounded"
        />
      </td>
      <td>
        <button
          className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onAddItem}
        >
          Add Item
        </button>
      </td>
    </>
  );
}
