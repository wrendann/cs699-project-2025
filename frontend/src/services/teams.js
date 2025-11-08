import apiClient from './apiClient';

export const getTeamInfo = async (teamID) => {
    const response = await apiClient.get(`TFapp/teams/${teamID}`);
    return response.data;
}

export const acceptTeamMember = async (teamID, userID) => {
    const response = await apiClient.post(`TFapp/teams/${teamID}/members/accept/`, {user_id: userID});
    return response.data;
}

export const rejectTeamMember = async (teamID, userID) => {
    const response = await apiClient.post(`TFapp/teams/${teamID}/members/reject/`, {user_id: userID});
    return response.data;
}

export const kickTeamMember = async (teamID, userID) => {
    const response = await apiClient.post(`TFapp/teams/${teamID}/members/kick/`, {user_id: userID});
    return response.data;
}

export const updateTeamMemberRole = async (teamID, userID, role) => {
    const response = await apiClient.patch(`TFapp/teams/${teamID}/members/update_role/`, 
        {user_id: userID, role: role});
    return response.data;
}

export const leaveTeam = async (teamID) => {
    const response = await apiClient.post(`TFapp/teams/${teamID}/members/leave/`);
    return response.data;
}

export const acceptTeamInvite = async (teamID) => {
    const response = await apiClient.post(`TFapp/teams/${teamID}/members/accept_invitation/`);
    return response.data;
}

export const rejectTeamInvite = async (teamID) => {
    const response = await apiClient.post(`TFapp/teams/${teamID}/members/reject_invitation/`);
    return response.data;
}

export const inviteTeamMember = async (teamID, userName) => {
    const response = await apiClient.post(`TFapp/teams/${teamID}/invite/`, {user_name: userName});
    return response.data;
}

export const requestToJoinTeam = async (teamID) => {
    const response = await apiClient.post(`TFapp/teams/${teamID}/join/`);
    return response.data;
}

export const updateTeamDetails = async (teamID, updates) => {
    const response = await apiClient.patch(`TFapp/teams/${teamID}/`, updates);
    return response.data;
};