import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || []; // Ensure it’s always an array
    this.calculateItemSubTotal();
    this.calculateOrderTotal(); // Ensure totals update on page load
  }

  calculateItemSubTotal() {
    if (this.list.length === 0) {
      this.itemTotal = 0;
    } else {
      this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    }

    const subtotalElement = document.querySelector("#checkout-subtotal");
    if (subtotalElement) {
      subtotalElement.innerHTML = `Subtotal: $${this.itemTotal.toFixed(2)}`;  // Ensure label and value are both shown
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElement = document.querySelector("#checkout-tax");
    const shippingElement = document.querySelector("#checkout-shipping");
    const orderTotalElement = document.querySelector("#checkout-total");

    if (!taxElement || !shippingElement || !orderTotalElement) {
      console.error("Error: One or more elements in the order summary are missing!");
      return;
    }

    // Ensure labels and values are both updated
    taxElement.innerHTML = `Tax: $${this.tax.toFixed(2)}`;
    shippingElement.innerHTML = `Shipping: $${this.shipping.toFixed(2)}`;
    orderTotalElement.innerHTML = `Final Total: $${this.orderTotal.toFixed(2)}`;
  }

  async checkout() {
    const formElement = document.forms["checkout"];
    const order = formDataToJSON(formElement);

    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal;
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = packageItems(this.list);

    try {
      const response = await services.checkout(order);
      window.location.href = 'success.html'; // Add './' for relative path;
      console.log("Order Success:", response);
    } catch (err) {
      console.error("Order Failed:", err);
    }
  }
}
