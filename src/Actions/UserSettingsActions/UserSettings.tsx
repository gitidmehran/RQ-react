import {http} from "../../http";
const USERS_SETTINGS_URL = "/settings";

const getUserSettings = async (id:any) => {
  return await http.get(`/settings?id=${id}`);
};

const saveUserSettings = async (data: any) => {
  return await http.post(USERS_SETTINGS_URL, data);
};

export { getUserSettings, saveUserSettings };
