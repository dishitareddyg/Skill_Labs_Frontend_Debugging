# ShopShock: Store Administration Dashboard

A dashboard for a shop administrator to review products, prices, stock, orders and revenue. Some of its numbers and lists are wrong. Find out why and fix them.

| | |
|---|---|
| **Skills practised** | JavaScript data types, the `+` operator, filtering, searching and sorting arrays, checking totals against the source data |
| **Suggested time** | 60 to 90 minutes |
| **Stack** | HTML, CSS and vanilla JavaScript. No libraries, server or network requests |
| **Data** | Fictional products and orders |

## The scenario

You look after the back office of an online shop. The owner says the revenue figure "feels too high", the stock total looks strange, and the category filter shows products that do not belong. You need to find out whether the data or the code is at fault.

## Your mission

1. Run the dashboard and check each reported issue.
2. Work out the right numbers by hand from the sample data and the metric definitions below.
3. Find the code that produces the wrong result and fix it.
4. Re-test every control, not only the one you changed.
5. Write a short bug report for each fix (see **What to submit**).

## Run it

1. Unzip or clone the project so all files sit together in the `ShopShock` folder.
2. Double-click **`start.bat`** (Windows). Your default browser opens `index.html`.
3. After each edit, save the file and refresh the page (`Ctrl + F5` clears the cache).

No `start.bat`? Open a Command Prompt in the folder and run `start index.html`, or open `index.html` in any browser.

## How the dashboard should work

### Controls

- **Search** matches part of a product name. Upper and lower case do not matter, and spaces around the text are ignored.
- **Category** shows only products in the chosen category. *All categories* shows everything.
- **Sort by price** orders the table by price. *Default order* restores the order in the data.
- The three controls work **together**: the table shows products that match the search **and** the category, in the chosen order.
- The summary cards and the sales overview describe the whole store. They do not change when you search or filter.

### Metric definitions

| Metric | How it is calculated |
|---|---|
| Revenue | For every **Delivered** order, `price × quantity`, added up. Processing and Cancelled orders are not included. |
| Orders | The number of records in `orders`, whatever their status |
| Products | The number of records in `products` |
| Low-stock items | Products with a `stock` of 10 or fewer, including products with none |
| Units in stock | The sum of `stock` across all products |
| Units sold (table) | The sum of `quantity` for Delivered orders of that product |
| Revenue by category (bars) | Delivered revenue of all products in that category |

### Data model

The sample data is the `products` and `orders` arrays at the top of `script.js`. `products.json` is a reference copy that the app does not read.

| Product field | Meaning |
|---|---|
| `id` | Unique product number |
| `name`, `category` | Product name and category |
| `price` | Price of one unit in rupees |
| `stock` | Units currently in stock |
| `supplier` | *Optional.* Some products have none, and the dashboard must cope. |

| Order field | Meaning |
|---|---|
| `orderId` | Unique order reference |
| `productId` | The `id` of the product ordered |
| `quantity` | Units in the order |
| `status` | `Delivered`, `Processing` or `Cancelled` |

| Order | Product ID | Quantity | Status |
|---|---|---|---|
| ORD-1001 | 1 | 1 | Delivered |
| ORD-1002 | 3 | 2 | Delivered |
| ORD-1003 | 10 | 5 | Delivered |
| ORD-1004 | 5 | 1 | Cancelled |
| ORD-1005 | 2 | 1 | Delivered |
| ORD-1006 | 11 | 10 | Delivered |
| ORD-1007 | 8 | 2 | Delivered |
| ORD-1008 | 4 | 1 | Processing |
| ORD-1009 | 6 | 2 | Delivered |
| ORD-1010 | 9 | 3 | Cancelled |
| ORD-1011 | 1 | 2 | Delivered |
| ORD-1012 | 12 | 4 | Delivered |
| ORD-1013 | 7 | 1 | Delivered |
| ORD-1014 | 13 | 1 | Delivered |

### Map of the code (`script.js`)

| Area | Where to look |
|---|---|
| Summary numbers | `calculateRevenue`, `countOrders`, `countLowStockProducts`, `calculateTotalUnitsInStock` |
| Chart data | `calculateRevenueByCategory` |
| Search, filter, sort | `filterBySearch`, `filterByCategory`, `comparePrices`, `sortByPrice` |
| Rendering | `renderSummary`, `renderCategoryBars`, `renderProducts` |

## Reported issues: start here

These are the symptoms users reported. They may not be the only problems, so check everything against the rules above.

| # | Where you will see it | What you notice | Where to start looking |
|---|---|---|---|
| 1 | Revenue card | It shows ₹26,770, which is more than the bars in *Sales overview* add up to. | Work through the revenue rule order by order, and check which orders the code includes. |
| 2 | Units in stock card | It shows a very long, strange number instead of a total in the hundreds. | Check the type of every `stock` value being added. One record is different from the rest. |
| 3 | Category drop-down | Choosing **Home** also lists office furniture and accessories. | Look at the condition that decides whether a product belongs to the chosen category. |

## Test it yourself

Work out each summary card by hand from the sample data, then compare it with the dashboard.

- **Search:** try upper case, lower case, partial words, extra spaces, and a word that matches nothing. The empty-results message should appear for the last one.
- **Category:** choose every category, then *All categories*.
- **Sort:** sort both ways and compare the prices in the table with the prices in the data. Then choose *Default order*.
- **Combine:** use a search, a category and a sort order together. For example, "pen" with *Stationery* should show two products.
- **Stock labels:** look at a product with no supplier, with very low stock, and with no stock at all.
- **Cards versus bars:** the Revenue card and the revenue bars describe the same delivered orders.

## Debugging toolkit

Open DevTools with **F12** (or **Ctrl + Shift + I**).

| Tab | Use it to |
|---|---|
| Console | Spot errors and print values, for example `console.table(products)` or `console.log(typeof product.stock, product.stock)` |
| Elements | Check the live HTML and the text of each card |
| Sources | Set a breakpoint in `script.js`, then step with **F10** (over) and **F11** (into). Watch a running `total` change inside a loop. |

Routine: reproduce, work out the right answer by hand, find where the code first goes wrong, change one thing, then re-test.

## What to submit

- Your fixed code, with **one Git commit per fix** and a clear message.
- A short bug report for each fix: what you did, what you expected, what happened, where the cause is, how you fixed it and how you tested it.
- Any extra problems you found that are not in the table above.

## Files

```
ShopShock/
├── index.html      Page structure
├── style.css       Styling and responsive layout
├── script.js       Sample data, calculations, filtering, sorting and rendering
├── products.json   Reference copy of the sample data (not loaded by the app)
├── README.md       This guide
└── start.bat       Windows launcher
```
