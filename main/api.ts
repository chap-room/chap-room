import {
  BindingMethod,
  BindingOptions,
  BindingType,
  CoverColors,
  PostageMethod,
  PrintColor,
  PrintFile,
  PrintFolder,
  PrintSide,
  PrintSize,
} from "./../shared/types";
import {
  Address,
  Order,
  OrderCancelReason,
  OrderStatus,
  PaymentMethod,
  Transaction,
  TransactionStatus,
} from "@/shared/types";
import axios, { AxiosRequestConfig } from "axios";
import Router from "next/router";
import { convert } from "@/shared/utils";
import { printFoldersConvertMap } from "@/main/convertMaps";

const BASE_URL = "http://78.157.34.146:3000/v1";

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export function logout() {
  localStorage.removeItem("accessToken");
}

const api = axios.create({
  baseURL: "http://78.157.34.146:3000/v1",
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
});

interface requestConfig extends AxiosRequestConfig<any> {
  needAuth?: boolean;
}

const request = async ({ needAuth, ...config }: requestConfig) => {
  return new Promise<any>((resolve, reject) => {
    if (needAuth && !getAccessToken()) {
      reject("لطفا دوباره وارد شوید");
      Router.push(`/login?redirectTo=${encodeURIComponent(Router.asPath)}`);
      return;
    }
    api({
      ...config,
      headers: {
        "Content-Type": "application/json",
        ...(needAuth ? { authorization: `Bearer ${getAccessToken()}` } : {}),
        ...config.headers,
      },
    })
      .then((response) => {
        if (response.data.data?.token?.access) {
          setAccessToken(response.data.data.token.access);
        }

        resolve(response.data);
      })
      .catch(({ response, message, code }) => {
        if (code === "ERR_CANCELED") {
          reject("لغو شده");
        }
        if (response?.status === 401) {
          logout();
          reject("لطفا دوباره وارد شوید");
          Router.push(`/login?redirectTo=${encodeURIComponent(Router.asPath)}`);
        }
        reject(response?.data?.error?.message || message || "");
      });
  });
};

export function reportReferralView(slug: string) {
  return request({
    method: "PUT",
    url: "/public/referrals/view",
    data: {
      slug,
    },
  });
}

export function sendCooperationRequest(phoneNumber: string) {
  return request({
    method: "POST",
    url: "/public/cooperations",
    data: {
      phoneNumber,
    },
  }).then(({ data }) => data.message);
}

export function submitContactUs(
  name: string,
  phoneNumber: string,
  message: string
) {
  return request({
    method: "POST",
    url: "/public/contact-us",
    data: {
      name,
      phoneNumber,
      message,
    },
  }).then(({ data }) => data.message);
}

export function login(phoneNumber: string, password: string) {
  return request({
    method: "POST",
    url: "/users/auth/login",
    data: {
      phoneNumber,
      password,
    },
  });
}

export function resendCode(phoneNumber: string) {
  return request({
    method: "POST",
    url: "/users/auth/resend-code",
    data: {
      phoneNumber,
    },
  }).then(({ data }) => ({
    message: data.message,
    expireAt: new Date(data.expireAt),
  }));
}

export function register(
  name: string,
  phoneNumber: string,
  password: string,
  referralSlug: string | null
) {
  return request({
    method: "POST",
    url: "/users/auth/register",
    data: {
      name,
      phoneNumber,
      password,
      referralSlug,
    },
  }).then(({ data }) => ({
    message: data.message,
    expireAt: new Date(data.expireAt),
  }));
}

export function registerConfirm(phoneNumber: string, code: number) {
  return request({
    method: "POST",
    url: "/users/auth/register/confirm",
    data: {
      phoneNumber,
      code,
    },
  });
}

export function passwordReset(phoneNumber: string) {
  return request({
    method: "POST",
    url: "/users/auth/password-reset",
    data: {
      phoneNumber,
    },
  }).then(({ data }) => ({
    message: data.message,
    expireAt: new Date(data.expireAt),
  }));
}

export function passwordResetConfirmCode(phoneNumber: string, code: number) {
  return request({
    method: "POST",
    url: "/users/auth/password-reset/confirm-code",
    data: {
      phoneNumber,
      code,
    },
  }).then(({ data }) => ({
    message: data.message,
    passwordResetToken: data.passwordResetToken,
  }));
}

export function passwordResetT(
  passwordResetToken: string,
  newPassword: string
) {
  return request({
    method: "PUT",
    url: "/users/auth/password-reset",
    data: {
      passwordResetToken,
      newPassword,
    },
  });
}

export function walletDeposit(amount: number) {
  return request({
    method: "POST",
    url: "/users/wallets/deposit",
    needAuth: true,
    data: { amount },
  }).then(({ data }) => data.paymentUrl);
}

export function walletWithdrawal(accountHolderName: string, iban: string) {
  return request({
    method: "POST",
    url: "/users/wallets/withdrawal",
    needAuth: true,
    data: { accountHolderName, iban },
  }).then(({ data }) => data.message);
}

