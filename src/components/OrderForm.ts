import { IEvents } from "./base/Events";
import { Form } from "./Form";
import { ensureAllElements, ensureElement } from "../utils/utils";

export class OrderForm extends Form<HTMLFormElement> {
  protected readonly paymentButtons: HTMLButtonElement[];
  protected readonly addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button_alt",
      container,
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container,
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.paymentButtons.forEach((item) => {
          item.classList.remove("button_alt-active");
        });

        button.classList.add("button_alt-active");

        this.events.emit("order:payment", {
          payment: button.name,
        });
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:input", {
        address: this.addressInput.value,
      });
    });

    container.addEventListener("submit", (event) => {
      event.preventDefault();

      this.events.emit("order:submit");
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
