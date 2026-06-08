import * as XLSX from 'xlsx';
import { Fields } from './Fields';
import { Input } from './Input';
import Item from './Item';
import './index.css';
import { $fields, $sortedItems, deserialize, serialize } from './store';
import { useStore } from '@nanostores/react';
import { useRef } from 'react';

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
      console.error('Export to Excel failed:', err);
    }
  }

  function saveToFile() {
    try {
      const data = serialize();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fancy-counter.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Save failed: ' + String(err));
    }
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleLoadFile() {
    const input = fileInputRef.current;
    if (!input) return;
    input.value = '';
    input.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = deserialize(text);
      if (typeof res === 'string') {
        alert('Load failed: ' + res);
      } else {
        alert('Loaded successfully');
      }
    } catch (err) {
      console.error('Load failed:', err);
      alert('Load failed: ' + String(err));
    }
  }

  return (
    <>
      <div className="flex justify-center gap-2 max-md:my-3 md:float-end print:hidden">
        <button
          className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
        <button
          className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          onClick={saveToFile}
        >
          Save
        </button>
        <button
          className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          onClick={handleLoadFile}
        >
          Load
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={onFileChange}
        />
      </div>
      <table className="mx-auto rounded-lg border border-gray-300 bg-white shadow-md">
        <thead className="border-b border-gray-300 bg-gray-100">
          <Input />
          <Fields />
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
