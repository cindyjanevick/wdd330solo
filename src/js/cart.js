import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs"; 
loadHeaderFooter();

// Function to render the cart items or show an empty cart message
function renderCartContents() {
  let cartItems = getLocalStorage("so-cart") || [];
  const cartFooter = document.querySelector(".cart-footer");

  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty</p>";
    cartFooter.classList.add("hide"); // Hide the footer when cart is empty
    return;
  }

  // Combine duplicate items by summing their quantity
  const mergedCart = mergeCartItems(cartItems);

  // Render cart items
  const htmlItems = mergedCart.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Calculate and display total price
  const totalPrice = mergedCart.reduce((total, item) => total + item.FinalPrice * item.Quantity, 0);
  document.querySelector(".cart-total").innerHTML = `Total: $${totalPrice.toFixed(2)}`;

  // Show the cart footer
  cartFooter.classList.remove("hide");

  // Add event listeners to all remove buttons
  document.querySelectorAll(".cart-card__remove").forEach(button => {
    button.addEventListener("click", removeFromCart);
  });
}

// Function to merge duplicate cart items
function mergeCartItems(cartItems) {
  let mergedCart = [];

  cartItems.forEach(item => {
    let existingItem = mergedCart.find(cartItem => cartItem.Id === item.Id);

    if (existingItem) {
      existingItem.Quantity += item.Quantity || 1; // Increase quantity
    } else {
      item.Quantity = item.Quantity || 1; // Set default quantity if missing
      mergedCart.push(item);
    }
  });

  return mergedCart;
}

// Function to create the HTML template for a cart item
function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.Quantity}</p>
    <p class="cart-card__price">$${(item.FinalPrice * item.Quantity).toFixed(2)}</p>
    <span class="cart-card__remove" data-id="${item.Id}">X</span>
  </li>`;
}

// Function to remove an item from the cart
function removeFromCart(e) {
  const productId = e.target.dataset.id;
  let cartItems = getLocalStorage("so-cart");

  if (cartItems) {
    // Find the item to remove
    const itemIndex = cartItems.findIndex(item => item.Id === productId);

    if (itemIndex !== -1) {
      // Decrease the quantity or remove the item if it's 1
      if (cartItems[itemIndex].Quantity > 1) {
        cartItems[itemIndex].Quantity -= 1;
      } else {
        cartItems.splice(itemIndex, 1);
      }

      // Save the updated cart back to localStorage
      setLocalStorage("so-cart", cartItems);

      // Re-render the cart
      renderCartContents();
    }
  }
}

// Call the function to render the cart on page load
renderCartContents();
