import { Grid, Typography, TextField } from "@mui/material";
import { Box } from "@mui/system";
import EventMiniBox from "./EventMiniBox";

import { getPastEvents } from "../services/events";
import { useState, useEffect } from "react";

const fetchEvents = async(setEvents) => {
  let events;
  try
  {
    events = await getPastEvents();
    events = events.filter((e) => new Date(e.end_date).getTime() < new Date())
    setEvents(events)
  }
  catch(e)
  {
    console.log(e);
  }
}


const PastEvents = ({ setLastButton, user }) => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents(setEvents);
  }, [])
  
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Grid item size={{xs: 12, lg:7}}>
      <Box display="flex"
        flexDirection="column"
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
        <TextField
          label="Search Events"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
          {filteredEvents.map((e) => (
            <EventMiniBox eventInfo={e} setLastButton={setLastButton} />
          ))}
        </Grid>
      </Box>
    </Grid>
  );
};

export default PastEvents;