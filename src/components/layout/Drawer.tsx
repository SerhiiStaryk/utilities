import { useTheme } from "@mui/material/styles";
import { Box, Divider, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HouseIcon from "@mui/icons-material/House";
import { DrawerUI } from "../ui/DrawerUI";
import { DrawerHeaderUI } from "../ui/DrawerHeaderUI";
import { MenuList } from "./MenuList";
import React from "react";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

type DrawerProps = {
  open: boolean;
  handleDrawerClose: () => void;
  isMobile?: boolean;
};

export type listMenuType = {
  icon?: React.ReactNode;
  name: string;
  route?: string;
};

export const Drawer = ({ open, handleDrawerClose, isMobile }: DrawerProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const listMenu1: listMenuType[] = [
    { name: t("nav.dashboard", "Dashboard"), route: "/", icon: <DashboardIcon /> },
    { name: t("nav.addresses", "Addresses"), route: "address-list", icon: <HouseIcon /> },
  ];
  const listMenu2: listMenuType[] = [
    { name: t("nav.settings", "Settings"), route: "settings", icon: <SettingsIcon /> },
  ];

  return (
    <DrawerUI
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={isMobile ? handleDrawerClose : undefined}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <DrawerHeaderUI
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        {(open || isMobile) && (
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: 48,
            }}
          />
        )}

        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeaderUI>
      <Divider />
      <MenuList
        open={!!(open || isMobile)}
        list={listMenu1}
        handleDrawerClose={isMobile ? handleDrawerClose : undefined}
      />
      <Divider />
      <MenuList
        open={!!(open || isMobile)}
        list={listMenu2}
        handleDrawerClose={isMobile ? handleDrawerClose : undefined}
      />
    </DrawerUI>
  );
};
