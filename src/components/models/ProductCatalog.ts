import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductCatalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected readonly events: IEvents) {}

  // сохранение массива товаров
  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed');
  }

  // получение массива товаров из модели
  getProducts(): IProduct[] {
    return this.products;
  }

  // получение одного товара по его id
  getProduct(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }
  
  // сохранение товара для подробного отображения
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('product:selected');
  }
  
  // получение товара для подробного отображения
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}