import { useEffect, useState } from 'react';
import { Button, Stack, Grid2, Typography, Box, Paper, IconButton, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { ArrowBack, Edit, Delete, CalendarToday } from '@mui/icons-material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useModalApi } from '../../controller/modal.controller';
import { Modal } from '../../components/modal/Modal';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { addUtilityData, deleteAddress, getYearsForAddress, createYearWithServices, getAddress, deleteYearAndServices } from '../../firebase/firestore';
import { YearDoc } from '../../types/firestore';
import { addresses, currencies, utilityServices, years } from '../../constants';
import { Settings } from '@mui/icons-material';
import { Select } from '../../components/Select';
import { Input } from '../../components/Input';
import { useTranslation } from 'react-i18next';

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
] as const;

export const AddressDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { open, close } = useModalApi();
  const { t } = useTranslation();
  const [yearsList, setYearsList] = useState<{ id: string; data: YearDoc }[]>([]);
  const [createYearOpen, setCreateYearOpen] = useState(false);
  const [newYear, setNewYear] = useState('');

  const fetchYears = () => {
    if (id) {
        getYearsForAddress(id).then(setYearsList).catch(console.error);
    }
  };

  useEffect(() => {
    fetchYears();
  }, [id]);

  const handleCreateYear = async () => {
      if (!id || !newYear) return;
      try {
          const addressDoc = await getAddress(id);
          const servicesStart = addressDoc?.services || [];
          // If no services configured, maybe warn user? or just create empty year? 
          // For now, allow empty.
          
          await createYearWithServices(id, newYear, servicesStart);
          setCreateYearOpen(false);
          setNewYear('');
          fetchYears();
      } catch (e) {
          console.error(e);
      }
  };

  const handleDeleteYear = async (yearStr: string) => {
      if (!id) return;
      if (window.confirm(t('Are you sure you want to delete this year archive? All data will be lost.'))) {
          try {
              await deleteYearAndServices(id, yearStr);
              fetchYears();
          } catch (e) {
              console.error(e);
              alert('Failed to delete year');
          }
      }
  };

  const { control, handleSubmit } = useForm({
    defaultValues: {
      currency: '',
      addressId: '',
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

  const onSubmit: SubmitHandler<any> = data => {
    const { addressId, yearId, serviceId, currency, accountNumber, ...monthsData } = data;

    let addressDoc: any = {
      street: '',
      house_number: '',
      flat_number: '',
      city: ''
    };

    // Map addressId to address details (Mock logic for now, could be improved)
    if (addressId.value === 'Mazepy') {
      addressDoc = { street: 'Мазепи', house_number: '9а', flat_number: '68', city: 'Львів' };
    } else if (addressId.value === 'Levandivska') {
      addressDoc = { street: 'Левандівська', house_number: '3', flat_number: '45', city: 'Львів' };
    } else if (addressId.value === 'Dashkevicha') {
      addressDoc = { street: 'Дашкевича', house_number: '12', flat_number: '78', city: 'Львів' };
    } else if (addressId.value === 'Haidamatska') {
      addressDoc = { street: 'Гайдамацька', house_number: '5', flat_number: '22', city: 'Львів' };
    }

    const payload = {
      addressId: addressId.value,
      yearId: yearId.value,
      serviceId: serviceId.value,
      addressDoc,
      currency: currency.value,
      accountNumber,
      ...monthsData,
    };

    addUtilityData(payload);
    console.log(payload);
    close(); // Close modal on submit
  };

  const handleDelete = async () => {
      if (id && window.confirm(t('Are you sure you want to delete this address?'))) {
          try {
              await deleteAddress(id);
              navigate('/address-list');
          } catch (e) {
              console.error(e);
              alert('Failed to delete address');
          }
      }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
         <Box display="flex" alignItems="center">
            <IconButton onClick={() => navigate('/address-list')} sx={{ mr: 2 }}>
            <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold">
            {t('address.details_title', { id })}
            </Typography>
         </Box>
         <Stack direction="row" gap={1}>
             <Button 
                variant="outlined" 
                startIcon={<Settings />}
                onClick={() => navigate(`/address-list/${id}/services`)}
             >
                 Services
             </Button>
             <Button 
                variant="outlined" 
                startIcon={<Edit />}
                onClick={() => navigate(`/address-list/edit/${id}`)}
             >
                 Edit
             </Button>
             <Button 
                variant="outlined" 
                color="error" 
                startIcon={<Delete />}
                onClick={handleDelete}
             >
                 Delete
             </Button>
         </Stack>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
           <Typography variant="h6">
            {t('address.year_archive', 'Years Archive')}
           </Typography>
           <Stack direction="row" gap={2}>
             <Button variant="outlined" onClick={() => setCreateYearOpen(true)}>{t('year.create', 'New Year')}</Button>
             <Button variant="contained" onClick={open}>{t('dashboard.add_utility')}</Button>
           </Stack>
        </Box>
        <List>
            {yearsList.map((year) => (
                <ListItem 
                    key={year.id} 
                    disablePadding
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteYear(year.data.year.toString())}>
                          <Delete />
                        </IconButton>
                    }
                >
                <ListItemButton component={Link} to={`year/${year.data.year}`}>
                    <ListItemIcon>
                    <CalendarToday />
                    </ListItemIcon>
                    <ListItemText primary={year.data.year} />
                </ListItemButton>
                </ListItem>
            ))}
            {yearsList.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                    No years found. Add utility data to create a year.
                </Typography>
            )}
        </List>
      </Paper>

      <Modal title={t('year.create_title', 'Create New Year')} open={createYearOpen} onClose={() => setCreateYearOpen(false)}>
            <Box p={2}>
                <Typography variant="body2" mb={2} color="textSecondary">
                    Enter the year (e.g., 2026). This will create a new archive and automatically add the configured services for this address.
                </Typography>
                <Input 
                    label="Year" 
                    value={newYear} 
                    onChange={(e) => setNewYear(e.target.value)} 
                    type="number"
                />
                <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                    <Button onClick={() => setCreateYearOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateYear} disabled={!newYear}>Create</Button>
                </Box>
            </Box>
      </Modal>

      <Modal title={t('dashboard.add_utility')}>
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
            <Button onClick={close} color="inherit">{t('address.create.cancel')}</Button>
            <Button variant='contained' type='submit'>{t('utility.submit')}</Button>
          </Box>
        </Stack>
      </Modal>
    </Box>
  );
};
