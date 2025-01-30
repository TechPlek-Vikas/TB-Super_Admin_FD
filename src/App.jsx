import { BrowserRouter as Router } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/useAuth";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;
