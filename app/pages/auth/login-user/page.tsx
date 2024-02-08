/* Login Page */

"use client";
import {
  FormControl,
  Button,
  InputAdornment,
  IconButton,
  TextField,
  Grid,
  Link,
} from "@mui/material";
import * as React from "react";
import Image from "next/image";
import LoginImage from "../../../../public/images/login.png";
import TasksIcon from "../../../icon.ico";
import SuccessSnackBar from "@/app/components/Notify/Success-Snackbar/successSnackbar";
import ErrorSnackBar from "@/app/components/Notify/Error-Snackbar/ErrorSnackbar";
import Loading from "@/app/components/Notify/Loading/loading";
import BoxMediaQuery from "@/app/MediaQuerys/BoxMedia";
import { loginDataInterface } from "@/app/DTOs/DTOs";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/app/api/api/api";
import { t } from "i18next";
import Cookies from "js-cookie";

const LoginUser = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(20);
  const [ErrorMessage, setErrorMessage] = useState("");

  const loginData: loginDataInterface = {
    email: email,
    password: password,
    role: "user",
  };

  /* POST Proccess */
  /* save Token in Cookies then navigate to Tasks Page */
  const sendLoginData = async () => {
    try {
      setShowLoading(true);
      const response = await api.post("/auth/login", loginData, {
        onUploadProgress: (progressEvent: any) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setLoadingProgress(percentCompleted);
        },
      });
      setShowLoading(false);
      setLoadingProgress(20);
      Cookies.set("Token", response.data.token);
      Cookies.set("role", "user");
      Cookies.set("userId", response.data.userId);
      setEmail("");
      setPassword("");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/pages/tasks-user");
      }, 3000);
    } catch (error: any) {
      setShowLoading(false);
      setLoadingProgress(20);
      setPassword("");
      setErrorMessage(error.response?.data.message);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  return (
    /* All Page Container */
    <Grid container direction={"column"}>
      {/* Show Loading Animation Bar */}
      {showLoading && (
        <Grid item xs={1}>
          <Loading progress={loadingProgress} />
        </Grid>
      )}

      {/* All Page Container without Loading */}
      <Grid
        item
        xs={11}
        container
        direction={BoxMediaQuery() ? "column" : "row"}
        display={"flex"}
        justifyContent={"center"}
      >
        {/* Login Image */}
        <Grid
          item
          xs={6}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Image
            src={LoginImage}
            priority={true}
            style={
              BoxMediaQuery()
                ? { width: "50%", height: "100vh" }
                : { width: "80%", height: "100vh" }
            }
            alt="Login Image"
          />
        </Grid>

        {/* Login Box */}
        <Grid
          item
          xs={6}
          container
          direction={"column"}
          bgcolor={"ButtonFace"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          flexWrap={"nowrap"}
        >
          {/* Tasks Logo and Heading */}
          <Grid
            item
            xs={4}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Image src={TasksIcon} alt="TasksIcon" width={50} />
            <h2 style={{ marginTop: "20px" }}>{t("login.user-login")}</h2>
          </Grid>

          {/* Login Form */}
          <Grid
            item
            xs={4}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
          >
            <form onSubmit={handleSubmit(sendLoginData)}>
              <FormControl
                sx={BoxMediaQuery() ? { width: "150px" } : { width: "300px" }}
              >
                {/* Email Field */}
                <FormControl>
                  <TextField
                    variant="standard"
                    type="email"
                    label={t("login.email")}
                    value={email}
                    {...register("email", { required: true })}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  {errors.email && !email && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {t("validation.email")}
                    </p>
                  )}
                </FormControl>
                <br />

                {/* Password Field */}
                <FormControl>
                  <TextField
                    variant="standard"
                    label={t("login.password")}
                    value={password}
                    {...register("password", { required: true })}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    /* endAdornment has Eye icon to show or hide password */
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                          >
                            {password ? (
                              showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )
                            ) : null}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.password && !password && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {t("validation.password")}
                    </p>
                  )}
                </FormControl>
                <br />

                {/* Login Button */}
                <FormControl>
                  <Button type="submit" color="secondary" variant="contained">
                    {t("login.login-button")}
                  </Button>
                </FormControl>
              </FormControl>
            </form>
          </Grid>

          {/* Pages Links */}
          <Grid item xs={4} display={"flex"} flexDirection={"column"}>
            <Link href="/pages/auth/login-admin">{t("login.admin-link")}</Link>
            <br />
            <Link href="/pages/auth/register-user">
              {t("login.register-link")}
            </Link>
          </Grid>
        </Grid>

        {/* Check to show Success and Error Snackbar */}
        {showSuccess && (
          <SuccessSnackBar message={t("login.get-login-success")} />
        )}
        {showError && <ErrorSnackBar message={ErrorMessage} />}
      </Grid>
    </Grid>
  );
};

export default LoginUser;
