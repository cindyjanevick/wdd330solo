// Import: import Modal from "./modal.mjs";
// Import: import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class Modal {
  constructor(title, message, actionButton = false) {
    this.title = title;
    this.message = message;
    this.actionButton = actionButton;
  }

  ShowModal() {
    const shouldShowModal = getLocalStorage("modal-register");
    if (shouldShowModal) return false;

    this.handleModal();
    setLocalStorage("modal-register", true);
  }

  handleModal() {
    const HTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-content">
          <div class="header">
            <h5 id="modal-title">${this.title}</h5>
            <button id="close-modal" type="button" aria-label="Close modal">🗙</button>
          </div>
          <div class="modal-body">
            ${this.message}
          </div>
          <div class="action-button">
            ${this.actionButton ? `<a href="https://www.example.com/register">Register Now</a>` : ""}
          </div>
        </div>
      </div>
    `;
    document.querySelector("body").insertAdjacentHTML("beforeend", HTML);

    document.querySelector("#close-modal").addEventListener("click", () => {
      const modalElement = document.querySelector(".modal");
      modalElement.remove();
    });
  }
}
