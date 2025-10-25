import React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { Grid, Button, Dialog, Slide, Typography } from "@mui/material";

// Import your new icons for the buttons
import DashboardIcon from "../assets/sidebar/dashboardicon.png";
import EventsIcon from "../assets/sidebar/events.png";
import PastEventsIcon from "../assets/sidebar/pastevents.png";
import TeamsIcon from "../assets/sidebar/teams.png";
import ProfileIcon from "../assets/sidebar/profile.png";
import Logo from "../assets/sidebar/logo.png";

const SideBarButton = ({
  label,
  icon,
  name,
  lastButton,
  setLastButton,
  link,
  handleClose,
}) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault();
    setLastButton(name);
    navigate(link);
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <Grid item xs={12}>
      <Button
        disableTouchRipple
        size="large"
        variant="outlined"
        startIcon={
          icon ? (
            <img
              src={icon}
              style={{ color: lastButton === name ? "red" : "" }}
              width="18px"
              alt=""
            />
          ) : null
        }
        style={{
          textTransform: "none",
          color: lastButton === name ? "black" : "rgba(0,0,0,0.8)",
          position: "relative",
          left: "10px",
          width: "259px",
          border: "none",
          fontSize: "20px",
          justifyContent: "flex-start",
          borderRight: lastButton === name ? "4px solid blue" : "none",
          borderRadius: "0px",
        }}
        onClick={(e) => handleClick(e)}
      >
        <span
          style={{ position: "relative", left: icon === null ? "20px" : "0px" }}
        >
          {label}
        </span>
      </Button>
    </Grid>
  );
};

// Removed SideBarMenuButton since there are no nested menu items in the new design.

const SideBar = ({ lastButton, setLastButton, handleClose }) => {
  const navigate = useNavigate();

  const handleTitleClick = (event) => {
    event.preventDefault();
    setLastButton("dashboard");
    navigate("/");
  };

  return (
    <div>
      <Box
        style={{
          width: "275px",
          height: "100vh",
          backgroundColor: "white",
          overflowY: "auto",
        }}
      >
        <Grid container spacing={2}>
          <Grid container item style={{ marginTop: "5px" }} marginLeft={"10px"}>
            <Grid item>
              <img src={Logo} width="70px" alt="SHIPLIV logo" />
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="h4"
                style={{
                  position: "relative",
                  top: "13px",
                  cursor: "pointer",
                  fontFamily: "Barlow Condensed",
                  color: "#2D3748",
                  fontStyle: "italic",
                }}
                onClick={(e) => handleTitleClick(e)}
              >
                TEAMFINDER
              </Typography>
            </Grid>
          </Grid>

          <SideBarButton
            label=" Dashboard"
            icon={DashboardIcon}
            name="dashboard"
            lastButton={lastButton}
            setLastButton={setLastButton}
            link="/"
            handleClose={handleClose}
          />
          <SideBarButton
            label=" Events"
            icon={EventsIcon}
            name="events"
            lastButton={lastButton}
            setLastButton={setLastButton}
            link="/events"
            handleClose={handleClose}
          />
          <SideBarButton
            label=" Past Events"
            icon={PastEventsIcon}
            name="pastevents"
            lastButton={lastButton}
            setLastButton={setLastButton}
            link="/pastevents"
            handleClose={handleClose}
          />
          <SideBarButton
            label=" Teams"
            icon={TeamsIcon}
            name="teams"
            lastButton={lastButton}
            setLastButton={setLastButton}
            link="/teams"
            handleClose={handleClose}
          />
          <SideBarButton
            label=" Profile"
            icon={ProfileIcon}
            name="profile"
            lastButton={lastButton}
            setLastButton={setLastButton}
            link="/profile"
            handleClose={handleClose}
          />
        </Grid>
      </Box>
    </div>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const SideBarManager = ({
  isMobile,
  open,
  handleClose,
  lastButton,
  setLastButton,
}) => {
  if (!isMobile) {
    return (
      <Grid item style={{ width: "275px", positon: "sticky", top: "1px" }}>
        <SideBar lastButton={lastButton} setLastButton={setLastButton} />
      </Grid>
    );
  }

  return (
    <Dialog
      PaperProps={{
        sx: {
          position: "fixed",
          top: 0,
          left: 0,
          m: 0,
          minHeight: "100vh",
          maxHeight: "100vh",
        },
      }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="sidebar-dialog-slide-description"
    >
      <SideBar
        lastButton={lastButton}
        setLastButton={setLastButton}
        handleClose={handleClose}
      />
    </Dialog>
  );
};

export default SideBarManager;