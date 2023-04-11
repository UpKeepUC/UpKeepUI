import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Topbar from "./pages/global/topbar";
import Sidebar from "./pages/global/sidebar";
import Home from "./pages/home";
import Inventory from "./pages/inventory";
import MaintenanceTask from "./pages/maintenanceTask";
import Calendar from "./pages/calendar/calendar";
import Rooms from "./pages/rooms";
import Admin from "./pages/admin";
import UserForm from "./pages/userForm";
import FAQ from "./pages/faq";
import SignIn from "./pages/login";
import SignUp from "./pages/register";
import InventoryView from "./pages/inventory/view";
import MaintenanceView from "./pages/maintenanceTask/view";

function App() {
  const [theme, colorMode] = useMode();
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">


          {authenticated && <Sidebar />}
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/login" element={<SignIn setAuthenticated={setAuthenticated} />} />
                

              <Route path="/" element={authenticated ? <Home /> : <SignIn setAuthenticated={setAuthenticated} />} />


              <Route path="/register" element={<SignUp />} />

              <Route path="/home" element={<Home />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/maintenanceTask" element={<MaintenanceTask />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/userForm" element={<UserForm />} />
              <Route path="/faq" element={<FAQ />} />
              
              <Route path="/inventory/:id" element={<InventoryView />} />
              <Route path="/maintenanceTask/:id" element={<MaintenanceView/>}/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
