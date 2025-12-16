import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { DepartmentProvider } from "./context/DepartmentContext";
import { ServiceProvider } from "./context/ServiceContext";
import { BookingProvider } from "./context/BookingContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
      <DepartmentProvider>
        <ServiceProvider>
          <BookingProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
            }}
          />
          </BookingProvider>
        </ServiceProvider>
      </DepartmentProvider>
    </AuthProvider>
  );
};

export default App;