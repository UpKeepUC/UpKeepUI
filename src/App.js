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
import jwtDecode from "jwt-decode";

function App() {
  const [theme, colorMode] = useMode();
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("upkeeptoken");

    if (token !== null) {
      try {
        let decodedToken = jwtDecode(token);
        let currentDate = new Date();

        // JWT exp is in seconds
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          navigate("/login");
        } else {
          setAuthenticated(true);
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    }

  },[]);

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

              <Route path="/home" element={authenticated ?<Home />: <SignIn setAuthenticated={setAuthenticated} />} />
              <Route path="/inventory" element={authenticated ?<Inventory /> :<SignIn setAuthenticated={setAuthenticated} />} />
              <Route path="/maintenanceTask" element={authenticated ?<MaintenanceTask />: <SignIn setAuthenticated={setAuthenticated} />} />
              <Route path="/calendar" element={authenticated ?<Calendar />: <SignIn setAuthenticated={setAuthenticated} />} />
              <Route path="/rooms" element={authenticated ?<Rooms />: <SignIn setAuthenticated={setAuthenticated} />} />
              <Route path="/admin" element={authenticated ?<Admin />: <SignIn setAuthenticated={setAuthenticated} />} />
              <Route path="/userForm" element={authenticated ?<UserForm />: <SignIn setAuthenticated={setAuthenticated} />} />
              <Route path="/faq" element={authenticated ?<FAQ />: <SignIn setAuthenticated={setAuthenticated} />} />
              
              <Route path="/inventory/:id" element={authenticated ?<InventoryView />: <SignIn setAuthenticated={setAuthenticated} />} />
              <Route path="/maintenanceTask/:id" element={authenticated ?<MaintenanceView/>: <SignIn setAuthenticated={setAuthenticated} />}/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
