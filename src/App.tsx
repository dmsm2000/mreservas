import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Reservations from "./pages/reservations";
import Settings from "./pages/services";

import { QueryClient, QueryClientProvider } from "react-query";
import Services from "./pages/services";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
