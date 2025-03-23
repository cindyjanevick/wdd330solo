import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

// Get references to DOM elements
const cartList = document.querySelector(".product-list");
const cartFooter = document.querySelector(".cart-footer");

// Create a new ShoppingCart instance and initialize it
const myCart = new ShoppingCart(cartList, cartFooter);
myCart.init();