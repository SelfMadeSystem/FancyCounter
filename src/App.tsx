import * as XLSX from 'xlsx';
import { Fields } from './Fields';
import { Input } from './Input';
import Item from './Item';
import './index.css';
import { $fields, $sortedItems } from './store';
import { useStore } from '@nanostores/react';

export function App() {
  const items = useStore($sortedItems);
  const fields = useStore($fields);

  function exportToExcel() {
    try {
      const headers = fields.map(f => f.name);
      const data = items.map(([, item]) => {
        const row: Record<string, string | number> = {};
        headers.forEach((h, i) => (row[h] = item.values[i] ?? ''));
        row.Count = item.count;
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(data, {
        header: [...headers, 'Count'],
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Items');
      XLSX.writeFile(wb, 'items.xlsx');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Export to Excel failed:', err);
    }
  }

  return (
    <>
      <div className="flex justify-center max-md:my-3 md:float-end">
        <button
          className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
      </div>
      <table className="mx-auto rounded-lg border border-gray-300 bg-white shadow-md">
        <thead className="border-b border-gray-300 bg-gray-100">
          <tr className="text-left text-sm text-gray-600">
            <Input />
          </tr>
          <tr className="text-left text-sm text-gray-600 uppercase">
            <Fields />
          </tr>
        </thead>
        <tbody>
          {items.map(([item]) => (
            <Item key={item} id={item} />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
