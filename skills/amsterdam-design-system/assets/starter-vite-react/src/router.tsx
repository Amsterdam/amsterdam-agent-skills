import { createBrowserRouter } from "react-router-dom"

import { AppLayout } from "@/layouts/AppLayout"
import { HomePage } from "@/pages/HomePage"
import { NotFoundPage } from "@/pages/NotFoundPage"

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
