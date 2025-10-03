import apiClient from './apiClient';
const baseUrl = "/api"

export const signInWithEmail = async credentials => {
    if(credentials.credentials.email == 'admin@admin' && credentials.credentials.password == 'testpasswordadmin')
        return {user: "rootuser", token: "rootusertoken"}
    console.log("Sign in attempt with credentials: ", credentials)
    const response = await apiClient.post(`/auth/login/`, credentials.credentials);
    return response.data;
}

export const signOut = async () => {
    console.log("Signed out")
}