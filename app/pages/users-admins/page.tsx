/* Users and Admins Page */

"use client";
import { Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { UsersRowInterface } from "@/app/DTOs/DTOs";
import api from "@/app/api/api/api";
import { t } from "i18next";
import moment from "Moment";
import ErrorSnackBar from "@/app/components/Notify/Error-Snackbar/ErrorSnackbar";
import Loading from "@/app/components/Notify/Loading/loading";
import SuccessSnackBar from "@/app/components/Notify/Success-Snackbar/successSnackbar";
import withAuthUser from "@/app/withAuth/withAuthUser";
import Cookies from "js-cookie";

const UsersAdmins = () => {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(20);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([]);

  /* Users Rows */
  const rows: Array<any> = users.map(
    (user: UsersRowInterface, index: number) => {
      return {
        id: index + 1,
        privillege: user.role,
        username: user.username,
        userID: user._id, //hidden , only for send to props
        email: user.email,
        dateCreated: moment(user.createdAt).format("DD/MM/YYYY"),
        assignedTasks: user.assignedTasks,
        status: user.status,
      };
    }
  );

  /* Users Columns */
  const columns: Array<any> = [
    { field: "id", headerName: `${t("users.id")}`, width: 50 },
    { field: "privillege", headerName: `${t("users.privillege")}`, width: 100 },
    { field: "username", headerName: `${t("users.username")}`, width: 120 },
    { field: "email", headerName: `${t("users.email")}`, width: 150 },
    {
      field: "dateCreated",
      headerName: `${t("users.date-created")}`,
      width: 150,
    },
    {
      field: "assignedTasks",
      headerName: `${t("users.assigned-tasks")}`,
      width: 120,
    },
    { field: "status", headerName: `${t("users.status")}`, width: 120 },
  ];

  /* GET All Users */
  async function getUsers() {
    setShowLoading(true);
    try {
      const response = await api.get("/auth/users", {
        onDownloadProgress: () => {
          setLoadingProgress(100);
        },
      });
      const usersData = response.data.users;
      setUsers(usersData);
      setTimeout(() => {
        setShowLoading(false);
        setLoadingProgress(20);
      }, 1000);
      setSuccessMessage(`${t("users.get-users-success")}`);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage("");
      }, 3000);
    } catch (error: any) {
      setTimeout(() => {
        setShowLoading(false);
        setLoadingProgress(20);
      }, 1000);
      setShowError(true);
      setErrorMessage(error.response.data.message);
      setTimeout(() => {
        setShowError(false);
        if (
          error.response.data.message === "jwt expired" ||
          error.response.data.message === "jwt must be provided" ||
          error.response.data.message === "jwt malformed" ||
          error.response.data.message === "Not Authenticated.."
        ) {
          router.push("/pages/auth/login-admin");
          Cookies.remove("Token");
        }
      }, 3000);
    }
  }
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Grid
      container
      direction={"column"}
      bgcolor={"ButtonHighlight"}
      padding={2}
      borderRadius={8}
    >
      {/* Show Loading Animation Bar */}
      {showLoading && (
        <Grid item xs={1}>
          <Loading progress={loadingProgress} />
        </Grid>
      )}

      {/* Container */}
      <Grid container direction={"column"} item xs={11} padding={1} spacing={3}>
        {/* Users Table */}
        <Grid container item xs={8}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Grid>
      </Grid>

      {/* Show Success */}
      {showSuccess && <SuccessSnackBar message={SuccessMessage} />}

      {/* Show Error */}
      {showError && <ErrorSnackBar message={ErrorMessage} />}
    </Grid>
  );
};

export default withAuthUser(UsersAdmins);
