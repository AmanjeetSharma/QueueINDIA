import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { DepartmentProvider } from "./context/DepartmentContext";
import { ServiceProvider } from "./context/ServiceContext";
import { Toaster } from "react-hot-toast";
import { BookingProvider } from "./context/BookingContext";
import { AdminProvider } from "./context/AdminContext";
import { DepartmentOfficerProvider } from "./context/DepartmentOfficerContext";
import { QueueProvider } from "./context/QueueContext";

const App = () => {
  return (
    <AuthProvider>
      {/* Core providers first */}
      <DepartmentProvider>
        <ServiceProvider>
          <BookingProvider>
            {/* Role-specific providers (depend on AuthContext) */}
            <AdminProvider>
              <DepartmentOfficerProvider>
                <QueueProvider>
                  {/* Routes */}
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
                </QueueProvider>
              </DepartmentOfficerProvider>
            </AdminProvider>
          </BookingProvider>
        </ServiceProvider>
      </DepartmentProvider>
    </AuthProvider>
  );
};

export default App;