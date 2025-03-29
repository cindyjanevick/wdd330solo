// ExternalServices class: Responsible for fetching product details from a server and providing methods
// to retrieve all products in a category and details for a specific product by ID.
// This class is used by `product.js` to populate the product details in `product_pages/index.html`
// by passing the fetched data to the `ProductDetails` component.

// getData(category) fetches and returns all products in a specific category (e.g., tents).
// findProductById(id) fetches and returns details for a specific product by its ID within the category.

// Base URL is imported from the environment variables.
const baseURL = import.meta.env.VITE_SERVER_URL 

// Converts the response to JSON if the response is okay. Otherwise, throws an error.
// async function convertToJson(res) {
//   const text = await res.text();
//   console.log(text)
//   if (!res.ok) {
//     throw new Error(res.text());
//   }
//   return JSON.parse(text);
// }
async function convertToJson(res) {
  const json = await res.json();
  if (res.ok) {
    return json;
  } else {
    throw { name: "servicesError", message: json };
  }
}

// Exporting ExternalServices class
export default class ExternalServices {
  // Fetches and returns all products in a given category.
  async getData(category) {
    const response = await fetch(baseURL + `products/search/${category}`);
    const data = await convertToJson(response); 
    return data.Result;
}

  // Fetches and returns details for a specific product by its ID.
  async findProductById(id) {
    const products = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(products);
    return data.Result;
  }
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}