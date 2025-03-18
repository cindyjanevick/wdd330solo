import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// Function to render the cart items or show an empty cart message
function renderCartContents() {
  let cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  if (cartItems.length === 0) {
    productList.innerHTML = "<p>Your cart is empty</p>";
    cartTotal.innerHTML = ""; // Clear total if cart is empty
    cartFooter.classList.add("hide"); // Hide footer when cart is empty
    return;
  }

  // Merge duplicate items by summing quantity
  const mergedCart = mergeCartItems(cartItems);

  // Render cart items
  const htmlItems = mergedCart.map(item => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  // Calculate and display total price
  const totalPrice = mergedCart.reduce((total, item) => total + item.FinalPrice * item.Quantity, 0);
  cartTotal.innerHTML = `Total: $${totalPrice.toFixed(2)}`;

  cartFooter.classList.remove("hide"); // Show footer

  // Add event listeners to all remove buttons
  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", removeCartItem);
  });
}

// Function to merge duplicate cart items
function mergeCartItems(cartItems) {
  const merged = [];

  cartItems.forEach(item => {
    const existing = merged.find(i => i.Id === item.Id);

    if (existing) {
      existing.Quantity += item.Quantity || 1;
    } else {
      item.Quantity = item.Quantity || 1;
      merged.push(item);
    }
  });

  return merged;
}

// Function to create the HTML template for a cart item
function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <span class="remove-item" data-id="${item.Id}">X</span> <!-- X button -->
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.Quantity}</p>
    <p class="cart-card__price">$${(item.FinalPrice * item.Quantity).toFixed(2)}</p>
  </li>`;
}

// Function to remove an item from the cart (decrease quantity or remove)
function removeCartItem(event) {
  const productId = event.target.dataset.id;
  let cartItems = getLocalStorage("so-cart") || [];

  const itemIndex = cartItems.findIndex(item => item.Id === productId);

  if (itemIndex !== -1) {
    if (cartItems[itemIndex].Quantity && cartItems[itemIndex].Quantity > 1) {
      cartItems[itemIndex].Quantity -= 1; // Decrement quantity
    } else {
      cartItems.splice(itemIndex, 1); // Remove item completely
    }

    setLocalStorage("so-cart", cartItems);
    renderCartContents(); // Update UI
  }
}

// Call the function to render the cart on page load
renderCartContents();
