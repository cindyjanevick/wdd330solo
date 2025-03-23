import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

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

export default class ShoppingCart {
  constructor(listElement, footerElement) {
    this.listElement = listElement;
    this.footerElement = footerElement;
  }

  async init() {
    // Get cart items from localStorage
    const cartItems = getLocalStorage("so-cart") || [];
    
    // Render the cart
    this.renderCart(cartItems);
    
    // Setup event listeners for remove buttons
    this.setupRemoveEvents();
  }

  renderCart(cartItems) {
    // Clear the current contents
    this.listElement.innerHTML = "";
    
    if (cartItems.length === 0) {
      this.listElement.innerHTML = "<p>Your cart is empty</p>";
      this.footerElement.classList.add("hide");
      return;
    }

    // Combine duplicate items by summing their quantity
    const mergedCart = this.mergeCartItems(cartItems);
    
    // Render cart items using the template and helper function
    renderListWithTemplate(cartItemTemplate, this.listElement, mergedCart);
    
    // Calculate and display total price
    const totalPrice = mergedCart.reduce(
      (total, item) => total + item.FinalPrice * item.Quantity, 
      0
    );
    
    document.querySelector(".cart-total").innerHTML = 
      `Total: $${totalPrice.toFixed(2)}`;
    
    // Show the cart footer
    this.footerElement.classList.remove("hide");
  }

  mergeCartItems(cartItems) {
    const mergedCart = [];
    
    cartItems.forEach(item => {
      // Find if this item already exists in our merged cart
      const existingItemIndex = mergedCart.findIndex(i => i.Id === item.Id);
      
      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        mergedCart[existingItemIndex].Quantity += item.Quantity || 1;
      } else {
        // Item doesn't exist, add it with a quantity property
        const newItem = { ...item };
        newItem.Quantity = item.Quantity || 1;
        mergedCart.push(newItem);
      }
    });
    
    return mergedCart;
  }

  setupRemoveEvents() {
    // Remove any existing event listeners first to prevent duplicates
    document.querySelectorAll(".cart-card__remove").forEach(button => {
      // Clone and replace to remove any existing event listeners
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Add the event listener to the new button
      newButton.addEventListener("click", (e) => {
        this.removeFromCart(e);
      });
    });
  }

  removeFromCart(e) {
    const productId = e.target.dataset.id;
    let cartItems = getLocalStorage("so-cart") || [];
    
    if (cartItems.length > 0) {
      // We need to be careful with the merged cart approach
      // Find the first occurrence of this item
      const itemIndex = cartItems.findIndex(item => item.Id === productId);
      
      if (itemIndex !== -1) {
        // Remove just one instance of this item
        cartItems.splice(itemIndex, 1);
        
        // Update localStorage
        setLocalStorage("so-cart", cartItems);
        
        // Re-render the cart
        this.renderCart(cartItems);
        
        // Re-attach event listeners
        this.setupRemoveEvents();
      }
    }
  }
}