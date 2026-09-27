import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class Header extends Component<HTMLElement> {
	protected readonly counterElement: HTMLElement;
	protected readonly basketButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected readonly events: IEvents
	) {
		super(container);

		this.counterElement = container.querySelector('.header__basket-counter')!;
		this.basketButton = container.querySelector('.header__basket')!;

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.counterElement.textContent = String(value);
	}
}