import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  private items: IProduct[] = [];

  constructor(protected readonly events: IEvents) {}

// получить массив товаров, которые находятся в корзине
  getItems(): IProduct[] {
    return this.items;
  }

// добавление товара, который был получен в параметре, в массив корзины
  add(product: IProduct): void {
  if (this.has(product.id)) {
    return;
  }

  this.items.push(product);
  this.events.emit('basket:changed');
}

// удаление товара, полученного в параметре из массива корзины
  remove(product: IProduct): void {
    const index = this.items.indexOf(product);

    if (index > -1) {
      this.items.splice(index, 1);
      this.events.emit('basket:changed');
    }
  }

// очистка корзины
  clear(): void {
    this.items = [];
    this.events.emit('basket:changed');
  }
  
// возвращает общую стоимость товаров в корзине
  getTotal(): number {
    const totalPrice = this.items.reduce((sum, item) => {
      const price = item.price !== null ? item.price : 0;
      return sum + price;
    }, 0)
    
    return totalPrice
  }

// возвращает количество товаров в корзине
  getCount(): number {
    return this.items.length
  }

// проверка наличия товара в корзине по его id, полученного в параметр метода
  has(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}