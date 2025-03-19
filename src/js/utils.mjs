// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  if (data === null) {
    return null;
  }
  return JSON.parse(data);
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// helper to get parameter strings
export function getParam(param, defaultValue = null) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param) || defaultValue;
}


// Render a single template into a parent element, with optional callback functionality
export function renderWithTemplate(template, parentElement, data = null, callback = null) {
  parentElement.innerHTML = template;  // Insert the template
  if (callback) {
    callback(data);  // If a callback is provided, invoke it with data
  }
}

// Fetch and return the HTML content from a given path
export async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load template');
    const template = await res.text();
    return template;
  } catch (error) {
    console.error('Error loading template:', error);
    return '';  // Return an empty string or some fallback template
  }
}


// Load the header and footer templates, then render them to their respective DOM elements
export async function loadHeaderFooter(callback) {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);  // Render header
  renderWithTemplate(footerTemplate, footerElement);  // Render footer

  if (callback) {
    callback();  // Optional callback after header/footer rendering (e.g., cart updates)
  }
}

// function to take a list of objects and a template and insert the objects as HTML into the DOM (for lists)
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  const htmlStrings = list.map(templateFn);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
