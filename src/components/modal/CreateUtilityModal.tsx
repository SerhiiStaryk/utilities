import { Button, Stack, Box, Grid2, Typography } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { GenericModal } from './GenericModal';
import { Input } from '../Input';
import { Select } from '../Select';
import { addUtilityData } from '../../firebase/firestore';
import { utilityServices, years, currencies } from '../../constants';
import { UtilityDataPayload } from '../../types/firestore';
import { useTranslation } from 'react-i18next';

interface CreateUtilityModalProps {
  open: boolean;
  onClose: () => void;
  addressId: string; // The ID of the address we are adding data to
  onSuccess?: () => void;
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
] as const;

export const CreateUtilityModal = ({ open, onClose, addressId, onSuccess }: CreateUtilityModalProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      yearId: '',
      serviceId: '',
      currency: '',
      accountNumber: '',
      january: '',
      february: '',
      march: '',
      april: '',
      may: '',
      june: '',
      july: '',
      august: '',
      september: '',
      october: '',
      november: '',
      december: '',
    },
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
        const { yearId, serviceId, currency, accountNumber, ...monthsData } = data;
        
        const payload: UtilityDataPayload = {
            addressId,
            yearId: yearId.value,
            serviceId: serviceId.value,
            addressDoc: {} as any, // We are not updating address info here
            currency: currency.value,
            accountNumber,
            ...monthsData
        };

        await addUtilityData(payload);
        
        reset();
        onClose();
        if (onSuccess) onSuccess();
    } catch (e) {
        console.error("Error adding utility", e);
    }
  };

  return (
    <GenericModal title={t('utility.add_title', { address: addressId })} open={open} onClose={onClose}>
      <Stack component='form' onSubmit={handleSubmit(onSubmit)} gap={3}>
          <Grid2 container spacing={3}>
             {/* General Info Column */}
            <Grid2 size={{ xs: 12, md: 4 }}>
               <Typography variant="subtitle2" gutterBottom color="primary">{t('utility.config')}</Typography>
               <Stack gap={2}>
                  <Controller
                    name='yearId'
                    control={control}
                    render={({ field }) => <Select {...field} label={t('utility.year')} options={years} />}
                  />
                  <Controller
                    name='serviceId'
                    control={control}
                    render={({ field }) => <Select {...field} label={t('utility.service')} options={utilityServices} />}
                  />
                   <Controller
                    name='currency'
                    control={control}
                    render={({ field }) => <Select {...field} label={t('utility.currency')} options={currencies} />}
                  />
                  <Controller
                    name='accountNumber'
                    control={control}
                    render={({ field }) => <Input {...field} label={t('utility.account')} />}
                  />
               </Stack>
            </Grid2>

             {/* Monthly Data Column */}
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Typography variant="subtitle2" gutterBottom color="primary">{t('utility.monthly')}</Typography>
              <Grid2 container spacing={2}>
                {MONTHS.map(month => (
                  <Grid2 key={month} size={6}>
                    <Controller
                      name={month}
                      control={control}
                      render={({ field }) => (
                         <Input {...field} label={t(`utility.months.${month}`)} />
                      )}
                    />
                  </Grid2>
                ))}
              </Grid2>
            </Grid2>
          </Grid2>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} color="inherit">{t('address.create.cancel')}</Button>
          <Button variant='contained' type='submit'>{t('utility.submit')}</Button>
        </Box>
      </Stack>
    </GenericModal>
  );
};
