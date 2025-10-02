import axios from "axios";
const baseUrl = "/apiv1/"

export const signInWithEmail = async credentials => {
    console.log("Sign in attempt with credentials: ", credentials)
    const response = await axios.post(`${baseUrl}/email`, credentials);
    return response.data;
}