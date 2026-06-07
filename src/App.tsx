import { useStore } from "@nanostores/react";
import { Fields } from "./Fields";
import "./index.css";
import Item from "./Item";
import { itemsAtom, filterAtom } from "./store";
import { Input } from "./Input";
import { filterMatches } from "./utils";

export function App() {
  const itemsObj = useStore(itemsAtom);
  const filter = useStore(filterAtom);


  const items = Object.keys(itemsObj).sort((a, b) => {
    const aMatch = filterMatches(itemsObj[a]!.values, filter);
    const bMatch = filterMatches(itemsObj[b]!.values, filter);
    if (aMatch === bMatch) return 0;
    return aMatch ? -1 : 1;
  });

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
