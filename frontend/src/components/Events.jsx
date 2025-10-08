import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EventMiniBox from "./EventMiniBox";

import { useNavigate } from "react-router-dom";

import { getEvents } from "../services/events";
import AddNewEvent from "./AddNewEvent";
import { useState, useEffect } from "react";

const fetchEvents = async(setEvents) => {
  let events;
  try
  {
    events = await getEvents();
    setEvents(events)
  }
  catch(e)
  {
    console.log(e);
  }
}


const Events = ({ setLastButton, user }) => {
  const [events, setEvents] = useState([]);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  useEffect(() => {
    fetchEvents(setEvents);
  }, [])
  
  return (
    <Grid item size={{xs: 12, lg:7}}>
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
            {events.map(e => <EventMiniBox eventInfo={e} />)}
          </Grid>

          <Fab color="primary" aria-label="add" onClick={(e) => {
            e.preventDefault();
            setAddressFormOpen(true);
          }}
             sx={{position: "fixed", bottom: 16, right: 16}}>
            <AddIcon />
          </Fab>
          <AddNewEvent open={addressFormOpen} setOpen={setAddressFormOpen} />
      </Box>
    </Grid>
  );
};

export default Events;