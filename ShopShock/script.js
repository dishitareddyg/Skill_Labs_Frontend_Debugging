// ShopShock - product, order and summary logic.
// The data below is plain JavaScript so the page works when opened directly from disk.
// products.json holds the same data for reference only; this file does not read it.

// ---------- Settings ----------
const LOW_STOCK_THRESHOLD = 10;   // A product with this many units or fewer is "low stock"

// ---------- Sample data ----------
const products = [
  { id: 1,  name: "Wireless Earbuds Pro",        category: "Electronics",  price: 2499, stock: 34,   supplier: "SoundWave Traders" },
  { id: 2,  name: "Bluetooth Speaker Mini",      category: "Electronics",  price: 1799, stock: 8,    supplier: "SoundWave Traders" },
  { id: 3,  name: "Smart LED Bulb (Pack of 2)",  category: "Home",         price: 599,  stock: 62 },
  { id: 4,  name: "Cotton Bedsheet Set",         category: "Home",         price: 1299, stock: "48", supplier: "Jaipur Textiles" },
  { id: 5,  name: "Ergonomic Office Chair",      category: "Home Office",  price: 7499, stock: 5,    supplier: "SitWell Furniture" },
  { id: 6,  name: "Adjustable Laptop Stand",     category: "Home Office",  price: 999,  stock: 27 },
  { id: 7,  name: "Desk Organizer",              category: "Home Office",  price: 150,  stock: 40,   supplier: "Deskify" },
  { id: 8,  name: "Yoga Mat (6 mm)",             category: "Fitness",      price: 799,  stock: 0 },
  { id: 9,  name: "Resistance Band Set",         category: "Fitness",      price: 499,  stock: 15,   supplier: "FlexFit India" },
  { id: 10, name: "Spiral Notebook (A5)",        category: "Stationery",   price: 100,  stock: 120 },
  { id: 11, name: "Gel Pen (Blue)",              category: "Stationery",   price: 20,   stock: 300,  supplier: "Inkwell Traders" },
  { id: 12, name: "Eraser",                      category: "Stationery",   price: 9,    stock: 9 },
  { id: 13, name: "Premium Fountain Pen",        category: "Stationery",   price: 1499, stock: 22,   supplier: "Inkwell Traders" }
];

const orders = [
  { orderId: "ORD-1001", productId: 1,  quantity: 1,  status: "Delivered" },
  { orderId: "ORD-1002", productId: 3,  quantity: 2,  status: "Delivered" },
  { orderId: "ORD-1003", productId: 10, quantity: 5,  status: "Delivered" },
  { orderId: "ORD-1004", productId: 5,  quantity: 1,  status: "Cancelled" },
  { orderId: "ORD-1005", productId: 2,  quantity: 1,  status: "Delivered" },
  { orderId: "ORD-1006", productId: 11, quantity: 10, status: "Delivered" },
  { orderId: "ORD-1007", productId: 8,  quantity: 2,  status: "Delivered" },
  { orderId: "ORD-1008", productId: 4,  quantity: 1,  status: "Processing" },
  { orderId: "ORD-1009", productId: 6,  quantity: 2,  status: "Delivered" },
  { orderId: "ORD-1010", productId: 9,  quantity: 3,  status: "Cancelled" },
  { orderId: "ORD-1011", productId: 1,  quantity: 2,  status: "Delivered" },
  { orderId: "ORD-1012", productId: 12, quantity: 4,  status: "Delivered" },
  { orderId: "ORD-1013", productId: 7,  quantity: 1,  status: "Delivered" },
  { orderId: "ORD-1014", productId: 13, quantity: 1,  status: "Delivered" }
];

// ---------- DOM references ----------
const revenueElement = document.getElementById("revenue-value");
const ordersElement = document.getElementById("orders-value");
const productsElement = document.getElementById("products-value");
const lowStockElement = document.getElementById("lowstock-value");
const unitsElement = document.getElementById("units-value");
const barsElement = document.getElementById("category-bars");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const sortSelect = document.getElementById("sort-select");
const resultCountElement = document.getElementById("result-count");
const tableBody = document.getElementById("product-table-body");
const emptyState = document.getElementById("empty-state");

// ---------- Formatting helpers ----------
const currencyFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const numberFormatter = new Intl.NumberFormat("en-IN");

function formatCurrency(amount) { return currencyFormatter.format(amount); }
function formatNumber(value) { return numberFormatter.format(value); }

// ---------- Data helpers ----------

// Find a product by its id (returns undefined if there is no match).
function findProduct(productId) {
  return products.find(function (product) { return product.id === productId; });
}

// Only delivered orders count towards sales figures.
function isDeliveredOrder(order) {
  return order.status === "Delivered";
}

// Total delivered units for one product.
function getUnitsSold(productId) {
  let units = 0;
  orders.forEach(function (order) {
    if (order.productId === productId && isDeliveredOrder(order)) {
      units = units + order.quantity;
    }
  });
  return units;
}

// Return "in", "low" or "out" for a product's stock level.
function getStockStatus(product) {
  if (product.stock <= 0) { return "out"; }
  if (product.stock <= LOW_STOCK_THRESHOLD) { return "low"; }
  return "in";
}

// ---------- Summary calculations ----------

// Add up the sales value of the orders.
function calculateRevenue() {
  let total = 0;
  orders.forEach(function (order) {
    const product = findProduct(order.productId);
    if (product) {
      total = total + product.price * order.quantity;
    }
  });
  return total;
}

// Number of orders in the orders list.
function countOrders() {
  return orders.length;
}

