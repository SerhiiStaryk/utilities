import { List } from "@mui/material";
import { MenuItem } from "./MenuItem";
import { listMenuType } from "./Drawer";

type MenuListProps = {
  open: boolean;
  list: listMenuType[];
};

export const MenuList: React.FC<MenuListProps> = ({ list, open }) => {
  return (
    <List>
      {list.map((item, index) => (
        <MenuItem key={index} item={item} open={open} />
      ))}
    </List>
  );
};
