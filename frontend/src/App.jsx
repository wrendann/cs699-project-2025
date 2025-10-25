import { useState, useEffect } from "react";
import SideBarManager from "./components/SideBarManager";
import TopBar from "./components/TopBar";
import { Grid } from "@mui/material";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { signOut } from "./services/users";
import { updateProfile } from "./services/profile";

import Dashboard from "./components/Dashboard";
import Events from "./components/Events";
import EventPage from "./components/EventPage";
import PastEvents from "./components/PastEvents";
import Teams from "./components/Teams";
import Profile from "./components/Profile";
import Signin from "./components/Signin";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 575);
  const [open, setOpen] = useState(false);
  const [lastButton, setLastButton] = useState("dashboard");
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem("IITBTeamFinderUser"))
  );
  const [token, setToken] = useState(
    JSON.parse(window.localStorage.getItem("IITBTeamFinderUserToken"))
  );

  useEffect(() => {
    let pathname = location.pathname
    if (
      !user &&
      !pathname.startsWith("/verify") &&
      !pathname.startsWith("/forgot")
    ) {
      navigate("/signin");
    }
    if(pathname.startsWith("/events"))
      pathname = "/events"
    switch (pathname) {
      case "/":
        setLastButton("dashboard");
        break;
      case "/events":
        setLastButton("events");
        break;
      case "/pastevents":
        setLastButton("pastevents");
        break;
      case "/teams":
        setLastButton("teams");
        break;
      case "/members":
        setLastButton("members");
        break;
      case "/profile":
        setLastButton("profile");
        break;
      case "/signin":
        setLastButton("dashboard");
        if (user) {
          navigate("/");
        }
        break;
      default:
        if (
          !pathname.startsWith("/verify") &&
          !pathname.startsWith("/forgot")
        ) {
          setLastButton("dashboard");
          navigate("/");
        }
    }
  }, []);

  useEffect(() => {
    if (
      !user &&
      !location.pathname.startsWith("/verify") &&
      !location.pathname.startsWith("/forgot")
    ) {
      navigate("/signin");
    } else {
      if (location.pathname === "/signin") {
        navigate("/");
        setLastButton("dashboard");
      }
    }
  }, [user]);

  const handleResize = () => {
    if (window.innerWidth < 900) {
      setIsMobile(true);
      if (window.innerWidth < 575) {
        setIsNarrow(true);
      } else {
        setIsNarrow(false);
      }
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("IITBTeamFinderUser");
    setToken(null);
    window.localStorage.removeItem("IITBTeamFinderUserToken");
    signOut();
  };

  const profileUpdate = async () => {
    let userProfile;
    try {
      userProfile = await updateProfile();
    } catch (exception) {
      logout();
    }
    if (!userProfile.user) logout();
    else {
      setUser(userProfile.user);
      window.localStorage.setItem(
        "IITBTeamFinderUser",
        JSON.stringify(userProfile.user)
      );
    }
  };

  useEffect(() => {
    if (user) {
      handleResize();
      //profileUpdate(); --- FUNCTION NOT IMPLEMENTED, KEEPS PROFILE DETAILS UPDATED
    }
  }, []);

  if (location.pathname.startsWith("/forgot")) {
    const token = location.pathname.substring(8);
    return <ForgotPassword token={token} />;
  }

  if (!user) {
    return <Signin setUser={setUser} />;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    // This top-level Box handles the full-screen layout.
    <Grid container flexWrap="nowrap">
      <SideBarManager
        isMobile={isMobile}
        open={open}
        handleClose={handleClose}
        lastButton={lastButton}
        setLastButton={setLastButton}
      />
      {/* This Box will handle the main content and take up all remaining space. */}
      <Grid container item direction="column" flexGrow={1}>
        <TopBar
          isMobile={isMobile}
          handleClickOpen={handleClickOpen}
          isNarrow={isNarrow}
          user={user}
          logout={logout}
          setLastButton={setLastButton}
        />
        {/* This inner Box contains the routes and will grow to fill the remaining vertical space. */}
        <Grid item style={{ scrollBehavior: "smooth" }}>
          <Box
              height="calc(100vh)"
              style={{
                overflowY: "scroll",
                backgroundColor: "#f1f5f9",
              }}
            >
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <Dashboard
                    isNarrow={isNarrow}
                    setLastButton={setLastButton}
                    user={user}
                  />
                }
              />
              <Route path="/events" element={<Events 
                    isNarrow={isNarrow}
                    setLastButton={setLastButton}
                    user={user}
                />} />
              <Route 
                path="/events/:eventId" 
                element={
                  <EventPage 
                    isNarrow={isNarrow}
                    setLastButton={setLastButton}
                    user={user}
                  />
                } 
              />
              <Route path="/pastevents" element={<PastEvents />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default App;