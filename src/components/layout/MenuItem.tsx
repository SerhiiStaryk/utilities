import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { listMenuType } from "./Drawer";

type MenuItemProps = {
  item: listMenuType;
  open: boolean;
  handleDrawerClose?: () => void;
};

export const MenuItem: React.FC<MenuItemProps> = ({ item, open, handleDrawerClose }) => {
  return (
    <Link
      to={item.route || ""}
      onClick={handleDrawerClose}
      style={{
        color: "inherit",
        textDecoration: "none",
      }}
    >

      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          sx={[
            {
              minHeight: 48,
              px: 2.5,
            },
            open
              ? {
                  justifyContent: "initial",
                }
              : {
                  justifyContent: "center",
                },
          ]}
        >
          <ListItemIcon
            sx={[
              {
                minWidth: 0,
                justifyContent: "center",
              },
              open ? { mr: 3 } : { mr: "auto" },
            ]}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.name} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};
