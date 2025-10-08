import apiClient from './apiClient';

export const getEvents = async () => {

    return [
        {
        id: 'e1',
        name: 'Q3 Financial Review and Budget Planning',
        location: '14th Floor, Boardroom A',
        start_date: '2025-11-15T10:00:00',
        end_date: '2025-11-15T11:30:00',
        description: 'A mandatory review of the third quarter financial performance, including budget forecasts and departmental spending analysis. Please bring your departmental expense reports and be prepared to discuss Q4 projections.',
        },
        {
        id: 'e2',
        name: 'Company Holiday Party Planning Committee Meeting',
        location: 'The Grand Ballroom Annex',
        start_date: '2025-11-20T14:00:00',
        end_date: '2025-11-20T15:00:00',
        description: 'Meeting to finalize the theme, catering, and entertainment for the annual company holiday celebration. All committee members must attend and provide final vendor quotes.',
        },
        {
        id: 'e3',
        name: 'Company Holiday Party Planning Committee Meeting',
        location: 'The Grand Ballroom Annex',
        start_date: '2025-11-20T14:00:00',
        end_date: '2025-11-20T15:00:00',
        description: 'Meeting to finalize the theme, catering, and entertainment for the annual company holiday celebration. All committee members must attend and provide final vendor quotes.',
        },
        {
        id: 'e4',
        name: 'Company Holiday Party Planning Committee Meeting',
        location: 'The Grand Ballroom Annex',
        start_date: '2025-11-20T14:00:00',
        end_date: '2025-11-20T15:00:00',
        description: 'Meeting to finalize the theme, catering, and entertainment for the annual company holiday celebration. All committee members must attend and provide final vendor quotes.',
        },
        {
        id: 'e5',
        name: 'Company Holiday Party Planning Committee Meeting',
        location: 'The Grand Ballroom Annex',
        start_date: '2025-11-20T14:00:00',
        end_date: '2025-11-20T15:00:00',
        description: 'Meeting to finalize the theme, catering, and entertainment for the annual company holiday celebration. All committee members must attend and provide final vendor quotes.',
        },
        {
        id: 'e6',
        name: 'Q3 Financial Review and Budget Planning',
        location: '14th Floor, Boardroom A',
        start_date: '2024-11-15T10:00:00',
        end_date: '2024-11-15T11:30:00',
        description: 'A mandatory review of the third quarter financial performance, including budget forecasts and departmental spending analysis. Please bring your departmental expense reports and be prepared to discuss Q4 projections.',
        },
    ];
    
    const response = await apiClient.get(`TFapp/events/`);
    return response.data;
}

export const addEvent = async (newEvent) => {
    const response = await apiClient.post("TFapp/events/", newEvent);
    return response.data;
}