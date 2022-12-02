import {
  BindingOptions,
  Order,
  Post,
  PrintFile,
  PrintFolder,
  Tariffs,
} from "@/shared/types";
import axios, { AxiosRequestConfig } from "axios";
import Router from "next/router";
import { convert } from "@/shared/utils/convert";
import { orderConvertMap, printFoldersConvertMap } from "@/main/convertMaps";

export function getAccessToken() {
  return localStorage.getItem("userAccessToken");
}

export function setAccessToken(token: string) {
  localStorage.setItem("userAccessToken", token);
}

export function logout() {
  localStorage.removeItem("userAccessToken");
  localStorage.removeItem("userData");
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

export function cancelableRequest<DT>(
  request: (signal: AbortSignal) => Promise<DT>
): [Promise<DT | null>, AbortController] {
  const abortController = new AbortController();
  return [
    request(abortController.signal).catch((message) => {
      if (message === "لغو شده") return null;
      throw message;
    }),
    abortController,
  ];
}

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

export function getTariffs() {
  return request({
    method: "GET",
    url: "/public/tariffs",
  }).then(({ data }) => data as Tariffs);
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

export function getBlogPosts(page: number, blogType?: "popular") {
  return cancelableRequest((signal) =>
    request({
      method: "GET",
      url: "/public/blogs",
      params: {
        page,
        blogType,
      },
      signal,
    }).then(({ data }) => ({
      totalCount: data.totalCount,
      pageSize: data.pageSize,
      posts: data.blogs as Post[],
    }))
  );
}

export function getBlogPost(slug: string) {
  return request({
    method: "GET",
    url: `/public/blogs/slug/${slug}`,
  }).then(({ data }) => data);
}

export function getBlogCategories() {
  return request({
    method: "GET",
    url: "/public/blogs/categories",
  }).then(({ data }) => data);
}

export function getBlogPostsByCategory(categoryId: number, page: number) {
  return request({
    method: "GET",
    url: `/public/blogs/category-id/${categoryId}`,
    params: {
      page,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    posts: data.blogs,
  }));
}

export function login(phoneNumber: string, password: string) {
  return request({
    method: "POST",
    url: "/users/auth/login",
    data: {
      phoneNumber,
      password,
    },
  })
    .then(({ data }) => ({
      marketingBalance: data.marketingBalance,
      walletBalance: data.walletBalance,
      avatar: data.avatar,
      name: data.name,
      phoneNumber: data.phoneNumber,
    }))
    .then((userData) => {
      localStorage.setItem("userData", JSON.stringify(userData));
      return userData;
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
  })
    .then(({ data }) => ({
      marketingBalance: data.marketingBalance,
      walletBalance: data.walletBalance,
      avatar: data.avatar,
      name: data.name,
      phoneNumber: data.phoneNumber,
    }))
    .then((userData) => {
      localStorage.setItem("userData", JSON.stringify(userData));
      return userData;
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

export function passwordResetSet(
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
  })
    .then(({ data }) => ({
      tariffs: data.tariffs,
      marketingBalance: data.marketingBalance,
      walletBalance: data.walletBalance,
      avatar: data.avatar,
      name: data.name,
      phoneNumber: data.phoneNumber,
      inProgressOrders: data.inProgressOrders.map(
        (item: any) => convert(orderConvertMap, item, "a2b") as Order
      ),
    }))
    .then((dashboardData) => {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          marketingBalance: dashboardData.marketingBalance,
          walletBalance: dashboardData.walletBalance,
          avatar: dashboardData.avatar,
          name: dashboardData.name,
          phoneNumber: dashboardData.phoneNumber,
        })
      );
      return dashboardData;
    });
}

export function getOrders(page: number) {
  return request({
    method: "GET",
    url: "/users/orders",
    needAuth: true,
    params: {
      page,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    orders: data.orders.map((item: any) =>
      convert(orderConvertMap, item, "a2b")
    ),
  }));
}

export function getOrder(orderId: number) {
  return request({
    method: "GET",
    url: `/users/orders/id/${orderId}`,
    needAuth: true,
  }).then(({ data }) => convert(orderConvertMap, data, "a2b") as Order);
}

