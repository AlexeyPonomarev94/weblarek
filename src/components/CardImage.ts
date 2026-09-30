import { IProduct } from "../types";
import { Card } from "./Card";
import { categoryMap } from "../utils/constants";
import { ensureElement } from "../utils/utils";

export class CardImage<T extends IProduct = IProduct> extends Card<T> {
  protected readonly categoryElement: HTMLElement;
  protected readonly imageElement: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }
}