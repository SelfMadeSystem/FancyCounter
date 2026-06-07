import { persistentAtom, persistentMap } from "@nanostores/persistent";

export type Field = {
  name: string;
};
export const fieldsAtom = persistentAtom<Field[]>(
  "Fields",
  [
    {
      name: "Name",
    },
    {
      name: "NSN",
    },
  ],
  {
    encode: (value) => JSON.stringify(value),
    decode: (value) => JSON.parse(value),
  },
);

export type Item = {
  values: string[];
  count: number;
};
export const itemsAtom = persistentMap<Record<string, Item>>(
  "Items",
  {
    1: {
      values: ["PWR-008 (2000 mm)", "1010-21-832-9927"],
      count: 2,
    },
    2: {
      values: ["PWR-007 (1000 mm)", "1010-21-832-9926"],
      count: 1,
    },
    3: {
      values: ["AC Input Cable", "1010-21-832-9925"],
      count: 3,
    },
  },
  {
    encode: (value) => JSON.stringify(value),
    decode: (value) => JSON.parse(value),
  },
);

export function removeItem(key: string) {
  const prevItems = itemsAtom.get();
  delete prevItems[key];
  itemsAtom.set({ ...prevItems });
  localStorage.removeItem(`Items${key}`);
}

export function addItem(values: string[], count: number) {
  const findExisting = Object.entries(itemsAtom.get()).find(([_, item]) =>
    item.values.every((value, index) => value === values[index]),
  );
  if (findExisting) {
    const [key, existingItem] = findExisting;
    itemsAtom.setKey(key, {
      ...existingItem,
      count: existingItem.count + count,
    });
  } else {
    const newKey = Date.now().toString();
    itemsAtom.setKey(newKey, { values, count });
  }
}

export function searchItems(query: string): Array<{ key: string; item: Item }> {
  const items = itemsAtom.get();
  return Object.entries(items)
    .filter(([key, item]) =>
      item.values.some((value) =>
        value.toLowerCase().includes(query.toLowerCase()),
      ),
    )
    .map(([key, item]) => ({ key, item }));
}
