import { IBuyer, TPayment } from "../../types";

export class Buyer implements IBuyer {
  payment: TPayment = '';
  address: string = '';
  email: string = '';
  phone: string = '';

  constructor() {};

  // Сохранение либо обновление данных покупателя
  setData(data: Partial<IBuyer>): void {
    Object.assign(this, data)
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
  }

  // проверка заполненности данных покупателя
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

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