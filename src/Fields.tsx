import { useStore } from "@nanostores/react";
import Field from "./Field";
import { fieldsAtom, onSortSelect, sortAtom } from "./store";

export function Fields() {
  const fields = useStore(fieldsAtom);
  const sort = useStore(sortAtom);

  function toggleQtySort() {
    onSortSelect("qty");
  }

  function onAddField() {
    fieldsAtom.set([...fields, { name: `Field ${fields.length + 1}` }]);
  }

  return (
    <>
      {fields.map((field, i) => (
        <Field key={i} name={field.name} index={i} />
      ))}
      <th className="pl-4 border-b border-gray-300 text-left text-gray-600 uppercase text-sm">
        <span>Qty</span>
        <span
          contentEditable={false}
          onClick={(e) => {
            e.stopPropagation();
            toggleQtySort();
          }}
          className="px-2 py-2 text-xs text-gray-500 cursor-pointer font-mono"
          title="Sort by quantity"
        >
          {sort.by === "qty" ? (sort.dir === "asc" ? " ▲" : " ▼") : " ⤓"}
        </span>
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
