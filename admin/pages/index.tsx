import { useRouter } from "next/router";
import { getIsLoggedIn } from "@/admin/api";
import DataLoader from "@/shared/components/DataLoader";

export default function Home() {
  const router = useRouter();

  return (
    <DataLoader
      load={() => getIsLoggedIn()}
      setData={(isLoggedIn) =>
        router.replace(isLoggedIn ? "/dashboard" : "/login")
      }
    />
  );
}
