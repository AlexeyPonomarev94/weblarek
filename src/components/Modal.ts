import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";

export class Modal extends Component<HTMLElement> {
  protected readonly contentElement: HTMLElement;
  protected readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );

    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }
}