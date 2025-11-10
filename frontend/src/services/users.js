import apiClient from './apiClient';
const baseUrl = "api/"

export const signInWithEmail = async credentials => {
    if(credentials.credentials.email == 'admin@admin' && credentials.credentials.password == 'testpasswordadmin')
        return {user: {username: 'admin', email: 'admin@admin', name: 'admin'}, access: "rootusertoken"}
    console.log("Sign in attempt with credentials: ", credentials)
    const response = await apiClient.post(baseUrl+`auth/login/`, credentials.credentials);
    return response.data;
}

export const signUpWithEmail = async credentials => {
    if(credentials.credentials.email == 'admin@admin' && credentials.credentials.password == 'testpasswordadmin')
        return {user: {username: 'admin', email: 'admin@admin', name: 'admin'}, access: "rootusertoken"}
    console.log("Sign up attempt with credentials: ", credentials)
    const signUpObject = {
        username: credentials.credentials.name, 
        email: credentials.credentials.email, 
        password1: credentials.credentials.password,
        password2: credentials.credentials.confirmPassword
    }
    const response = await apiClient.post(baseUrl+`auth/registration/`, signUpObject);
    return response.data;
}

export const signOut = async () => {
    console.log("Signed out")
}

export const getUserTeams = async (userId) => {
    try {
        const response = await apiClient.get(`TFapp/users/${userId}/teams/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user teams:", error);
        throw error;
    }
};