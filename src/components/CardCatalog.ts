import { IProduct } from "../types";
import { Card } from "./Card";
import { categoryMap } from "../utils/constants";
import { IEvents } from "./base/Events";
import { ensureElement } from "../utils/utils";

export class CardCatalog extends Card<IProduct> {
  protected readonly categoryElement: HTMLElement;
  protected readonly imageElement: HTMLImageElement;

  constructor(
    container: HTMLElement,
    protected readonly events: IEvents,
  ) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );

    container.addEventListener("click", () => {
      this.events.emit("card:select", {
        id: this.container.dataset.id,
      });
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }
}
