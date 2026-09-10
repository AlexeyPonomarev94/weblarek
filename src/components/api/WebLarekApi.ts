import { IApi } from "../../types";
import { IOrder } from "../../types";
import { IOrderResponse } from "../../types";
import { IProductResponse } from "../../types";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductResponse> {
    return this.api.get<IProductResponse>('/product/');
  }

  createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}