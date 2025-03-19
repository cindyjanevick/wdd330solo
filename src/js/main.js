import { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Load header and footer first
loadHeaderFooter(() => {
    try {
      const dataSource = new ProductData("tents");
      const element = document.querySelector(".product-list");
      const listing = new ProductList("Tents", dataSource, element);
      listing.init();
    } catch (error) {
      console.error("Error initializing product list:", error);
    }
  });
  