import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Basket as BasketModel } from "./components/models/Basket";
import { Basket as BasketView } from "./components/Basket";
import { Buyer } from "./components/models/Buyer";
import { WebLarekApi } from "./components/api/WebLarekApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { Header } from "./components/Header";
import { Gallery } from "./components/Gallery";
import { Modal } from "./components/Modal";
import { CardCatalog } from "./components/CardCatalog";
import { CardPreview } from "./components/CardPreview";
import { CardBasket } from "./components/CardBasket";
import { OrderForm } from "./components/OrderForm";
import { ContactsForm } from "./components/ContactsForm";
import { Success } from "./components/Success";
import { cloneTemplate, ensureElement } from "./utils/utils";

const events = new EventEmitter();

const productsModel = new ProductCatalog(events);
const basket = new BasketModel(events);
const buyer = new Buyer(events);

const headerElement = ensureElement<HTMLElement>(".header");
const galleryElement = ensureElement<HTMLElement>(".gallery");
const modalElement = ensureElement<HTMLElement>("#modal-container");

const header = new Header(headerElement, events);
const gallery = new Gallery(galleryElement);
const modal = new Modal(modalElement);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");

const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");

const orderTemplate = ensureElement<HTMLTemplateElement>("#order");

const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");

const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const cardPreviewElement = cloneTemplate(cardPreviewTemplate);

const cardPreview = new CardPreview(cardPreviewElement, {
  onClick: () => events.emit("card:button"),
});

const basketElement = cloneTemplate(basketTemplate);
const basketView = new BasketView(basketElement, events);

const orderElement = cloneTemplate(orderTemplate) as HTMLFormElement;
const orderForm = new OrderForm(orderElement, events);

const contactsElement = cloneTemplate(contactsTemplate) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsElement, events);

const successElement = cloneTemplate(successTemplate);
const success = new Success(successElement, events);

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

events.on("catalog:changed", () => {
  const products = productsModel.getProducts();

  const cards = products.map((product) => {
    const cardElement = cloneTemplate(cardCatalogTemplate);

    const card = new CardCatalog(cardElement, events);

    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: `${CDN_URL}${product.image}`,
    });
  });

  gallery.items = cards;
});

events.on<{ id: string }>("card:select", ({ id }) => {
  const product = productsModel.getProduct(id);

  if (product) {
    productsModel.setSelectedProduct(product);
  }
});

events.on("product:selected", () => {
  const product = productsModel.getSelectedProduct();

  if (!product) return;

  modal.content = cardPreview.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: `${CDN_URL}${product.image}`,
    description: product.description,

    button:
      product.price === null
        ? "Недоступно"
        : basket.has(product.id)
          ? "Удалить из корзины"
          : "В корзину",

    disabled: product.price === null,
  });

  modal.open();
});

events.on("card:button", () => {
  const product = productsModel.getSelectedProduct();

  if (!product) return;

  if (basket.has(product.id)) {
    basket.remove(product);
  } else {
    basket.add(product);
  }

  modal.close();
});

events.on("basket:changed", () => {
  header.counter = basket.getCount();

  const items = basket.getItems().map((product, index) => {
    const cardElement = cloneTemplate(cardBasketTemplate);

    const card = new CardBasket(cardElement, events);

    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  basketView.items = items;
  basketView.total = basket.getTotal();
  basketView.disabled = basket.getCount() === 0;
});

events.on("basket:open", () => {
  modal.content = basketView.render();
  modal.open();
});

events.on<{ id: string }>("basket:remove", ({ id }) => {
  const product = productsModel.getProduct(id);

  if (product) {
    basket.remove(product);
  }
});

events.on("basket:order", () => {
  modal.content = orderForm.render();
  modal.open();
});

events.on("buyer:changed", () => {
  const data = buyer.getData();
  const errors = buyer.validate();

  orderForm.payment = data.payment;
  orderForm.address = data.address;

  orderForm.valid = !errors.payment && !errors.address;

  orderForm.errors = [errors.payment, errors.address]
    .filter(Boolean)
    .join(", ");

  contactsForm.email = data.email;
  contactsForm.phone = data.phone;

  contactsForm.valid = !errors.email && !errors.phone;

  contactsForm.errors = [errors.email, errors.phone].filter(Boolean).join(", ");
});

events.on<{ payment: string }>("order:payment", ({ payment }) => {
  buyer.setData({
    payment: payment as "card" | "cash",
  });
});

events.on<{ address: string }>("order:input", ({ address }) => {
  buyer.setData({
    address,
  });
});

events.on("order:submit", () => {
  modal.content = contactsForm.render();
  modal.open();
});

events.on<{ email?: string; phone?: string }>("contacts:input", (data) => {
  buyer.setData(data);
});

events.on("contacts:submit", () => {
  const order = {
    ...buyer.getData(),
    items: basket.getItems().map((product) => product.id),
    total: basket.getTotal(),
  };

  webLarekApi
    .createOrder(order)
    .then((result) => {
      basket.clear();
      buyer.clear();

      success.total = result.total;
      modal.content = success.render();
      modal.open();
    })
    .catch((error) => {
      console.error("Ошибка создания заказа:", error);
    });
});

events.on("success:close", () => {
  modal.close();
});

basket.clear();
buyer.clear();

webLarekApi
  .getProducts()
  .then((data) => {
    productsModel.setProducts(data.items);
  })
  .catch((error) => {
    console.error("Ошибка при получении товара", error);
  });
