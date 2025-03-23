import {
  getLocalStorage,
  hideElement,
  showElement,
  getCartCount,
} from "./utils.mjs";
export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key; // Ensure this matches what is being used in local storage
    this.parentSelector = parentSelector;
    // Call updateCartIcon when the cart is first initialized
    this.updateCartIcon();
  }
  
  // Add this new method to update the cart icon
  updateCartIcon() {
    const cartCount = getCartCount();
    const cartCountElement = document.getElementById("cart-count");
    
    if (cartCount > 0) {
      // Show notification with count
      if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.classList.remove("hidden");
        cartCountElement.classList.add("visible");
      }
    } else {
      // Hide notification when cart is empty
      if (cartCountElement) {
        cartCountElement.classList.remove("visible");
        cartCountElement.classList.add("hidden");
      }
    }
  }
  
  // Renders the cart contents into the cart page
  renderCartContents() {
    const cartItems = getLocalStorage(this.key);
    if (!cartItems || cartItems.length === 0) {
      this.displayEmptyCartMessage();
      return;
    }
    
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(this.parentSelector).innerHTML = htmlItems.join("");
    
    // Add event listeners for quantity buttons and remove buttons after rendering
    this.addCartEventListeners();
  }
  
  // Add event listeners for cart actions
  addCartEventListeners() {
    // Add event listeners for quantity increase buttons
    const increaseButtons = document.querySelectorAll(".quantity-increase");
    increaseButtons.forEach(button => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this.updateQuantity(id, 1);
      });
    });
    
    // Add event listeners for quantity decrease buttons
    const decreaseButtons = document.querySelectorAll(".quantity-decrease");
    decreaseButtons.forEach(button => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this.updateQuantity(id, -1);
      });
    });
    
    // Add event listeners for remove buttons
    const removeButtons = document.querySelectorAll(".close-btn");
    removeButtons.forEach(button => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this.removeItem(id);
      });
    });
  }
  
  // Update quantity of an item in the cart
  updateQuantity(id, change) {
    let cartItems = getLocalStorage(this.key);
    if (cartItems) {
      const itemIndex = cartItems.findIndex((item) => item.Id === id);
      if (itemIndex !== -1) {
        // Initialize quantity if it doesn't exist
        if (!cartItems[itemIndex].Q) {
          cartItems[itemIndex].Q = 1;
        }
        
        // Update quantity, ensuring it doesn't go below 1
        cartItems[itemIndex].Q += change;
        if (cartItems[itemIndex].Q < 1) {
          cartItems[itemIndex].Q = 1;
        }
        
        // Store the base price if not already stored
        if (!cartItems[itemIndex].BasePrice) {
          cartItems[itemIndex].BasePrice = cartItems[itemIndex].FinalPrice;
        }
        
        // Update the final price based on quantity
        cartItems[itemIndex].FinalPrice = (cartItems[itemIndex].BasePrice * cartItems[itemIndex].Q).toFixed(2) * 1;
        
        // Save updated cart to localStorage
        localStorage.setItem(this.key, JSON.stringify(cartItems));
        
        // Re-render the entire cart to ensure all elements are updated correctly
        this.renderCartContents();
        
        // Recalculate the total
        this.calculateTotal();
        
        // Update cart icon
        this.updateCartIcon();
      }
    }
  }
  
  // Displays a message when the cart is empty
  displayEmptyCartMessage() {
    document.querySelector(this.parentSelector).innerHTML = `
      <p class="empty-cart">Your cart is empty.</p>
    `;
    
    // Hide the cart footer when cart is empty
    const element = document.getElementById("cart-footer");
    if (element) {
      hideElement(element);
    }
  }
  
  // Removes an item from the cart and updates the UI
  removeItem(id) {
    let cartItems = getLocalStorage(this.key);
    if (cartItems) {
      const itemIndex = cartItems.findIndex((item) => item.Id === id);
      if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1);
        localStorage.setItem(this.key, JSON.stringify(cartItems));
      }
    }
    
    // Re-render the cart contents
    if (cartItems.length === 0) {
      this.displayEmptyCartMessage();
    } else {
      this.renderCartContents();
    }
    
    this.calculateTotal();
    this.updateCartIcon();
  }
  
  // Calculates and displays the total price
  calculateTotal() {
    const element = document.getElementById("cart-footer");
    const totalElement = document.getElementById("cart-total");
    let finalPrice = 0;
    const cartItems = getLocalStorage(this.key);
    
    if (cartItems && cartItems.length > 0) {
      showElement(element);
      cartItems.forEach(item => finalPrice += item.FinalPrice);
      totalElement.innerText = `Total: $${finalPrice.toFixed(2)}`;
    } else {
      hideElement(element);
    }
  }
  
  // Add this method to handle adding items to cart
  addToCart(product) {
    // Get current cart items
    let cartItems = getLocalStorage(this.key) || [];
    
    // Check if the product already exists in the cart
    const existingItemIndex = cartItems.findIndex(item => item.Id === product.Id);
    
    if (existingItemIndex !== -1) {
      // If product exists, increase quantity
      if (!cartItems[existingItemIndex].Q) {
        cartItems[existingItemIndex].Q = 1;
      }
      cartItems[existingItemIndex].Q += 1;
      
      // Store base price if not already stored
      if (!cartItems[existingItemIndex].BasePrice) {
        cartItems[existingItemIndex].BasePrice = cartItems[existingItemIndex].FinalPrice;
      }
      
      // Update the price based on quantity
      cartItems[existingItemIndex].FinalPrice = (cartItems[existingItemIndex].BasePrice * cartItems[existingItemIndex].Q).toFixed(2) * 1;
    } else {
      // If the product doesn't exist, add it with Q=1
      product.Q = 1;
      // Store the original price as BasePrice
      product.BasePrice = product.FinalPrice;
      cartItems.push(product);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem(this.key, JSON.stringify(cartItems));
    
    // Update the cart icon notification
    this.updateCartIcon();
  }
}

// Template for rendering each cart item
function cartItemTemplate(item) {
  const quantity = item.Q || 1;
  return `
    <li class="cart-card divider" id="${item.Id}">
      <button class="close-btn" data-id="${item.Id}">X</button>
      <a href="#" class="cart-card__image">
        <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors}</p>
      <p class="cart-card__quantity">
        <button class="quantity-decrease" data-id="${item.Id}">-</button>
        <span>Qty: ${quantity}</span>
        <button class="quantity-increase" data-id="${item.Id}">+</button>
      </p>
      <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
    </li>
  `;
}