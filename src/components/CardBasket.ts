import { IProduct } from "../types";
import { IEvents } from "./base/Events";
import { Card } from "./Card";
import { ensureElement } from "../utils/utils";

type CardBasketData = IProduct & {
  index: number;
};

export class CardBasket extends Card<CardBasketData> {
  protected readonly indexElement: HTMLElement;
  protected readonly deleteButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected readonly events: IEvents,
  ) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      container,
    );

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    this.deleteButton.addEventListener("click", () => {
      this.events.emit("basket:remove", { id: this.container.dataset.id });
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
