import { List } from "@mui/material";
import { MenuItem } from "./MenuItem";
import { listMenuType } from "./Drawer";

type MenuListProps = {
  open: boolean;
  list: listMenuType[];
  handleDrawerClose?: () => void;
};

export const MenuList: React.FC<MenuListProps> = ({ list, open, handleDrawerClose }) => {
  return (
    <List>
      {list.map((item, index) => (
        <MenuItem key={index} item={item} open={open} handleDrawerClose={handleDrawerClose} />
      ))}
    </List>
  );
};
