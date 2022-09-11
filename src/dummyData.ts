import {
  Order,
  PaymentMethod,
  OrderStatus,
  PostageMethod,
  Address,
  Transaction,
  TransactionStatus,
} from "./types";

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadOrders() {
  await timeout(3000);
  return orders.values();
}

export async function loadOrder(id: number) {
  await timeout(3000);
  return orders.get(id);
}

export const currentUser = {
  name: "عباس بوعذار",
  phoneNumber: "09359278399",
  avatar: null,
};

export const wallet = {
  balance: 152000,
  marketingSales: 182000,
};

export const orders = new Map<number, Order>();
orders.set(265454, {
  id: 265454,
  description:
    "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.",
  recipientName: "آرش زنگنه فر",
  recipientPhoneNumber: "0123456789",
  recipientPostalCode: "1234512345",
  data: new Date("2022-07-11T07:24:52"),
  recipientDeliveryAddress:
    "استان اصفهان / شهر اصفهان / خیابان 1 / خیابان 2 / کوچه 1 / پلاک 1 / طبقه 1",
  amount: 650000,
  postageAmount: 200000,
  discountAmount: 20000,
  discountCode: "HHFDPD",
  paymentMethod: {
    [PaymentMethod.zarinPalGate]: 30000,
    [PaymentMethod.wallet]: 600000,
  },
  status: OrderStatus.sent,
  lastStatusChange: new Date("2022-07-13T07:24:52"),
  trackingCode: "102489911100422150000114",
  postageDate: new Date("2022-07-13T07:24:52"),
  postageMethod: PostageMethod.expressMail,
});

export const addresses = new Map<string, Address>();
addresses.set("1", {
  id: "1",
  label: "خانه",
  recipientName: "آرش زنگنه فر",
  recipientPhoneNumber: "0123456789",
  recipientPostalCode: "1234512345",
  recipientDeliveryState: "اصفهان",
  recipientDeliveryCity: "اصفهان",
  recipientDeliveryAddress: "خیابان 1 / خیابان 2 / کوچه 1 / پلاک 1 / طبقه 1",
});
addresses.set("2", {
  id: "2",
  label: "مدرسه",
  recipientName: "آرش زنگنه فر",
  recipientPhoneNumber: "0123456789",
  recipientPostalCode: "1234512345",
  recipientDeliveryState: "اصفهان",
  recipientDeliveryCity: "اصفهان",
  recipientDeliveryAddress: "خیابان 1 / خیابان 2 / کوچه 1 / پلاک 1 / طبقه 1",
});

export const transactions: Transaction[] = [
  {
    id: "1",
    data: new Date("2022-05-06T07:24"),
    amount: 14500000,
    details: "",
    status: TransactionStatus.successful,
  },
  {
    id: "2",
    data: new Date("2022-05-06T07:24"),
    amount: 14500000,
    details: "پکیج دانشجویی",
    status: TransactionStatus.successful,
  },
  {
    id: "3",
    data: new Date("2022-05-06T07:24"),
    amount: 14500000,
    details: "بازگشت وجه به کیف پول بابت لغو سفارش",
    status: TransactionStatus.successful,
  },
  {
    id: "4",
    data: new Date("2022-05-06T07:24"),
    amount: 14500000,
    details: "",
    status: TransactionStatus.unsuccessful,
  },
  {
    id: "5",
    data: new Date("2022-05-06T07:24"),
    amount: 14500000,
    details: "افزایش موجودی کیف پول",
    status: TransactionStatus.unsuccessful,
  },
  {
    id: "6",
    data: new Date("2022-05-06T07:24"),
    amount: 14500000,
    details: "واریز به حساب کاربر بابت برداشت موجودی کد پیگیری :1542552",
    status: TransactionStatus.successful,
  },
  {
    id: "7",
    data: new Date("2022-05-06T07:24"),
    amount: 14500000,
    details: "5 درصد پورسانت بازاریابی با کد تخفیف",
    status: TransactionStatus.successful,
  },
];
