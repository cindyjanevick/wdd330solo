//purpose is to generate a list of product cards in HTML from an array
import { renderListWithTemplate, createBreadcrumbs } from "./utils.mjs";
import { generateDiscount } from "./ProductDetails.mjs";

//Template literal for product cards on main page
function productCardTemplate(product){
    // Retrieve saved rating (defaulting to 0 if not set)
    const savedRating = localStorage.getItem(`rating-${product.Id}`) || 0;
    let ratingHTML = `<div class="product-rating">`;
    // Build a 5-star rating display
    for (let i = 1; i <= 5; i++) {
      ratingHTML += i <= savedRating ? "★" : "☆";
    }
    ratingHTML += `</div>`;
    
    return `<li class="product-card">
      <a href="../product_pages/index.html?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        ${generateDiscount(product)}
        <p class="product-card__price">$${product.FinalPrice}</p>
        ${ratingHTML}
      </a>
    </li>`;
  }
  

export default class ProductList{
    constructor(category, dataSource){
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = document.querySelector(".product-list");
        this.productList = [];
    }

    async init(sortBy = "name"){
        this.productList = await this.dataSource.getData(this.category);
        this.sortProducts(sortBy);
        this.renderList(this.productList)
    }
    
    renderList(productList){
        //filter out bad products before sending to render
        this.listElement.textContent = ""
        this.filter(productList);
        renderListWithTemplate(productCardTemplate, this.listElement, productList, "afterbegin", false);
        //add breadcrumbs based on existing (valid) products.
        const validProducts = productList.filter(product => product);
        const count = validProducts.length;
        createBreadcrumbs(this.category, count);
    }

    filter(productList){
        //filtering out by hardcoded id.  feels brute force but not seeing another way to filter?
        const idFilters = ["880RT", "989CG"];
        Object.keys(productList).forEach(key => {
            const product = productList[key];
            if (idFilters.includes(product.Id)) {
                delete productList[key];
            }
        });
    }

    sortProducts(sortBy) {
        if (sortBy === "name") {
            this.productList.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand))
        } else if (sortBy === "price") {
            this.productList.sort((a, b) => a.FinalPrice - b.FinalPrice)
        }
    }
}