export function cancelOrder(orderId: number) {
  return request({
    method: "PUT",
    url: `/users/orders/id/${orderId}/cancel`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function uploadPrintFile(
  file: File,
  setProgress: (progress: number) => void
) {
  let data = new FormData();
  data.append("attachment", file);
  data.append("fileName", file.name);

  return cancelableRequest((signal) =>
    request({
      method: "POST",
      url: "/users/files",
      needAuth: true,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent) {
        setProgress(progressEvent.progress || 0);
      },
      signal,
    }).then(({ data }) => ({
      message: data.message,
      fileId: data.id,
      countOfPages: data.countOfPages,
    }))
  );
}

export function deletePrintFile(printFileId: number) {
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

export function getPrintFolder(printFolderId: number) {
  return request({
    method: "GET",
    url: `/users/folders/id/${printFolderId}`,
    needAuth: true,
  }).then(
    ({ data }) => convert(printFoldersConvertMap, data, "a2b") as PrintFolder
  );
}

export function newPrintFolder(data: {
  printColor: "blackAndWhite" | "normalColor" | "fullColor";
  printSize: "a4" | "a5" | "a3";
  printSide: "singleSided" | "doubleSided";
  countOfPages: number;
  bindingOptions: BindingOptions | null;
  description: string | null;
  countOfCopies: number | null;
  filesManuallySent: boolean;
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
  printFolderId: number,
  data: {
    printColor: "blackAndWhite" | "normalColor" | "fullColor";
    printSize: "a4" | "a5" | "a3";
    printSide: "singleSided" | "doubleSided";
    countOfPages: number;
    bindingOptions: BindingOptions | null;
    description: string | null;
    countOfCopies: number | null;
    filesManuallySent: boolean;
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

export function calculatePrintFolderPrice(data: {
  printColor: "blackAndWhite" | "normalColor" | "fullColor";
  printSize: "a4" | "a5" | "a3";
  printSide: "singleSided" | "doubleSided";
  countOfPages: number;
  bindingOptions: BindingOptions | null;
  countOfCopies: number | null;
}) {
  return cancelableRequest((signal) =>
    request({
      method: "POST",
      url: "/users/folders/price-calculator",
      needAuth: true,
      data: convert(printFoldersConvertMap, data, "b2a"),
      signal,
    }).then(({ data }) => data.amount)
  );
}

export function deletePrintFolder(printFolderId: number) {
  return request({
    method: "DELETE",
    url: `/users/folders/id/${printFolderId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
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
  addressId: number,
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
    orderId: data.id,
  }));
}

export function getAddresses(page: number) {
  return request({
    method: "GET",
    url: "/users/addresses",
    needAuth: true,
    params: {
      page,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    addresses: data.addresses,
  }));
}

export function newAddress(data: {
  recipientName: string;
  recipientPhoneNumber: string;
  recipientPostalCode: string;
  recipientDeliveryProvince: string;
  recipientDeliveryCity: string;
  recipientDeliveryAddress: string;
}) {
  return request({
    method: "POST",
    url: "/users/addresses",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function getAddress(addressId: number) {
  return request({
    method: "GET",
    url: `/users/addresses/id/${addressId}`,
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
    url: `/users/addresses/id/${addressId}`,
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}

export function deleteAddress(addressId: number) {
  return request({
    method: "DELETE",
    url: `/users/addresses/id/${addressId}`,
    needAuth: true,
  }).then(({ data }) => data.message);
}

export function getTransactions(page: number) {
  return request({
    method: "GET",
    url: "/users/transactions",
    needAuth: true,
    params: {
      page,
    },
  }).then(({ data }) => ({
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    transactions: data.transactions,
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
  })
    .then(({ data }) => ({
      marketingBalance: data.marketingBalance,
      walletBalance: data.walletBalance,
      avatar: data.avatar,
      name: data.name,
      phoneNumber: data.phoneNumber,
    }))
    .then((userData) => {
      localStorage.setItem("userData", JSON.stringify(userData));
      return userData;
    });
}

export function isLoggedIn() {
  return request({
    method: "GET",
    url: "/users/profile",
    needAuth: true,
    redirectIfNotLogin: false,
  })
    .then(({ data }) => ({
      marketingBalance: data.marketingBalance,
      walletBalance: data.walletBalance,
      avatar: data.avatar,
      name: data.name,
      phoneNumber: data.phoneNumber,
    }))
    .catch((message) => {
      if (message === "لطفا دوباره وارد شوید") return null;
      throw message;
    })
    .then((userData) => {
      localStorage.setItem("userData", JSON.stringify(userData));
      return userData;
    });
}

export function updateProfile(data: { name: string; password: string }) {
  return request({
    method: "PUT",
    url: "/users/profile",
    needAuth: true,
    data,
  }).then(({ data }) => data.message);
}
