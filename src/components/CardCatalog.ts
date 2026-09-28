import { CardImage } from "./CardImage";

type CardCatalogActions = {
  onClick: () => void;
};

export class CardCatalog extends CardImage {
  constructor(
    container: HTMLElement,
    actions: CardCatalogActions,
  ) {
    super(container);

    container.addEventListener("click", actions.onClick);
  }
}