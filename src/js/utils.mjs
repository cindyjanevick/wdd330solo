// Wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  if (!key || !data) {
    // console.error("setLocalStorage: Invalid key or data", { key, data });
    return;
  }
  localStorage.setItem(key, JSON.stringify(data));

}


// Set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Get URL parameters
export function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Used by ProductList
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Render header/footer with template
export function renderWithTemplate(templateFn, parentElement) {
  if (parentElement) {
    parentElement.innerHTML = templateFn;
  } else {
    // console.warn(`Element not found for template insertion.`);
  }
}

export async function loadHeaderFooter() {
  // Detect if we're in `src/` (index.html) or a subdirectory (cart/index.html)
  const basePath = window.location.pathname.split("/").length > 2 ? ".." : ".";


  // Grab header/footer elements
  const header = document.getElementById("main-header");
  const footer = document.getElementById("main-footer");

  // Grab the template data using the correct basePath
  const headerTemplate = await loadTemplate(`${basePath}/partials/header.html`);
  const footerTemplate = await loadTemplate(`${basePath}/partials/footer.html`);

  // Insert templates into the DOM
  renderWithTemplate(headerTemplate, header);
  renderWithTemplate(footerTemplate, footer);

  // Ensure the cart count updates AFTER the header is fully loaded
  setTimeout(() => {
    renderCartCount();
  }, 100);
}

// Fetch template content
export async function loadTemplate(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.text();
  } catch (error) {
    // console.error("Error loading template:", error);
    return "";
  }
}

// FIXED: Cart superscript updates correctly across all pages
//cart superscript
export function renderCartCount(){
  const cartCounter = document.getElementById("cart-count");
  // Add null check to prevent error
  if (!cartCounter) return;
  
  const cartCount = getCartCount();
  //check if cart has items to toggle visibility
  if (cartCount > 0){
    showElement(cartCounter);
  }
  else{
    hideElement(cartCounter);
  }
  //populate the div w/ the count
  cartCounter.innerText = cartCount;
}
//Toggle visibility of the cart depending on if something is in it
//default is hidden
export function showElement(element) {
  element.classList.add("visible");
  element.classList.remove("hidden");
}
export function hideElement(element) {
  element.classList.add("hidden");
  element.classList.remove("visible");
}
export function getCartCount() {
  const cart = getLocalStorage("cart");
  let cartCount = 0;
  if (cart !== null && cart !== undefined) {
    cartCount = cart.length;
  }
  return cartCount;
}

//Create Breadcrumbs
export function createBreadcrumbs(category = "",count = null) {
  const currentLocation = window.location.pathname;
  const breadcrumbs = document.querySelector(".breadcrumbs");
  if (currentLocation.includes("listing")) {
    breadcrumbs.innerHTML = `${category} -> (${count} items)`;
  } else if (currentLocation.includes("pages")) {
    breadcrumbs.innerHTML = `${category}`;
  }
}