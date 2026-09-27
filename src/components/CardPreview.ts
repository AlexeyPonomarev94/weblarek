import { IProduct } from "../types";
import { categoryMap } from "../utils/constants";
import { IEvents } from "./base/Events";
import { Card } from "./Card";
import { ensureElement } from "../utils/utils";

export class CardPreview extends Card<IProduct> {
  protected readonly imageElement: HTMLImageElement;
  protected readonly categoryElement: HTMLElement;
  protected readonly descriptionElement: HTMLElement;
  protected readonly buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected readonly events: IEvents,
  ) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      container,
    );

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("card:add", {
        id: this.container.dataset.id,
      });
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}
