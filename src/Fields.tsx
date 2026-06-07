import Field from './Field';
import { $fields, $sort, onSortSelect } from './store';
import { useStore } from '@nanostores/react';

export function Fields() {
  const fields = useStore($fields);
  const sort = useStore($sort);

  function toggleQtySort() {
    onSortSelect('qty');
  }

  function onAddField() {
    $fields.set([...fields, { name: `Field ${fields.length + 1}` }]);
  }

  return (
    <tr className="text-left text-sm text-gray-600 uppercase">
      {fields.map((field, i) => (
        <Field key={i} name={field.name} index={i} />
      ))}
      <th className="border-b border-gray-300 px-4 text-left text-sm text-gray-600 uppercase not-print:pr-0">
        <span>Qty</span>
        <span
          contentEditable={false}
          onClick={e => {
            e.stopPropagation();
            toggleQtySort();
          }}
          className="cursor-pointer px-2 py-2 font-mono text-xs text-gray-500 select-none print:hidden"
          title="Sort by quantity"
        >
          {sort.by === 'qty' ? (sort.dir === 'asc' ? '▲' : '▼') : '⤓'}
        </span>
      </th>
      <th className="h-1 cursor-pointer border-b border-gray-300 text-left text-sm text-gray-600 uppercase print:hidden">
        <button
          className="h-full w-full cursor-pointer rounded-md bg-green-200 px-4 py-2 select-none hover:bg-green-300"
          onClick={onAddField}
        >
          +
        </button>
      </th>
    </tr>
  );
}
