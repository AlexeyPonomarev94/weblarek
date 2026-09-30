import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { ensureElement } from "../utils/utils";

export class Form<T> extends Component<T> {
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsElement: HTMLElement;

  constructor(
    container: HTMLFormElement,
    protected readonly events: IEvents,
    protected readonly name: string,
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
    );

    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);

    this.submitButton.disabled = true;

    container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(`${this.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
