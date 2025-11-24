import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom"; // Corrected from "react-router-router"
import { getProfile, updateProfile } from '../services/profile'; 
import {
    Box, TextField, Typography, Button, Card, CardContent,
    Stack, CircularProgress, Grid, Alert, IconButton
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    CalendarToday as CalendarTodayIcon,
    Person as PersonIcon,
    CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

// --- Utility Functions ---

// Function to fetch profile data from the server
const getProfileFromServer = async (username, navigate, user, setProfileStates) => {
    try {
        const profile = await getProfile(username);
        if (!profile) {
            navigate(`/profile/${user.username}`);
            return;
        }

        setProfileStates.setUserID(profile.id || '');
        setProfileStates.setBio(profile.bio || '');
        setProfileStates.setSkills(profile.skills || '');
        setProfileStates.setInterests(profile.interests || '');
        setProfileStates.setLocation(profile.location || '');
        
        // When fetching, set profilePicture to the URL from the server
        setProfileStates.setProfilePicture(profile.profile_picture || null); 
        // Also update the preview immediately
        setProfileStates.setProfilePicturePreview(profile.profile_picture || null); 

        setProfileStates.setDateJoined(profile.date_joined || ''); 
        setProfileStates.setIsUserLoggedIn(username === user.username);
        setProfileStates.setIsLoading(false);
    } catch (e) {
        console.error("Error fetching profile:", e);
        setProfileStates.setError('Failed to load profile details.');
        setProfileStates.setIsLoading(false);
    }
}


const updateProfileToServer = async (userID, profileData, file, setSuccessMessage, setError, setEditMode, setUser) => {
    try {
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            formData.append(key, profileData[key]);
        });
        
        // Append file if it's an actual File object
        if (file instanceof File) {
            formData.append('profile_picture', file);
        } else if (file === null && profileData.profilePictureWasCleared) { 
            // Optional: send a flag if user explicitly removed the picture
            // This assumes your backend handles a 'clear' flag
            // formData.append('clear_profile_picture', 'true');
        }

        const response = await updateProfile(userID, formData);

        // If the server returned updated user/profile info, update localStorage and app-level user state
        if (response && setUser) {
            try {
                const stored = JSON.parse(window.localStorage.getItem('IITBTeamFinderUser')) || {};

                const updatedUser = { ...stored, ...response };
                window.localStorage.setItem('IITBTeamFinderUser', JSON.stringify(updatedUser));
                setUser(updatedUser);
            } catch (err) {
                console.error('Failed to update local user after profile save', err);
            }
        }

        setSuccessMessage('Profile updated successfully!');
        setError('');
        setEditMode(false); 
    } catch (e) {
        console.error("Error updating profile:", e);
        setError(`Failed to save profile: ${e.message || 'Server error'}`);
        setSuccessMessage('');
    }
}

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const Profile = ({ user, setUser }) => {

    const { username } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // --- State ---
    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [interests, setInterests] = useState('');
    const [location, setLocation] = useState('');
    
    // profilePicture stores the File object OR the original URL string from the server
    const [profilePicture, setProfilePicture] = useState(null); 
    // profilePicturePreview always stores the URL string for the <img> src
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);

    const [userID, setUserID] = useState('');
    const [dateJoined, setDateJoined] = useState('');
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // State for temporary edits (used when cancelling edit mode)
    const [originalProfile, setOriginalProfile] = useState({ 
        bio: '', skills: '', interests: '', location: '', profilePicture: null, profilePicturePreview: null
    });

    // --- Effects ---
    useEffect(() => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        const setProfileStates = {
            setUserID, setBio, setSkills, setInterests, setLocation, setProfilePicture,
            setProfilePicturePreview, setDateJoined, setIsUserLoggedIn, setIsLoading, setError
        };
        getProfileFromServer(username, navigate, user, setProfileStates);
    }, [username, navigate, user]);

    useEffect(() => {
        if (!isLoading) {
            // When initial data is loaded or after a save, update originalProfile
            setOriginalProfile({ 
                bio, skills, interests, location, 
                profilePicture: profilePicture, // This could be File or URL
                profilePicturePreview: profilePicturePreview // This is always URL
            });
        }
    }, [isLoading, bio, skills, interests, location, profilePicture, profilePicturePreview]);

    // --- Handlers ---

    // Handles file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePicture(file); // Store the File object
            setProfilePicturePreview(URL.createObjectURL(file)); // Create URL for immediate display
            setError('');
        }
    };
    
    // Triggers the hidden file input
    const handleImageUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleEditClick = () => {
        setOriginalProfile({ 
            bio, skills, interests, location, 
            profilePicture, // Store the current state (File or URL)
            profilePicturePreview // Store the current preview URL
        });
        setEditMode(true);
        setError('');
        setSuccessMessage('');
    };

    const handleCancelClick = () => {
        // Revert all states to their original values
        setBio(originalProfile.bio);
        setSkills(originalProfile.skills);
        setInterests(originalProfile.interests);
        setLocation(originalProfile.location);
        setProfilePicture(originalProfile.profilePicture);
        setProfilePicturePreview(originalProfile.profilePicturePreview); // Revert preview URL
        setEditMode(false);
        setError('');
        setSuccessMessage('');
    };

    const handleSave = async () => {
        const newProfileData = {
            bio,
            skills,
            interests,
            location,
        };
        // profilePicture holds either a File object (new upload) or a URL (original from server)
        // updateProfileToServer will determine what to send based on its type
        await updateProfileToServer(
            userID, 
            newProfileData, 
            profilePicture, // This is the actual data to send (File or original URL string)
            setSuccessMessage, 
            setError, 
            setEditMode,
            setUser
        );
        // On success, the component will re-fetch data, and states will be reset via useEffect
    };

    // --- Loading & Error Renders ---
    if (isLoading) {
        return (
            <Grid container justifyContent="center" sx={{ p: 4 }}>
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading profile...</Typography>
            </Grid>
        );
    }
    
    // --- Main Render ---
    return (
        <Grid item xs={12} md={8} sx={{ mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Box 
                sx={{ 
                    padding: { xs: "2%", md: "2.5%" }, 
                    borderRadius: "15px", 
                    backgroundColor: "white", 
                    boxShadow: 6 
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 700, color: 'text.primary', borderBottom: '3px solid', borderColor: 'primary.main', pb: 0.5 }}
                    >
                        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                        {username}'s Profile
                    </Typography>

                    {/* Action Buttons */}
                    {isUserLoggedIn && (
                        <Box>
                            {!editMode ? (
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleEditClick}
                                    startIcon={<EditIcon />}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Stack direction="row" spacing={2}>
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        onClick={handleSave}
                                        startIcon={<SaveIcon />}
                                    >
                                        Save
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="error" 
                                        onClick={handleCancelClick}
                                        startIcon={<CloseIcon />}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    )}
                </Stack>

                {/* Status Messages */}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                
                <Card variant="outlined" sx={{ p: 3 }}>
                    <CardContent component={Stack} spacing={3}>
                        
                        {/* Profile Picture Upload & Display */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', mb: 2 }}>
                            <Box 
                                sx={{ 
                                    width: 120, 
                                    height: 120, 
                                    borderRadius: '50%', 
                                    backgroundColor: 'grey.300', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    border: '3px solid', 
                                    borderColor: 'primary.main',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Use profilePicturePreview for the img src */}
                                {profilePicturePreview ? (
                                    <img 
                                        src={profilePicturePreview} 
                                        alt={`${username[0]}`} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <PersonIcon sx={{ fontSize: 80, color: 'grey.600' }} />
                                )}
                            </Box>
                            
                            {/* Upload Button overlay, only visible in edit mode */}
                            {isUserLoggedIn && editMode && ( // Ensure only logged-in user can edit their picture
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{ display: 'none' }} 
                                    />
                                    <IconButton
                                        onClick={handleImageUploadClick}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: '35%', // Adjust as needed for alignment
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            '&:hover': { backgroundColor: 'primary.dark' },
                                            p: 0.5,
                                        }}
                                        aria-label="upload profile picture"
                                    >
                                        <CloudUploadIcon />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                        
                        {/* Text Fields (same logic as before) */}
                        <TextField
                            label="Bio"
                            multiline
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            variant="outlined"
                            fullWidth
                            disabled={!editMode}
                            InputProps={{
                                style: { 
                                    backgroundColor: !editMode ? '#f5f5f5' : 'white', 
                                    color: !editMode ? '#333' : 'inherit',
                                },
                            }}
                        />

                        <TextField
                            label="Skills"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            variant="outlined"
                            fullWidth
                            disabled={!editMode}
                            InputProps={{
                                style: { 
                                    backgroundColor: !editMode ? '#f5f5f5' : 'white', 
                                    color: !editMode ? '#333' : 'inherit',
                                },
                            }}
                        />

                        <TextField
                            label="Interests"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            variant="outlined"
                            fullWidth
                            disabled={!editMode}
                            InputProps={{
                                style: { 
                                    backgroundColor: !editMode ? '#f5f5f5' : 'white', 
                                    color: !editMode ? '#333' : 'inherit',
                                },
                            }}
                        />

                        <TextField
                            label="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            variant="outlined"
                            fullWidth
                            disabled={!editMode}
                            InputProps={{
                                style: { 
                                    backgroundColor: !editMode ? '#f5f5f5' : 'white', 
                                    color: !editMode ? '#333' : 'inherit',
                                },
                            }}
                        />
                        
                        {/* Date Joined - Always Not Editable */}
                        <Box sx={{ borderTop: '1px solid #eee', pt: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                                <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                Date Joined: 
                                <span style={{ marginLeft: '8px', fontWeight: 'normal', color: '#666' }}>
                                    {formatDateTime(dateJoined)}
                                </span>
                            </Typography>
                        </Box>

                    </CardContent>
                </Card>

            </Box>
        </Grid>
    );
}

export default Profile;