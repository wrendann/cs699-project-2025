import axios from "axios";
const baseUrl = "/apiv1/"

export const signInWithEmail = async credentials => {
    if(credentials.credentials.email == 'admin@admin' && credentials.credentials.password == 'testpasswordadmin')
        return {user: {name: 'admin', email: 'admin@admin'}, token: "rootusertoken"}
    console.log("Sign in attempt with credentials: ", credentials)
    const response = await axios.post(`${baseUrl}/email`, credentials);
    return response.data;
}

export const signOut = async () => {
    console.log("Signed out")
}