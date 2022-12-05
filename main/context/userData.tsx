import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { getIsLoggedIn } from "@/main/api";
import { DataLoaderState, useDataLoader } from "@/shared/components/DataLoader";

export interface UserData {
  avatar: string;
  name: string;
  phoneNumber: string;
}

const UserDataContext = createContext<{
  loaderState: DataLoaderState;
  value: UserData | null;
  isLoggedIn: boolean;
}>({
  loaderState: { isLoading: true, isError: false, reload: () => {} },
  value: null,
  isLoggedIn: false,
});

export function UserDataProvider({ children }: PropsWithChildren<{}>) {
  const [value, setValue] = useState<UserData | null>(null);
  const loaderState = useDataLoader({
    load: () => getIsLoggedIn(),
    setData: setValue,
  });

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "");
      if (userData) setValue(userData);
    } catch {}
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        loaderState,
        value,
        isLoggedIn: value !== null,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserDataContext);
}
