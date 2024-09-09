export type AyatTranslations = {
    languageId: number;
    languageName: string;
    scholarId: number;
    scholarName: string;
    translation: string;
    note:string;
  };

export type AyatProps = {
  id?: number;
  surahId: number;
  scholarId:number;
  ayatId: number;
  arabic: string;
  simpleArabic:string;
  translations: AyatTranslations[];
  checkPageStatus:number;
  showSimpleArabic?: boolean;
  // handleOpenPdf:(ayatId:number, scholarId:number) => void;
  // isAyatNoteExist?:(ayatId:number, scholarId:number) => boolean; 
};
export type TopicAyatProps = {
  id?: number;
  surahId: number;
  scholarId:number;
  ayatId: number;
  arabic: string;
  translations: AyatTranslations[];
  // checkPageStatus:number;
  // handleOpenPdf:(ayatId:number, scholarId:number) => void;
  // isAyatNoteExist?:(ayatId:number, scholarId:number) => boolean; 
};
export type WordProps = {
  columns: any[];
  words: any[];
  handleOpenWordPdf:(wordId:number, scholarId:number) => void;
  // isAyatNoteExist?:(ayatId:number, scholarId:number) => boolean; 
};

export type SurahsType = {
  id: number;
  arabic: string;
}
