import { FC } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "@/app/routes/router";

const AppRouterProvider: FC = () => <RouterProvider router={router} />;

export default AppRouterProvider;
