import apiClient from './apiClient';

export const getEvents = async () => {
    const response = await apiClient.get(`TFapp/events/`);
    return response.data;
}

export const getEvent = async (eventID) => {
    const response = await apiClient.get(`TFapp/events/${eventID}`);
    return response.data;
}

export const addEvent = async (newEvent) => {
    const response = await apiClient.post("TFapp/events/", newEvent);
    return response.data;
}

export const addTeam = async (eventID, newTeam) => {
    console.log(`Adding New Team to event ${eventID}`);
    console.log(newTeam);
    const response = await apiClient.post(`TFapp/events/${eventID}/team`, newTeam);
    return response.data;
}