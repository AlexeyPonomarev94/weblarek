import { IProduct } from "../types";
import { CardImage } from "./CardImage";
import { IEvents } from "./base/Events";

export class CardCatalog extends CardImage<IProduct> {
  constructor(
    container: HTMLElement,
    protected readonly events: IEvents,
  ) {
    super(container);

    container.addEventListener("click", () => {
      const id = this.container.dataset.id;

      if (id) {
        this.events.emit("card:select", { id });
      }
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}