# FancyCounter

A small web app for counting items with customizable fields and fast keyboard-driven input.

## Key Features

- **Export:** Export data to Excel.
- **Custom Fields:** Define custom field names for each item.
- **Smart Increment:** Automatically increments quantity when all fields match an existing item.
- **Search:** Filter items per field.
- **Sorting:** Sort items by field.
- **Keyboard Friendly:** Use Up/Down to select, Enter to increment, Tab to move between top-bar fields. When at the last top-bar field (excluding quantity), press Enter to add the item.
- **Offline Data:** All data is saved locally in your browser and restored when you close and reopen or refresh the tab.

## Development

Install dependencies:

```bash
bun i
```

Start the dev server:

```bash
bun dev
```

Build for production:

```bash
bun run build
```

The production build is placed in `./dist`.

## License

MIT — see [LICENSE](./LICENSE) for details.
