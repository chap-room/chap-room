import {
  cooperationRequestConvertMap,
  customerReportConvertMap,
  dedicatedDiscountCodeReportConvertMap,
  dedicatedLinkReportConvertMap,
  discountConvertMap,
  financialRecordConvertMap,
} from "./convertMaps";
import {
  Address,
  BindingTariffs,
  CooperationRequest,
  CooperationRequestStatus,
  CustomerReport,
  DedicatedDiscountCodeReport,
  DedicatedLinkReport,
  Discount,
  DiscountType,
  FinancialRecord,
  FinancialRecordStatus,
  FinancialRecordType,
  Order,
  OrderStatus,
  PrintPrice,
  PrintTariffs,
  WithdrawalRequest,
} from "@/shared/types";
import { convert } from "@/shared/utils";
import axios, { AxiosRequestConfig } from "axios";
import Router from "next/router";
import { orderConvertMap } from "@/main/convertMaps";

const BASE_URL = "http://78.157.34.146:3000/v1";

function getAccessToken() {
  return localStorage.getItem("adminAccessToken");
}

function setAccessToken(token: string) {
  localStorage.setItem("adminAccessToken", token);
}

export function logout() {
  localStorage.removeItem("adminAccessToken");
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
  redirectIfNotLogin?: boolean;
}

const request = async ({
  needAuth,
  redirectIfNotLogin = true,
  ...config
}: requestConfig) => {
  return new Promise<any>((resolve, reject) => {
    if (needAuth && !getAccessToken()) {
      reject("لطفا دوباره وارد شوید");
      if (redirectIfNotLogin) {
        Router.push(`/login?redirectTo=${encodeURIComponent(Router.asPath)}`);
      }
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
          if (redirectIfNotLogin) {
            Router.push(
              `/login?redirectTo=${encodeURIComponent(Router.asPath)}`
            );
          }
        }
        reject(response?.data?.error?.message || message || "");
      });
  });
};

export function isLoggedIn() {
  return request({
    method: "GET",
    url: "/admins/profile",
    needAuth: true,
    redirectIfNotLogin: false,
  }).then(({ data }) => ({
    avatar: data.avatar,
    name: data.name,
    phoneNumber: data.phoneNumber,
  }));
}

export function resendCode(phoneNumber: string) {
  return request({
    method: "POST",
    url: "/admins/auth/resend-code",
    data: {
      phoneNumber,
    },
  }).then(({ data }) => ({
    message: data.message,
    expireAt: new Date(data.expireAt),
  }));
}

export function login(phoneNumber: string, password: string) {
  return request({
    method: "POST",
    url: "/admins/auth/login",
    data: {
      phoneNumber,
      password,
    },
  }).then(({ data }) => ({
    message: data.message,
    expireAt: new Date(data.expireAt),
  }));
}

export function loginConfirm(phoneNumber: string, code: number) {
  return request({
    method: "POST",
    url: "/admins/auth/login/confirm",
    data: {
      phoneNumber,
      code,
    },
  });
}

export function register(
  name: string,
  phoneNumber: string,
  password: string,
  referralSlug: string | null
) {
  return request({
    method: "POST",
    url: "/admins/auth/register",
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
    url: "/admins/auth/register/confirm",
    data: {
      phoneNumber,
      code,
    },
  });
}

export function passwordReset(phoneNumber: string) {
  return request({
    method: "POST",
    url: "/admins/auth/password-reset",
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
    url: "/admins/auth/password-reset/confirm-code",
    data: {
      phoneNumber,
      code,
    },
  }).then(({ data }) => ({
    message: data.message,
    passwordResetToken: data.passwordResetToken,
  }));
}

export function passwordResetSet(
  passwordResetToken: string,
  newPassword: string
) {
  return request({
    method: "PUT",
    url: "/admins/auth/password-reset",
    data: {
      passwordResetToken,
      newPassword,
    },
  });
}

