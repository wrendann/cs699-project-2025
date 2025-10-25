import React from 'react';
import { 
    Box, 
    Typography, 
    Stack,
    Button,
    Grid 
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';


const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};


const EventMiniBox = ({ eventInfo, setLastButton }) => {

    const navigate = useNavigate();

  const startDateFormatted = formatDate(eventInfo.start_date);
  const dateSummary = startDateFormatted.split(',')[0]; 
  
  const handleViewDetails = (e) => {
    e.stopPropagation(); 
    setLastButton('events');
    navigate(`/events/${eventInfo.id}`);
  };

  return (
    <Box 
      sx={{ 
        padding: '15px',
        mx: 'auto', 
        my: 2, 
        p: 2, 
        borderRadius: 2, 
        backgroundColor: 'white',
        boxShadow: 4, 
        transition: 'box-shadow 0.3s',
        '&:hover': {
            boxShadow: 8, 
        }
      }}
    >
        <Box sx={{ pb: 1, borderBottom: '1px solid', borderColor: 'grey.300', mb: 1.5 }}>
            <Typography 
                variant="h6"
                sx={{ fontWeight: 600, color: 'text.primary' }}
            >
                {eventInfo.name}
            </Typography>
        </Box>

        <Grid 
            container 
            spacing={2} 
            alignItems="center"
            sx={{ mb: 1.5 }}
        >
            <Grid item xs={12} sm={8}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', overflow: 'hidden' }}>
                    <LocationOnIcon fontSize="small" color="primary" />
                    <Typography variant="body2" noWrap>
                        {eventInfo.location}
                    </Typography>
                </Stack>
            </Grid>
            
            <Grid item xs={12} sm={4}>
                <Stack 
                    direction="row" 
                    spacing={1} 
                    alignItems="center" 
                    justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                    sx={{ color: 'text.secondary' }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {dateSummary}
                    </Typography>
                    <CalendarTodayIcon fontSize="small" color="success" />
                </Stack>
            </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1, borderTop: '1px solid', borderColor: 'grey.100' }}>
            <Button 
                size="small" 
                variant="outlined" 
                color="primary"
                onClick={handleViewDetails}
            >
                View Details
            </Button>
        </Box>
    </Box>
  );
};

export default EventMiniBox;