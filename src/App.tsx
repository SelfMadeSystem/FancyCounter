import { useStore } from "@nanostores/react";
import { Fields } from "./Fields";
import "./index.css";
import Item from "./Item";
import { itemsAtom, sortAtom } from "./store";
import { Input } from "./Input";

export function App() {
  const itemsMap = useStore(itemsAtom);
  const sort = useStore(sortAtom);

  const items = Object.keys(itemsMap).sort((a, b) => {
    if (sort.by === null) return Number(a) - Number(b);
    if (sort.by === "qty") {
      const av = itemsMap[a]?.count ?? 0;
      const bv = itemsMap[b]?.count ?? 0;
      return sort.dir === "asc" ? av - bv : bv - av;
    }
    const av = (itemsMap[a]?.values?.[sort.by] || "").toString();
    const bv = (itemsMap[b]?.values?.[sort.by] || "").toString();
    if (av < bv) return sort.dir === "asc" ? -1 : 1;
    if (av > bv) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });

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
          {items.map((item) => (
            <Item key={item} id={item} />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
