import {
  $fields,
  $filter,
  $items,
  $selected,
  $selectedId,
  addItem,
  selectNext,
  selectPrevious,
} from './store';
import { useStore } from '@nanostores/react';
import { useRef, useState } from 'react';

export function Input() {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const fields = useStore($fields);

  function onValueChange(newValue: string, i: number) {
    values.length = fields.length; // Ensure the array length matches the number of fields
    const newValues = [...values];
    newValues[i] = newValue;
    $filter.set(newValues.map(v => v?.trim()?.toLowerCase() ?? ''));
    setValues(newValues);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTableCellElement>, i: number) {
    switch (e.key) {
      case 'Enter': {
        e.preventDefault();
        const sid = $selectedId.get();
        if (sid !== null) {
          const item = $items.get()[sid]!;
          $items.setKey(sid, {
            ...item,
            count: item.count + count,
          });
          $selected.set(null);
          clear();
          break;
        }
        if (e.shiftKey) {
          const prevIndex =
            refs.current.findIndex(ref => ref === e.currentTarget) - 1;
          if (prevIndex !== -1 && prevIndex < refs.current.length) {
            refs.current[prevIndex]?.focus();
          }
          break;
        }
        const nextIndex =
          refs.current.findIndex(ref => ref === e.currentTarget) + 1;
        if (nextIndex < refs.current.length) {
          refs.current[nextIndex]?.focus();
        } else {
          values[refs.current.length - 1] = e.currentTarget.textContent || '';
          onAddItem();
          const firstRef = refs.current[0];
          if (firstRef) {
            firstRef.focus();
          }
        }
        break;
      }
      case 'ArrowDown': {
        if (e.shiftKey || e.altKey || e.metaKey || e.ctrlKey) break;
        e.preventDefault();
        selectNext();
        break;
      }
      case 'ArrowUp': {
        if (e.shiftKey || e.altKey || e.metaKey || e.ctrlKey) break;
        e.preventDefault();
        selectPrevious();
        break;
      }
    }
  }

  function onAddItem() {
    addItem(values, count);
    clear();
  }

  function clear() {
    setValues([]);
    setCount(1);
    refs.current.forEach(ref => {
      if (ref) {
        ref.textContent = '';
      }
    });
    $filter.set([]);
  }

  return (
    <>
      {fields.map((_, i) => (
        <td
          className="border border-gray-300 px-4 py-2 text-left text-gray-800"
          key={i}
          contentEditable="plaintext-only"
          suppressContentEditableWarning
          onKeyDown={e => onKeyDown(e, i)}
          onInput={e => onValueChange(e.currentTarget.innerText, i)}
          ref={el => {
            refs.current[i] = el;
          }}
        />
      ))}
      <td className="border-b border-gray-300 text-left text-gray-800">
        <input
          type="number"
          value={count}
          onChange={e => setCount(parseInt(e.target.value, 10))}
          className="w-18 rounded border border-gray-300 px-2 py-2"
        />
      </td>
      <td>
        <button
          className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={onAddItem}
        >
          Add
        </button>
      </td>
    </>
  );
}
