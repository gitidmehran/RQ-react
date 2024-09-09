import { http } from "../../http";
export type TopicRequest = {
  storyId: string;
  sortType: string;
};
const fetchStoryTopics = async (data: TopicRequest) => {
  return await http.post(`/published-topics`, data);
};
const fetchActiveStories = async (status: string) => {
  return await http.get(`/stories/get-all?status=${status}`);
};
export { fetchStoryTopics, fetchActiveStories };
