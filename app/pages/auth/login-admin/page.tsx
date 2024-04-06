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
  Typography,
} from "@mui/material";
import * as React from "react";
import "../auth.scss";
import Image from "next/image";
import LoginImage from "../../../../public/images/login.jpg";
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

const LoginAdmin = () => {
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
  const [showEmailHint, setShowEmailHint] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const loginData: loginDataInterface = {
    email: email,
    password: password,
    role: "admin",
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
      Cookies.set("role", "admin");
      Cookies.remove("userId");
      setEmail("");
      setPassword("");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/pages/tasks");
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

  /* Handle Routing */
  const goToUserLoginPage = () => {
    router.push("/pages/auth/login-user");
  };
  const goToRegisterPage = () => {
    router.push("/pages/auth/register-user");
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
            className="login-image"
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
            margin={2}
          >
            <Image src={TasksIcon} alt="TasksIcon" width={50} />
            <h2 style={{ marginTop: "20px" }}>{t("login.admin-login")}</h2>
          </Grid>

          {/* Login Form */}
          <Grid
            item
            xs={4}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            className="login-content"
          >
            <form onSubmit={handleSubmit(sendLoginData)}>
              {/* Email Field */}
              <FormControl
                className="login-form-control"
                sx={{ width: "100%" }}
                fullWidth
              >
                <TextField
                  variant="standard"
                  type="email"
                  label={t("login.email")}
                  onFocus={() => setShowEmailHint(true)}
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
                {showEmailHint && (
                  <div style={{ color: "green", fontSize: "13px" }}>
                    <p>Email is : feras@admin.com</p>
                  </div>
                )}
              </FormControl>
              <br />

              {/* Password Field */}
              <FormControl fullWidth className="login-form-control">
                <TextField
                  variant="standard"
                  label={t("login.password")}
                  onFocus={() => setShowPasswordHint(true)}
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
                {showPasswordHint && (
                  <div style={{ color: "green", fontSize: "13px" }}>
                    <p>Password is : 12345</p>
                  </div>
                )}
              </FormControl>
              <br />

              {/* Login Button */}
              <FormControl fullWidth className="login-form-control">
                <Button type="submit" color="secondary" variant="contained">
                  {t("login.login-button")}
                </Button>
              </FormControl>
            </form>
          </Grid>

          {/* Pages Links */}
          <Grid
            item
            xs={4}
            display={"flex"}
            flexDirection={"column"}
            margin={2}
          >
            <a onClick={goToUserLoginPage}>{t("login.user-link")}</a>
            <br />
            <a onClick={goToRegisterPage}>{t("login.register-link")}</a>
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

export default LoginAdmin;
