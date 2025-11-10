import { useEffect, useState } from 'react';
import { getUserTeams } from '../services/users';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Stack
} from '@mui/material';

const Teams = ({ user }) => {
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const currentUserId = user.pk;
                const fetchedTeams = await getUserTeams(currentUserId);
                setTeams(fetchedTeams);
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            }
        };

        fetchTeams();
    }, [user.pk]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Your Teams
            </Typography>
            <Stack spacing={2}>
                {teams.length > 0 ? (
                    teams.map((team) => (
                        <Card key={team.id} sx={{ boxShadow: 3, display: 'flex', flexDirection: 'row', alignItems: 'center', p: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {team.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {team.description || 'No description provided.'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Event: {team.event_name || 'No event specified'}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Typography variant="body2">
                                        Members: {team.current_size}/{team.max_size}
                                    </Typography>
                                    {team.is_full && (
                                        <Typography variant="body2" color="error">
                                            (Full)
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => navigate(`/teams/${team.id}`)}
                            >
                                View Team
                            </Button>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        No teams found.
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default Teams;