import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Box, TextField, Typography, Grid, Stack, CircularProgress,
    Button, Card, CardContent, List, ListItem, ListItemText,
    ListItemSecondaryAction, IconButton, Select, MenuItem,
    FormControl, InputLabel, Alert,
} from '@mui/material';
import {
    People as PeopleIcon,
    Group as GroupIcon,
    PersonAdd as PersonAddIcon,
    Send as SendIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Logout as LogoutIcon,
    Edit as EditIcon,
    CalendarToday as CalendarTodayIcon,
    PersonPin as PersonPinIcon,
    Event as EventIcon,
    Engineering as EngineeringIcon,
    Save as SaveIcon,
} from '@mui/icons-material';

import {
    getTeamInfo,
    getRecommendedMembers,
    acceptTeamMember,
    rejectTeamMember,
    kickTeamMember,
    updateTeamMemberRole,
    leaveTeam,
    acceptTeamInvite,
    rejectTeamInvite,
    inviteTeamMember,
    requestToJoinTeam,
    updateTeamDetails
} from '../services/teams';

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const MemberShipActions = React.memo(({ 
    isMember, hasBeenInvited, isOwner, hasPendingRequest, 
    hasBeenRejected, is_open, is_full, handleLeave, 
    handleAcceptInvite, handleRejectInvite, handleRequestJoin 
}) => (
    <Box>
        {isMember && (
            <Button variant="contained" color="error" onClick={handleLeave}>
                <LogoutIcon sx={{ mr: 1 }} /> Leave Team
            </Button>
        )}
        {hasBeenInvited && !isMember && (
            <>
                <Button variant="contained" color="success" onClick={handleAcceptInvite} sx={{ mr: 1 }}>
                    <CheckIcon sx={{ mr: 1 }} /> Accept Invite
                </Button>
                <Button variant="outlined" color="error" onClick={handleRejectInvite}>
                    <CloseIcon sx={{ mr: 1 }} /> Reject Invite
                </Button>
            </>
        )}
        {!hasBeenRejected && !isMember && !hasPendingRequest && is_open && !is_full && !hasBeenInvited && (
            <Button variant="contained" color="primary" onClick={handleRequestJoin}>
                <PersonAddIcon sx={{ mr: 1 }} /> {isOwner ? 'Join Team' : 'Request to Join'}
            </Button>
        )}
        {hasPendingRequest && (
            <Button variant="outlined" disabled>
                Pending Request
            </Button>
        )}
        {hasBeenRejected && (
            <Button variant="outlined" disabled>
                Rejected
            </Button>
        )}
    </Box>
));

