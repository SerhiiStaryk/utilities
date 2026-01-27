import { Button, Stack, Box } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { GenericModal } from './GenericModal';
import { Input } from '../Input';
import { addAddress } from '../../firebase/firestore';
import { useTranslation } from 'react-i18next';

interface CreateAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface AddressFormValues {
  id: string;
  city: string;
  street: string;
  houseNumber: string;
  flatNumber: string;
}

export const CreateAddressModal = ({ open, onClose, onSuccess }: CreateAddressModalProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<AddressFormValues>({
    defaultValues: {
      id: '',
      city: '',
      street: '',
      houseNumber: '',
      flatNumber: '',
    },
  });

  const onSubmit: SubmitHandler<AddressFormValues> = async (data) => {
    try {
      await addAddress(data.id, {
        city: data.city,
        street: data.street,
        house_number: data.houseNumber,
        flat_number: data.flatNumber,
      });
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
        console.error("Failed to create address", error);
    }
  };

  return (
    <GenericModal title={t('address.create.title')} open={open} onClose={onClose}>
      <Stack component='form' onSubmit={handleSubmit(onSubmit)} gap={3}>
        <Controller
          name='id'
          control={control}
          render={({ field }) => (
            <Input {...field} label={t('address.create.id_label')} placeholder="e.g. MyNewApartment" />
          )}
        />
        <Controller
          name='city'
          control={control}
          render={({ field }) => <Input {...field} label={t('address.create.city')} />}
        />
        <Controller
          name='street'
          control={control}
          render={({ field }) => <Input {...field} label={t('address.create.street')} />}
        />
        <Box display="flex" gap={2}>
            <Controller
            name='houseNumber'
            control={control}
            render={({ field }) => <Input {...field} label={t('address.create.house')} />}
            />
            <Controller
            name='flatNumber'
            control={control}
            render={({ field }) => <Input {...field} label={t('address.create.flat')} />}
            />
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} color="inherit">{t('address.create.cancel')}</Button>
          <Button variant='contained' type='submit'>{t('address.create.submit')}</Button>
        </Box>
      </Stack>
    </GenericModal>
  );
};
