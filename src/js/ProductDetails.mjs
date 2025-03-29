// This module is responsible for dynamically rendering product details on the product page
// It feeds data into `product.js`, which then populates the `product_pages/index.html` page with the relevant information.
// Additionally, it includes an 'Add to Cart' functionality for adding the product to the shopping cart.

import { setLocalStorage, getLocalStorage, renderCartCount, createBreadcrumbs, animateCartIcon } from "./utils.mjs";

// Function to generate discount details based on price comparison
export function generateDiscount(product) {
    if (product.SuggestedRetailPrice > product.FinalPrice) {
        const discount = product.SuggestedRetailPrice - product.FinalPrice;
        const discountPercentage = Math.round((discount / product.SuggestedRetailPrice) * 100);
        return `
        <p class="product-card-price">
            <span class="product-original">$${product.SuggestedRetailPrice}</span> 
            <span class="product-final">$${product.FinalPrice}</span> 
            <span class="product-percentage">(-${discountPercentage}%)</span>
        </p>`;
    } else {
        return `<p class="product-card-price">$${product.FinalPrice}</p>`;
    }
}

// The ProductDetail class handles fetching and displaying detailed product information
// It dynamically loads the data based on the product ID and the category (tent, backpack, etc.).
// This class also manages the 'Add to Cart' button functionality.
export default class ProductDetail {
    constructor(productId, dataSource) {
        // Initializes with the product's ID and the source from which product data will be fetched.
        this.productId = productId;
        this.product = {}; // This will hold the product details after fetching
        this.dataSource = dataSource; // This is used to build the path to the JSON file (category)
    }

    // Initializes the class by fetching the product data based on the product ID
    // and rendering the details in the HTML page. It also sets up the event listener for 'Add to Cart' functionality.
    async init() {
        // Fetch product data dynamically using JSON
        this.product = await this.dataSource.findProductById(this.productId);

        // Render the product details in the HTML.
        // REMOVED document.querySelector('.product-details-container').innerHTML = productDetailsTemplate(this.product);
        
        //Render Breadcrumbs
        createBreadcrumbs(this.product.Category);
        
        // Render product details dynamically instead of relying on a static class
        this.renderProductDetails();

        // Attach event listener to dynamically created 'Add to Cart' button
        document.getElementById("addToCart").addEventListener("click", () => {
            this.addToCart();
        });
    }

    // This method dynamically generates and inserts product details into the page.
    renderProductDetails() {
        // Select the main container where the product details will be inserted
        const mainElement = document.querySelector("main");
        //render breadcrumbs

        if (!mainElement) {
            // console.error(" No <main> element found! Ensure your HTML includes a <main> tag.");
            return;
        }

        // Create the product details section dynamically
        const productHTML = document.createElement("section");
        productHTML.classList.add("product-detail");

        // Populate the product details using the fetched JSON data
        productHTML.innerHTML = `
            <h3>${this.product.Brand.Name}</h3> <!-- Displays the product's brand -->
            <h2 class="divider">${this.product.NameWithoutBrand}</h2> <!-- Displays the product's name without the brand -->
            <img class="divider" src="${this.product.Images.PrimaryLarge}" alt="${this.product.NameWithoutBrand}" /> <!-- Displays the main product image -->
            ${generateDiscount(this.product)} <!-- Generates price and discount details -->
            <p class="product__color">${this.product.Colors[0].ColorName}</p> <!-- Displays the product's first color -->
            <p class="product__description">${this.product.DescriptionHtmlSimple}</p> <!-- Displays a simplified HTML description of the product -->
            <div class="product-detail__add">
                <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button> <!-- Add to Cart button -->
            </div>`;

        // Remove any existing content and append the newly created product details
        mainElement.innerHTML = ""; // Clear previous content
        mainElement.appendChild(productHTML);
    }

    // Adds the current product to the shopping cart and updates the cart count
    addToCart() {
        let cart = getLocalStorage("cart") || [];
        
        let existingItem = cart.find(item => item.Id === this.product.Id);
        if (existingItem) {
          existingItem.Q = (existingItem.Q || 1) + 1;
        } else {
          let optimizedData = {
            Id: this.product.Id,
            Name: this.product.NameWithoutBrand,
            FinalPrice: this.product.FinalPrice,
            Colors: (this.product.Colors?.length > 0)
                ? this.product.Colors[0].ColorName
                : "N/A",
            Q: 1,
            Images: this.product.Images 
          };
        //   console.log("Before pushing:", optimizedData); // Debugging log
          optimizedData = JSON.parse(JSON.stringify(optimizedData));
          cart.push({ ...optimizedData});
        //   console.log("Cart AFTER pushing:", JSON.stringify(cart, null, 2)); // Debugging log
        }
      
        setLocalStorage("cart", cart);
        renderCartCount();
        animateCartIcon();
        // console.log("Added to cart:", getLocalStorage("cart")); // Debugging log
      }
}