export function getDashboard() {
  return request({
    method: "GET",
    url: "/users/dashboard",
    needAuth: true,
  }).then(({ data }) => ({
    marketingBalance: data.marketingBalance,
    walletBalance: data.walletBalance,
    avatar: data.avatar,
    name: data.name,
    phoneNumber: data.name,
    inProgressOrders: data.inProgressOrders.map((item: any) => ({
      id: item.id,
      date: new Date(item.createdAt),
      amount: item.amount,
      status:
        item.status === "pending" ? OrderStatus.pending : OrderStatus.preparing,
    })) as Order[],
  }));
}

export function getOrders(itemPerPage: number, currentPage: number) {
  return request({
    method: "GET",
    url: "/users/orders",
    needAuth: true,
    data: {
      pageSize: itemPerPage,
      page: currentPage,
    },
  }).then(({ data }) => ({
    itemCount: data.totalCount,
    orders: data.orders.map((item: any) => ({
      id: item.id,
      date: new Date(item.createdAt),
      amount: item.amount,
      status:
        item.status === "sent"
          ? OrderStatus.sent
          : item.status === "pending"
          ? OrderStatus.pending
          : item.status === "preparing"
          ? OrderStatus.preparing
          : OrderStatus.canceled,
      cancelReason: item.cancelReason,
    })) as Order[],
  }));
}

export function getOrder(orderId: string) {
  return request({
    method: "GET",
    url: `/users/orders/id/${orderId}`,
    needAuth: true,
  }).then(
    ({ data }) =>
      ({
        id: data.id,
        date: new Date(data.createdAt),
        status:
          data.status === "sent"
            ? OrderStatus.sent
            : data.status === "pending"
            ? OrderStatus.pending
            : data.status === "preparing"
            ? OrderStatus.preparing
            : OrderStatus.canceled,
        recipientName: data.recipientName,
        recipientPhoneNumber: data.recipientPhoneNumber,
        recipientPostalCode: data.recipientPostalCode,
        recipientDeliveryProvince: data.recipientDeliveryProvince,
        recipientDeliveryCity: data.recipientDeliveryCity,
        recipientDeliveryAddress: data.recipientDeliveryAddress,
        amount: data.amount,
        postageFee: data.postageFee,
        postageDate: new Date(data.postageAt),
        postageMethod: {
          express_mail: PostageMethod.expressMail,
        }[data.postageMethod as string],
        discountAmount: data.discountAmount,
        discountCode: data.discountCode,
        paymentMethod: {
          [PaymentMethod.zarinPalGate]: data.gatewayPaidAmount
            ? data.gatewayPaidAmount
            : 0,
          [PaymentMethod.wallet]: data.walletPaidAmount
            ? data.walletPaidAmount
            : 0,
        },
        cancelReason: data.cancelReason,
        lastUpdateDate: new Date(data.updatedAt),
        trackingNumber: data.trackingNumber,
        printFolders: data.folders.map(
          (item: any) =>
            convert(printFoldersConvertMap, item, "a2b") as PrintFolder
        ),
      } as Order)
  );
}

