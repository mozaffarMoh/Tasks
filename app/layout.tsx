/* Index Page */

"use client";
import "./styles/globals.css";
import Appbar from "./components/Appbar/Appbar";
import Footer from "./components/Footer/footer";
import { Box, Container } from "@mui/material";
import { redirect, useRouter, usePathname } from "next/navigation";
import { NextFont } from "next/dist/compiled/@next/font";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useEffect } from "react";
import Cookies from "js-cookie";

function RootLayout(props: React.PropsWithChildren) {
  /* check if showAppbar equal true then Appbar will be shown ,if false hide Appbar  */
  const token: any = Cookies.get("Token");
  const pathName = usePathname();
  const showAppbar = !(
    pathName === "/pages/auth/login-admin" ||
    pathName === "/pages/auth/login-user" ||
    pathName === "/pages/auth/register-user"
  )
    ? true
    : false;

  /* Change head title Dynamically based on pathName */
  useEffect(() => {
    if (pathName === "/") {
      document.title = "TASKS";
    } else if (pathName === "/pages/auth/login-admin") {
      document.title = "TASKS | Admin Login";
    } else if (pathName === "/pages/auth/login-user") {
      document.title = "TASKS | User Login";
    } else if (pathName === "/pages/auth/register-user") {
      document.title = "TASKS | Register New User";
    } else if (pathName === "/pages/tasks") {
      document.title = "TASKS | All-Tasks";
    } else if (pathName === "/pages/users") {
      document.title = "TASKS | All-Users";
    } else if (pathName === "/pages/tasks-user") {
      document.title = "TASKS | User-Tasks";
    } else if (pathName === "/pages/users-admins") {
      document.title = "TASKS | All (Users/Admins)";
    } else {
      document.title = "TASKS | PAGE NOT FOUND";
    }
  }, [pathName]);

  useEffect(() => {
    if (showAppbar) {
      if (token === "undefined") {
        redirect("/pages/auth/login-user");
      }
    }
  }, [token]);

  return (
    <html lang="en">
      <body>
        {/*     <I18nextProvider i18n={i18n}>
          {showAppbar ? (
            <Box>
              {token && <Appbar />}
              <Container className="appContainer" maxWidth="lg">
                {props.children}
                {token && <Footer />}
              </Container>
            </Box>
          ) : ( */}
        <main>{props.children}</main>
        {/*  )}
        </I18nextProvider>  */}
      </body>
    </html>
  );
}

export default RootLayout;