export function getDashboard() {
  return request({
    method: "GET",
    url: "/admins/dashboard",
    needAuth: true,
  }).then(({ data }) => ({
    marketingBalance: data.marketingBalance,
    walletBalance: data.walletBalance,
    avatar: data.avatar,
    name: data.name,
    phoneNumber: data.name,
  }));
}

export function getUsers(search: string, page: number) {
  return request({
    method: "GET",
    url: "/admins/users",
    needAuth: true,
    params: {
      search,
      page,
    },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
    users: data.users,
  }));
}

export function newUser(data: {
  name: string;
  phoneNumber: string;
  password: string;
  walletBalance: number;
}) {
  return request({
    method: "POST",
    url: "/admins/users",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function getUser(userId: number) {
  return request({
    method: "GET",
    url: `/admins/users/id/${userId}`,
    needAuth: true,
  }).then(({ data }) => ({
    id: data.id,
    name: data.name,
    phoneNumber: data.phoneNumber,
    walletBalance: data.walletBalance,
  }));
}

export function updateUser(
  userId: number,
  data: {
    name: string;
    phoneNumber: string;
    password: string;
    walletBalance: number;
  }
) {
  return request({
    method: "PUT",
    url: `/admins/users/id/${userId}`,
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function deleteUser(userId: number) {
  return request({
    method: "DELETE",
    url: `/admins/users/id/${userId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function createUserAccessToken(userId: number) {
  return request({
    method: "POST",
    url: `/admins/users/id/${userId}/jwt`,
    needAuth: true,
  }).then(({ data }) => data.userToken.access);
}

export function getUserMarketing(userId: number) {
  return request({
    method: "GET",
    url: `/admins/users/id/${userId}/marketing`,
    needAuth: true,
  }).then(({ data }) => data);
}

export function getUserOrders(userId: number, search: string, page: number) {
  return request({
    method: "GET",
    url: `/admins/orders/user-id/${userId}`,
    needAuth: true,
    params: {
      search,
      page,
    },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
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

export function getUserAddresses(userId: number, page: number) {
  return request({
    method: "GET",
    url: `/admins/addresses/user-id/${userId}`,
    needAuth: true,
    params: {
      page,
    },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
    addresses: data.addresses as Address[],
  }));
}

export function getAddress(addressId: number) {
  return request({
    method: "GET",
    url: `/admins/addresses/id/${addressId}`,
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
  addressId: number,
  data: {
    label: string;
    recipientName: string;
    recipientPhoneNumber: string;
    recipientPostalCode: string;
    recipientDeliveryProvince: string;
    recipientDeliveryCity: string;
    recipientDeliveryAddress: string;
  }
) {
  return request({
    method: "PUT",
    url: `/admins/addresses/id/${addressId}`,
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function deleteAddress(addressId: number) {
  return request({
    method: "DELETE",
    url: `/admins/addresses/id/${addressId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function getOrders(search: string, page: number) {
  return request({
    method: "GET",
    url: "/admins/orders",
    needAuth: true,
    params: { search, page },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
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

export function getOrder(orderId: number) {
  return request({
    method: "GET",
    url: `/admins/orders/id/${orderId}`,
    needAuth: true,
  }).then(({ data }) => convert(orderConvertMap, data, "a2b") as Order);
}

export function cancelOrder(orderId: number, cancelReason: string) {
  return request({
    method: "PUT",
    url: `/admins/orders/id/${orderId}`,
    needAuth: true,
    data: {
      status: "canceled",
      cancelReason,
    },
  }).then(({ data }) => data.message);
}

export function confirmOrder(orderId: number) {
  return request({
    method: "PUT",
    url: `/admins/orders/id/${orderId}`,
    needAuth: true,
    data: {
      status: "preparing",
    },
  }).then(({ data }) => data.message);
}

export function markOrderSent(orderId: number, trackingNumber: string) {
  return request({
    method: "PUT",
    url: `/admins/orders/id/${orderId}`,
    needAuth: true,
    data: {
      status: "sent",
      trackingNumber,
    },
  }).then(({ data }) => data.message);
}

export function getDiscounts(search: string, page: number) {
  return request({
    method: "GET",
    url: "/admins/discounts",
    needAuth: true,
    params: {
      search,
      page,
    },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
    discounts: data.discounts.map((item: any) =>
      convert(discountConvertMap, item, "a2b")
    ) as Discount[],
  }));
}

export function newDiscount(data: {
  active: boolean;
  code: string;
  description: string;
  user: {
    id: number;
    name: string;
    phoneNumber: string;
  } | null;
  phoneNumber: string | null;
  discountType: DiscountType;
  discountValue: number;
  usageLimit: number | null;
  expireDate: Date | null;
}) {
  return request({
    method: "POST",
    url: "/admins/discounts",
    needAuth: true,
    data: convert(discountConvertMap, data, "b2a"),
  }).then(({ data }) => data.message);
}

export function getDiscount(discountId: number) {
  return request({
    method: "GET",
    url: `/admins/discounts/id/${discountId}`,
    needAuth: true,
  }).then(({ data }) => convert(discountConvertMap, data, "a2b") as Discount);
}

export function updateDiscount(
  discountId: number,
  data: {
    active: boolean;
    code: string;
    description: string;
    user: {
      id: number;
      name: string;
      phoneNumber: string;
    } | null;
    phoneNumber: string | null;
    discountType: DiscountType;
    discountValue: number;
    usageLimit: number | null;
    expireDate: Date | null;
  }
) {
  return request({
    method: "PUT",
    url: `/admins/discounts/id/${discountId}`,
    needAuth: true,
    data: convert(discountConvertMap, data, "b2a"),
  }).then(({ data }) => data.message);
}

export function deleteDiscount(discountId: number) {
  return request({
    method: "DELETE",
    url: `/admins/discounts/id/${discountId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function getCooperationRequests(search: string, page: number) {
  return request({
    method: "GET",
    url: "/admins/cooperations",
    needAuth: true,
    params: {
      search,
      page,
    },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
    cooperations: data.cooperations.map((item: any) =>
      convert(cooperationRequestConvertMap, item, "a2b")
    ) as CooperationRequest[],
  }));
}

export function updateCooperationRequest(
  cooperationRequestId: number,
  status: CooperationRequestStatus,
  description: string
) {
  return request({
    method: "PUT",
    url: `/admins/cooperations/id/${cooperationRequestId}`,
    needAuth: true,
    data: {
      status: {
        [CooperationRequestStatus.pending]: "pending",
        [CooperationRequestStatus.approved]: "approved",
        [CooperationRequestStatus.rejected]: "rejected",
      }[status],
      description,
    },
  }).then(({ data }) => data.message);
}

export function getFinancialRecords(
  search: string,
  page: number,
  status: FinancialRecordStatus | null
) {
  return request({
    method: "GET",
    url: "/admins/transactions",
    needAuth: true,
    params: {
      search,
      page,
      status: status
        ? {
            [FinancialRecordStatus.successful]: "successful",
            [FinancialRecordStatus.unsuccessful]: "unsuccessful",
          }[status]
        : "null",
    },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
    records: data.transactions.map((item: any) =>
      convert(financialRecordConvertMap, item, "a2b")
    ) as FinancialRecord[],
  }));
}

export function getFinancialRecord(financialRecordId: number) {
  return request({
    method: "GET",
    url: `/admins/transactions/id/${financialRecordId}`,
    needAuth: true,
  }).then(
    ({ data }) =>
      convert(financialRecordConvertMap, data, "a2b") as FinancialRecord
  );
}

export function updateFinancialRecord(
  financialRecordId: number,
  data: {
    userId: number;
    type: FinancialRecordType;
    amount: number;
    description: string;
  }
) {
  return request({
    method: "PUT",
    url: `/admins/transactions/id/${financialRecordId}`,
    needAuth: true,
    data: convert(financialRecordConvertMap, data, "b2a"),
  }).then(({ data }) => data.message);
}

export function deleteFinancialRecord(financialRecordId: number) {
  return request({
    method: "DELETE",
    url: `/admins/transactions/id/${financialRecordId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function getWithdrawalRequests(search: string, page: number) {
  return request({
    method: "GET",
    url: "/admins/withdrawals",
    needAuth: true,
    params: {
      search,
      page,
    },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
    withdrawals: data.withdrawals.map((item: any) =>
      convert(cooperationRequestConvertMap, item, "a2b")
    ) as WithdrawalRequest[],
  }));
}

export function doWithdrawalRequests(
  cooperationRequestId: number,
  trackingNumber: string
) {
  return request({
    method: "PUT",
    url: `/admins/cooperations/id/${cooperationRequestId}`,
    needAuth: true,
    data: {
      status: "done",
      trackingNumber,
    },
  }).then(({ data }) => data.message);
}

export function rejectWithdrawalRequests(
  cooperationRequestId: number,
  description: string
) {
  return request({
    method: "PUT",
    url: `/admins/cooperations/id/${cooperationRequestId}`,
    needAuth: true,
    data: {
      status: "rejected",
      description,
    },
  }).then(({ data }) => data.message);
}

export function getPrintTariffs() {
  return request({
    method: "GET",
    url: "/admins/tariffs/print",
    needAuth: true,
  }).then(({ data }) => data as PrintTariffs);
}

export function updatePrintPrice(data: PrintTariffs) {
  return request({
    method: "PUT",
    url: "/admins/tariffs/print",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function getBindingTariffs() {
  return request({
    method: "GET",
    url: "/admins/tariffs/binding",
    needAuth: true,
  }).then(({ data }) => data as BindingTariffs);
}

export function updateBindingTariffs(data: BindingTariffs) {
  return request({
    method: "PUT",
    url: "/admins/tariffs/binding",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function getDedicatedDiscountCodeReports(search: string, page: number) {
  return request({
    method: "GET",
    url: "/admins/marketings/discounts",
    needAuth: true,
    params: {
      search,
      page,
    },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
    reports: data.marketings.map((item: any) =>
      convert(dedicatedDiscountCodeReportConvertMap, item, "a2b")
    ) as DedicatedDiscountCodeReport[],
  }));
}

export function getDedicatedLinkReports(search: string, page: number) {
  return request({
    method: "GET",
    url: "/admins/marketings/referrals",
    needAuth: true,
    params: {
      search,
      page,
    },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
    reports: data.marketings.map((item: any) =>
      convert(dedicatedLinkReportConvertMap, item, "a2b")
    ) as DedicatedLinkReport[],
  }));
}

export function getCustomerReports(search: string, page: number) {
  return request({
    method: "GET",
    url: "/admins/customers-report",
    needAuth: true,
    params: {
      search,
      page,
    },
  }).then(({ data }) => ({
    countOfItems: data.totalCount,
    reports: data.customersReport.map((item: any) =>
      convert(customerReportConvertMap, item, "a2b")
    ) as CustomerReport[],
  }));
}

export function getCustomerReportsExcel(search: string) {
  return request({
    method: "POST",
    url: "/admins/customers-report/excel",
    needAuth: true,
    params: {
      search,
    },
  }).then(({ data }) => data.url);
}

export function getProfile() {
  return request({
    method: "GET",
    url: "/admins/profile",
    needAuth: true,
  }).then(({ data }) => ({
    marketingBalance: data.marketingBalance,
    walletBalance: data.walletBalance,
    avatar: data.avatar,
    name: data.name,
    phoneNumber: data.phoneNumber,
    role: data.role,
  }));
}

export function updateProfile(name: string, password: string) {
  return request({
    method: "PUT",
    url: "/admins/profile",
    needAuth: true,
    data: {
      name,
      password,
    },
  }).then(({ data }) => data.message);
}
