/* Tasks Page */

"use client";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/app/api/api/api";
import { t } from "i18next";
import Image from "next/image";
import ErrorSnackBar from "@/app/components/Notify/Error-Snackbar/ErrorSnackbar";
import Loading from "@/app/components/Notify/Loading/loading";
import SuccessSnackBar from "@/app/components/Notify/Success-Snackbar/successSnackbar";
import withAuthUser from "@/app/withAuth/withAuthUser";
import Cookies from "js-cookie";

const TasksUser = () => {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(20);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [tasksInProgress, setTasksInProgress] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  /* Success process stages when request api */
  function successTry() {
    setTimeout(() => {
      setShowLoading(false);
      setLoadingProgress(20);
    }, 1000);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage("");
    }, 3000);
  }

  /* Catch error stages when request api */
  function catchError() {
    setTimeout(() => {
      setShowLoading(false);
      setLoadingProgress(20);
    }, 1000);
    setShowError(true);
  }

  /* GET All Tasks */
  async function getUsersTasks() {
    setShowLoading(true);

    /* In Progress Tasks */
    try {
      const responseInProgress = await api.get(
        `/tasks/user-tasks/${Cookies.get("userId")}`,
        {
          params: { status: "In-Progress" },
          onDownloadProgress: () => {
            setLoadingProgress(100);
          },
        }
      );
      const tasksInProgressData = responseInProgress.data.tasks;
      setTasksInProgress(tasksInProgressData);
      setSuccessMessage(`${t("tasks-users.get-in-progress-tasks-success")}`);
      successTry();
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
      catchError();
      setTimeout(() => {
        setShowError(false);
        if (
          error.response.data.message === "jwt expired" ||
          error.response.data.message === "jwt must be provided" ||
          error.response.data.message === "jwt malformed" ||
          error.response.data.message === "Not Authenticated.."
        ) {
          router.push("/pages/auth/login-user");
          Cookies.remove("Token");
        }
      }, 3000);
    }

    /* Completed Tasks */
    try {
      const responseCompleted = await api.get(
        `/tasks/user-tasks/${Cookies.get("userId")}`,
        {
          params: { status: "Complete" },
          onDownloadProgress: () => {
            setLoadingProgress(100);
          },
        }
      );
      const tasksCompletedData = responseCompleted.data.tasks;
      setTasksCompleted(tasksCompletedData);
      setSuccessMessage(`${t("tasks-users.get-completed-tasks-success")}`);
      successTry();
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
      catchError();
      setTimeout(() => {
        setShowError(false);
        if (
          error.response.data.message === "jwt expired" ||
          error.response.data.message === "jwt must be provided" ||
          error.response.data.message === "jwt malformed" ||
          error.response.data.message === "Not Authenticated.."
        ) {
          router.push("/pages/auth/login-user");
          Cookies.remove("Token");
        }
      }, 3000);
    }
  }

  useEffect(() => {
    getUsersTasks();
  }, []);

  /* CompleteTask */
  const completeTask = async (taskId: string) => {
    setShowLoading(true);
    try {
      const response = await api.put("/tasks/complete", { id: taskId });
      setShowLoading(false);
      setSuccessMessage(`${t("tasks-users.complete-task-success")}`);
      setShowSuccess(true);
      setTimeout(() => {
        setSuccessMessage("");
        setShowSuccess(false);
      }, 3000);
      getUsersTasks();
    } catch (error: any) {
      console.log(error);
      setShowLoading(false);
      setErrorMessage(error.message);
      setShowError(true);
      setTimeout(() => {
        setErrorMessage("");
        setShowError(false);
      }, 3000);
    }
  };

  /* Close Add Task Dialog */
  const handleClose = () => {
    setOpenConfirmationDialog(false);
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      bgcolor={"ButtonHighlight"}
      padding={2}
      borderRadius={8}
    >
      {/* Show Loading Animation Bar */}
      {showLoading && (
        <Box>
          <Loading progress={loadingProgress} />
        </Box>
      )}

      {/* Container */}
      <Box display={"flex"} flexDirection={"column"} padding={1}>
        {/* Tasks Cards */}
        <Box display={"flex"} justifyContent={"center"} marginBottom={2}>
          <Typography variant="h4" color={"red"} fontFamily={"fantasy"}>
            {t("tasks-users.in-progress")}
          </Typography>
        </Box>

        {/* In-Progress Tasks */}
        <Box display={"flex"} justifyContent={"space-around"} flexWrap={"wrap"}>
          {tasksInProgress.map((task: any, index: number) => {
            return (
              <Card sx={{ width: "265px", marginTop: "10px" }} key={index}>
                <CardContent>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    fontWeight={800}
                    gutterBottom
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    fontWeight={600}
                    gutterBottom
                  >
                    {task.status}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {task.deadline}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => completeTask(task._id)}
                  >
                    {t("tasks-users.complete-button")}
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>

        <br />
        <hr />
        <br />

        <Box display={"flex"} justifyContent={"center"} marginBottom={2}>
          <Typography variant="h4" color={"red"} fontFamily={"fantasy"}>
            {t("tasks-users.completed-tasks")}
          </Typography>
        </Box>
        {/* Completed Tasks */}
        <Box display={"flex"} justifyContent={"space-around"} flexWrap={"wrap"}>
          {tasksCompleted.map((task: any, index: number) => {
            return (
              <Card sx={{ width: "265px", marginTop: "10px" }} key={index}>
                <CardContent>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    fontWeight={800}
                    gutterBottom
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    fontWeight={600}
                    gutterBottom
                  >
                    {task.status}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {task.deadline}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                  <br />
                  <Typography variant="h5" color="red" fontWeight={600}>
                    {t("tasks-users.completed")}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>

      {/* Show Success */}
      {showSuccess && <SuccessSnackBar message={SuccessMessage} />}

      {/* Show Error */}
      {showError && <ErrorSnackBar message={ErrorMessage} />}
    </Box>
  );
};

export default withAuthUser(TasksUser);
