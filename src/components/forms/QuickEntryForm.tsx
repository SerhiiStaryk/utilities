
interface QuickEntryFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    currentMonth: string;
    services: { name: string; accountNumber: string }[];
}

import { Button, Box, Stack, Grid2, Typography } from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '../Input';
import { Select as CustomSelect } from '../Select';
import { currencies } from '../../constants';

export const QuickEntryForm = ({ onSubmit, onCancel, currentMonth, services }: QuickEntryFormProps) => {
    const { t } = useTranslation();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            month: currentMonth,
            year: new Date().getFullYear().toString(),
            payments: services.map(s => ({
                serviceId: s.name,
                accountNumber: s.accountNumber, // Display only or editable if needed
                amount: '',
                currency: 'UAH'
            }))
        }
    });

    const { fields } = useFieldArray({
        control,
        name: "payments"
    });

    return (
        <Stack component='form' onSubmit={handleSubmit(onSubmit)} gap={3} sx={{ mt: 2 }}>
            <Box>
                <Typography variant="subtitle1" gutterBottom>
                    Reporting for {t(`utility.months.${currentMonth}`)}
                </Typography>
                {/* 
                   Ideally, we could allow changing year here if needed, 
                   but requirement is 'current input', assuming current context year.
                   This form assumes the year ID is handled by the submit logic 
                   based on the context (e.g. current year or selected year).
                */}
            </Box>

            <Grid2 container spacing={3}>
                {fields.map((field, index) => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.id}>
                        <Box p={2} border={1} borderColor="divider" borderRadius={1}>
                            <Typography variant="subtitle2" gutterBottom color="primary">
                                {field.serviceId}
                            </Typography>
                             <Typography variant="caption" display="block" mb={1} color="textSecondary">
                                {field.accountNumber}
                            </Typography>
                            
                            <Stack gap={2}>
                                <Controller
                                    name={`payments.${index}.amount`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} label={t('utility.amount')} placeholder="0.00" />
                                    )}
                                />
                                <Controller
                                    name={`payments.${index}.currency`}
                                    control={control}
                                    render={({ field }) => (
                                        <CustomSelect {...field} label={t('utility.currency')} options={currencies} />
                                    )}
                                />
                            </Stack>
                        </Box>
                    </Grid2>
                ))}
            </Grid2>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button onClick={onCancel} color="inherit">{t('address.create.cancel')}</Button>
                <Button variant='contained' type='submit'>{t('utility.submit')}</Button>
            </Box>
        </Stack>
    );
};
