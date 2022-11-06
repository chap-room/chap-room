export interface User {
  id: number;
  name: string;
  phoneNumber: string;
}

export interface AdminUserRole {
  name: string,
}

// all amounts in toman
export interface Order {
  id: number;
  date: Date;
  status: OrderStatus;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientDeliveryProvince: string;
  recipientDeliveryCity: string;
  recipientPostalCode: string;
  recipientDeliveryAddress: string;
  amount: number;
  postageFee: number;
  postageDate: Date | null;
  postageMethod: PostageMethod;
  discountAmount: number | null;
  discountCode: string;
  gatewayPaidAmount: number;
  walletPaidAmount: number;
  cancelReason: string | null;
  lastUpdateDate: Date;
  trackingNumber: string | null;
  printFolders: PrintFolder[];
}

export enum OrderStatus {
  canceled = "لغو شده",
  pending = "در انتظار بررسی",
  preparing = "در حال آماده سازی",
  sent = "ارسال شده",
}

export enum OrderCancelReason {
  userCancel = "لغو شخصی",
  countOfPagesMismatch = "تعداد برگ با سفارش همخوانی ندارد",
}

export interface PrintFolder {
  id: number;
  amount: number;
  printColor: PrintColor;
  printSize: PrintSize;
  printSide: PrintSide;
  countOfPages: number;
  bindingOptions: BindingOptions | null;
  description: string | null;
  countOfCopies: number | null;
  printFiles: PrintFile[];
  filesUrl: string;
}

export interface PrintFile {
  id: number;
  name: string;
  countOfPages: number;
}
export enum PrintColor {
  blackAndWhite = "سیاه و سفید",
  normalColor = "رنگی معمولی",
  fullColor = "تمام رنگی",
}

export enum PrintSize {
  a4 = "A4",
  a3 = "A3",
  a5 = "A5",
}

export enum PrintSide {
  singleSided = "یک رو",
  doubleSided = "دو رو",
}

export interface BindingOptions {
  bindingType: BindingType;
  bindingMethod: BindingMethod;
  countOfFiles: number | null;
  coverColor: CoverColors;
}

export enum BindingType {
  springNormal = "فنر با طلق معمولی",
  springPapco = "فنر با طلق پاپکو",
  stapler = "منگنه",
}

export enum BindingMethod {
  eachFileSeparated = "هر فایل جدا",
  allFilesTogether = "همه فایل ها با هم",
  countOfFiles = "تعدادی از فایل ها",
}

export enum CoverColors {
  colorful = "رنگی",
  blackAndWhite = "سیاه و سفید",
}

export enum PaymentMethod {
  wallet = "کیف پول",
  zarinPalGate = "زرین پال",
}

export enum PostageMethod {
  expressMail = "پست پیشتاز",
}

export interface Address {
  id: number;
  label: string;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientPostalCode: string;
  recipientDeliveryProvince: string;
  recipientDeliveryCity: string;
  recipientDeliveryAddress: string;
}

export interface Transaction {
  id: number;
  date: Date;
  amount: number;
  description: string;
  orderId: number | null;
  status: TransactionStatus;
}

export enum TransactionStatus {
  successful = "موفق",
  unsuccessful = "نا موفق",
}

export interface Discount {
  id: number;
  active: boolean;
  code: string;
  description: string;
  user: User | null;
  phoneNumber: string | null;
  discountType: DiscountType;
  discountValue: number;
  usageLimit: number | null;
  timesUsed: number | null;
  expireDate: Date | null;
}

export enum DiscountType {
  fixedAmount = "مبلغ ثابت",
  percentage = "درصدی",
  countOfPages = "تعدادی از صفحات",
}

export interface CooperationRequest {
  id: number;
  date: Date;
  phoneNumber: string;
  description: string | null;
  status: CooperationRequestStatus;
}

export enum CooperationRequestStatus {
  approved = "قبول شده",
  rejected = "رد شده",
  pending = "در انتظار بررسی",
}

export interface FinancialRecord {
  id: number;
  date: Date;
  user: User;
  amount: number;
  description: string;
  orderId: number | null;
  type: FinancialRecordType;
  status: FinancialRecordStatus;
  admin: User | null;
}

export enum FinancialRecordType {
  debtor = "بدهکار",
  creditor = "بستانکار",
}

export enum FinancialRecordStatus {
  successful = "موفق",
  unsuccessful = "نا موفق",
}

export interface WithdrawalRequest {
  id: number;
  date: Date;
  amount: number;
  user: User;
  iban: number;
  accountHolderName: string;
  status: WithdrawalRequestStatus;
  rejectReason: string | null;
  transactionDate: string | null;
  trackingNumber: string | null;
}

export enum WithdrawalRequestStatus {
  done = "انجام شده",
  rejected = "رد شده",
  pending = "در انتظار بررسی",
}

export interface Tariffs {
  print: PrintTariffs;
  binding: BindingTariffs;
}

export interface PrintTariffs {
  a4: {
    blackAndWhite: PrintPrice;
    normalColor: PrintPrice;
    fullColor: PrintPrice;
  };
  a5: {
    blackAndWhite: PrintPrice;
    normalColor: PrintPrice;
    fullColor: PrintPrice;
  };
  a3: {
    blackAndWhite: PrintPrice;
    normalColor: PrintPrice;
    fullColor: PrintPrice;
  };
}

export interface PrintPrice {
  singleSided: number;
  doubleSided: number;
  singleSidedGlossy: number;
  doubleSidedGlossy: number;
  breakpoints: {
    at: number;
    singleSided: number;
    doubleSided: number;
    singleSidedGlossy: number;
    doubleSidedGlossy: number;
  }[];
}

export interface BindingTariffs {
  springNormal: {
    a4: number;
    a3: number;
    a5: number;
  };
  springPapco: {
    a4: number;
    a3: number;
    a5: number;
  };
  stapler: number;
}

export interface Post {
  id: number;
  pageSlug: string;
  pageTitle: string;
  postTitle: string;
  categories: string[];
  keywords: string[];
  metaDescription: string;
  thumbnail: string | null;
  thumbnailAlt: string;
  status: PostStatus;
  content: string;
}

export enum PostStatus {
  draft = "پیش نویس",
  published = "منتشر شده",
}

export interface DedicatedLinkReport {
  orderId: number;
  date: Date;
  user: User;
  buyer: User;
  amount: number; 
  referralBenefit: number;
  referralCommission: number;
  referralSlug: string;
}

export interface DedicatedDiscountCodeReport {
  orderId: number;
  date: Date;
  user: User;
  buyer: User;
  amount: number;
  discountCode: string;
  discountValue: number;
  discountAmount: number;
  discountBenefitPercentage: number;
  discountBenefit: number;
}

export interface CustomerReport {
  id: number;
  name: string;
  phoneNumber: string;
  walletBalance: number;
  marketingBalance: number;
  countOfOrders: number;
  totalPaidAmount: number;
  registrationDate: Date;
  firstOrderDate: Date;
  lastOrderDate: Date;
}
