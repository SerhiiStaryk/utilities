import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledModalContent = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 1100,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  outline: "none",
}));
