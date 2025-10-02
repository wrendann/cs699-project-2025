import axios from "axios";
const baseUrl = "/";

export const requestReset = async(email) => {
  console.log("Requested Reset for email: ", email);
  const response = await axios.post(`${baseUrl}/request`, email);
  return response.data;
};

export const requestVerify = async(token) => {
  const obj = {token};
  const response = await axios.post(`${baseUrl}/verify`, obj);
  return response.data;
};

const resetPassword = async(token, newPassword) => {
  const obj = {token, newPassword};
  const response = await axios.post(`${baseUrl}/reset`, obj);
  return response.data;
};

export default resetPassword;