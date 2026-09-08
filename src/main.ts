import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

// Экземпляр класса
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



const buyer = new Buyer();

buyer.setData({
  email: 'test@mail.ru',
  phone: '79999999999',
});

console.log('Данные покупателя:', buyer.getData());

console.log('Ошибки валидации:', buyer.validate());

buyer.clear();

console.log('Данные после очистки:', buyer.getData());

