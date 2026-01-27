import { useModalApi, useModalData } from '../../controller/modal.controller';
import { PropsWithChildren } from 'react';
import { GenericModal } from './GenericModal';

export type ModalProps = PropsWithChildren & {
  title: string;
  open?: boolean;
  onClose?: () => void;
};

export const Modal = ({ title, children, open, onClose }: ModalProps) => {
  const { openned } = useModalData();
  const { close } = useModalApi();

  const isOpen = open !== undefined ? open : openned;
  const handleClose = onClose || close;

  return (
    <GenericModal title={title} open={isOpen} onClose={handleClose}>
      {children}
    </GenericModal>
  );
};

