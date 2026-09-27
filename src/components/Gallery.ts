import { Component } from './base/Component';

export class Gallery extends Component<HTMLElement> {
	protected readonly catalogElement: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.catalogElement = container;
	}

	set items(value: HTMLElement[]) {
		this.catalogElement.replaceChildren(...value);
	}
}