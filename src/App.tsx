import { useStore } from "@nanostores/react";
import { Fields } from "./Fields";
import "./index.css";
import Item from "./Item";
import { $sortedItems } from "./store";
import { Input } from "./Input";

export function App() {
  const items = useStore($sortedItems);

  return (
    <>
      <table className="mx-auto bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr className="text-left text-gray-600 text-sm">
            <Input />
          </tr>
          <tr className="text-left text-gray-600 uppercase text-sm">
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
