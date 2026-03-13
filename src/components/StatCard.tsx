import { Card, Typography, CardContent, CircularProgress } from "@mui/material";

type StatCardProps = {
  title: string;
  value: string | number;
  loading?: boolean;
};

export const StatCard = ({ title, value, loading }: StatCardProps) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Typography
        color="textSecondary"
        gutterBottom
        variant="overline"
        fontSize={{ sx: 10, md: 12, lg: 14 }}
      >
        {title}
      </Typography>
      {loading ? (
        <CircularProgress size={24} sx={{ mt: 1 }} />
      ) : (
        <Typography component="div" variant="h4" fontSize={{ sx: 16, md: 20, lg: 24 }}>
          {value}
        </Typography>
      )}
    </CardContent>
  </Card>
);