// Number of products with a low stock level (including out of stock).
function countLowStockProducts() {
  return products.filter(function (product) {
    return product.stock <= LOW_STOCK_THRESHOLD;
  }).length;
}

// Total number of units held across all products.
function calculateTotalUnitsInStock() {
  let total = 0;
  products.forEach(function (product) {
    total = total + product.stock;
  });
  return total;
}

// Delivered revenue for each category, used by the sales overview bars.
function calculateRevenueByCategory() {
  const revenueByCategory = {};
  products.forEach(function (product) {
    if (!(product.category in revenueByCategory)) { revenueByCategory[product.category] = 0; }
  });
  orders.forEach(function (order) {
    const product = findProduct(order.productId);
    if (product && isDeliveredOrder(order)) {
      revenueByCategory[product.category] += product.price * order.quantity;
    }
  });
  return revenueByCategory;
}

// ---------- Filtering and sorting ----------

// Keep products whose name contains the search text (ignoring upper/lower case).
function filterBySearch(list, searchText) {
  const query = searchText.trim().toLowerCase();
  if (query === "") { return list; }
  return list.filter(function (product) {
    return product.name.toLowerCase().includes(query);
  });
}

// Keep products in the chosen category ("all" keeps everything).
function filterByCategory(list, category) {
  if (category === "all") { return list; }
  return list.filter(function (product) {
    return product.category.includes(category);
  });
}

// Compare two products by price (used by the sort control).
function comparePrices(productA, productB) {
  const priceA = String(productA.price);
  const priceB = String(productB.price);
  if (priceA < priceB) { return -1; }
  if (priceA > priceB) { return 1; }
  return 0;
}

// Return a sorted copy of the list; "default" keeps the original order.
function sortByPrice(list, direction) {
  if (direction === "default") { return list; }
  const sorted = list.slice().sort(comparePrices);
  if (direction === "desc") { sorted.reverse(); }
  return sorted;
}

// Apply search, category and sort in turn to get the rows to display.
function getVisibleProducts() {
  let visible = filterBySearch(products, searchInput.value);
  visible = filterByCategory(visible, categorySelect.value);
  visible = sortByPrice(visible, sortSelect.value);
  return visible;
}

// ---------- Rendering ----------

// Fill the summary cards.
function renderSummary() {
  revenueElement.textContent = formatCurrency(calculateRevenue());
  ordersElement.textContent = formatNumber(countOrders());
  productsElement.textContent = formatNumber(products.length);
  lowStockElement.textContent = formatNumber(countLowStockProducts());
  unitsElement.textContent = formatNumber(calculateTotalUnitsInStock());
}

// Draw one CSS bar per category.
function renderCategoryBars() {
  const revenueByCategory = calculateRevenueByCategory();
  const categories = Object.keys(revenueByCategory);
  const highest = Math.max.apply(null, categories.map(function (name) { return revenueByCategory[name]; }));
  barsElement.innerHTML = "";

  categories.forEach(function (name) {
    const row = document.createElement("li");
    row.className = "bar-row";

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = name;

    const track = document.createElement("div");
    track.className = "bar-track";
    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = (highest > 0 ? (revenueByCategory[name] / highest) * 100 : 0) + "%";
    track.appendChild(fill);

    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = formatCurrency(revenueByCategory[name]);

    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(value);
    barsElement.appendChild(row);
  });
}

// Fill the category drop-down from the product data.
function populateCategories() {
  const seen = [];
  products.forEach(function (product) {
    if (!seen.includes(product.category)) { seen.push(product.category); }
  });
  seen.forEach(function (category) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Create one table cell.
function createCell(label, className) {
  const cell = document.createElement("td");
  cell.dataset.label = label;
  if (className) { cell.className = className; }
  return cell;
}

// Create one table row for a product.
function createProductRow(product) {
  const row = document.createElement("tr");

  const nameCell = createCell("Product");
  const name = document.createElement("div");
  name.className = "product-name";
  name.textContent = product.name;
  nameCell.appendChild(name);
  if (product.supplier) {
    const supplier = document.createElement("div");
    supplier.className = "product-supplier";
    supplier.textContent = "Supplier: " + product.supplier;
    nameCell.appendChild(supplier);
  }

  const categoryCell = createCell("Category");
  categoryCell.textContent = product.category;

  const priceCell = createCell("Price", "num");
  priceCell.textContent = formatCurrency(product.price);

  const stockCell = createCell("Stock", "num");
  const status = getStockStatus(product);
  const badge = document.createElement("span");
  badge.className = "badge badge-" + status;
  badge.textContent = status === "out" ? "Out of stock" : status === "low" ? "Low stock" : "In stock";
  stockCell.appendChild(document.createTextNode(String(product.stock)));
  stockCell.appendChild(badge);

  const soldCell = createCell("Units sold", "num");
  soldCell.textContent = formatNumber(getUnitsSold(product.id));

  row.appendChild(nameCell);
  row.appendChild(categoryCell);
  row.appendChild(priceCell);
  row.appendChild(stockCell);
  row.appendChild(soldCell);
  return row;
}

// Redraw the product table, the result count and the empty state.
function renderProducts() {
  const visible = getVisibleProducts();
  tableBody.innerHTML = "";
  visible.forEach(function (product) {
    tableBody.appendChild(createProductRow(product));
  });
  resultCountElement.textContent = "Showing " + visible.length + " of " + products.length + " products";
  emptyState.hidden = visible.length !== 0;
}

// ---------- Event listeners ----------
searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);

// ---------- Start the app ----------
populateCategories();
renderSummary();
renderCategoryBars();
renderProducts();
