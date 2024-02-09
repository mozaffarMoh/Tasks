/* Tasks Page */

"use client";
import { t } from "i18next";
import api from "@/app/api/api/api";
import { Box, Grid, Button, Tooltip, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DataGrid, renderActionsCell } from "@mui/x-data-grid";
import { TasksRowsInterface } from "@/app/DTOs/DTOs";
import AddTaskDialog from "./add-task-dialog";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import Loading from "@/app/components/Notify/Loading/loading";
import SuccessSnackBar from "@/app/components/Notify/Success-Snackbar/successSnackbar";
import ErrorSnackBar from "@/app/components/Notify/Error-Snackbar/ErrorSnackbar";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import withAuthAdmin from "@/app/withAuth/withAuthAdmin";
import Image from "next/image";
import taskImage from "../../../public/images/task-image.png";
import Cookies from "js-cookie";

const Tasks = () => {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(20);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [tasks, setTasks] = useState([]);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [rowData, setRowData] = useState({});
  const [rowTaskId, setRowTaskId] = useState("");

  /* Tasks Rows */
  const rows: Array<any> = tasks.map(
    (task: TasksRowsInterface, index: number) => {
      return {
        taskId: task._id, //hidden only for send taskId to props
        userId: task.userId._id, //hidden , only for send userID to props
        imagePath: task.image, //hidden , only for send imagePath to props
        id: index + 1,
        img: renderActionsCell,
        username: task.userId.username,
        title: task.title,
        deadline: task.deadline,
        status: task.status,
        description: task.description,
        action: renderActionsCell,
      };
    }
  );

  /* Tasks Columns */
  const columns: Array<any> = [
    { field: "id", headerName: `${t("tasks.id")}`, width: 50 },
    {
      field: "img",
      headerName: `${t("tasks.image")}`,
      width: 120,
      renderCell: () => (
        <Image
          src={taskImage}
          priority={true}
          alt="taskImage"
          width={40}
          height={40}
        />
      ),
    },
    { field: "username", headerName: `${t("tasks.username")}`, width: 120 },
    { field: "title", headerName: `${t("tasks.title")}`, width: 120 },
    { field: "deadline", headerName: `${t("tasks.deadline")}`, width: 120 },
    { field: "status", headerName: `${t("tasks.status")}`, width: 120 },
    {
      field: "description",
      headerName: `${t("tasks.description")}`,
      width: 200,
    },
    {
      field: "action",
      headerName: `${t("tasks.actions")}`,
      width: 200,
      renderCell: (rowData: any) => (
        <Box>
          <IconButton onClick={() => EditTask(rowData.row)}>
            <Tooltip title={t("tasks.edit-task-tooltip")}>
              <EditRoundedIcon color="primary" />
            </Tooltip>
          </IconButton>
          <IconButton onClick={() => DeleteTask(rowData.row.taskId)}>
            <Tooltip title={t("tasks.delete-task-tooltip")}>
              <DeleteRoundedIcon color="error" />
            </Tooltip>
          </IconButton>
        </Box>
      ),
    },
  ];

  /* GET All Tasks */
  async function getTasks() {
    setShowLoading(true);
    try {
      const response = await api.get("/tasks/all-tasks", {
        onDownloadProgress: () => {
          setLoadingProgress(100);
        },
      });
      const tasksData = response.data.tasks;
      setTasks(tasksData);
      setTimeout(() => {
        setShowLoading(false);
        setLoadingProgress(20);
      }, 1000);
      setSuccessMessage(`${t("tasks.get-tasks-success")}`);
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
          Cookies.remove("role");
        }
      }, 3000);
    }
  }
  useEffect(() => {
    getTasks();
  }, []);

  /* Open Add Task Dialog */
  function addTask() {
    setRowData({});
    setOpenAddTaskDialog(true);
  }

  /* Handle Success After Add or Edit Task */
  function handleSuccess(success: boolean, error: any) {
    if (success === true) {
      getTasks();
    }
    if (success === false) {
      setErrorMessage(error.response.data.massage);
      setShowError(true);
      setTimeout(() => {
        setErrorMessage("");
        setShowError(false);
      }, 3000);
    }
  }

  /* Open Edit Task Dialog */
  function EditTask(rowData: any) {
    setRowData(rowData);
    setOpenAddTaskDialog(true);
  }

  /* Open Delete Task Dialog */
  function DeleteTask(taskId: any) {
    setOpenConfirmationDialog(true);
    setRowTaskId(taskId);
    console.log(rowTaskId);
    handleConfirmation(false);
  }

  /* Handle Delete Confirmation */
  async function handleConfirmation(confirmationProp: boolean) {
    if (confirmationProp) {
      handleClose();
      setShowLoading(true);
      try {
        const response = await api.delete(`/tasks/delete-task/${rowTaskId}`);
        setShowLoading(false);
        setSuccessMessage(`${t("tasks.delete-message")}`);
        setShowSuccess(true);
        getTasks();
        setTimeout(() => {
          setShowSuccess(false);
          setSuccessMessage("");
        }, 2000);
      } catch (error: any) {
        setShowLoading(false);
        setShowError(true);
        setErrorMessage(error.message);
        setTimeout(() => {
          setErrorMessage("");
          setShowError(false);
        }, 2000);
      }
    }
  }

  /* Close Add Task Dialog */
  const handleClose = () => {
    setRowData({});
    setOpenAddTaskDialog(false);
    setOpenConfirmationDialog(false);
  };

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
        <Grid item xs={4}>
          {/* Add Task Button */}
          <Button
            onClick={addTask}
            variant="contained"
            color="warning"
            sx={{ width: "150px", height: "40px", borderRadius: "13px" }}
          >
            {t("tasks.add-task-button")}
          </Button>
        </Grid>

        {/* Tasks Table */}
        <Grid container item xs={8}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Grid>
      </Grid>

      {/* Show Success */}
      {showSuccess && <SuccessSnackBar message={SuccessMessage} />}
      {/* Show Error */}
      {showError && <ErrorSnackBar message={ErrorMessage} />}
      {/* Add Task Dialog */}
      <AddTaskDialog
        open={openAddTaskDialog}
        onClose={handleClose}
        rowDataProp={rowData}
        handleSuccess={handleSuccess}
      />
      {/* Confirmation Dialog */}
      {openConfirmationDialog && (
        <ConfirmationDialog
          message={t("tasks.delete-message")}
          open={openConfirmationDialog}
          onClose={handleClose}
          handleConfirmation={handleConfirmation}
        />
      )}
    </Grid>
  );
};


export default withAuthAdmin(Tasks);
