/* App Page */

"use client";
import { Box } from "@mui/system";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();
  let role = Cookies.get("role");
  let isAdmin: any = role === "admin";
  let isUser: any = role === "user";
  useEffect(() => {
    if (role) {
      if (isAdmin) {
        router.push("/pages/tasks");
      } else if (isUser) {
        router.push("/pages/tasks-user");
      }
    } else {
      router.push("/pages/auth/login-admin");
    }
  }, []);

  return <Box></Box>;
};

export default Home;
