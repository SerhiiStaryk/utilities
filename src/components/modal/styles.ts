import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledModalContent = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "calc(100% - 32px)",
  maxWidth: 1100,
  maxHeight: "calc(100% - 32px)",
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.shadows[24],
  outline: "none",
  overflow: "hidden", // Parent doesn't scroll, children do
  [theme.breakpoints.down("sm")]: {
    top: 0,
    left: 0,
    transform: "none",
    width: "100%",
    height: "100%",
    maxHeight: "100%",
    borderRadius: 0,
  },
}));



