import { useState } from "react";
import { Outlet, useNavigation, useLocation, Navigate } from "react-router-dom";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";

import { DrawerHeaderUI } from "../ui/DrawerHeaderUI";
import { Drawer } from "./Drawer";
import { Header } from "./Header";
import { Loader } from "../Loader";
import { useAuth } from "../../app/providers/AuthProvider";

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const location = useLocation();
  const { role, allowedPages, loading } = useAuth();

  const isAdmin = role === "admin";

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Permission check
  if (!loading) {
    const path = location.pathname;
    const routeToId: Record<string, string> = {
      "/": "dashboard",
      "/address-list": "address-list",
      "/rental": "rental",
      "/info": "info",
      "/settings": "settings",
    };

    // Find if the path starts with any of the protected routes
    const matchedRoute = Object.keys(routeToId).find(
      (r) => path === r || (r !== "/" && path.startsWith(r)),
    );

    if (matchedRoute && !isAdmin && allowedPages) {
      const pageId = routeToId[matchedRoute];
      if (!allowedPages.includes(pageId)) {
        // Redirect to the first allowed page or home if no pages allowed
        const firstAllowedPath =
          Object.keys(routeToId).find((r) => allowedPages.includes(routeToId[r])) || "/";
        return <Navigate to={firstAllowedPath} replace />;
      }
    }
  }

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
        {navigation.state === "loading" && <Loader />}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
