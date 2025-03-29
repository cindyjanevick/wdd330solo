// Main entry point for the application
import { loadHeaderFooter } from "./utils.mjs";
import Modal from "./modal.mjs";

// Display promotional modal
const title = "🎁 Register Now & Win! 🎁";
const message =
  "Sign up on your first visit and get a chance to win premium camping gear tents, sleeping bags, and more! 🏕️";
const modal = new Modal(title, message, true);
modal.ShowModal();

// Load header/footer (Wk 3)
loadHeaderFooter();

// Newsletter subscription logic
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  const subscribeMessage = document.getElementById("subscribe-message");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = form.email;

      if (emailInput.checkValidity()) {
        subscribeMessage.textContent = `Sweet! You're now subscribed to our newsletter with ${emailInput.value}!`;
        subscribeMessage.classList.remove("hidden");
        form.reset();
      } else {
        subscribeMessage.textContent = "Please enter a valid email address.";
        subscribeMessage.classList.remove("hidden");
      }
    });
  } else {
    console.warn("Newsletter form not found in the document.");
  }
});
