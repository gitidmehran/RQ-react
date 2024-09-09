import { http } from "../../http";

const WORD_BY_WORD_URL = "/word-by-word";

const getwordbyword = async (
  surah: string,
  fromVerse: string,
  toVerse: string,
  scholar_id: string,
  perPage: number,
  pageNumber: number
) => {
  return await http.get(
    `${WORD_BY_WORD_URL}?surahId=${surah}&fromVerse=${fromVerse}&toVerse=${toVerse}&scholarId=${scholar_id}&perPage=${perPage}&page=${pageNumber}`
  );
};
const filterSurah = async (data: any) => {
  return await http.post(`/search-ayat`, data);
};

export { getwordbyword, filterSurah };
