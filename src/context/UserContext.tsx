"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie"
import { IUserSession, ILoginData } from "@/interfaces/ILogin";
import { useRouter } from "next/navigation";
import fetchLogin from "@/app/api/LoginAPI";


interface UserContextType {
  userSession: IUserSession | null;
  isLoggedIn: boolean;
  initializeUserSession: () => void;
  handleLogout: () => Promise<void>;
  handleLogin: (loginData: ILoginData) => Promise<void>;

}

export const UserContext = createContext<UserContextType>({
  userSession: null,
  isLoggedIn: false,
  initializeUserSession: () => {},
  handleLogout: async () => {},
  handleLogin: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userSession, setUserSession] = useState<IUserSession | null>(null);
  const router = useRouter();

  /*const initializeUserSession = () => {
    const dataCookie = Cookies.get("loginData");
    if (dataCookie) {
      const parsedData = JSON.parse(dataCookie);
      setUserSession(parsedData);
    } else {
      setUserSession(null);
    }
  };*/

  const initializeUserSession = () => {

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Decodificar token si es necesario (por ejemplo, para obtener información del usuario)
      const userPayload = JSON.parse(atob(token.split(".")[1])); // Decodifica el payload del JWT

      const userSessionData = {
        token,
        user: userPayload, // Asegúrate de que el payload contenga información relevante del usuario
      };

      // Guardar en cookies y estado
      Cookies.set("loginData", JSON.stringify(userSessionData), { expires: 7 });
      setUserSession(userSessionData.user);

      // Limpiar la query string
      window.history.replaceState({}, document.title, "/");
    } else {
      // Manejar sesión existente desde cookies
      const dataCookie = Cookies.get("loginData");
      if (dataCookie) {
        const parsedData = JSON.parse(dataCookie);
        setUserSession(parsedData.user);
      } else {
        setUserSession(null);
      }
    }
  };



  const handleLogout = async () => {
    Cookies.remove("loginData");
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleLogin = async (loginData: ILoginData) => {
    const user = await fetchLogin(loginData);
    if (user) {
      Cookies.set("loginData", JSON.stringify(user), { expires: 7 });
      setUserSession(user);
      router.push("/");
    } 
  };


  useEffect(() => {
    initializeUserSession();
  }, []);

  const value = {
    userSession,
    isLoggedIn: !!userSession,
    initializeUserSession,
    handleLogout,
    handleLogin,

  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
