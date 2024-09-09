import { http } from '../../http';

const getScholars = async () => {
  return await http.get(`/get-scholars`);
};
const getRefernceWords = async (scholarId: any) => {
  return await http.post(`/reference-words`, scholarId);
};
const saveRelatedWords = async (data: any) => {
  return await http.post(`/save-reference-word-translation`, data);
};
const removeRelatedWords = async (data: any) => {
  return await http.post(`/reference-words-delete`, data);
};
const getRelatedWords = async (wordId:any) => {
  return await http.post(`/translation/related-words`,wordId);
};


export { getRefernceWords, saveRelatedWords, getScholars, removeRelatedWords, getRelatedWords };