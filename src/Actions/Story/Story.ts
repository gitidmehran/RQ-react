import { http } from "../../http";
import {
  getAllStoriesResponse,
  createStoryType,
  createOrUpdateStoryResponse,
  updateStoryStatusResponse,
} from "../../Types/Stories";
const URL = "stories";
const getStoriesList = async (): Promise<getAllStoriesResponse> => {
  const response = await http.get(URL);
  return response.data;
};

const createStory = async (
  data: createStoryType
): Promise<createOrUpdateStoryResponse> => {
  const response = await http.post(URL, data);
  return response.data;
};

const getSingleStory = async (
  id: number
): Promise<createOrUpdateStoryResponse> => {
  const response = await http.get(`${URL}/${id}`);
  return response.data;
};

const updateStory = async (
  id: number,
  data: any
): Promise<createOrUpdateStoryResponse> => {
  const response = await http.post(`${URL}/${id}?_method=PUT`, data);
  return response.data;
};

const deleteStory = async (
  id: number
): Promise<createOrUpdateStoryResponse> => {
  const response = await http.delete(`${URL}/${id}`);
  return response.data;
};

const updateStoryStatus = async (
  id: number,
  data: any
): Promise<updateStoryStatusResponse> => {
  const response = await http.post(`${URL}/update-status/${id}`, data);
  return response.data;
};

export {
  getStoriesList,
  createStory,
  getSingleStory,
  updateStory,
  deleteStory,
  updateStoryStatus,
};
