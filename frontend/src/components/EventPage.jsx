import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Stack,
    CircularProgress
} from '@mui/material';
import Fab from '@mui/material/Fab';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { getEvent } from '../services/events'; 

import TeamDetailBox from './TeamDetailBox'; 
import AddNewTeam from './AddNewTeam';
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const fetchEvent = async(eventId, setEventDetails, setIsLoading) => {
    setIsLoading(true);
    // setEventDetails({
    //     "id": "9693a050-f293-4496-8f2a-8e4c2bf60c06",
    //     "name": "Event Name",
    //     "description": "efwjbibisbvs",
    //     "start_date": "2025-10-27T15:55:00Z",
    //     "end_date": "2025-10-29T12:00:00Z",
    //     "location": "efw31r1r3rf32",
    //     "created_at": "2025-10-25T17:28:32.877595Z",
    //     "teams": [{
    //         "id": "23414",
    //         "name": "Team Synos",
    //         "description": "Always working",
    //         "max_size": 5,
    //         "required_skills": "gumption",
    //         "is_open": true,
    //         "created_at": "2025-10-25T17:28:32.877595Z"
    //     },
    //         {
    //         "id": "234414",
    //         "name": "Team Workhorse",
    //         "description": "Never working",
    //         "max_size": 21,
    //         "required_skills": "javascript",
    //         "is_open": true,
    //         "created_at": "2025-10-25T17:28:32.877595Z"
    //     }
    //     ]
    // })
    try
    {
        const eventInfo = await getEvent(eventId); 
        setEventDetails(eventInfo);
    }
    catch(e)
    {
        console.error("Error fetching event details:", e);
        setEventDetails(null);
    } finally {
        setIsLoading(false);
    } 
}

const EventPage = () => {
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState({ teams: [] }); 
    const [formOpen, setFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEvent(eventId, setEventDetails, setIsLoading);
      }, [eventId]) 

    if (isLoading) {
        return (
            <Grid item size={{ xs: 12, lg: 7 }} sx={{ mx: 'auto', p: 4, textAlign: 'center' }}>
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading event details...</Typography>
            </Grid>
        );
    }

    if (!eventDetails || !eventDetails.name) {
        return (
            <Grid item size={{ xs: 12, lg: 7 }} sx={{ mx: 'auto', p: 4 }}>
                <Typography variant="h5" color="error">Event Not Found or Error Loading.</Typography>
            </Grid>
        );
    }

    const {
        name,
        description,
        start_date,
        end_date,
        location,
        teams = []
    } = eventDetails;

    const formattedStartDate = formatDateTime(start_date);
    const formattedEndDate = formatDateTime(end_date);


    return (
        <Grid item size={{ xs: 12}} sx={{ mx: 'auto' }}>
            <Box
                display="flex"
                flexDirection="column"
                marginLeft={{ xs: "15px", lg: "15px" }}
                marginRight={{ xs: "15px", lg: "15px" }}
                sx={{
                    padding: "2.5%",
                    paddingBottom: "3%",
                    borderRadius: "20px",
                    backgroundColor: "white",
                    marginBottom: "15px",
                    marginTop: "20px",
                    boxShadow: 4,
                }}
            >
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.300', mb: 3 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 700, color: 'text.primary' }}
                    >
                        {name}
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                            <LocationOnIcon color="primary" fontSize="small" />
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {location}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                            <CalendarTodayIcon color="success" fontSize="small" />
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {formattedStartDate} - {formattedEndDate}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {description}
                    </Typography>
                </Box>

                <Box sx={{ p: 2 }}>
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: 600, color: 'text.primary', borderBottom: '2px solid', borderColor: 'primary.main', display: 'inline-block', pb: 0.5 }}
                    >
                        Formed Teams ({teams.length})
                    </Typography>

                    <Grid container spacing={2}>
                        {teams.length > 0 ? (
                            teams.map(team => (
                                <Grid item xs={12} key={team.id}>
                                    <TeamDetailBox teamInfo={team} />
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                                    No teams have been formed for this event yet.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>
                <Fab color="primary" aria-label="add" onClick={(e) => {
                    e.preventDefault();
                    setFormOpen(true);
                }}
                    sx={{position: "fixed", bottom: 16, right: 16, borderRadius: '8px', width: '150px'}}>
                    <pre>Create New Team</pre>
                </Fab>
                <AddNewTeam eventId={eventId} open={formOpen} setOpen={setFormOpen} />
            </Box>
        </Grid>
    );
};

export default EventPage;