import { IProduct } from "../types";
import { CardImage } from "./CardImage";
import { ensureElement } from "../utils/utils";

type CardPreviewActions = {
  onClick: () => void;
};

type CardPreviewData = IProduct & {
  button: string;
  disabled: boolean;
};

export class CardPreview extends CardImage<CardPreviewData> {
  protected readonly descriptionElement: HTMLElement;
  protected readonly buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions: CardPreviewActions) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      container,
    );

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.buttonElement.addEventListener("click", actions.onClick);
  }

  set button(value: string) {
    this.buttonElement.textContent = value;
  }

  set disabled(value: boolean) {
    this.buttonElement.disabled = value;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}
