import { SxProps } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";

import { useModalApi, useModalData } from "@/controller/modal.controller";

import { GenericModal } from "./GenericModal";

export type ModalProps = PropsWithChildren & {
  title: string;
  open?: boolean;
  onClose?: () => void;
  footer?: ReactNode;
  additionalStyles?: SxProps;
};

export const Modal = ({ title, children, open, onClose, footer, additionalStyles }: ModalProps) => {
  // Only use controller if explicitly in uncontrolled mode (no open/onClose props)
  const shouldUseController = open === undefined || onClose === undefined;
  const { opened } = useModalData();
  const { close } = useModalApi();

  const isOpen = shouldUseController ? opened : open;
  const handleClose = shouldUseController ? close : onClose!;

  return (
    <GenericModal
      additionalStyles={additionalStyles}
      title={title}
      open={isOpen}
      onClose={handleClose}
      footer={footer}
    >
      {children}
    </GenericModal>
  );
};
