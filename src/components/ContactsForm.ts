import { IEvents } from "./base/Events";
import { Form } from "./Form";
import { ensureElement } from "../utils/utils";

export class ContactsForm extends Form<HTMLFormElement> {
  protected readonly emailInput: HTMLInputElement;
  protected readonly phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, "contacts");

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container,
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
    );

    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts:input", {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:input", {
        phone: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
