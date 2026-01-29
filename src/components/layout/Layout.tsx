import { useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";

import { DrawerHeaderUI } from "../ui/DrawerHeaderUI";
import { Drawer } from "./Drawer";
import { Header } from "./Header";

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header open={open} handleDrawerOpen={handleDrawerOpen} isMobile={isMobile} />
      <Drawer open={open} handleDrawerClose={handleDrawerClose} isMobile={isMobile} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${open ? 240 : 64}px)` },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <DrawerHeaderUI />
        {navigation.state === "loading" && <p>Loading ...</p>}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
