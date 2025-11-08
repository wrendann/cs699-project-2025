import apiClient from './apiClient';

export const getProfile = async(username) => {
  const response = await apiClient.get(`TFapp/users/`);
  
  return response.data.find((profile) => profile.username == username);
}

export const updateProfile = async(userID, newProfile) => {
  const response = await apiClient.patch(`TFapp/users/${userID}/update_profile/`, newProfile,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }
  );
  return response.data;
}