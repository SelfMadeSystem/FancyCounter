import { useStore } from "@nanostores/react";
import { fieldsAtom } from "./store";

export function Fields() {
  const fields = useStore(fieldsAtom);

  function onFieldNameBlur(
    e: React.FocusEvent<HTMLTableCellElement>,
    i: number,
  ) {
    const newName = e.currentTarget.textContent || "";

    if (!newName.trim()) {
      fieldsAtom.set(fields.filter((_, index) => index !== i));
      return;
    }

    fieldsAtom.set(
      fields.map((field, index) => (index === i ? { name: newName } : field)),
    );
    e.currentTarget.textContent = newName;
  }

  function onAddField() {
    fieldsAtom.set([...fields, { name: `Field ${fields.length + 1}` }]);
  }

  return (
    <>
      {fields.map((field, i) => (
        <th
          className="px-4 py-2 border-b border-gray-300 text-left text-gray-600 uppercase text-sm"
          key={i}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onFieldNameBlur(e, i)}
        >
          {field.name}
        </th>
      ))}
      <th className="px-4 py-2 border-b border-gray-300 text-left text-gray-600 uppercase text-sm">
        Qty
      </th>
      <th
        className="px-4 py-2 border-b border-gray-300 bg-green-200 text-left text-gray-600 uppercase text-sm cursor-pointer"
        onClick={onAddField}
      >
        +
      </th>
    </>
  );
}
