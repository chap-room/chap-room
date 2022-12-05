import { useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { request, setAccessToken } from "@/main/api";
import Loader from "@/shared/components/Loader";

export default function LoginByAcessToken() {
  const router = useRouter();
  const acessToken = router.query.accessToken as string;

  useEffect(() => {
    if (router.isReady) {
      setAccessToken(acessToken);
      request({
        method: "GET",
        url: "/users/profile",
        needAuth: true,
        nullIfNotLogin: false,
      })
        .then((responseBody) =>
          responseBody === null
            ? null
            : {
                marketingBalance: responseBody.data.marketingBalance,
                walletBalance: responseBody.data.walletBalance,
                avatar: responseBody.data.avatar,
                name: responseBody.data.name,
                phoneNumber: responseBody.data.phoneNumber,
              }
        )
        .then((userData) => {
          localStorage.setItem("userData", JSON.stringify(userData));
          if (userData) {
            router.replace("/dashboard");
          } else {
            router.replace("/login");
          }
        })
        .catch((message) => {
          toast.error(message);
          router.replace("/login");
        });
    }
  }, [router.isReady]);

  return <Loader />;
}
