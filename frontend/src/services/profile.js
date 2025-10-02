import axios from "axios";
const baseUrl = '/';

export const updateProfile = async () => {
  const updatedUser = await axios.get(baseUrl);
  return updatedUser.data;
};