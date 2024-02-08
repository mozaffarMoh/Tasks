import { Alert, Snackbar, Stack } from "@mui/material";
import { useState } from "react";
import { t } from "i18next";

const SuccessSnackBar = ({ message }: any) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const action = (
    <Alert severity="success" variant="filled">
      {message} {t("snackbar.success")}
    </Alert>
  );
  return (
    <Stack>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={`${t("snackbar.notify")}`}
        action={action}
      />
    </Stack>
  );
};

export default SuccessSnackBar;