const InfoCards = React.memo(({ owner, owner_id, event_name, event_id, created_at, current_size, max_size, is_full, required_skills, isOwner }) => (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} sx={{ mt: 2, p: 1, flexWrap: 'wrap' }}>
        <Card key="owner" variant="outlined" sx={{ mb: 1.5, p: 1 }}>
            <Link to={`/profile/${owner}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <PersonPinIcon color="primary" fontSize="small" />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Owner: {owner} {isOwner ? <span>(You)</span> : null}
                    </Typography>
                </Stack>
            </Link>
        </Card>
        <Card key="event" variant="outlined" sx={{ mb: 1.5, p: 1, cursor: 'pointer' }}>
            <Link to={`/events/${event_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <EventIcon color="primary" fontSize="small" />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Event: {event_name}
                    </Typography>
                </Stack>
            </Link>
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
        <Card key="skills" variant="outlined" sx={{ mb: 1.5, p: 1 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
                <EngineeringIcon color="primary" fontSize="small" />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Required Skills: {required_skills || 'None specified'}
                </Typography>
            </Stack>
        </Card>
    </Stack>
));

const OwnerEditCard = React.memo(({ 
    isOwner, isEditing, setIsEditing, editedDescription, 
    setEditedDescription, editedSkills, setEditedSkills, 
    handleSaveEdits, description, required_skills 
}) => {
    if (!isOwner) return null;
    return (
        <Card variant="outlined" sx={{ p: 2, mt: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Edit Team Details</Typography>
            {isEditing ? (
                <Stack spacing={2}>
                    <TextField
                        label="Team Description"
                        multiline
                        rows={3}
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="Required Skills"
                        value={editedSkills}
                        onChange={(e) => setEditedSkills(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSaveEdits}
                            startIcon={<SaveIcon />}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                                setIsEditing(false);
                                setEditedDescription(description || '');
                                setEditedSkills(required_skills || '');
                            }}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                >
                    Edit Team Details
                </Button>
            )}
        </Card>
    );
});

const PendingRequests = React.memo(({ isOwner, pending_requests = [], handleAccept, handleReject }) => {
    if (!isOwner || pending_requests.length === 0) return null;
    return (
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
    );
});

const PendingInvitations = React.memo(({ isOwner, pending_invites = [] }) => {
    if (!isOwner || pending_invites.length === 0) return null;
    return (
        <Box sx={{ p: 2, mb: 3 }}>
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600, borderBottom: '2px solid', borderColor: 'warning.main', display: 'inline-block', pb: 0.5 }}
            >
                Pending Invitations ({pending_invites.length})
            </Typography>
            <List dense>
                {pending_invites.map((invite) => (
                    <Card key={invite.id} variant="outlined" sx={{ mb: 1.5 }}>
                        <ListItem>
                            <ListItemText
                                primary={invite.username}
                                secondary={`Invited on on: ${formatDateTime(invite.joined_at)}`}
                            />
                        </ListItem>
                    </Card>
                ))}
            </List>
        </Box>
    );
});

const MembersList = React.memo(({ 
    approved_members = [], isOwner, currentUserId, 
    roleEdits, setRoleEdits, handleUpdateRole, handleKick 
}) => (
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
));

const InviteCard = React.memo(({ isOwner, inviteUserId, setInviteUserId, handleInvite, recommenedMembers }) => {
    if (!isOwner) return null;
    const navigate = useNavigate();
    return (
        <Card variant="outlined" sx={{ p: 2, mt: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Invite New Member</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>Enter the username of the person you want to invite.</Alert>
            <Stack direction="row" spacing={2} alignItems="center">
                <TextField 
                    label="Username to Invite" 
                    variant="outlined" 
                    size="small" 
                    value={inviteUserId} 
                    onChange={(e) => setInviteUserId(e.target.value)} 
                    sx={{ flexGrow: 1 }} 
                />
                <Button 
                    variant="contained" 
                    color="info" 
                    onClick={handleInvite(inviteUserId)} 
                    startIcon={<SendIcon />} 
                    disabled={!inviteUserId}
                >
                    Invite User
                </Button>
            </Stack>
            {recommenedMembers && recommenedMembers.length > 0 ?
                <div>
                    <br />
                    <Typography variant="h7" gutterBottom>Recommended Members</Typography>
                    {recommenedMembers.map((rm) => <Button onClick={() => {
                        navigate(`/profile/${rm}`)
                        console.log('navigating')
                    }}>{rm}</Button>)}
                </div> : null}
        </Card>
    );
});


const TeamPage = ({ user }) => {
    // --- State ---
    const [teamDetails, setTeamDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [roleEdits, setRoleEdits] = useState({}); 
    const [inviteUserId, setInviteUserId] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const [editedSkills, setEditedSkills] = useState('');
    const [recommenedMembers, setRecommendedMembers] = useState([]);

    // --- Derived Values ---
    const { teamID } = useParams();
    const currentUserId = user.pk;
    const currentUsername = user.username;

    const isOwner = teamDetails && teamDetails.owner === currentUsername;
    const isMember = teamDetails && teamDetails.approved_members.some(m => m.user === currentUserId);
    const hasPendingRequest = teamDetails && teamDetails.pending_requests.some(m => m.user === currentUserId);
    const hasBeenRejected = teamDetails && teamDetails.has_been_rejected;
    const hasBeenInvited = teamDetails && teamDetails.has_been_invited;

    // --- Data Fetching ---
    const fetchTeamData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const info = await getTeamInfo(teamID);


            const mockedInfo = { ...info };
            mockedInfo.approved_members = info.approved_members.map(m => ({
                ...m,
                username: m.username
            }));
            mockedInfo.pending_requests = info.pending_requests.map(m => ({
                ...m,
                username: m.username
            }));
            mockedInfo.pending_invites = info.pending_invites.map(m => ({
                ...m,
                username: m.username
            }));
            
            setTeamDetails(mockedInfo);

        } catch (e) {
            console.error("Error fetching team details:", e);
            setError("Failed to load team details. Please try again.");
            setTeamDetails(null);
        } finally {
            setIsLoading(false);
        }
        try{
            const r_members = await getRecommendedMembers(teamID);
            setRecommendedMembers(r_members);
        } catch (e) {
            console.log(e);
        }
    }, [teamID, currentUserId, currentUsername]);

    useEffect(() => {
        if (teamID && currentUserId) {
            fetchTeamData();
        }
    }, [teamID, currentUserId, fetchTeamData]);

    useEffect(() => {
        if (teamDetails) {
            setEditedDescription(teamDetails.description || '');
            setEditedSkills(teamDetails.required_skills || '');
        }
    }, [teamDetails]);
    
    // --- Event Handlers ---
    const handleAction = useCallback((apiCall, successMsg, memberID = null, role = null) => async () => {
        setError('');
        setSuccessMessage('');
        try {
            if (memberID && role) {
                await apiCall(teamID, memberID, role);
            } else if (memberID) {
                await apiCall(teamID, memberID);
            } else {
                await apiCall(teamID);
            }

            setSuccessMessage(successMsg);
            await fetchTeamData(); // Refresh data

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
    }, [teamID, fetchTeamData]); // Dependencies for the factory

    const handleSaveEdits = useCallback(async () => {
        setError('');
        setSuccessMessage('');
        try {
            await updateTeamDetails(teamID, { description: editedDescription, required_skills: editedSkills });
            setSuccessMessage('Team details updated successfully!');
            setIsEditing(false);
            await fetchTeamData(); // Refresh the team data
        } catch (e) {
            console.error('Failed to update team details:', e);
            setError(`Failed to update team details: ${e.response?.data?.detail || e.message}`);
        }
    }, [teamID, editedDescription, editedSkills, fetchTeamData]);

    // Stabilize handlers for memoized components
    const handleAccept = useCallback((userID) => handleAction(acceptTeamMember, 'Member accepted!', userID), [handleAction]);
    const handleReject = useCallback((userID) => handleAction(rejectTeamMember, 'Request rejected.', userID), [handleAction]);
    const handleKick = useCallback((userID) => handleAction(kickTeamMember, 'Member kicked.', userID), [handleAction]);
    const handleUpdateRole = useCallback((userID) => handleAction(updateTeamMemberRole, 'Role updated!', userID, roleEdits[userID]), [handleAction, roleEdits]);
    const handleInvite = useCallback((userID) => handleAction(inviteTeamMember, `Invite sent to user ID: ${userID}`, userID), [handleAction]); 

    const handleLeave = useCallback(handleAction(leaveTeam, 'You have left the team.'), [handleAction]);
    const handleRequestJoin = useCallback(handleAction(requestToJoinTeam, 'Request to join sent successfully!'), [handleAction]);
    const handleAcceptInvite = useCallback(handleAction(acceptTeamInvite, 'You have accepted the invitation and joined the team!'), [handleAction]);
    const handleRejectInvite = useCallback(handleAction(rejectTeamInvite, 'You have rejected the invitation.'), [handleAction]);

    // --- Loading & Error Renders ---
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
        event_name,
        event_id,
        owner,
        owner_id,
        max_size,
        current_size,
        is_full,
        required_skills,
        is_open,
        created_at,
        approved_members,
        pending_requests,
        pending_invites
    } = teamDetails;

    // --- Main Render ---
    return (
        <Grid item xs={12} sx={{ minWidth:0, maxWidth:{xs:"calc(100vw - 20px)", md: "calc(100vw - 240px)"},
            mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Box sx={{ padding: { xs: "2%", md: "2.5%" }, borderRadius: "20px", backgroundColor: "white", boxShadow: 4 }}>
                
                {/* Header & Main Info */}
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.300', mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ flexWrap: 'wrap', gap: 2 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{ fontWeight: 700, color: 'text.primary' }}
                        >
                            <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                            {name}
                        </Typography>

                        <MemberShipActions
                            isMember={isMember}
                            hasBeenInvited={hasBeenInvited}
                            isOwner={isOwner}
                            hasPendingRequest={hasPendingRequest}
                            hasBeenRejected={hasBeenRejected}
                            is_open={is_open}
                            is_full={is_full}
                            handleLeave={handleLeave}
                            handleAcceptInvite={handleAcceptInvite}
                            handleRejectInvite={handleRejectInvite}
                            handleRequestJoin={handleRequestJoin}
                        />
                    </Stack>

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

                    <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>{description}</Typography>

                    <InfoCards 
                        owner={owner} 
                        owner_id={owner_id}
                        event_name={event_name} 
                        event_id={event_id}
                        created_at={created_at} 
                        current_size={current_size} 
                        max_size={max_size} 
                        is_full={is_full} 
                        required_skills={required_skills} 
                        isOwner={isOwner}
                    />

                    <OwnerEditCard 
                        isOwner={isOwner} 
                        isEditing={isEditing} 
                        setIsEditing={setIsEditing} 
                        editedDescription={editedDescription} 
                        setEditedDescription={setEditedDescription} 
                        editedSkills={editedSkills} 
                        setEditedSkills={setEditedSkills} 
                        handleSaveEdits={handleSaveEdits} 
                        description={description} 
                        required_skills={required_skills} 
                    />
                </Box>

                {/* Member & Request Lists */}
                <MembersList 
                    approved_members={approved_members} 
                    isOwner={isOwner} 
                    currentUserId={currentUserId} 
                    roleEdits={roleEdits} 
                    setRoleEdits={setRoleEdits} 
                    handleUpdateRole={handleUpdateRole} 
                    handleKick={handleKick} 
                />

                <PendingRequests 
                    isOwner={isOwner} 
                    pending_requests={pending_requests} 
                    handleAccept={handleAccept} 
                    handleReject={handleReject} 
                />

                <PendingInvitations
                    isOwner={isOwner}
                    pending_invites={pending_invites}
                />

                <InviteCard 
                    isOwner={isOwner} 
                    inviteUserId={inviteUserId} 
                    setInviteUserId={setInviteUserId} 
                    handleInvite={handleInvite} 
                    recommenedMembers={recommenedMembers}
                />
            </Box>
        </Grid>
    );
};

export default TeamPage;