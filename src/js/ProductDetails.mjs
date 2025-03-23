import { getLocalStorage, setLocalStorage } from "./utils.mjs";
 
function productDetailsTemplate(product) {
  // Check if product is discounted
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  
  // Calculate discount percentage if there's a discount
  let discountHtml = "";
  if (isDiscounted) {
    const discountPercentage = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
    discountHtml = `
      <div class="product-card__discount">
        <span class="product-card__original-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>
        <span class="product-card__discount-badge">${discountPercentage}% OFF</span>
      </div>
    `;
  }

  return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Image}"
      alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
    ${discountHtml}
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div></section>`;
}
 
export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    // use our datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // once we have the product details we can render out the HTML
    this.renderProductDetails("main");
    // once the HTML is rendered we can add a listener to Add to Cart button
    // Notice the .bind(this). Our callback will not work if we don't include that line. Review the readings from this week on 'this' to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }
 
  addToCart() {
    // Get current cart items
    let cartItems = getLocalStorage("so-cart");
   
    // If cartItems is not an array, convert it to one
    if (!Array.isArray(cartItems)) {
      // If there's a single item, put it in an array
      if (cartItems && typeof cartItems === "object") {
        cartItems = [cartItems];
      } else {
        // If there's nothing, initialize empty array
        cartItems = [];
      }
    }
   
    // Add the new product to the array
    cartItems.push(this.product);
   
    // Save back to localStorage
    setLocalStorage("so-cart", cartItems);
  }
 
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product)
    );
  }
}