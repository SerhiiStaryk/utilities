import { useState } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

import { DrawerHeaderUI } from '../ui/DrawerHeaderUI';
import { Drawer } from './Drawer';
import { Header } from './Header';

const Layout = () => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header
        open={open}
        handleDrawerOpen={handleDrawerOpen}
      />
      <Drawer
        open={open}
        handleDrawerClose={handleDrawerClose}
      />
      <Box
        component='main'
        sx={{ flexGrow: 1, p: 3 }}
      >
        <DrawerHeaderUI />
        {navigation.state === 'loading' && <p>Loading ...</p>}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
