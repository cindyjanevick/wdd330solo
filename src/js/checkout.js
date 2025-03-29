import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".summary");
myCheckout.init();

// Ensure total updates when user fills ZIP code
document.querySelector("#zip").addEventListener("blur", () => {
  myCheckout.calculateOrderTotal();
});

// Handle checkout submission
document.querySelector("#paySubmit").addEventListener("click", (e) => {
  e.preventDefault();
  myCheckout.checkout();
});
