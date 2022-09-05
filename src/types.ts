// all amounts in toman
export interface Order {
  id: number;
  description: string | null;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientPostalCode: string;
  recipientDeliveryAddress: string;
  data: Date;
  amount: number;
  postageAmount: number;
  discountAmount: number;
  discountCode: string;
  paymentMethod: Record<PaymentMethod, number>;
  status: OrederStatus;
  lastStatusChange: Date;
  trackingCode: string | null;
  postageDate: Date | null;
  postageMethod: PostageMethod;
}

export enum OrederStatus {
  UserCancel,
  paperCountMismatch,
  pending,
  preparing,
  sent,
}

export enum PaymentMethod {
  wallet = 'wallet',
  zarinPalGate = 'zarinPalGate',
}

export enum PostageMethod {
  expressMail,
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientPostalCode: string;
  recipientDeliveryState: string;
  recipientDeliveryCity: string;
  recipientDeliveryAddress: string;
}

export interface Transaction {
  id: string;
  data: Date;
  amount: number;
  details: string;
  status: TransactionStatus;
}

export enum TransactionStatus {
  successful,
  unsuccessful,
}
