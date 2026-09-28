import { IProduct } from "../types";
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
    onDelete: () => void,
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

    this.deleteButton.addEventListener("click", onDelete);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}