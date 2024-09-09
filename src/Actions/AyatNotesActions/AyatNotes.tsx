import { http } from "../../http";

const Ayat_Notes_URL = "/ayat-notes";
const Add_Ayat_Note_URL = "/add-ayats-notes";
const getAyatNotes = async (page: number) => {
  return await http.get(`${Ayat_Notes_URL}?page=${page}`);
};

const saveAyatNote = async (data: any) => {
  return await http.post(Ayat_Notes_URL, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateAyatNote = async (id: any, data: any) => {
  return await http.post(`${Ayat_Notes_URL}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getScholars = async () => {
  return await http.get("/get-scholars");
};
const filterSurah = async (surah: any) => {
  return await http.post(`/search-ayat?surahId=${surah}`);
};
const deleteAyatNote = async (id: any) => {
  return await http.delete(`/ayat-notes/${id}`);
};
const getLanguages = async () => {
  return await http.get(`/languages`);
};
const addAyatNote = async (data: any) => {
  return await http.post(`${Add_Ayat_Note_URL}`, data);
};
export {
  getAyatNotes,
  saveAyatNote,
  updateAyatNote,
  filterSurah,
  addAyatNote,
  deleteAyatNote,
  getScholars,
  getLanguages,
};
