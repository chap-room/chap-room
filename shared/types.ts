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
  admin = "مدیر",
  representation = "نمایندگی",
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
  paymentMethod: Record<PaymentMethod, number>;
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
  id: string;
  printColor: PrintColor;
  printSize: PrintSize;
  printSide: PrintSide;
  countOfPages: number;
  bindingOptions: BindingOptions | null;
  description: string | null;
  countOfCopies: number | null;
  printFiles: PrintFile[];
}

export interface PrintFile {
  id: string;
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
  orderId: string | null;
  status: TransactionStatus;
}

export enum TransactionStatus {
  successful = "موفق",
  unsuccessful = "نا موفق",
}

export interface DiscountCode {
  id: string;
  active: boolean;
  code: string;
  description: string;
  customer: User | null;
  discountType: DiscountType;
  discountValue: number;
  percentageDiscountCeiling: number | null;
  minOrderAmount: number | null;
  maxOrderAmount: number | null;
  minPageCount: number | null;
  maxPageCount: number | null;
  usageLimit: number | null;
  timesUsed: number | null;
  expirationDate: Date | null;
}

export enum DiscountType {
  fixedAmount = "مبلغ ثابت",
  percentage = "درصدی",
  numberOfPages = "تعدادی از صفحات",
}

export interface CooperationRequest {
  id: string;
  date: Date;
  phoneNumber: string;
  description: string | null;
  status: CooperationRequestStatus;
}

export enum CooperationRequestStatus {
  accepted = "قبول شده",
  rejected = "رد شده",
  pending = "در انتظار بررسی",
}

export interface FinancialRecord {
  id: string;
  date: Date;
  user: User;
  amount: number;
  details: string;
  orderId: string | null;
  type: FinancialRecordType;
  status: FinancialRecordStatus;
  addedBy: AdminUser | null;
}

export enum FinancialRecordType {
  debtor = "بدهکار",
  creditor = "بستانکار",
}

export enum FinancialRecordStatus {
  successful = "موفق",
  unsuccessful = "نا موفق",
  addedManually = "دستی افزوده شده",
}

export interface WithdrawalRequest {
  id: string;
  date: Date;
  amount: number;
  user: User;
  shabaNumber: number;
  accountHolderName: string;
  status: WithdrawalRequestStatus;
  rejectReason: string | null;
  transactionDate: string | null;
  transactionTrackingCode: string | null;
}

export enum WithdrawalRequestStatus {
  done = "انجام شده",
  rejected = "رد شده",
  pending = "در انتظار بررسی",
}

// export interface AllPrintPrices {
//   [PrintSize.a4]: {
//     [PrintColor.blackAndWhite]: PrintPrices;
//     [PrintColor.normalColor]: PrintPrices;
//     [PrintColor.fullColor]: PrintPrices;
//   };
//   [PrintSize.a3]: {
//     [PrintColor.blackAndWhite]: PrintPrices;
//     [PrintColor.normalColor]: PrintPrices;
//     [PrintColor.fullColor]: PrintPrices;
//   };
//   [PrintSize.a5]: {
//     [PrintColor.blackAndWhite]: PrintPrices;
//     [PrintColor.normalColor]: PrintPrices;
//     [PrintColor.fullColor]: PrintPrices;
//   };
//   binding: BindingPrices;
// }

// export interface PrintPrices {
//   [PrintSide.singleSided]: number;
//   [PrintSide.doubleSided]: number;
//   [PrintSide.singleSidedGlossy]: number;
//   [PrintSide.doubleSidedGlossy]: number;
//   breakpoints: {
//     at: number;
//     [PrintSide.singleSided]: number;
//     [PrintSide.doubleSided]: number;
//     [PrintSide.singleSidedGlossy]: number;
//     [PrintSide.doubleSidedGlossy]: number;
//   }[];
// }

export interface BindingPrices {
  [BindingType.springNormal]: {
    [PrintSize.a4]: number;
    [PrintSize.a3]: number;
    [PrintSize.a5]: number;
  };
  [BindingType.springPapco]: {
    [PrintSize.a4]: number;
    [PrintSize.a3]: number;
    [PrintSize.a5]: number;
  };
  [BindingType.stapler]: number;
}

export interface Post {
  id: string;
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

export interface DedicatedDiscountCodeReport {
  id: string;
  date: Date;
  user: User;
  customer: User;
  orderId: string;
  orderAmount: number;
  customerDiscount: number;
  userFee: number;
  discountCode: string;
}

export interface DedicatedLinkReport {
  id: string;
  date: Date;
  user: User;
  customer: User;
  orderId: string;
  orderAmount: number;
  userFee: number;
  userLink: string;
}

export interface CustomerReport {
  id: string;
  user: User;
  registrationDate: Date;
  firstOrderDate: Date;
  lastOrderDate: Date;
  totalAmountPaid: number;
}
