export interface AdminUser {
  id: string;
  name: string;
  phoneNumber: string;
  avatar: string | null;
  role: AdminUserRole;
}

export interface CurrentAdminUser {
  name: string;
  phoneNumber: string;
  avatar: string | null;
  role: AdminUserRole;
}

export enum AdminUserRole {
  admin = 'مدیر',
  representation = 'نمایندگی'
}

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  avatar: string | null;
  wallet: {
    balance: number;
    marketingSales: number;
  };
  addresses: Address[];
  orders: Order[];
  transactions: Transaction[];
}

export interface CurrentUser {
  name: string;
  phoneNumber: string;
  avatar: string | null;
  wallet: {
    balance: number;
    marketingSales: number;
  };
}

// all amounts in toman
export interface Order {
  id: string;
  date: Date;
  printFolders: PrintFolder[];
  recipientName: string;
  recipientPhoneNumber: string;
  recipientPostalCode: string;
  recipientDeliveryAddress: string;
  amount: number;
  postageAmount: number;
  discountAmount: number | null;
  discountCode: string;
  paymentMethod: Record<PaymentMethod, number>;
  status: OrderStatus;
  cancelReason: OrderCancelReason | null;
  lastStatusChange: Date;
  trackingCode: string | null;
  postageDate: Date | null;
  postageMethod: PostageMethod;
}

export interface PrintFolder {
  printFiles: PrintFile[];
  printColors: PrintColors;
  printPaperSize: PrintPaperSize;
  printType: PrintType;
  paperCount: number;
  bindingOptions: BindingOptions | null;
  description: string | null;
  copiesCount: number | null;
}

export interface PrintFile {
  id: string;
  name: string;
}

export enum PrintColors {
  blackAndWhite = "سیاه و سفید",
  normalColor = "رنگی معمولی",
  fullColor = "تمام رنگی",
}

export enum PrintPaperSize {
  a4 = "A4",
  a3 = "A3",
  a5 = "A5",
}

export enum PrintType {
  singleSided = "یک رو",
  doubleSided = "دو رو",
}

export interface BindingOptions {
  bindingType: BindingType;
  bindingMethod: BindingMethod;
  numberOfFiles: number | null;
  coverColor: CoverColor;
}

export enum BindingType {
  springNormal = "فنر با طلق معمولی",
  springPapco = "فنر با طلق پاپکو",
  stapler = "منگنه",
}

export enum BindingMethod {
  eachFileSeparated = "هر فایل جدا",
  allFilesTogether = "همه فایل ها با هم",
  numberOfFiles = "تعدادی از فایل ها",
}

export enum CoverColor {
  colorful = "رنگی",
  blackAndWhite = "سیاه و سفید",
}

export enum OrderStatus {
  canceled = "لغو شده",
  pending = "در حال بررسی",
  preparing = "در حال آماده سازی",
  sent = "ارسال شده",
}

export enum OrderCancelReason {
  userCancel = "لغو شخصی",
  paperCountMismatch = "تعداد برگ با سفارش همخوانی ندارد",
}

export enum PaymentMethod {
  wallet = "کیف پول",
  zarinPalGate = "زرین پال",
}

export enum PostageMethod {
  expressMail = "پست پیشتاز",
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientPostalCode: string;
  recipientDeliveryProvince: string;
  recipientDeliveryCity: string;
  recipientDeliveryAddress: string;
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  details: string;
  status: TransactionStatus;
}

export enum TransactionStatus {
  successful = "موفق",
  unsuccessful = "نا موفق",
}
