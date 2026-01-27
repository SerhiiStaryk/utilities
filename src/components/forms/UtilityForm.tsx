import { Button, Box, Stack, Grid2, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '../Input';
import { Select } from '../Select';
import { addresses, currencies, utilityServices, years } from '../../constants';

interface UtilityFormProps {
  initialValues?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
] as const;

export const UtilityForm = ({ initialValues, onSubmit, onCancel, isEditMode = false }: UtilityFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    defaultValues: initialValues || {
        currency: '',
        addressId: '', // These might be pre-filled or handled outside if edit mode implies fixed address/year
        yearId: '',
        serviceId: '',
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

  return (
    <Stack
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      gap={3}
      sx={{ mt: 2 }}
    >
      <Grid2 container spacing={3}>
         {/* General Info Column */}
        <Grid2 size={{ xs: 12, md: 6 }}>
           <Typography variant="subtitle2" gutterBottom color="primary">{t('utility.config')}</Typography>
           <Stack gap={2}>
              {!isEditMode && (
                <>
                  <Controller
                    name='addressId'
                    control={control}
                    render={({ field }) => <Select {...field} label='Address' options={addresses} />}
                  />
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
                </>
              )}
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
        <Grid2 size={{ xs: 12, md: 6 }}>
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

      <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
        <Button onClick={onCancel} color="inherit">{t('address.create.cancel')}</Button>
        <Button variant='contained' type='submit'>{t('utility.submit')}</Button>
      </Box>
    </Stack>
  );
};
