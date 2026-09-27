import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { ensureElement } from "../utils/utils";

type SuccessData = {
  total: number;
};

export class Success extends Component<SuccessData> {
  protected readonly descriptionElement: HTMLElement;
  protected readonly closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected readonly events: IEvents,
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
