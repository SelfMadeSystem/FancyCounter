import { filterMatches } from './utils';
import { persistentAtom, persistentMap } from '@nanostores/persistent';
import { atom, computed } from 'nanostores';
import z from 'zod';

export const fieldSchema = z.object({
  name: z.string(),
});
export const fieldsSchema = z.array(fieldSchema);
export type Field = z.infer<typeof fieldSchema>;
export const $fields = persistentAtom<Field[]>(
  'Fields',
  [
    {
      name: 'Name',
    },
    {
      name: 'NSN',
    },
  ],
  {
    encode: value => JSON.stringify(value),
    decode: value => JSON.parse(value),
  },
);

export const itemSchema = z.object({
  values: z.array(z.string()),
  count: z.number(),
});
export const itemsSchema = z.record(z.string(), itemSchema);
export type Item = z.infer<typeof itemSchema>;
export const $items = persistentMap<Record<string, Item>>(
  'Items',
  {},
  {
    encode: value => JSON.stringify(value),
    decode: value => JSON.parse(value),
  },
);

export function removeItem(key: string) {
  const prevItems = $items.get();
  delete prevItems[key];
  $items.set({ ...prevItems });
  localStorage.removeItem(`Items${key}`);
}

export function addItem(values: string[], count: number) {
  const findExisting = Object.entries($items.get()).find(([_, item]) =>
    item.values.every((value, index) => value === values[index]),
  );
  if (findExisting) {
    const [key, existingItem] = findExisting;
    $items.setKey(key, {
      ...existingItem,
      count: existingItem.count + count,
    });
  } else {
    const newKey = Date.now().toString();
    $items.setKey(newKey, { values, count });
  }
}

export const $filter = atom<string[]>([]);

export type Sort = {
  by: 'qty' | number | null;
  dir: 'asc' | 'desc';
};

export const $sort = atom<Sort>({ by: null, dir: 'asc' });

export function onSortSelect(sort: 'qty' | number) {
  const cur = $sort.get();
  if (cur.by === sort) {
    if (cur.dir === 'desc') {
      $sort.set({ by: null, dir: 'asc' });
      return;
    }
    $sort.set({ by: sort, dir: 'desc' });
    return;
  }
  $sort.set({ by: sort, dir: 'asc' });
}

export const $filteredItems = computed([$items, $filter], (items, filter) => {
  return Object.values(items).filter(item =>
    filterMatches(item.values, filter),
  );
});

export const $sortedItems = computed([$items, $sort], (items, sort) => {
  if (sort.by === null) return Object.entries(items);
  return Object.entries(items).sort(([a], [b]) => {
    if (sort.by === null) return Number(a) - Number(b);
    if (sort.by === 'qty') {
      const av = items[a]?.count ?? 0;
      const bv = items[b]?.count ?? 0;
      return sort.dir === 'asc' ? av - bv : bv - av;
    }
    const av = (items[a]?.values?.[sort.by] || '').toString();
    const bv = (items[b]?.values?.[sort.by] || '').toString();
    if (av < bv) return sort.dir === 'asc' ? -1 : 1;
    if (av > bv) return sort.dir === 'asc' ? 1 : -1;
    return 0;
  });
});

export const $sortedFilteredItems = computed(
  [$sortedItems, $filter],
  (items, filter) => {
    return items.filter(([, item]) => filterMatches(item.values, filter));
  },
);

export const $selected = atom<number | null>(null);
export const $selectedId = computed(
  [$selected, $sortedFilteredItems],
  (s, i) => {
    if (s === null) return null;
    return i[s]?.[0] ?? null;
  },
);

export function selectNext() {
  const items = $sortedFilteredItems.get();
  if (items.length === 0) {
    $selected.set(null);
    return;
  }
  const selected = $selected.get();
  if (selected === null) {
    $selected.set(0);
    return;
  }
  if (selected + 1 === items.length) {
    $selected.set(null);
    return;
  }
  $selected.set(selected + 1);
}

export function selectPrevious() {
  const items = $sortedFilteredItems.get();
  if (items.length === 0) {
    $selected.set(null);
    return;
  }
  const selected = $selected.get();
  if (selected === null) {
    $selected.set(items.length - 1);
    return;
  }
  if (selected === 0) {
    $selected.set(null);
    return;
  }
  $selected.set(selected - 1);
}

export function serialize(): string {
  return JSON.stringify({
    fields: $fields.get(),
    items: $items.get(),
  });
}

export function deserialize(str: string): string | void {
  const obj = JSON.parse(str);
  if (!('fields' in obj)) {
    return "'fields' missing from JSON";
  }
  if (!('items' in obj)) {
    return "'items' missing from JSON";
  }
  const fieldsParse = fieldsSchema.safeParse(obj.fields);
  if (fieldsParse.error) {
    console.error('Error parsing fields: ' + fieldsParse.error);
    return fieldsParse.error.name;
  }
  const itemsParse = itemsSchema.safeParse(obj.items);
  if (itemsParse.error) {
    console.error('Error parsing items: ' + itemsParse.error);
    return itemsParse.error.name;
  }
  $fields.set(fieldsParse.data);
  $items.set(itemsParse.data);
}
