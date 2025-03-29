//used to populate cart/index.html data
import { loadHeaderFooter, renderCartCount } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

const cart = new ShoppingCart("cart", ".product-list");
cart.renderCartContents();
loadHeaderFooter();
cart.calculateTotal();

const deleteButtons = document.querySelectorAll(".close-btn");

deleteButtons.forEach((button) => {
  button.addEventListener("click", function () {
    cart.removeItem(button.getAttribute("data-id"));
    renderCartCount();

    // Animate on delete
    const cartIcon = document.querySelector(".cart");
    const cartCount = document.getElementById("cart-count");

    cartIcon.classList.add("remove");
    cartCount.classList.add("remove");

    setTimeout(() => {
      cartIcon.classList.remove("remove");
      cartCount.classList.remove("remove");
    }, 400);
  });
});