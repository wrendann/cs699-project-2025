import React from 'react';
import { 
    Box, 
    Typography, 
    Stack,
    Button,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People';

const TeamDetailBox = ({ teamInfo, setLastButton }) => {

    const navigate = useNavigate();

    const handleJoin = (e) => {
        e.preventDefault();
        setLastButton('events');
        navigate(`/teams/${teamInfo.id}`);
    };

    const currentSize = Math.max(teamInfo.current_size, 0); 
    const isFull = currentSize >= teamInfo.max_size;
    const isDisabled = !teamInfo.is_open || isFull;

    return (
        <Box
            sx={{
                padding: '15px',
                mx: 'auto', 
                my: 1,
                p: 2, 
                borderRadius: 2, 
                backgroundColor: 'white',
                boxShadow: 2, 
                border: '1px solid',
                borderColor: 'grey.100',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                    boxShadow: 4, 
                }
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ pb: 1, borderBottom: '1px solid', borderColor: 'grey.100', mb: 1.5 }}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                    {teamInfo.name}
                </Typography>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={handleJoin}
                    disabled={isDisabled}
                >
                    {isDisabled ? (isFull ? "Full" : "Closed") : "Join"}
                </Button>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {teamInfo.description}
            </Typography>

            <Stack direction="row" spacing={3} sx={{ color: 'text.secondary', mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'grey.50' }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <PeopleIcon fontSize="small" color="primary" />
                    <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                        {currentSize}/{teamInfo.max_size} Members
                    </Typography>
                </Stack>
                {teamInfo.required_skills && (
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                            Skills:
                        </Typography>
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                            {teamInfo.required_skills}
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Box>
    );
};

export default TeamDetailBox;