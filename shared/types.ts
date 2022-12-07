export interface User {
  id: number;
  name: string;
  phoneNumber: string;
}

export interface AdminUserRole {
  name: string;
}

// all amounts in toman
export interface Order {
  id: number;
  status: "canceled" | "pending" | "preparing" | "sent";
  recipientName: string;
  recipientPhoneNumber: string;
  recipientDeliveryProvince: string;
  recipientDeliveryCity: string;
  recipientPostalCode: string;
  recipientDeliveryAddress: string;
  amount: number;
  postageFee: number;
  sentAt: string | null;
  postageMethod: string | null;
  discountAmount: number | null;
  discountCode: string | null;
  gatewayPaidAmount: number;
  walletPaidAmount: number;
  cancelReason: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  printFolders: PrintFolder[];
  createdAt: string;
  updatedAt: string;
  user: User;
}

export enum OrderCancelReason {
  userCancel = "لغو شخصی",
  countOfPagesMismatch = "تعداد برگ با سفارش همخوانی ندارد",
}

export interface PrintFolder {
  id: number;
  amount: number;
  printColor: "blackAndWhite" | "normalColor" | "fullColor";
  printSize: "a4" | "a5" | "a3";
  printSide: "singleSided" | "doubleSided";
  countOfPages: number;
  bindingOptions: BindingOptions | null;
  description: string | null;
  countOfCopies: number | null;
  filesManuallySent: boolean;
  printFiles: PrintFile[];
  folderCode: string;
  phoneNumberToSendFile: string;
  filesUrl: string;
}

export interface PrintFile {
  id: number;
  name: string;
  countOfPages: number | null;
}

export interface BindingOptions {
  bindingType: "springNormal" | "springPapco" | "stapler";
  bindingMethod: "allFilesTogether" | "eachFileSeparated" | "countOfFiles";
  countOfFiles: number | null;
  coverColor: "colorful" | "blackAndWhite";
}

export interface Address {
  id: number;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientPostalCode: string;
  recipientDeliveryProvince: string;
  recipientDeliveryCity: string;
  recipientDeliveryAddress: string;
}

export interface Transaction {
  id: number;
  createdAt: Date;
  amount: number;
  description: string;
  orderId: number | null;
  status: "successful" | "unsuccessful";
}

export interface Discount {
  id: number;
  active: boolean;
  code: string;
  description: string;
  user: User | null;
  phoneNumber: string | null;
  type:
    | "fixed"
    | "percentage"
    | "page"
    | "pageBlackAndWhite"
    | "pageNormalColor"
    | "pageFullColor";
  value: number;
  usageLimit: number | null;
  timesUsed: number | null;
  expireAt: string | null;
}

export interface CooperationRequest {
  id: number;
  createdAt: string;
  phoneNumber: string;
  description: string | null;
  status: "approved" | "rejected" | "pending";
}

export interface FinancialRecord {
  id: number;
  createdAt: string;
  user: User;
  amount: number;
  description: string;
  orderId: number | null;
  type: "debtor" | "creditor";
  status: "successful" | "unsuccessful";
  admin: User | null;
}

export interface WithdrawalRequest {
  id: number;
  createdAt: string;
  amount: number;
  user: User;
  iban: number;
  accountHolderName: string;
  status: "done" | "rejected" | "pending";
  description: string | null;
  transactionDate: string | null;
  trackingNumber: string | null;
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
  countOfViews: number;
  admin: User;
  slug: string;
  pageTitle: string;
  title: string;
  categories: PostCategory[];
  keywords: string;
  metaDescription: string;
  thumbnailUrl: string | null;
  thumbnailAlt: string | null;
  display: boolean;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostCategory {
  id: number;
  name: string;
  countOfBlogs: number;
}

export interface DedicatedLinkReport {
  orderId: number;
  createdAt: string;
  user: User;
  buyer: User;
  amount: number;
  referralBenefit: number;
  referralCommission: number;
  referralSlug: string;
}

export interface DedicatedDiscountCodeReport {
  orderId: number;
  createdAt: string;
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
  createdAt: string;
  firstOrderAt: string | null;
  lastOrderAt: string | null;
}
