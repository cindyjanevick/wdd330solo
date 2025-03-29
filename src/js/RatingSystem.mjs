import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";

export default class RatingSystem {
  constructor() {
    this.productId = getParam("product");
    this.initialize();
  }

  initialize() {
    this.ratingsKey = `ratings-${this.productId}`;
    this.ratings = getLocalStorage(this.ratingsKey) || [];
    this.createRatingUI();
  }

  createRatingUI() {
    const ratingContainer = document.createElement("div");
    ratingContainer.className = "rating-system divider";
    ratingContainer.innerHTML = `
      <h4>Product Rating</h4>
      <div class="stars">
        ${Array.from({length: 5}, (_, i) => `
          <span class="star" data-value="${i + 1}">☆</span>
        `).join("")}
      </div>
      <p class="average-rating">Average: ${this.calculateAverage()}/5</p>
    `;
    
    document.querySelector(".product-detail").appendChild(ratingContainer);
    this.addEventListeners();
  }

  addEventListeners() {
    document.querySelectorAll(".star").forEach(star => {
      star.addEventListener("click", () => this.handleRating(star.dataset.value));
      star.addEventListener("mouseover", () => this.hoverStars(star.dataset.value));
      star.addEventListener("mouseout", () => this.resetStars());
    });
  }

  handleRating(rating) {
    this.ratings.push(parseInt(rating));
    setLocalStorage(this.ratingsKey, this.ratings);
    this.updateDisplay();
  }

  calculateAverage() {
    return this.ratings.length 
      ? (this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length).toFixed(1)
      : "0.0";
  }

  updateDisplay() {
    document.querySelector(".average-rating").textContent = 
      `Average: ${this.calculateAverage()}/5 (${this.ratings.length} ratings)`;
    this.highlightStars(Math.round(this.calculateAverage()));
  }

  highlightStars(activeCount) {
    document.querySelectorAll(".star").forEach((star, index) => {
      star.classList.toggle("active", index < activeCount);
    });
  }

  hoverStars(hoverValue) {
    document.querySelectorAll(".star").forEach((star, index) => {
      star.classList.toggle("hover", index < hoverValue);
    });
  }

  resetStars() {
    document.querySelectorAll(".star").forEach(star => {
      star.classList.remove("hover");
    });
  }
}