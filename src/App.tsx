import { useStore } from "@nanostores/react";
import { Fields } from "./Fields";
import "./index.css";
import Item from "./Item";
import { itemsAtom } from "./store";
import { Input } from "./Input";

export function App() {
  const items = Object.keys(useStore(itemsAtom));

  return (
    <>
      <table className="bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr className="text-left text-gray-600 text-sm">
            <Input />
          </tr>
          <tr className="text-left text-gray-600 uppercase text-sm">
            <Fields />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <Item key={item} id={item} />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
