import ExternalServices from "./ExternalServices.mjs"; 
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter, getParams } from "./utils.mjs";

const productId = getParams("product");
const dataSource = new ExternalServices("tents"); // Updated from ProductData to ExternalServices

const product = new ProductDetails(productId, dataSource);

// Use an async IIFE to await product initialization
(async function initPage() {
  await product.init();         // Wait for product details to be rendered
  loadHeaderFooter();           // Load header and footer after product details are rendered
  addRatingSystem();            // Now add the rating system
})();

function addRatingSystem() {
  // Find the <main> element where the product details are rendered
  const main = document.querySelector("main");
  if (!main) {
    return;
  }

  // Create a container for the rating system
  const ratingContainer = document.createElement("div");
  ratingContainer.className = "rating-container";

  // Create a label for the rating system
  const ratingLabel = document.createElement("span");
  ratingLabel.textContent = "Rate this product: ";
  ratingContainer.appendChild(ratingLabel);

  // Create 5 stars for rating
  const maxRating = 5;
  for (let i = 1; i <= maxRating; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.dataset.rating = i;
    star.textContent = "☆"; // Empty star

    // When a star is clicked, update the rating
    star.addEventListener("click", () => {
      setRating(i);
    });

    ratingContainer.appendChild(star);
  }

  // Append the rating system to the <main> element
  main.appendChild(ratingContainer);

  // Load any saved rating for this product from localStorage
  const savedRating = localStorage.getItem(`rating-${productId}`);
  if (savedRating) {
    setRating(parseInt(savedRating), false);
  }
}

function setRating(rating, save = true) {
  // Update all stars based on the selected rating
  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    if (parseInt(star.dataset.rating) <= rating) {
      star.textContent = "★"; // Filled star
    } else {
      star.textContent = "☆"; // Empty star
    }
  });

  // Save the rating to localStorage if required
  if (save) {
    localStorage.setItem(`rating-${productId}`, rating);
  }
}
