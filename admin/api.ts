import { orderConvertMap } from "@/main/convertMaps";
import {
  PostCategory,
  BindingTariffs,
  PrintTariffs,
  Order,
} from "@/shared/types";
import { convert } from "@/shared/utils/convert";
import axios, { AxiosRequestConfig } from "axios";
import Router from "next/router";

export function getAccessToken() {
  return localStorage.getItem("adminAccessToken");
}

export function setAccessToken(token: string) {
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

export async function request({
  needAuth,
  redirectIfNotLogin = true,
  ...config
}: requestConfig) {
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
      .catch((error) => {
        if (axios.isCancel(error)) {
          reject("لغو شده");
        }
        const { response, message } = error;
        if (message === "Network Error") {
          reject("خطای شبکه");
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
}

export function isLoggedIn() {
  return request({
    method: "GET",
    url: "/admins/profile",
    needAuth: true,
    redirectIfNotLogin: false,
  })
    .then(() => true)
    .catch((message) => {
      if (message === "لطفا دوباره وارد شوید") return false;
      throw message;
    });
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
  }).then(({ data }) => data);
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
    totalCount: data.totalCount,
    pageSize: data.pageSize,
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

export function getUserOrders(userId: number, page: number) {
  return request({
    method: "GET",
    url: `/admins/orders/user-id/${userId}`,
    needAuth: true,
    params: {
      page,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    user: {
      id: data.user.id,
      name: data.user.name,
      phoneNumber: data.user.phoneNumber,
    },
    orders: data.orders.map((item: any) =>
      convert(orderConvertMap, item, "a2b")
    ),
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
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    user: {
      id: data.user.id,
      name: data.user.name,
      phoneNumber: data.user.phoneNumber,
    },
    addresses: data.addresses,
  }));
}

export function getAddress(addressId: number) {
  return request({
    method: "GET",
    url: `/admins/addresses/id/${addressId}`,
    needAuth: true,
  }).then(({ data }) => data);
}

export function updateAddress(
  addressId: number,
  data: {
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

export function getAdmins(search: string, page: number) {
  return request({
    method: "GET",
    url: "/admins",
    needAuth: true,
    params: {
      search,
      page,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    admins: data.admins,
  }));
}

export function newAdmin(data: {
  name: string;
  phoneNumber: string;
  password: string;
}) {
  return request({
    method: "POST",
    url: "/admins",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function getAdmin(adminId: number) {
  return request({
    method: "GET",
    url: `/admins/id/${adminId}`,
    needAuth: true,
  }).then(({ data }) => ({
    id: data.id,
    name: data.name,
    phoneNumber: data.phoneNumber,
  }));
}

export function updateAdmin(
  adminId: number,
  data: {
    name: string;
    phoneNumber: string;
    password: string;
  }
) {
  return request({
    method: "PUT",
    url: `/admins/id/${adminId}`,
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function deleteAdmin(adminId: number) {
  return request({
    method: "DELETE",
    url: `/admins/id/${adminId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function getOrders(
  search: string,
  page: number,
  status: "canceled" | "pending" | "preparing" | "sent" | null
) {
  return request({
    method: "GET",
    url: "/admins/orders",
    needAuth: true,
    params: { search, page, status: status !== null ? status : undefined },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    orders: data.orders.map(
      (item: any) => convert(orderConvertMap, item, "a2b") as Order
    ),
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
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    discounts: data.discounts,
  }));
}

export function newDiscount(data: {
  active: boolean;
  code: string;
  description: string;
  userId: number | null;
  phoneNumber: string | null;
  type: "fixed" | "percentage" | "page";
  value: number;
  usageLimit: number | null;
  expireAt: string | null;
}) {
  return request({
    method: "POST",
    url: "/admins/discounts",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function getDiscount(discountId: number) {
  return request({
    method: "GET",
    url: `/admins/discounts/id/${discountId}`,
    needAuth: true,
  }).then(({ data }) => data);
}

export function updateDiscount(
  discountId: number,
  data: {
    active: boolean;
    code: string;
    description: string;
    userId: number | null;
    phoneNumber: string | null;
    type: "fixed" | "percentage" | "page";
    value: number;
    usageLimit: number | null;
    expireAt: string | null;
  }
) {
  return request({
    method: "PUT",
    url: `/admins/discounts/id/${discountId}`,
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function deleteDiscount(discountId: number) {
  return request({
    method: "DELETE",
    url: `/admins/discounts/id/${discountId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function getCooperationRequests(
  search: string,
  page: number,
  status: "approved" | "rejected" | "pending"
) {
  return request({
    method: "GET",
    url: "/admins/cooperations",
    needAuth: true,
    params: {
      search,
      page,
      status,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    cooperations: data.cooperations,
  }));
}

export function updateCooperationRequest(
  cooperationRequestId: number,
  status: "approved" | "rejected" | "pending",
  description: string
) {
  return request({
    method: "PUT",
    url: `/admins/cooperations/id/${cooperationRequestId}`,
    needAuth: true,
    data: {
      status,
      description,
    },
  }).then(({ data }) => data.message);
}

export function getFinancialRecords(
  search: string,
  startAt: string | null,
  endAt: string | null,
  paymentStatus: "successful" | "unsuccessful" | null,
  page: number
) {
  return request({
    method: "GET",
    url: "/admins/transactions",
    needAuth: true,
    params: {
      search,
      startAt: startAt || undefined,
      endAt: endAt || undefined,
      status: paymentStatus || undefined,
      page,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    records: data.transactions,
  }));
}

export function newFinancialRecord(data: {
  userId: number;
  type: "debtor" | "creditor";
  amount: number;
  description: string;
}) {
  return request({
    method: "POST",
    url: "/admins/transactions",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function getFinancialRecord(financialRecordId: number) {
  return request({
    method: "GET",
    url: `/admins/transactions/id/${financialRecordId}`,
    needAuth: true,
  }).then(({ data }) => data);
}

export function updateFinancialRecord(
  financialRecordId: number,
  data: {
    userId: number;
    type: "debtor" | "creditor";
    amount: number;
    description: string;
  }
) {
  return request({
    method: "PUT",
    url: `/admins/transactions/id/${financialRecordId}`,
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function deleteFinancialRecord(financialRecordId: number) {
  return request({
    method: "DELETE",
    url: `/admins/transactions/id/${financialRecordId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function getWithdrawalRequests(
  search: string,
  page: number,
  status: "pending" | "rejected" | "done"
) {
  return request({
    method: "GET",
    url: "/admins/withdrawals",
    needAuth: true,
    params: {
      search,
      page,
      status,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    withdrawals: data.withdrawals,
  }));
}

export function doWithdrawalRequests(
  cooperationRequestId: number,
  trackingNumber: string
) {
  return request({
    method: "PUT",
    url: `/admins/withdrawals/id/${cooperationRequestId}`,
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
    url: `/admins/withdrawals/id/${cooperationRequestId}`,
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
  }).then(({ data }) => data);
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
  }).then(({ data }) => data);
}

export function updateBindingTariffs(data: BindingTariffs) {
  return request({
    method: "PUT",
    url: "/admins/tariffs/binding",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function getBlogPosts(search: string, page: number) {
  return request({
    method: "GET",
    url: "/admins/blogs",
    needAuth: true,
    params: {
      search,
      page,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    posts: data.blogs,
  }));
}

export function getBlogPost(postId: number) {
  return request({
    method: "GET",
    url: `/admins/blogs/id/${postId}`,
    needAuth: true,
  }).then(({ data }) => data);
}

export function newBlogPost(data: {
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
}) {
  return request({
    method: "POST",
    url: "/admins/blogs",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function updateBlogPost(
  postId: number,
  data: {
    slug: string;
    pageTitle: string;
    title: string;
    categories: { id: number; name: string }[];
    keywords: string;
    metaDescription: string;
    thumbnailUrl: string | null;
    thumbnailAlt: string | null;
    display: boolean;
    body: string;
  }
) {
  return request({
    method: "PUT",
    url: `/admins/blogs/id/${postId}`,
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function deleteBlogPost(postId: number) {
  return request({
    method: "DELETE",
    url: `/admins/blogs/id/${postId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function getBlogCategories(page: number) {
  return request({
    method: "GET",
    url: "/admins/blogs/categories",
    needAuth: true,
    params: {
      page,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    categories: data.categories as PostCategory[],
  }));
}

export function newBlogCategory(data: { name: string }) {
  return request({
    method: "POST",
    url: "/admins/blogs/categories",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function deleteBlogCategory(categoryId: number) {
  return request({
    method: "DELETE",
    url: `/admins/blogs/categories/id/${categoryId}`,
    needAuth: true,
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
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    reports: data.marketings,
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
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    reports: data.marketings,
  }));
}

export function getCustomerReports(
  search: string,
  paperSize: "a4" | "a5" | "a3" | null,
  paperColor: "blackAndWhite" | "fullColor" | "normalColor" | null,
  paperSide: "singleSided" | "doubleSided" | null,
  sortOrder:
    | "withoutOrder"
    | "oneOrder"
    | "twoOrder"
    | "threeAndMoreOrder"
    | "mostToLowestOrder"
    | "lowestToMostOrder"
    | "mostToLowestBalance"
    | "lowestToMostBalance"
    | "mostToLowestPayment"
    | "lowestToMostPayment",
  page: number
) {
  return request({
    method: "GET",
    url: "/admins/customers-report",
    needAuth: true,
    params: {
      search,
      paperSize: paperSize !== null ? paperSize : undefined,
      paperColor:
        paperColor !== null
          ? {
              blackAndWhite: "black_and_white",
              fullColor: "full_color",
              normalColor: "normal_color",
            }[paperColor]
          : undefined,
      paperSide:
        paperSide !== null
          ? {
              singleSided: "single_sided",
              doubleSided: "double_sided",
            }[paperSide]
          : undefined,
      sortOrder: {
        withoutOrder: "without_order",
        oneOrder: "one_order",
        twoOrder: "two_order",
        threeAndMoreOrder: "three_and_more_order",
        mostToLowestOrder: "most_to_lowest_order",
        lowestToMostOrder: "lowest_to_most_order",
        mostToLowestBalance: "most_to_lowest_balance",
        lowestToMostBalance: "lowest_to_most_balance",
        mostToLowestPayment: "most_to_lowest_payment",
        lowestToMostPayment: "lowest_to_most_payment",
      }[sortOrder],
      page,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    totalCreditor: data.totalCreditor,
    totalDebtor: data.totalDebtor,
    totalOrdersCount: data.totalOrdersCount,
    reports: data.customersReport,
  }));
}

export function getCustomerReportsExcel(
  search: string,
  paperSize: "a4" | "a5" | "a3" | null,
  paperColor: "blackAndWhite" | "fullColor" | "normalColor" | null,
  paperSide: "singleSided" | "doubleSided" | null,
  sortOrder:
    | "withoutOrder"
    | "oneOrder"
    | "twoOrder"
    | "threeAndMoreOrder"
    | "mostToLowestOrder"
    | "lowestToMostOrder"
    | "mostToLowestBalance"
    | "lowestToMostBalance"
    | "mostToLowestPayment"
    | "lowestToMostPayment"
) {
  return request({
    method: "POST",
    url: "/admins/customers-report/excel",
    needAuth: true,
    params: {
      search,
      paperSize: paperSize !== null ? paperSize : undefined,
      paperColor:
        paperColor !== null
          ? {
              blackAndWhite: "black_and_white",
              fullColor: "full_color",
              normalColor: "normal_color",
            }[paperColor]
          : undefined,
      paperSide:
        paperSide !== null
          ? {
              singleSided: "single_sided",
              doubleSided: "double_sided",
            }[paperSide]
          : undefined,
      sortOrder: {
        withoutOrder: "without_order",
        oneOrder: "one_order",
        twoOrder: "two_order",
        threeAndMoreOrder: "three_and_more_order",
        mostToLowestOrder: "most_to_lowest_order",
        lowestToMostOrder: "lowest_to_most_order",
        mostToLowestBalance: "most_to_lowest_balance",
        lowestToMostBalance: "lowest_to_most_balance",
        mostToLowestPayment: "most_to_lowest_payment",
        lowestToMostPayment: "lowest_to_most_payment",
      }[sortOrder],
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

export function updateProfile(data: {
  phoneNumber: string;
  name: string;
  password: string;
}) {
  return request({
    method: "PUT",
    url: "/admins/profile",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}
