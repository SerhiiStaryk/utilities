import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AppBarUI } from "../ui/AppBarUI";
import { useState } from "react";
import { Avatar, Menu, MenuItem, ListItemIcon, Box, Tooltip, Divider } from "@mui/material";
import { Logout, Settings, Person } from "@mui/icons-material";
import { useAuth } from "../../app/providers/AuthProvider";
import { logout } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type HeaderProps = {
  open: boolean;
  handleDrawerOpen: () => void;
  isMobile?: boolean;
};

export const Header = ({ open, handleDrawerOpen, isMobile }: HeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
  };

  return (
    <AppBarUI position="fixed" open={open} isMobile={isMobile}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={[
            {
              marginRight: { xs: 2, sm: 5 },
            },
            !isMobile && open && { display: "none" },
          ]}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {t("app.title")}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
          <Tooltip title={t("settings.account")}>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={menuOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
            >
              <Avatar
                src={user?.photoURL || ""}
                sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
              >
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={menuOpen}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => handleNavigate("/settings/profile")}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            {t("settings.profile")}
          </MenuItem>
          <MenuItem onClick={() => handleNavigate("/settings")}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            {t("nav.settings")}
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            <Typography color="error">{t("nav.logout")}</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBarUI>
  );
};


