import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AppBarUI } from "../ui/AppBarUI";

type HeaderProps = {
  open: boolean;
  handleDrawerOpen: () => void;
  isMobile?: boolean;
};

export const Header = ({ open, handleDrawerOpen, isMobile }: HeaderProps) => (
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
      <Typography variant="h6" noWrap component="div">
        Комуналка
      </Typography>
    </Toolbar>
  </AppBarUI>
);

