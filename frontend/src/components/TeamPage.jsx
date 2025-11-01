import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    TextField,
    Typography,
    Grid,
    Stack,
    CircularProgress,
    Button,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import EventIcon from '@mui/icons-material/Event';
import EngineeringIcon from '@mui/icons-material/Engineering';

import {
    getTeamInfo,
    acceptTeamMember,
    rejectTeamMember,
    kickTeamMember,
    updateTeamMemberRole,
    leaveTeam,
    acceptTeamInvite,
    rejectTeamInvite,
    inviteTeamMember,
    requestToJoinTeam
} from '../services/teams'; 

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};


const TeamPage = ({ 
    user
}) => {
    const { teamID } = useParams();
    const currentUserId = user.pk;
    const currentUsername = user.username;
    const [teamDetails, setTeamDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [roleEdits, setRoleEdits] = useState({}); 
    const [inviteUserId, setInviteUserId] = useState('');

    const isOwner = teamDetails && teamDetails.owner === currentUsername;
    const isMember = teamDetails && teamDetails.approved_members.some(m => m.user === currentUserId);
    const hasPendingRequest = teamDetails && teamDetails.pending_requests.some(m => m.user === currentUserId);

    const fetchTeamData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const info = await getTeamInfo(teamID);
            
            const resolveUsername = (userId) => {
                if (userId === currentUserId) return currentUsername;
                if (userId === "5b1ceadb-0399-4446-84eb-99c9c74db034") return "Ziyad123"; // Assuming Ziyad123 is the owner example ID
                return `User-${userId.substring(0, 4)}`; // Generic placeholder
            };

            const mockedInfo = { ...info };
            mockedInfo.approved_members = info.approved_members.map(m => ({
                ...m,
                username: resolveUsername(m.user)
            }));
            mockedInfo.pending_requests = info.pending_requests.map(m => ({
                ...m,
                username: resolveUsername(m.user)
            }));
            
            setTeamDetails(mockedInfo);
        } catch (e) {
            console.error("Error fetching team details:", e);
            setError("Failed to load team details. Please try again.");
            setTeamDetails(null);
        } finally {
            setIsLoading(false);
        }
    }, [teamID, currentUserId, currentUsername]);

    useEffect(() => {
        if (teamID && currentUserId) {
            fetchTeamData();
        }
    }, [teamID, currentUserId, fetchTeamData]);

    const handleAction = (apiCall, successMsg, memberID = null, role = null) => async () => {
        setError('');
        setSuccessMessage('');
        try {
            // Execute the API call
            if (memberID && role) {
                await apiCall(teamID, memberID, role);
            } else if (memberID) {
                await apiCall(teamID, memberID);
            } else {
                await apiCall(teamID);
            }

            setSuccessMessage(successMsg);
            // Re-fetch data to update the UI
            await fetchTeamData();
            // Clear role edit state if it was a role update
            if (role) {
                setRoleEdits(prev => {
                    const newState = { ...prev };
                    delete newState[memberID];
                    return newState;
                });
            }

        } catch (e) {
            console.error("Team action failed:", e);
            setError(`Action failed: ${e.response?.data?.detail || e.message}`); 
        }
    };

    const handleAccept = (userID) => handleAction(acceptTeamMember, 'Member accepted!', userID);
    const handleReject = (userID) => handleAction(rejectTeamMember, 'Request rejected.', userID);
    const handleKick = (userID) => handleAction(kickTeamMember, 'Member kicked.', userID);
    const handleUpdateRole = (userID) => handleAction(updateTeamMemberRole, 'Role updated!', userID, roleEdits[userID]);
    const handleInvite = (userID) => handleAction(inviteTeamMember, `Invite sent to user ID: ${userID}`, userID); 

    const handleLeave = handleAction(leaveTeam, 'You have left the team.');
    const handleRequestJoin = handleAction(requestToJoinTeam, 'Request to join sent successfully!');
    const handleAcceptInvite = handleAction(acceptTeamInvite, 'You have accepted the invitation and joined the team!');
    const handleRejectInvite = handleAction(rejectTeamInvite, 'You have rejected the invitation.');


    if (isLoading) {
        return (
            <Grid container justifyContent="center" sx={{ p: 4 }}>
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading team details...</Typography>
            </Grid>
        );
    }

    if (!teamDetails) {
        return (
            <Grid container justifyContent="center" sx={{ p: 4 }}>
                <Alert severity="error">{error || "Team Not Found or Error Loading."}</Alert>
            </Grid>
        );
    }

    const {
        name,
        description,
        event,
        owner,
        max_size,
        current_size,
        is_full,
        required_skills,
        is_open,
        created_at,
        approved_members,
        pending_requests,
    } = teamDetails;

    return (
        <Grid item size={{ xs: 12 }} sx={{ mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Box
                sx={{
                    padding: { xs: "2%", md: "2.5%" },
                    borderRadius: "20px",
                    backgroundColor: "white",
                    boxShadow: 4,
                }}
            >
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.300', mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{ fontWeight: 700, color: 'text.primary' }}
                        >
                            <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                            {name}
                        </Typography>
                        
                        <Box>

                            {isMember && (
                                <Button variant="contained" color="error" onClick={handleLeave}>
                                    <LogoutIcon sx={{ mr: 1 }} /> Leave Team
                                </Button>
                            )}

                            {!isOwner && !isMember && !hasPendingRequest && is_open && !is_full && (
                                <Button variant="contained" color="primary" onClick={handleRequestJoin}>
                                    <PersonAddIcon sx={{ mr: 1 }} /> Request to Join
                                </Button>
                            )}
                            
                            {hasPendingRequest && (
                                <Button variant="outlined" disabled>
                                    Pending Request
                                </Button>
                            )}

                        </Box>
                    </Stack>

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

                    <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                        {description}
                    </Typography>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} sx={{ mt: 2, p: 1 }}>
                        <Card key="owner" variant="outlined" sx={{ mb: 1.5, p: 1 }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <PersonPinIcon color="primary" fontSize="small" />
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Owner: {owner} {isOwner && "(You)"}
                                </Typography>
                            </Stack>
                        </Card>
                        <Card key="event" variant="outlined" sx={{ mb: 1.5, p: 1 }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <EventIcon color="primary" fontSize="small" />
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Event: {event}
                                </Typography>
                            </Stack>
                        </Card>
                        <Card key="created_at" variant="outlined" sx={{ mb: 1.5, p: 1 }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarTodayIcon color="primary" fontSize="small" />
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Created: {formatDateTime(created_at)}
                                </Typography>
                            </Stack>
                        </Card>
                        <Card key="members" variant="outlined" sx={{ mb: 1.5, p: 1 }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <PeopleIcon color="primary" fontSize="small" />
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Members: {current_size}/{max_size} {is_full && <span style={{color: 'red'}}>(Full)</span>}
                                </Typography>
                            </Stack>
                        </Card>
                    </Stack>
                    <Card key="members" variant="outlined" sx={{ mb: 1.5, p: 1, marginLeft: 1 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <EngineeringIcon color="primary" fontSize="small" />
                            <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 1 }}>
                                Required Skills: {required_skills || 'None specified'}
                            </Typography>
                        </Stack>
                    </Card>
                </Box>

                {isOwner && pending_requests.length > 0 && (
                    <Box sx={{ p: 2, mb: 3 }}>
                        <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            sx={{ fontWeight: 600, borderBottom: '2px solid', borderColor: 'warning.main', display: 'inline-block', pb: 0.5 }}
                        >
                            Pending Requests ({pending_requests.length})
                        </Typography>
                        <List dense>
                            {pending_requests.map((request) => (
                                <Card key={request.id} variant="outlined" sx={{ mb: 1.5 }}>
                                    <ListItem>
                                        <ListItemText
                                            primary={request.username}
                                            secondary={`Requested on: ${formatDateTime(request.joined_at)}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <Button 
                                                size="small" 
                                                color="success" 
                                                onClick={handleAccept(request.user)} 
                                                sx={{ mr: 1 }}>
                                                <CheckIcon fontSize="small" /> Accept
                                            </Button>
                                            <Button 
                                                size="small" 
                                                color="error" 
                                                onClick={handleReject(request.user)}>
                                                <CloseIcon fontSize="small" /> Reject
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Card>
                            ))}
                        </List>
                    </Box>
                )}
                <Box sx={{ p: 2 }}>
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: 600, borderBottom: '2px solid', borderColor: 'primary.main', display: 'inline-block', pb: 0.5 }}
                    >
                        Approved Members ({approved_members.length})
                    </Typography>
                    
                    <List>
                        {approved_members.map((member) => (
                            <Card key={member.id} variant="outlined" sx={{ mb: 1.5 }}>
                                <ListItem>
                                    <ListItemText
                                        primary={member.username}
                                        secondary={member.role ? `Role: ${member.role}` : 'No Role'}
                                    />
                                    <ListItemSecondaryAction>
                                        {isOwner && member.user !== currentUserId && (
                                            <>
                                                {roleEdits[member.user] ? (
                                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 1 }}>
                                                        <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                                            <InputLabel>New Role</InputLabel>
                                                            <Select
                                                                value={roleEdits[member.user] || member.role || 'Member'}
                                                                onChange={(e) => setRoleEdits(prev => ({ ...prev, [member.user]: e.target.value }))}
                                                                label="New Role"
                                                            >
                                                                {['Leader', 'Member', 'Designer', 'Coder'].map(role => (
                                                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        <IconButton edge="end" aria-label="save-role" color="primary" onClick={handleUpdateRole(member.user)}>
                                                            <CheckIcon />
                                                        </IconButton>
                                                        <IconButton edge="end" aria-label="cancel-role" onClick={() => setRoleEdits(prev => {
                                                            const newState = { ...prev };
                                                            delete newState[member.user];
                                                            return newState;
                                                        })}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Stack>
                                                ) : (
                                                    <IconButton edge="end" aria-label="edit-role" onClick={() => setRoleEdits(prev => ({ ...prev, [member.user]: member.role || 'Member' }))} sx={{ mr: 1 }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                                
                                                <Button 
                                                    size="small" 
                                                    color="error" 
                                                    onClick={handleKick(member.user)} 
                                                    disabled={member.user === currentUserId}
                                                >
                                                    Kick
                                                </Button>
                                            </>
                                        )}
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </Card>
                        ))}
                    </List>
                </Box>

                {isOwner && (
                    <Card variant="outlined" sx={{ p: 2, mt: 3, backgroundColor: 'grey.50' }}>
                        <Typography variant="h6" gutterBottom>Invite New Member</Typography>
                        
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Enter the username of the person you want to invite.
                        </Alert>

                        <Stack direction="row" spacing={2} alignItems="center">
                            {/* Text Field for User ID */}
                            <TextField
                                label="Username to Invite"
                                variant="outlined"
                                size="small"
                                value={inviteUserId}
                                onChange={(e) => setInviteUserId(e.target.value)}
                                sx={{ flexGrow: 1 }}
                            />
                            
                            {/* Invite Button */}
                            <Button 
                                variant="contained" 
                                color="info" 
                                // Call the bound handler with the state value
                                onClick={handleInvite(inviteUserId)}
                                startIcon={<SendIcon />}
                                // Disable if the input field is empty
                                disabled={!inviteUserId}
                            >
                                Invite User
                            </Button>
                        </Stack>
                    </Card>
                )}
            </Box>
        </Grid>
    );
};

export default TeamPage;