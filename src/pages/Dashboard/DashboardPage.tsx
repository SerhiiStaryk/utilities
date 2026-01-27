import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Box, Typography, CardContent, Button, Stack, MenuItem, FormControl, InputLabel, Select as MuiSelect } from '@mui/material';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import { PieChart } from '../../components/charts/PieChart';
import BarChartAll from '../../components/charts/BarChartAll';
import { Add, HomeWork } from '@mui/icons-material';
import { CreateAddressModal } from '../../components/modal/CreateAddressModal';
import { CreateUtilityModal } from '../../components/modal/CreateUtilityModal';
import { getAddresses } from '../../firebase/firestore';
import { AddressDoc } from '../../types/firestore';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';


const StatCard = ({ title, value }: { title: string; value: string }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography color="textSecondary" gutterBottom variant="overline">
        {title}
      </Typography>
      <Typography component="div" variant="h4">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<{id: string, data: AddressDoc}[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  
  const [createAddressOpen, setCreateAddressOpen] = useState(false);
  const [createUtilityOpen, setCreateUtilityOpen] = useState(false);

  const fetchAddresses = async () => {
    try {
      const list = await getAddresses();


      setAddresses(list);
      if (list.length > 0 && !selectedAddress) {
          setSelectedAddress(list[0].id);
      }
    } catch (e) {
      console.error("Failed to fetch addresses", e);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" mb={4} gap={2}>
        <Box>
           <Typography variant="h4" fontWeight="bold">
            {t('dashboard.title')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
             {t('dashboard.overview', { address: selectedAddress || t('dashboard.all_addresses') })}
          </Typography>
        </Box>
        
        <Stack direction="row" gap={2} alignItems="center">
           <FormControl size="small" sx={{ minWidth: 200 }}>
             <InputLabel>{t('dashboard.current_address')}</InputLabel>
             <MuiSelect
               value={selectedAddress}
               label={t('dashboard.current_address')}
               onChange={(e) => setSelectedAddress(e.target.value)}
             >
               {addresses.map((addr) => (
                 <MenuItem key={addr.id} value={addr.id}>
                    {addr.data.street} {addr.data.house_number}, {addr.data.city}
                 </MenuItem>
               ))}
               {addresses.length === 0 && <MenuItem value="" disabled>No Addresses Found</MenuItem>}
             </MuiSelect>
           </FormControl>

           <Button 
             variant="outlined" 
             startIcon={<HomeWork />} 
             onClick={() => navigate('/address-list/create')}
           >
             {t('dashboard.new_address')}
           </Button>
           <Button 
             variant="contained" 
             startIcon={<Add />} 
             disabled={!selectedAddress}
             onClick={() => setCreateUtilityOpen(true)}
           >
             {t('dashboard.add_utility')}
           </Button>
        </Stack>
      </Stack>

      {/* Modals */}
      <CreateAddressModal 
        open={createAddressOpen} 
        onClose={() => setCreateAddressOpen(false)} 
        onSuccess={() => {
            fetchAddresses();
        }}
      />
      <CreateUtilityModal 
        open={createUtilityOpen} 
        onClose={() => setCreateUtilityOpen(false)} 
        addressId={selectedAddress}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t('dashboard.stats.total_users')} value="1,234" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t('dashboard.stats.revenue')} value="$45,678" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t('dashboard.stats.active_sessions')} value="890" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t('dashboard.stats.conversion_rate')} value="12.5%" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%', minHeight: 400, p: 2 }}>
             <Typography variant="h6" gutterBottom>
               {t('dashboard.charts.performance')} ({selectedAddress})
             </Typography>
            <Box sx={{ height: 350 }}>
              <LineChart />
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', minHeight: 400, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.charts.device_distribution')}
            </Typography>
             <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart />
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
           <Card sx={{ height: '100%', minHeight: 400, p: 2 }}>
             <Typography variant="h6" gutterBottom>
              {t('dashboard.charts.sales_category')}
             </Typography>
            <Box sx={{ height: 350 }}>
               <BarChart />
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
           <Card sx={{ height: '100%', minHeight: 400, p: 2 }}>
             <Typography variant="h6" gutterBottom>
               {t('dashboard.charts.monthly_trends')}
             </Typography>
            <Box sx={{ height: 350 }}>
               <BarChartAll />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