export function cancelOrder(orderId: string) {
  return request({
    method: "PUT",
    url: `/users/orders/id/${orderId}/cancel`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function uploadPrintFile(
  file: File,
  onProgress: (progress: number) => void,
  abortController: AbortController
) {
  let data = new FormData();
  data.append("attachment", file);

  return request({
    method: "POST",
    url: "/users/files",
    needAuth: true,
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: function (progressEvent) {
      onProgress(progressEvent.progress || 0);
    },
    signal: abortController.signal,
  }).then(({ data }) => ({
    message: data.message,
    fileId: data.id,
    countOfPages: data.countOfPages,
  }));
}

export function deletePrintFile(printFileId: string) {
  return request({
    method: "DELETE",
    url: `/users/files/id/${printFileId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function getPrintFolders() {
  return request({
    method: "GET",
    url: "/users/folders",
    needAuth: true,
  }).then(({ data }) =>
    data.map(
      (item: any) => convert(printFoldersConvertMap, item, "a2b") as PrintFolder
    )
  );
}

export function getPrintFolder(printFolderId: string) {
  return request({
    method: "GET",
    url: `/users/folders/id/${printFolderId}`,
    needAuth: true,
  }).then(
    ({ data }) => convert(printFoldersConvertMap, data, "a2b") as PrintFolder
  );
}

export function newPrintFolder(data: {
  printColor: PrintColor;
  printSize: PrintSize;
  printSide: PrintSide;
  countOfPages: number;
  bindingOptions: BindingOptions | null;
  description: string | null;
  countOfCopies: number | null;
  printFiles: PrintFile[];
}) {
  return request({
    method: "POST",
    url: "/users/folders",
    needAuth: true,
    data: convert(printFoldersConvertMap, data, "b2a"),
  }).then(({ data }) => data.message);
}

export function updatePrintFolder(
  printFolderId: string,
  data: {
    printColor: PrintColor;
    printSize: PrintSize;
    printSide: PrintSide;
    countOfPages: number;
    bindingOptions: BindingOptions | null;
    description: string | null;
    countOfCopies: number | null;
    printFiles: PrintFile[];
  }
) {
  return request({
    method: "PUT",
    url: `/users/folders/id/${printFolderId}`,
    needAuth: true,
    data: convert(printFoldersConvertMap, data, "b2a"),
  }).then(({ data }) => data.message);
}

export function deletePrintFolder(printFolderId: string) {
  return request({
    method: "DELETE",
    url: `/users/folders/id/${printFolderId}`,
    needAuth: true,
  });
}

export function calculateOrderPrice(discountCode: string | null) {
  return request({
    method: "POST",
    url: "/users/orders/price-calculator",
    needAuth: true,
    data: {
      discountCode,
    },
  }).then(({ data }) => ({
    discountAmount: data.discountAmount,
    userBalance: data.userBalance,
    foldersAmount: data.foldersAmount,
    postageFee: data.postageFee,
  }));
}

export function newOrder(
  addressId: string,
  discountCode: string | null,
  paidWithWallet: boolean
) {
  return request({
    method: "POST",
    url: "/users/orders",
    needAuth: true,
    data: {
      addressId,
      discountCode,
      paidWithWallet,
    },
  }).then(({ data }) => ({
    paymentUrl: data.paymentUrl,
    message: data.message,
  }));
}

export function getAddresses(itemPerPage: number, currentPage: number) {
  return request({
    method: "GET",
    url: "/users/addresses",
    needAuth: true,
    data: {
      pageSize: itemPerPage,
      page: currentPage,
    },
  }).then(({ data }) => ({
    itemCount: data.totalCount,
    addresses: data.addresses as Address[],
  }));
}

export function newAddress(
  label: string,
  recipientName: string,
  recipientPhoneNumber: string,
  recipientPostalCode: string,
  recipientDeliveryProvince: string,
  recipientDeliveryCity: string,
  recipientDeliveryAddress: string
) {
  return request({
    method: "POST",
    url: "/users/addresses",
    needAuth: true,
    data: {
      label,
      recipientName,
      recipientPhoneNumber,
      recipientPostalCode,
      recipientDeliveryProvince,
      recipientDeliveryCity,
      recipientDeliveryAddress,
    },
  }).then(({ data }) => data.message);
}

export function getAddress(addressId: string) {
  return request({
    method: "GET",
    url: `/users/addresses/id/${addressId}`,
    needAuth: true,
  }).then(
    ({ data }) =>
      ({
        id: data.id,
        label: data.label,
        recipientName: data.recipientName,
        recipientPhoneNumber: data.recipientPhoneNumber,
        recipientPostalCode: data.recipientPostalCode,
        recipientDeliveryProvince: data.recipientDeliveryProvince,
        recipientDeliveryCity: data.recipientDeliveryCity,
        recipientDeliveryAddress: data.recipientDeliveryAddress,
      } as Address)
  );
}

export function updateAddress(
  addressId: string,
  label: string,
  recipientName: string,
  recipientPhoneNumber: string,
  recipientPostalCode: string,
  recipientDeliveryProvince: string,
  recipientDeliveryCity: string,
  recipientDeliveryAddress: string
) {
  return request({
    method: "PUT",
    url: `/users/addresses/id/${addressId}`,
    needAuth: true,
    data: {
      label,
      recipientName,
      recipientPhoneNumber,
      recipientPostalCode,
      recipientDeliveryProvince,
      recipientDeliveryCity,
      recipientDeliveryAddress,
    },
  }).then(({ data }) => data.message);
}

export function deleteAddress(addressId: string) {
  return request({
    method: "DELETE",
    url: `/users/addresses/id/${addressId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function getTransactions(itemPerPage: number, currentPage: number) {
  return request({
    method: "GET",
    url: "/users/transactions",
    needAuth: true,
    data: {
      pageSize: itemPerPage,
      page: currentPage,
    },
  }).then(({ data }) => ({
    itemCount: data.totalCount,
    transactions: data.transactions.map((item: any) => ({
      id: item.id,
      date: new Date(item.createdAt),
      amount: item.amount,
      details: item.description,
      orderId: item.orderId,
      status:
        item.status === "successful"
          ? TransactionStatus.successful
          : TransactionStatus.unsuccessful,
    })) as Transaction[],
  }));
}

export function getMarketing() {
  return request({
    method: "GET",
    url: "/users/marketing",
    needAuth: true,
  }).then(({ data }) => data);
}

export function getProfile() {
  return request({
    method: "GET",
    url: "/users/profile",
    needAuth: true,
  }).then(({ data }) => ({
    marketingBalance: data.marketingBalance,
    walletBalance: data.walletBalance,
    avatar: data.avatar,
    name: data.name,
    phoneNumber: data.phoneNumber,
  }));
}

export function updateProfile(name: string, password: string) {
  return request({
    method: "PUT",
    url: "/users/profile",
    needAuth: true,
    data: {
      name,
      password,
    },
  }).then(({ data }) => data.message);
}
