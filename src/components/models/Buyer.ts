import { FormErrors, IBuyer, TPayment } from "../../types";

export class Buyer {
  private payment: TPayment = '';
  private address: string = '';
  private email: string = '';
  private phone: string = '';

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