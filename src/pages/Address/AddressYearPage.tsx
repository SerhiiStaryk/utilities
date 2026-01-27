import { useEffect, useState } from 'react';
import { Typography, Box, IconButton, Paper, Card, CardContent, Button } from '@mui/material';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllUtilityServicesForYear, updateUtilityService, deleteUtilityService } from '../../firebase/firestore';
import { UtilityService } from '../../types/firestore';
import { Modal } from '../../components/modal/Modal';
import { UtilityForm } from '../../components/forms/UtilityForm';
import { QuickEntryForm } from '../../components/forms/QuickEntryForm';
import Grid from '@mui/material/Grid2';

export const AddressYearPage = () => {
    const { id, year } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [services, setServices] = useState<UtilityService[]>([]);
    const [editingService, setEditingService] = useState<UtilityService | null>(null);
    const [quickEntryOpen, setQuickEntryOpen] = useState(false);

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();

    const fetchServices = () => {
        if (id && year) {
            getAllUtilityServicesForYear(id, year).then(setServices).catch(console.error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [id, year]);

    const handleUpdate = async (data: any) => {
        if (!id || !year || !editingService) return;
        
        // Prepare payload for update
        const payload: any = {
            monthly_payments: {},
            account_number: data.accountNumber,
            currency: data.currency 
        };
        
        // Map flat form data back to structure
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        months.forEach(month => {
             if (data[month]) {
                 payload.monthly_payments[month] = {
                     amount: data[month],
                     currency: data.currency
                 };
             }
        });

        try {
            await updateUtilityService(id, year, editingService.id || editingService.name, payload);
            setEditingService(null);
            fetchServices();
        } catch (e) {
            console.error("Failed to update service", e);
        }
    };

    const handleDelete = async (service: UtilityService) => {
        if (!id || !year) return;
        if (window.confirm(t('Are you sure you want to delete this service?'))) {
            try {
                await deleteUtilityService(id, year, service.id || service.name);
                fetchServices();
            } catch (e) {
                console.error("Failed to delete service", e);
            }
        }
    };

    const handleQuickEntrySubmit = async (data: any) => {
        if (!id || !year) return;
        
        const updates = data.payments
            .filter((p: any) => p.amount && parseFloat(p.amount) > 0)
            .map((p: any) => {
                const payload: any = {
                    monthly_payments: {
                        [data.month]: {
                            amount: p.amount,
                            currency: p.currency
                        }
                    }
                };
                return updateUtilityService(id, year, p.serviceId, payload);
            });

        try {
            await Promise.all(updates);
            setQuickEntryOpen(false);
            fetchServices();
        } catch (e) {
            console.error("Failed to batch update", e);
        }
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                <Box display="flex" alignItems="center">
                    <IconButton onClick={() => navigate(`/address-list/${id}`)} sx={{ mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" fontWeight="bold">
                        {t('address.year_archive', 'Year Archive')}: {year}
                    </Typography>
                </Box>
                <Button variant="contained" onClick={() => setQuickEntryOpen(true)}>
                    {t('utility.enter_current_month', 'Enter Current Month')}
                </Button>
            </Box>

            <Grid container spacing={3}>
                {services.map((service) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id || service.name}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="start">
                                    <Box>
                                        <Typography variant="h6" gutterBottom color="primary">
                                            {service.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Account: {service.account_number}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <IconButton size="small" onClick={() => setEditingService(service)}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(service)} color="error">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box mt={2}>
                                    {Object.entries(service.monthly_payments || {}).map(([month, payment]) => (
                                        <Box key={month} display="flex" justifyContent="space-between" my={0.5}>
                                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                                {month}:
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                {payment.amount} {payment.currency}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                
                {services.length === 0 && (
                     <Grid size={12}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="textSecondary">
                                No utility services found for this year.
                            </Typography>
                        </Paper>
                     </Grid>
                )}
            </Grid>

            {editingService && (
                <Modal title={`Edit ${editingService.name}`} open={!!editingService} onClose={() => setEditingService(null)}>
                    <UtilityForm
                        isEditMode
                        initialValues={{
                            currency: Object.values(editingService.monthly_payments || {})[0]?.currency || '',
                            accountNumber: editingService.account_number,
                            ...Object.entries(editingService.monthly_payments || {}).reduce((acc: any, [month, val]) => {
                                acc[month] = val.amount;
                                return acc;
                            }, {})
                        }}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingService(null)}
                    />
                </Modal>
            )}

            <Modal title={t('utility.quick_entry', 'Quick Entry')} open={quickEntryOpen} onClose={() => setQuickEntryOpen(false)}>
                <QuickEntryForm
                    currentMonth={currentMonth}
                    services={services.map(s => ({ name: s.name, accountNumber: s.account_number }))}
                    onSubmit={handleQuickEntrySubmit}
                    onCancel={() => setQuickEntryOpen(false)}
                />
            </Modal>
        </Box>
    );
};
