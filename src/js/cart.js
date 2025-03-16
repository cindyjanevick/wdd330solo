import { getLocalStorage, setLocalStorage } from "./utils.mjs"; 

// Function to render the cart items or show an empty cart message
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty</p>";
    document.querySelector(".cart-total").innerHTML = ""; // Clear total if cart is empty
    return;
  }

  // Render cart items
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Attach event listeners to "X" buttons after rendering
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", removeCartItem);
  });

  // Calculate and display total price
  const totalPrice = cartItems.reduce((total, item) => total + item.FinalPrice, 0);
  document.querySelector(".cart-total").innerHTML = `Total: $${totalPrice.toFixed(2)}`;
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
    <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

// Function to remove item from cart
function removeCartItem(event) {
  const itemId = event.target.dataset.id; // Get the item's ID
  let cartItems = getLocalStorage("so-cart");

  // Filter out the item with the matching ID
  cartItems = cartItems.filter(item => item.Id !== itemId);

  // Save the updated cart back to localStorage
  setLocalStorage("so-cart", cartItems);

  // Re-render the cart
  renderCartContents();
}

// Call the function to render the cart on page load
renderCartContents();
