//used to populate checkout/index.html data
import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

//Loads in the Header/Footer Templates
loadHeaderFooter();

const order = new CheckoutProcess("cart", ".checkout-summary");
order.init();

document.querySelector("#zip").addEventListener("blur", order.calculateOrderTotal.bind(order));

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
    e.preventDefault();
    const checkoutForm = document.forms[0];
    const isValid = checkoutForm.checkValidity();
    checkoutForm.reportValidity();
  
    if (isValid) {
      order.checkout(); // Let the CheckoutProcess handle success/failure
    }
  });