import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";

export class Page extends Component<HTMLElement> {
  protected readonly headerElement: HTMLElement;
  protected readonly galleryElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.headerElement = ensureElement<HTMLElement>(".header", container);

    this.galleryElement = ensureElement<HTMLElement>(".gallery", container);
  }
}
