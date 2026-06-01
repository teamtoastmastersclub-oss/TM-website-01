import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from 'sonner';
import { Preloader } from "./components/Preloader";

export default function App() {
  return (
    <Preloader>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </Preloader>
  );
}
