import { Alert, Snackbar, Stack, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { t } from "i18next";

const ErrorSnackBar = ({ message }: any) => {
  const [open, setOpen] = useState(true);
  const BoxMedia = useMediaQuery("(max-width:800px)");

  const handleClose = () => {
    setOpen(false);
  };

  const action = (
    <Alert severity="error" variant="filled">
      {t("snackbar.error")} : {message}
    </Alert>
  );
  return (
    <Stack>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={`${t('snackbar.notify')}`}
        action={action}
        sx={BoxMedia ? { width: "30%" } : { width: "450px" }}
      />
    </Stack>
  );
};

export default ErrorSnackBar;
