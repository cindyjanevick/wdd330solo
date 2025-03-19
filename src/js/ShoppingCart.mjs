import { getLocalStorage, setLocalStorage, cartSuperscript } from "./utils.mjs";

// Template for rendering a cart item
function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Images?.PrimarySmall || item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
      <div class="qtd-container">
        <div class="qtd-button" data-id="${item.Id}" data-action="increase">+</div>
        <p class="cart-card__quantity">qty: ${item.Qtd || 1}</p>
        <div class="qtd-button" data-id="${item.Id}" data-action="decrease">-</div>
      </div>
      <p class="cart-card__price">$${(item.FinalPrice || item.ListPrice).toFixed(2)}</p>
      <div class="cart-item-buttons">
        <button class="cart-card__remove" data-id="${item.Id}">X</button>
        <button class="to-wishlist-button" data-id="${item.Id}">Move to Wishlist</button>
      </div>
    </li>
  `;
}

// Template for rendering a wishlist item
function wishlistTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Images?.PrimarySmall || item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
      <button class="to-cart-button" data-id="${item.Id}">Move to Cart</button>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(cartKey = "so-cart", parentSelector = ".product-list", wishlistSelector = ".wishlist-items") {
    this.cartKey = cartKey;
    this.parentSelector = parentSelector;
    this.wishlistSelector = wishlistSelector;
  }

  init() {
    this.renderCartContents();
    this.renderWishlist();
  }

  renderCartContents() {
    const cartItems = getLocalStorage(this.cartKey) || [];
    const container = document.querySelector(this.parentSelector);

    if (cartItems.length === 0) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      this.updateCartSubtotal([]);
      return;
    }

    const htmlItems = cartItems.map(cartItemTemplate).join("");
    container.innerHTML = htmlItems;
    this.updateCartSubtotal(cartItems);
    this.attachCartEventListeners();
  }

  renderWishlist() {
    const wishlistItems = getLocalStorage("wishlist") || [];
    const container = document.querySelector(this.wishlistSelector);

    if (wishlistItems.length === 0) {
      container.innerHTML = "<p>Your wishlist is empty.</p>";
      return;
    }

    const htmlItems = wishlistItems.map(wishlistTemplate).join("");
    container.innerHTML = htmlItems;
    this.attachWishlistEventListeners();
  }

  attachCartEventListeners() {
    document.querySelectorAll(".cart-card__remove").forEach(btn =>
      btn.addEventListener("click", e => this.removeItem(e.target.dataset.id))
    );

    document.querySelectorAll(".qtd-button").forEach(btn =>
      btn.addEventListener("click", e => this.updateQuantity(e.target.dataset.id, e.target.dataset.action))
    );

    document.querySelectorAll(".to-wishlist-button").forEach(btn =>
      btn.addEventListener("click", e => this.moveToWishlist(e.target.dataset.id))
    );
  }

  attachWishlistEventListeners() {
    document.querySelectorAll(".to-cart-button").forEach(btn =>
      btn.addEventListener("click", e => this.moveToCart(e.target.dataset.id))
    );
  }

  updateQuantity(itemId, action) {
    const cartItems = getLocalStorage(this.cartKey);
    const index = cartItems.findIndex(item => item.Id === itemId);

    if (index === -1) return;

    const item = cartItems[index];
    const pricePerUnit = item.ListPrice || item.FinalPrice;

    if (action === "increase") {
      item.Qtd = (item.Qtd || 1) + 1;
      item.FinalPrice = (item.FinalPrice || pricePerUnit) + pricePerUnit;
    } else if (action === "decrease") {
      item.Qtd = (item.Qtd || 1) - 1;
      if (item.Qtd <= 0) {
        return this.removeItem(itemId);
      }
      item.FinalPrice = (item.FinalPrice || pricePerUnit) - pricePerUnit;
    }

    cartItems[index] = item;
    setLocalStorage(this.cartKey, cartItems);
    this.renderCartContents();
  }

  removeItem(itemId) {
    const cartItems = getLocalStorage(this.cartKey).filter(item => item.Id !== itemId);
    setLocalStorage(this.cartKey, cartItems);
    cartSuperscript();
    this.renderCartContents();
  }

  updateCartSubtotal(items) {
    const subtotalContainer = document.querySelector(".cart-card__subtotal");
    if (!subtotalContainer) return;

    if (items.length === 0) {
      subtotalContainer.classList.add("hide");
      return;
    }

    subtotalContainer.classList.remove("hide");
    const total = items.reduce((sum, item) => sum + (item.FinalPrice || 0), 0);
    const count = items.reduce((sum, item) => sum + (item.Qtd || 1), 0);

    document.querySelector(".cart-subtotal").textContent = `$${total.toFixed(2)}`;
    document.querySelector(".cart-count").textContent = `${count} item${count !== 1 ? "s" : ""}`;
  }

  moveToWishlist(itemId) {
    const cartItems = getLocalStorage(this.cartKey);
    const wishlistItems = getLocalStorage("wishlist") || [];

    const index = cartItems.findIndex(item => item.Id === itemId);
    if (index === -1) return;

    wishlistItems.push(cartItems[index]);
    setLocalStorage("wishlist", wishlistItems);

    cartItems.splice(index, 1);
    setLocalStorage(this.cartKey, cartItems);

    cartSuperscript();
    this.renderCartContents();
    this.renderWishlist();
  }

  moveToCart(itemId) {
    const wishlistItems = getLocalStorage("wishlist");
    const cartItems = getLocalStorage(this.cartKey) || [];

    const index = wishlistItems.findIndex(item => item.Id === itemId);
    if (index === -1) return;

    cartItems.push(wishlistItems[index]);
    setLocalStorage(this.cartKey, cartItems);

    wishlistItems.splice(index, 1);
    setLocalStorage("wishlist", wishlistItems);

    cartSuperscript();
    this.renderCartContents();
    this.renderWishlist();
  }
}
