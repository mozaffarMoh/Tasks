/* ِAdd Task Dialog  */

"use client";

import * as React from "react";
import {
  Typography,
  FormControl,
  Dialog,
  Button,
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "Moment";
import api from "@/app/api/api/api";
import { t } from "i18next";
import dayjs from "dayjs";
import Loading from "@/app/components/Notify/Loading/loading";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface DialogPropsInterface {
  open: boolean;
  onClose: () => void;
  rowDataProp: any;
  handleSuccess: any;
}

const AddTaskDialog = ({
  open,
  onClose,
  rowDataProp,
  handleSuccess,
}: DialogPropsInterface) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [rowData, setRowData] = React.useState();
  const [users, setUsers] = React.useState([]);
  const [showLoading, setShowLoading] = React.useState(false);
  const [loadingProgress, setLoadingProgress] = React.useState(20);
  const [title, setTitle] = React.useState("");
  const [userID, setUserID] = React.useState(rowDataProp.userId || "");
  const [taskID, setTaskID] = React.useState(rowDataProp.taskId || "");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePath, setImagePath] = React.useState(rowDataProp.imagePath || "");
  const [deadline, setDeadline] = React.useState(
    moment(rowDataProp.deadline || "").format("MM/DD/YYYY")
  );
  const [description, setDescription] = React.useState(
    rowDataProp.description || ""
  );

  /* Add Task Form */
  const addTaskForm: any = new FormData();
  addTaskForm.append("title", title);
  addTaskForm.append("userId", userID);
  addTaskForm.append("image", imageFile);
  addTaskForm.append("deadline", deadline);
  addTaskForm.append("description", description);

  /* Fill input fields by row data */
  React.useEffect(() => {
    if (rowDataProp.title) {
      setRowData(rowDataProp);
      setTitle(rowDataProp.title);
      setUserID(rowDataProp.userId);
      setTaskID(rowDataProp.taskId);
      setImagePath(rowDataProp.imagePath);
      setDeadline(rowDataProp.deadline);
      setDescription(rowDataProp.description);
    }
  }, [rowDataProp.title && rowDataProp]);

  /* Get Users */
  React.useEffect(() => {
    const getUsers = async () => {
      const response = await api.get("/auth/users");
      const usersData = response?.data.users;
      setUsers(usersData);
      return users;
    };
    getUsers();
  }, []);

  /* Add Task */
  const addTask = async () => {
    setShowLoading(true);
    try {
      const response = await api.post("/tasks/add-task", addTaskForm, {
        headers: { "Content-Type": "multipart/form-data" },
        onDownloadProgress: () => {
          setLoadingProgress(100);
        },
      });
      setShowLoading(false);
      cancelDialog();
      handleSuccess(true);
    } catch (error: any) {
      setShowLoading(false);
      handleSuccess(false, error);
    }
  };

  /* Edit Task */
  const EditTask = async () => {
    try {
      const response = await api.put(
        `/tasks/edit-task/${taskID}`,
        addTaskForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onDownloadProgress: () => {
            setLoadingProgress(100);
          },
        }
      );

      setShowLoading(false);
      cancelDialog();
      handleSuccess(true);
    } catch (error) {
      setShowLoading(false);
      handleSuccess(false, error);
    }

    //onClose();
  };

  /* Upload Image */
  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
    setImagePath(event.target.value);
  };

  /* Cancel Dialog then clear all values data*/
  const cancelDialog = () => {
    onClose();
    setTitle("");
    setUserID("");
    setImagePath("");
    setImageFile(null);
    setDeadline(moment().format("MM/DD/YYYY"));
    setDescription("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {/* Show Loading Animation Bar */}
      {showLoading && <Loading progress={loadingProgress} />}
      <form onSubmit={handleSubmit(rowDataProp.title ? EditTask : addTask)}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"500px"}
          padding={4}
        >
          <Typography variant="h4" fontWeight={800} color={"secondary"}>
            ''{" "}
            {rowDataProp.title
              ? `${t("add-task.edit-task-label")}`
              : `${t("add-task.add-task-label")}`}{" "}
            ''
          </Typography>
          <br />
          <FormControl fullWidth>
            {/* Title Field */}
            <FormControl>
              <TextField
                type="text"
                label={t("add-task.title")}
                value={title}
                {...register("title", {
                  required: `${t("validation.title")}`,
                  minLength: {
                    value: 5,
                    message: `${t("validation.title-minLength")}`,
                  },
                })}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              {errors.title && (
                <p style={{ color: "red", fontSize: "15px" }}>
                  {errors.title.message?.toString()}
                </p>
              )}
            </FormControl>
            <br />

            {/* UserId Field */}
            <FormControl>
              <InputLabel id="usersLabel">
                {t("add-task.select-user")}
              </InputLabel>
              <Select
                labelId="usersLabel"
                id="usersLabel"
                label={t("add-task.select-user")}
                value={userID}
                {...register("userID", { required: true })}
                onChange={(e: any) => {
                  setUserID(e.target.value);
                }}
              >
                <MenuItem value="" sx={{ height: "40px" }}></MenuItem>
                {users.map((user: any, index: number) => {
                  return (
                    <MenuItem key={index} value={user._id}>
                      {user.username}
                    </MenuItem>
                  );
                })}
              </Select>

              {errors.userID && !userID && (
                <p style={{ color: "red", fontSize: "15px" }}>
                  {t("validation.user")}
                </p>
              )}
            </FormControl>

            <br />

            {/* Image Field */}
            <FormControl>
              <Button
                variant="contained"
                color="info"
                component="label"
                sx={{ textTransform: "capitalize" }}
              >
                {t("add-task.upload-image")}
                <TextField
                  type="file"
                  {...register("imageFile", { required: true })}
                  onChange={(e: any) => {
                    uploadImage(e);
                  }}
                  sx={{ display: "none" }}
                />
              </Button>
              {errors.imageFile && !imageFile && (
                <p style={{ color: "red", fontSize: "15px" }}>
                  {t("validation.image")}
                </p>
              )}
              {/* Show Image Path when uploaded */}
              {imagePath && (
                <Typography variant="body1" marginTop={2}>
                  <span style={{ fontWeight: "600" }}>
                    {t("add-task.image-path")}
                  </span>{" "}
                  : {imagePath}
                </Typography>
              )}
            </FormControl>
            <br />

            {/* Deadline Field */}
            <FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(deadline)}
                  {...register("deadline", { required: true })}
                  onChange={(event: any) => {
                    setDeadline(moment(event.$d).format("MM/DD/YYYY"));
                  }}
                />
              </LocalizationProvider>
              {errors.deadline && !deadline && (
                <p style={{ color: "red", fontSize: "15px" }}>
                  {t("validation.deadline")}
                </p>
              )}
            </FormControl>
            <br />

            {/* Description Field */}
            <FormControl>
              <TextField
                type="text"
                label={t("add-task.description")}
                value={description}
                {...register("description", { required: true })}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              {errors.description && !description && (
                <p style={{ color: "red", fontSize: "15px" }}>
                  {t("validation.description")}
                </p>
              )}
            </FormControl>
            <br />

            {/* Buttons */}
            <FormControl>
              <Button type="submit" variant="contained" color="secondary">
                {rowDataProp.title
                  ? `${t("add-task.edit-task-button")}`
                  : `${t("add-task.add-task-button")}`}
              </Button>

              {/* Cancel Button */}
              <Button
                variant="contained"
                color="error"
                onClick={cancelDialog}
                sx={{ marginTop: "5px" }}
              >
                {t("add-task.cancel-button")}
              </Button>
            </FormControl>
          </FormControl>
        </Box>
      </form>
    </Dialog>
  );
};

export default AddTaskDialog;
