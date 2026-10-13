/* Jagdamba Kirana Store — Part 1 frontend
   Demo mode works without a backend.
   To use FastAPI, set API_BASE_URL and expose GET /api/products.
*/
"use strict";

const API_BASE_URL = ""; // Example: "http://127.0.0.1:8000"
const PRODUCTS_ENDPOINT = "/api/products";
const CART_STORAGE_KEY = "jagdamba-kirana-cart-v1";
const WISHLIST_STORAGE_KEY = "jagdamba-kirana-wishlist-v1";
const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 25;

const sampleProducts = [
  { id: "p001", name: "Fresh Tomatoes", category: "Fruits & Vegetables", quantity: "500 g", price: 28, mrp: 35, badge: "Fresh pick", rating: 4.8, reviews: 126, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80", featured: 1 },
  { id: "p002", name: "Farm Fresh Bananas", category: "Fruits & Vegetables", quantity: "6 pieces", price: 42, mrp: 50, badge: "Popular", rating: 4.7, reviews: 98, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80", featured: 2 },
  { id: "p003", name: "Amul Taaza Milk", category: "Dairy & Bakery", quantity: "500 ml", price: 29, mrp: 29, badge: "Daily essential", rating: 4.9, reviews: 215, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80", featured: 3 },
  { id: "p004", name: "Whole Wheat Atta", category: "Atta, Rice & Dal", quantity: "1 kg", price: 58, mrp: 65, badge: "Value buy", rating: 4.6, reviews: 84, image: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=600&q=80", featured: 4 },
  { id: "p005", name: "Basmati Rice", category: "Atta, Rice & Dal", quantity: "1 kg", price: 115, mrp: 135, badge: "10% off", rating: 4.8, reviews: 72, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80", featured: 5 },
  { id: "p006", name: "Crispy Potato Chips", category: "Snacks & Drinks", quantity: "Pack of 1", price: 20, mrp: 20, badge: "Snack time", rating: 4.5, reviews: 61, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80", featured: 6 },
  { id: "p007", name: "Creamy White Bread", category: "Dairy & Bakery", quantity: "400 g", price: 35, mrp: 40, badge: "Soft & fresh", rating: 4.6, reviews: 55, image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=600&q=80", featured: 7 },
  { id: "p008", name: "Masoor Dal", category: "Atta, Rice & Dal", quantity: "500 g", price: 68, mrp: 75, badge: "Kitchen staple", rating: 4.7, reviews: 48, image: "https://images.unsplash.com/photo-1515543904379-3d757ffee024?auto=format&fit=crop&w=600&q=80", featured: 8 },
  { id: "p009", name: "Fresh Green Capsicum", category: "Fruits & Vegetables", quantity: "250 g", price: 24, mrp: 30, badge: "Fresh pick", rating: 4.5, reviews: 36, image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80", featured: 9 },
  { id: "p010", name: "Orange Juice", category: "Snacks & Drinks", quantity: "1 litre", price: 99, mrp: 115, badge: "Save ₹16", rating: 4.4, reviews: 42, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80", featured: 10 },
  { id: "p011", name: "Classic Butter", category: "Dairy & Bakery", quantity: "100 g", price: 58, mrp: 60, badge: "Popular", rating: 4.8, reviews: 104, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80", featured: 11 },
  { id: "p012", name: "Premium Bath Soap", category: "Personal Care", quantity: "Pack of 3", price: 105, mrp: 120, badge: "Bundle deal", rating: 4.6, reviews: 66, image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80", featured: 12 },
  { id: "p013", name: "Red Apples", category: "Fruits & Vegetables", quantity: "4 pieces", price: 99, mrp: 120, badge: "Seasonal", rating: 4.7, reviews: 79, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80", featured: 13 },
  { id: "p014", name: "Roasted Peanuts", category: "Snacks & Drinks", quantity: "200 g", price: 45, mrp: 50, badge: "Tea-time pick", rating: 4.4, reviews: 31, image: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=600&q=80", featured: 14 },
  { id: "p015", name: "Toor Dal", category: "Atta, Rice & Dal", quantity: "500 g", price: 82, mrp: 90, badge: "Kitchen staple", rating: 4.7, reviews: 57, image: "https://images.unsplash.com/photo-1515543904379-3d757ffee024?auto=format&fit=crop&w=600&q=80", featured: 15 },
  { id: "p016", name: "Shampoo", category: "Personal Care", quantity: "180 ml", price: 149, mrp: 165, badge: "Save ₹16", rating: 4.5, reviews: 44, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80", featured: 16 }
];

const state = {
  products: [...sampleProducts],
  category: "All",
  query: "",
  sort: "featured",
  cart: readStorage(CART_STORAGE_KEY, {}),
  wishlist: new Set(readStorage(WISHLIST_STORAGE_KEY, [])),
  toastTimer: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(Number(value) || 0);

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([...state.wishlist]));
  } catch {
    // The page still works for this session if browser storage is unavailable.
  }
}

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function normaliseProduct(product, index = 0) {
  const price = Number(product.price ?? product.selling_price ?? product.sellingPrice ?? 0);
  const mrp = Number(product.mrp ?? product.original_price ?? product.originalPrice ?? price);
  return {
    id: String(product.id ?? product._id ?? product.product_id ?? `api-${index}`),
    name: String(product.name ?? product.title ?? "Grocery item"),
    category: String(product.category ?? "Other"),
    quantity: String(product.quantity ?? product.unit ?? product.pack_size ?? "1 unit"),
    price, mrp: mrp >= price ? mrp : price,
    badge: String(product.badge ?? (mrp > price ? "Special price" : "Everyday essential")),
    rating: Number(product.rating ?? 4.5),
    reviews: Number(product.reviews ?? product.review_count ?? 0),
    image: String(product.image ?? product.image_url ?? product.imageUrl ?? ""),
    featured: Number(product.featured ?? index + 1)
  };
}

async function loadProducts() {
  if (!API_BASE_URL) {
    renderProducts();
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`Product API returned ${response.status}`);
    const payload = await response.json();
    const items = Array.isArray(payload) ? payload : (payload.products ?? payload.items ?? []);
    if (!Array.isArray(items)) throw new Error("Unexpected product response format");
    state.products = items.map(normaliseProduct);
  } catch (error) {
    console.warn("Using demo products because the API could not be reached:", error);
    showToast("Demo products loaded. Backend connection is not active yet.");
  }
  renderProducts();
}

function getFilteredProducts() {
  let products = state.products.filter((product) => {
    const matchesCategory = state.category === "All" || product.category === state.category;
    const searchable = `${product.name} ${product.category} ${product.quantity} ${product.badge}`.toLowerCase();
    return matchesCategory && searchable.includes(state.query.toLowerCase().trim());
  });
  switch (state.sort) {
    case "price-low": products.sort((a, b) => a.price - b.price); break;
    case "price-high": products.sort((a, b) => b.price - a.price); break;
    case "name": products.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: products.sort((a, b) => a.featured - b.featured);
  }
  return products;
}

function productCard(product) {
  const discount = product.mrp > product.price ? Math.round((1 - product.price / product.mrp) * 100) : 0;
  const badge = discount ? `${discount}% OFF` : product.badge;
  const saved = state.wishlist.has(product.id);
  const image = product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${safeText(image)}" alt="${safeText(product.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'">
        <span class="product-badge ${discount ? "sale" : ""}">${safeText(badge)}</span>
        <button class="wishlist-button ${saved ? "saved" : ""}" data-wishlist="${safeText(product.id)}" type="button" aria-label="${saved ? "Remove from" : "Add to"} wishlist" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>
      </div>
      <div class="product-info">
        <span class="product-category">${safeText(product.category)}</span>
        <h3 class="product-name">${safeText(product.name)}</h3>
        <span class="product-quantity">${safeText(product.quantity)}</span>
        <div class="product-rating"><span>★</span><strong>${Number(product.rating).toFixed(1)}</strong><span>(${Number(product.reviews)})</span></div>
        <div class="product-bottom">
          <div class="product-price"><strong>${money(product.price)}</strong>${product.mrp > product.price ? `<del>${money(product.mrp)}</del>` : ""}</div>
          <button class="add-button" data-add="${safeText(product.id)}" type="button"><span class="plus">+</span> Add</button>
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  const products = getFilteredProducts();
  $("#productGrid").innerHTML = products.map(productCard).join("");
  $("#emptyState").hidden = products.length > 0;
  $("#productGrid").hidden = products.length === 0;
  $("#activeFilters").hidden = state.category === "All" && !state.query;
  $("#filterLabel").textContent = `${products.length} item${products.length === 1 ? "" : "s"}${state.category !== "All" ? ` in ${state.category}` : ""}${state.query ? ` matching “${state.query}”` : ""}`;
  $("#loadMoreBtn").textContent = state.category !== "All" || state.query ? "Show all products ↓" : "Explore all essentials ↓";
  $("#loadMoreBtn").dataset.reset = String(state.category !== "All" || Boolean(state.query));
  syncActiveCategories();
}

function syncActiveCategories() {
  $$(".nav-link").forEach((button) => {
    const active = button.dataset.category === state.category;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function setCategory(category, scroll = true) {
  state.category = category;
  state.query = "";
  $("#searchInput").value = "";
  renderProducts();
  if (scroll) $("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function findProduct(id) {
  return state.products.find((product) => product.id === String(id));
}

function addToCart(id) {
  const product = findProduct(id);
  if (!product) return;
  const current = state.cart[product.id]?.quantity ?? 0;
  state.cart[product.id] = { quantity: current + 1 };
  saveStorage();
  renderCart();
  showToast(`${product.name} added to your cart`);
}

function changeQuantity(id, delta) {
  const product = findProduct(id);
  if (!product || !state.cart[id]) return;
  const next = state.cart[id].quantity + delta;
  if (next <= 0) delete state.cart[id];
  else state.cart[id].quantity = next;
  saveStorage();
  renderCart();
}

function cartLines() {
  return Object.entries(state.cart).map(([id, entry]) => {
    const product = findProduct(id);
    return product ? { product, quantity: Math.max(1, Number(entry.quantity) || 1) } : null;
  }).filter(Boolean);
}

function renderCart() {
  const lines = cartLines();
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  $("#cartCount").textContent = count;
  $("#drawerCartCount").textContent = `(${count})`;
  $("#headerCartTotal").textContent = money(subtotal);
  $("#cartItems").innerHTML = lines.map(({ product, quantity }) => `
    <div class="cart-item">
      <img src="${safeText(product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=70")}" alt="${safeText(product.name)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=70'">
      <div class="cart-item-info"><strong>${safeText(product.name)}</strong><small>${safeText(product.quantity)} · ${money(product.price)} each</small><div class="quantity-control"><button data-quantity="${safeText(product.id)}" data-delta="-1" type="button" aria-label="Decrease ${safeText(product.name)} quantity">−</button><span>${quantity}</span><button data-quantity="${safeText(product.id)}" data-delta="1" type="button" aria-label="Increase ${safeText(product.name)} quantity">+</button></div></div>
      <div class="cart-item-price"><span>${money(product.price * quantity)}</span><button class="remove-link" data-remove="${safeText(product.id)}" type="button" style="border:0;background:none;color:#a0aaa2;font-size:10px;padding:0">Remove</button></div>
    </div>`).join("");

  const isEmpty = lines.length === 0;
  $("#cartEmpty").hidden = !isEmpty;
  $("#cartFooter").hidden = isEmpty;
  $("#cartSubtotal").textContent = money(subtotal);
  $("#deliveryFee").textContent = delivery === 0 && subtotal > 0 ? "FREE" : money(delivery);
  $("#cartGrandTotal").textContent = money(total);
  $("#freeDeliveryText").textContent = subtotal === 0 ? `Free delivery above ${money(FREE_DELIVERY_THRESHOLD)}` : subtotal >= FREE_DELIVERY_THRESHOLD ? "You've unlocked free delivery!" : `${money(FREE_DELIVERY_THRESHOLD - subtotal)} away from free delivery`;
  $("#deliveryProgress").style.width = `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%`;
}

function openCart() {
  $("#overlay").hidden = false;
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  $("#closeCartBtn").focus();
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;
  document.body.classList.remove("no-scroll");
  $("#openCartBtn").focus();
}

function toggleWishlist(id) {
  const product = findProduct(id);
  if (!product) return;
  if (state.wishlist.has(id)) {
    state.wishlist.delete(id);
    showToast("Removed from your wishlist");
  } else {
    state.wishlist.add(id);
    showToast("Saved to your wishlist");
  }
  saveStorage();
  renderProducts();
}

function resetFilters() {
  state.category = "All";
  state.query = "";
  state.sort = "featured";
  $("#searchInput").value = "";
  $("#sortSelect").value = "featured";
  renderProducts();
}

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.query = $("#searchInput").value.trim();
  renderProducts();
  $("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#searchInput").addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderProducts();
});

$("#sortSelect").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

document.addEventListener("click", (event) => {
  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    setCategory(categoryButton.dataset.category);
    return;
  }
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    addToCart(addButton.dataset.add);
    return;
  }
  const wishlistButton = event.target.closest("[data-wishlist]");
  if (wishlistButton) {
    toggleWishlist(wishlistButton.dataset.wishlist);
    return;
  }
  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    changeQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.delta));
    return;
  }
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    delete state.cart[removeButton.dataset.remove];
    saveStorage();
    renderCart();
    showToast("Item removed from your cart");
    return;
  }
  const footerCategory = event.target.closest("[data-footer-category]");
  if (footerCategory) setCategory(footerCategory.dataset.footerCategory);
});

$("#viewAllCategories").addEventListener("click", () => setCategory("All"));
$("#clearFilters").addEventListener("click", resetFilters);
$("#resetSearch").addEventListener("click", () => {
  resetFilters();
  $("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#loadMoreBtn").addEventListener("click", () => {
  if ($("#loadMoreBtn").dataset.reset === "true") resetFilters();
  else showToast("You're seeing all available demo products");
});
$("#openCartBtn").addEventListener("click", openCart);
$("#closeCartBtn").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#continueShoppingBtn").addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && $("#cartDrawer").classList.contains("open")) closeCart();
});

$("#checkoutBtn").addEventListener("click", () => {
  const lines = cartLines();
  if (!lines.length) {
    showToast("Your cart is empty");
    return;
  }
  showToast("Checkout will be enabled when the backend is connected.");
  // Part 2 will replace this demo notice with a checkout form and POST /api/orders.
});

$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("#newsletterEmail").value.trim();
  if (!email) return;
  $("#newsletterEmail").value = "";
  showToast("Thanks! Newsletter signup will be connected in a later part.");
});

$("#currentYear").textContent = new Date().getFullYear();
renderCart();
loadProducts();
