import "./scss/styles.scss";

console.log("MAIN ЗАПУЩЕН");

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
import { ensureElement } from "./utils/utils";

const events = new EventEmitter();

const productsModel = new ProductCatalog(events);
const basket = new BasketModel(events);
const buyer = new Buyer(events);

const headerElement = ensureElement<HTMLElement>(".header");
const galleryElement = ensureElement<HTMLElement>(".gallery");
const modalElement = ensureElement<HTMLElement>("#modal-container");

const header = new Header(headerElement, events);
const gallery = new Gallery(galleryElement);
const modal = new Modal(modalElement, events);

const cardCatalogTemplate =
  ensureElement<HTMLTemplateElement>('#card-catalog');

const cardPreviewTemplate =
  ensureElement<HTMLTemplateElement>('#card-preview');

const cardBasketTemplate =
  ensureElement<HTMLTemplateElement>('#card-basket');

const basketTemplate =
  ensureElement<HTMLTemplateElement>('#basket');

const orderTemplate =
  ensureElement<HTMLTemplateElement>('#order');

const contactsTemplate =
  ensureElement<HTMLTemplateElement>('#contacts');

console.log('Список покупок после очистки', basket.getItems());

const successTemplate =
  ensureElement<HTMLTemplateElement>('#success');

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

let isBasketOpen = false;

events.on("catalog:changed", () => {
  const products = productsModel.getProducts();

  const cards = products.map((product) => {
    const cardElement =
      cardCatalogTemplate.content.firstElementChild!.cloneNode(
        true,
      ) as HTMLElement;

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

  const cardElement = cardPreviewTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLElement;

  const card = new CardPreview(cardElement, events);

  modal.content = card.render({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    image: `${CDN_URL}${product.image}`,
    description: product.description,
  });

  modal.open();
});

events.on<{ id: string }>("card:add", ({ id }) => {
  const product = productsModel.getProduct(id);

  if (product) {
    basket.add(product);
    modal.close();
  }
});

events.on("basket:changed", () => {
  header.counter = basket.getCount();

  if (isBasketOpen) {
    modal.content = renderBasket();
  }
});

const renderBasket = () => {
  const basketElement = basketTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLElement;

  const basketView = new BasketView(basketElement, events);

  const items = basket.getItems().map((product, index) => {
    const cardElement = cardBasketTemplate.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

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

  return basketView.render();
};

events.on("basket:open", () => {
  isBasketOpen = true;

  modal.content = renderBasket();
  modal.open();
});

events.on<{ id: string }>("basket:remove", ({ id }) => {
  const product = productsModel.getProduct(id);

  if (product) {
    basket.remove(product);
  }
});

let orderForm: OrderForm | null = null;

events.on("basket:order", () => {
  isBasketOpen = false;

  const orderElement = orderTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLFormElement;

  orderForm = new OrderForm(orderElement, events);

  modal.content = orderForm.render();
  modal.open();
});

const validateOrder = () => {
  const errors = buyer.validate();

  delete errors.email;
  delete errors.phone;

  const errorMessage = Object.values(errors).join(", ");

  events.emit("order:validation", {
    valid: Object.keys(errors).length === 0,
    errors: errorMessage,
  });
};

const validateContacts = () => {
  const errors = buyer.validate();

  delete errors.payment;
  delete errors.address;

  const errorMessage = Object.values(errors).join(", ");

  events.emit("contacts:validation", {
    valid: Object.keys(errors).length === 0,
    errors: errorMessage,
  });
};

events.on<{ payment: string }>("order:payment", ({ payment }) => {
  buyer.setData({
    payment: payment as "card" | "cash",
  });

  validateOrder();
});

events.on<{ address: string }>("order:input", ({ address }) => {
  buyer.setData({
    address,
  });

  validateOrder();
});

events.on<{ valid: boolean; errors: string }>(
  "order:validation",
  ({ valid, errors }) => {
    if (orderForm) {
      orderForm.valid = valid;
      orderForm.errors = errors;
    }
  },
);

let contactsForm: ContactsForm | null = null;

events.on("order:submit", () => {
  const contactsElement = contactsTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLFormElement;

  contactsForm = new ContactsForm(contactsElement, events);

  modal.content = contactsForm.render();
});

events.on<{ email?: string; phone?: string }>("contacts:input", (data) => {
  buyer.setData(data);
  validateContacts();
});

events.on<{ valid: boolean; errors: string }>(
  "contacts:validation",
  ({ valid, errors }) => {
    if (contactsForm) {
      contactsForm.valid = valid;
      contactsForm.errors = errors;
    }
  },
);

events.on("contacts:submit", () => {
  const errors = buyer.validate();

  if (Object.keys(errors).length > 0) {
    validateContacts();
    return;
  }

  const order = {
    ...buyer.getData(),
    items: basket.getItems().map((product) => product.id),
    total: basket.getTotal(),
  };

  webLarekApi
    .createOrder(order)
    .then((result) => {
      const successElement =
        successTemplate.content.firstElementChild!.cloneNode(
          true,
        ) as HTMLElement;

      const success = new Success(successElement, events);

      modal.content = success.render({
        total: result.total,
      });

      modal.open();
    })
    .catch((error) => {
      console.error("Ошибка создания заказа:", error);
    });
});

events.on("success:close", () => {
  basket.clear();
  buyer.clear();
  modal.close();
});

events.on("modal:close", () => {
  isBasketOpen = false;
  modal.close();
});

webLarekApi
  .getProducts()
  .then((data) => {
    productsModel.setProducts(data.items);
  })
  .catch((error) => {
    console.error("Ошибка при получении товара", error);
  });
