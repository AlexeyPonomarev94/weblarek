import { IProduct } from "../../types";

export class Basket {
  items: IProduct[] = [];

  constructor() {};

// получить массив товаров, которые находятся в корзине
  getItems(): IProduct[] {
    return this.items;
  }

// добавление товара, который был получен в параметре, в массив корзины
  add(product: IProduct): void {
    this.items.push(product);
  }

// удаление товара, полученного в параметре из массива корзины
  remove(product: IProduct): void {
    const index = this.items.indexOf(product);

    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

// очистка корзины
  clear(): void {
    this.items = [];
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