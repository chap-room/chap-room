import { useRouter } from "next/router";
import { isLoggedIn } from "@/admin/api";
import DataLoader from "@/shared/components/DataLoader";

export default function Home() {
  const router = useRouter();

  return (
    <DataLoader
      load={() => isLoggedIn()}
      setData={(result) => router.replace(result ? "/dashboard" : "/login")}
    />
  );
}
