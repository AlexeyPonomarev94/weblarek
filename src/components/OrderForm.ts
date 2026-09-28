import { IEvents } from "./base/Events";
import { Form } from "./Form";
import { TPayment } from "../types";
import { ensureAllElements, ensureElement } from "../utils/utils";

export class OrderForm extends Form<HTMLFormElement> {
  protected readonly paymentButtons: HTMLButtonElement[];
  protected readonly addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, "order");

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
  }

  set payment(value: TPayment) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
