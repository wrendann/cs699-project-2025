import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import EventMiniBox from "./EventMiniBox";
import { useNavigate } from "react-router-dom";

import { getEvents } from "../services/events";
import { useState, useEffect } from "react";

const fetchLatestEvents = async(setLatestEvents) => {
  let events;
  try
  {
    events = await getEvents();
    events.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    events = events.slice(0, 3)
    setLatestEvents(events)
  }
  catch(e)
  {
    console.log(e);
  }
}


const WelcomeEventsBox = ({ setLastButton, user, forceScrollRerender }) => {
  const [latestEvents, setLatestEvents] = useState([]);
  useEffect(() => {
    fetchLatestEvents(setLatestEvents);
  }, [])
  
  return (
    <Grid item size={{xs: 12, lg:7}}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginLeft={{ xs: "15px", lg: "15px" }}
        marginRight={{ xs: "15px", lg: "15px" }}
        sx={{
          padding: "2.5%",
          paddingBottom: "3%",
          borderRadius: "20px",
          backgroundColor: "white",
          marginBottom: "15px",
          marginTop: "20px",
        }}
        
      >
        <Grid
          item
          size={12}
          style={{
            backgroundColor: "white",
            marginBottom: "5px",
            marginTop: "5px",
            marginLeft: "10px",
          }}
        >
          <Typography variant="h5" fontFamily="DM Sans" fontWeight="500">
            Welcome, {user}!
          </Typography>
        </Grid>
      </Box>
      <Box display="flex"
        justifyContent="center"
        alignItems="center"
        marginLeft={{ xs: "15px", lg: "15px" }}
        marginRight={{ xs: "15px", lg: "15px" }}
        sx={{
          padding: "2.5%",
          paddingBottom: "3%",
          borderRadius: "20px",
          backgroundColor: "white",
          marginBottom: "15px",
          marginTop: "20px",
        }}>
          <Grid
          item
          size={12}
          style={{
            backgroundColor: "white",
            marginBottom: "5px",
            marginTop: "5px",
            marginLeft: "10px",
          }}
          >
            <Typography variant="h6" fontFamily="DM Sans" fontWeight="500">
              Latest Events
            </Typography>
            {latestEvents.map(e => <EventMiniBox eventInfo={e} setLastButton={setLastButton}/>)}
          </Grid>
      </Box>
    </Grid>
  );
};

const Dashboard = ({ isNarrow, setLastButton, user, }) => {
  return (
    <Grid container direction={"row"} rowSpacing={1.5}>
      <WelcomeEventsBox
        setLastButton={setLastButton}
        user={user}
      />
    </Grid>
  );
};

export default Dashboard;
