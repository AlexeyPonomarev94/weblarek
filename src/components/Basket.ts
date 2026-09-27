import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { ensureElement } from '../utils/utils';

export class Basket extends Component<HTMLElement> {
  protected readonly listElement: HTMLElement;
  protected readonly totalElement: HTMLElement;
  protected readonly orderButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected readonly events: IEvents,
  ) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(".basket__list", container);

    this.totalElement = ensureElement<HTMLElement>(".basket__price", container);

    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
