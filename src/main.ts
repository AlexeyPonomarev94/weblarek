import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { WebLarekApi } from './components/api/WebLarekApi';
import { API_URL } from './utils/constants';

// Проверка работы методов ProductCatalog
// ======================================
const productsModel = new ProductCatalog();
// Сохранение массива товаров.
productsModel.setProducts(apiProducts.items);
// Получение массива товаров
console.log('Массив товаров из каталога: ', productsModel.getProducts())
// Получение товара по ID
const product =  productsModel.getProduct(apiProducts.items[0].id);
console.log('Товар по ID:', product);
// Сохранение товара для подробного отображения
if (product) {
  productsModel.setSelectedProduct(product);
}
// Получение товара для подробного отображения
console.log('Выбранный товар', productsModel.getSelectedProduct());

// Проверка работы методов Basket
// ======================================
const basket = new Basket();

// Получить массив товаров, которые находятся в корзине
console.log('Корзина с товарами', basket.getItems());

// Добавление товара
basket.add(apiProducts.items[0]);
console.log('Корзина после добавления товара', basket.getItems());

// Количество товаров в корзине
console.log('Количество товаров:', basket.getCount());

// Общая стоимость товаров в корзине
console.log('Общая стоимость:', basket.getTotal());

// Проверка наличия товара в корзине
console.log('Есть ли товар в корзине:', basket.has(apiProducts.items[0].id));

basket.add(apiProducts.items[1]);
console.log('После добавления второго товара:', basket.getItems());
console.log('Количество товаров:', basket.getCount());
console.log('Общая стоимость:', basket.getTotal());

// Удаление товара
basket.remove(apiProducts.items[0]);

console.log('После удаления товара:', basket.getItems());
console.log('Количество товаров:', basket.getCount());
console.log('Есть ли удалённый товар:', basket.has(apiProducts.items[0].id));

// Очистка корзины
basket.clear();

// Проверка работы методов Buyer
// ======================================
const buyer = new Buyer();

// Сохранение либо обновление данных покупателя
buyer.setData({
  email: 'test@mail.ru',
  phone: '79999999999',
});

// получение всех данных покупателя
console.log('Данные покупателя:', buyer.getData());

// проверка заполненности данных покупателя
console.log('Ошибки валидации:', buyer.validate());

// очистка данных покупателя
buyer.clear();
console.log('Данные после очистки:', buyer.getData());


// Работа с Api
// ======================================
const api = new Api(API_URL);
console.log('api:', api);
console.log('api.get:', api.get);
const webLarekApi = new WebLarekApi(api);

webLarekApi.getProducts()
  .then((data) => {
    console.log('Данные полученные с сервера', data);

    productsModel.setProducts(data.items);

    console.log('Массив товаров из каталога:', productsModel.getProducts());
  })
  .catch((error) => {
    console.error('Ошибка при получении товара', error);
  })