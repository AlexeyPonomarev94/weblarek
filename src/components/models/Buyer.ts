import { FormErrors, IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment = '';
  private address: string = '';
  private email: string = '';
  private phone: string = '';

  constructor(protected readonly events: IEvents) {}

  // Сохранение либо обновление данных покупателя
  setData(data: Partial<IBuyer>): void {
    Object.assign(this, data)
    this.events.emit('buyer:changed');
  }

  // получение всех данных покупателя
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  // очистка данных покупателя
  clear(): void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';

    this.events.emit('buyer:changed');
  }

  // проверка заполненности данных покупателя
  validate(): FormErrors {
    const errors: FormErrors = {};

    if(!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    
    if(!this.address) {
      errors.address = "Укажите адрес";
    }

    if(!this.email) {
      errors.email = "Укажите емайл";
    }

    if(!this.phone) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}