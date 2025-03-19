import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ShoppingCart {
  constructor(cartKey = "so-cart", wishlistKey = "so-wishlist") {
    this.cartKey = cartKey;
    this.wishlistKey = wishlistKey;
    this.cartItems = [];
    this.wishlistItems = [];
  }

  async init() {
    this.cartItems = getLocalStorage(this.cartKey) || [];
    this.renderCartContents();
    this.updateCartSubtotal(this.cartItems);
    this.setupListeners();
  }

  setupListeners() {
    const cartContainer = document.querySelector(".product-list");

    cartContainer?.addEventListener("click", (e) => {
      const itemId = e.target.closest("[data-id]")?.dataset.id;
      if (!itemId) return;

      if (e.target.classList.contains("cart-remove")) {
        this.removeItem(itemId);
      } else if (e.target.classList.contains("add-to-wishlist")) {
        this.addToWishlist(itemId);
      } else if (e.target.classList.contains("quantity-increase")) {
        this.updateQuantity(itemId, "increase");
      } else if (e.target.classList.contains("quantity-decrease")) {
        this.updateQuantity(itemId, "decrease");
      }
    });
  }

  renderCartContents() {
    const htmlItems = this.cartItems.map(item => this.cartItemTemplate(item)).join("");
    const element = document.querySelector(".product-list");

    if (element) {
      element.innerHTML = htmlItems;
    }

    this.updateCartSubtotal(this.cartItems);
  }

  cartItemTemplate(item) {
    const quantity = item.Qtd || 1;
    const totalPrice = item.ListPrice * quantity;

    return `
      <li class="cart-card" data-id="${item.Id}">
        <a href="#" class="cart-card__image">
          <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
        </a>
        <div class="cart-card__info">
          <a href="#"><h2 class="card__name">${item.Name}</h2></a>
          <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
          <p class="cart-card__quantity">
            Quantity: 
            <button class="quantity-btn quantity-decrease">-</button>
            <span>${quantity}</span>
            <button class="quantity-btn quantity-increase">+</button>
          </p>
          <p class="cart-card__price">$${totalPrice.toFixed(2)}</p>
          <button class="cart-remove">X</button>
          <button class="add-to-wishlist">Add to Wishlist</button>
        </div>
      </li>`;
  }

  updateQuantity(itemId, action) {
    const itemIndex = this.cartItems.findIndex(item => item.Id === itemId);
    if (itemIndex === -1) return;

    let item = this.cartItems[itemIndex];
    let quantity = item.Qtd || 1;

    if (action === "increase") {
      quantity++;
    } else if (action === "decrease") {
      quantity--;
      if (quantity <= 0) {
        this.removeItem(itemId);
        return;
      }
    }

    this.cartItems[itemIndex].Qtd = quantity;
    setLocalStorage(this.cartKey, this.cartItems);
    this.renderCartContents();
  }

  updateCartSubtotal(items) {
    const subtotalContainer = document.querySelector(".cart-card__subtotal");
    const cartCountContainer = document.querySelector(".cart-count");

    if (!subtotalContainer || !cartCountContainer) return;

    if (items.length === 0) {
      subtotalContainer.classList.add("hide");
      cartCountContainer.textContent = "0 items";
      return;
    }

    const subtotal = items.reduce((sum, item) => sum + (item.ListPrice * (item.Qtd || 1)), 0);
    const totalCount = items.reduce((sum, item) => sum + (item.Qtd || 1), 0);

    subtotalContainer.classList.remove("hide");
    subtotalContainer.querySelector(".cart-subtotal").textContent = ` $${subtotal.toFixed(2)}`;
    cartCountContainer.textContent = `${totalCount} item${totalCount > 1 ? "s" : ""}`;
  }

  removeItem(itemId) {
    this.cartItems = this.cartItems.filter(item => item.Id !== itemId);
    setLocalStorage(this.cartKey, this.cartItems);
    this.renderCartContents();
  }

  addToWishlist(itemId) {
    const item = this.cartItems.find(item => item.Id === itemId);
    if (!item) return;

    const exists = this.wishlistItems.some(wishItem => wishItem.Id === itemId);
    if (!exists) {
      this.wishlistItems.push(item);
      setLocalStorage(this.wishlistKey, this.wishlistItems);
      alert(`${item.Name} added to wishlist.`);
    } else {
      alert(`${item.Name} is already in your wishlist.`);
    }
  }
}
