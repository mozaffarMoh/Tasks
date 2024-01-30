import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { t } from 'i18next'

const ConfirmationDialog = ({ message, open, onClose, handleConfirmation }: any) => {

  function handleConfirm() {
    handleConfirmation(true);
  }

  return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{t('confirm-dialog.label')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message.includes('delete') || message.includes('حذف') && <DeleteForeverRoundedIcon fontSize="large" />}
            {t('confirm-dialog.message')} {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={onClose}>
          {t('confirm-dialog.cancel')}
          </Button>
          <Button variant="contained" color="secondary" onClick={handleConfirm}>
          {t('confirm-dialog.ok')}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default ConfirmationDialog;
