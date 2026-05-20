import { ReactNode, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { NoArgCallback } from "../../../types/frontend/functions/functionTypes";

interface SimpleDialogProps {
  title: string;
  content: ReactNode;
  confirmText: string;
  cancelText?: string;
  onConfirm: NoArgCallback;
  renderTrigger: (openDialog: NoArgCallback) => ReactNode;
}

// TODO Add variants or other styling options
function SimpleDialog({
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  renderTrigger,
}: SimpleDialogProps) {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <>
      {renderTrigger(openDialog)}
      <Dialog open={open} onClose={closeDialog}>
        <Box sx={{ padding: "0.75em 1.5em" }}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{content}</DialogContent>
          <DialogActions>
            {
              <Button onClick={closeDialog} color="info">
                {cancelText ?? "Close"}
              </Button>
            }
            {
              <Button
                onClick={() => {
                  onConfirm();
                  closeDialog();
                }}
                color="warning"
              >
                {confirmText}
              </Button>
            }
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default SimpleDialog;
