import { http } from "../../http";
const getUsers = async (page: number, type: string) => {
  return await http.get(`/users?page=${page}&type=${type}`);
};
const createUsers = async (data: any) => {
  return await http.post(`/users`, data);
};
const updateUser = async (id: number, data: any) => {
  return await http.post(`/users/${id}?_method=PUT`, data);
};
const deleteUser = async (id: any) => {
  return await http.delete(`/users/${id}`);
};
const impersonateUser = async (id: any) => {
  return await http.get(`/impersonate/${id}`);
};
const leaveUser = async () => {
  return await http.get(`/leave-impersonation`);
};
const getAllLanguages = async () => {
  return await http.get(`/languages`);
};
export {
  getUsers,
  createUsers,
  deleteUser,
  updateUser,
  impersonateUser,
  leaveUser,
  getAllLanguages,
};
