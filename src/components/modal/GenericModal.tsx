import { Backdrop, Modal as ModalUI, Fade, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { StyledModalContent } from './styles';

export type GenericModalProps = PropsWithChildren & {
  title: string;
  open: boolean;
  onClose: () => void;
};

export const GenericModal = ({ title, open, onClose, children }: GenericModalProps) => {
  return (
    <ModalUI
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <StyledModalContent>
          <Typography
            id='transition-modal-title'
            variant='h6'
            component='h2'
            mb={2}
          >
            {title}
          </Typography>
          {children}
        </StyledModalContent>
      </Fade>
    </ModalUI>
  );
};
