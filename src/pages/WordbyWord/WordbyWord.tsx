/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Row, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import "./style.css";
import { SurahsType } from "../../Types/Translations";
import {
  getwordbyword,
  filterSurah,
} from "../../Actions/WordByWordActions/WordByWord";
import { AyatNotesType } from "../../Types/AyatNotes";
import { OpenNotification } from "../../Actions/Utilities/Utilities";
import AyatTranslation from "../../components/AyatTranslation/AyatTranslation";
import WordTranslation from "../../components/WordTranslation/WordTranslation";
import UpdatedWordByWord from "./UpdatedWordByWord";
import WordbyWordFilter from "../../components/FilterComponent/WordbyWordFilter";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setdiagnosis } from "../../Redux/reducers/wordByWordReducer";
import { useLocation } from "react-router-dom";
import { getscholartranslations } from "../../Actions/ScholarTranslationActions/ScholarTranslation";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
function WordbyWord() {
  const [data, setData] = React.useState<any[]>([]);
  const [showSimpleArabic, setShowSimpleArabic] = useState<boolean>(false);
  const [loading, settLoading] = useState<boolean>(false);
  const [surahId, setSurahId] = React.useState<string>("");
  const [scholarIds, setScholarIds] = React.useState<string[]>([]);
  const [verses, setVerses] = React.useState<any>("");
  const [scholars, setScholars] = React.useState<any[]>([]);
  const [fromVerse, setFromVerse] = React.useState<string>("");
  const [toVerse, setToVerse] = React.useState<string>("");
  const [perPage, setPerPage] = React.useState<number>(50);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalRecords, setTotalRecords] = React.useState<number>(50);
  const [columns, setColumns] = React.useState<any>([]);
  const [ayatNotes, setAyatNotes] = React.useState<AyatNotesType[]>([]);
  const [verseLoader, setVerseLoader] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checkPageStatus, setCheckPageStatus] = React.useState<number>(0);
  const changeCurrentPage = (e: number) => {
    setCurrentPage(e);
  };
  const location = useLocation();
  const alldata = location?.state?.WordData;
  console.log(alldata);
  let mainUrl = "";
  const urll = process.env.REACT_APP_API_URL;
  if (urll !== undefined) {
    let newUrl = urll.split("/a");
    mainUrl = newUrl[0];
  }
  const dispatch = useDispatch();
  /*   const params = useP
   */ const fetchWordByWordData = () => {
    settLoading(true);
    getwordbyword(
      surahId === ""
        ? alldata?.surahId === undefined
          ? ""
          : alldata?.surahId
        : surahId,
      fromVerse === ""
        ? alldata?.fromVerse === undefined
          ? ""
          : alldata?.fromVerse
        : fromVerse,
        scholarIds.toString(),
      toVerse === ""
        ? alldata?.toVerse === undefined
          ? ""
          : alldata?.toVerse
        : toVerse,
      perPage === null
        ? alldata?.perPage === undefined
          ? 50
          : alldata?.perPage
        : perPage,
      currentPage === null
        ? alldata?.currentPage === undefined
          ? 1
          : alldata?.currentPage
        : currentPage
    )
      .then(({ data: response }) => {
        if (response.success) {
          settLoading(false);
          setColumns(response.columns);
          setData(response.list);
          setTotalRecords(response.total);
          dispatch(
            setdiagnosis({ surahId, fromVerse, toVerse, perPage, currentPage })
          );
          // setAyatNotes(response.ayatsNotesData)
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        console.log("error", err);
        settLoading(false);
      });
  };
  useEffect(() => {
    fetchWordByWordData();
    // eslint-disable-next-line
  }, [currentPage]);

  const handleChangeSurah = (e: string) => {
    setVerseLoader(true);
    setToVerse("");
    setFromVerse("");
    var data = new FormData();
    data.append("surahId", e);
    filterSurah(data)
      .then(({ data: response }) => {
        setVerseLoader(false);
        if (response.success) {
          setSurahId(e);
          setFromVerse(response.list[0].ayatNo);
          setToVerse(response.list.at(-1).ayatNo);
          setVerses(response.list);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  };
  useEffect(() => {
    settLoading(true);
    //   const storedNames = localStorage.getItem("surahs");
    getscholartranslations(
      surahId,
      fromVerse,
      toVerse,
      scholarIds.toString(),
      perPage,
      currentPage
    )
      .then(({ data: response }) => {
        if (response.success) {
          settLoading(false);
          // setSurahs(storedNames);
          setScholars(response.scholars);
          
        } else {
          settLoading(false);

          OpenNotification("error", response.message);
        }
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  }, [scholarIds, fromVerse, toVerse, surahId, perPage, currentPage]);
  const handleOpenPdf = (ayatId: number, scholarId: number) => {
    if (ayatNotes !== undefined) {
      const note = ayatNotes.filter(
        (item: { ayatId: number; scholarId: number }) =>
          item.ayatId === ayatId && item.scholarId === scholarId
      );
      console.log(note, ayatNotes);
      if (note.length > 0) {
        const file = note[0].noteFile;
        const url = `${mainUrl}/ayatsNotes/` + file;
        window.open(url, "_blank");
      }
    }
  };
  const handleChangeScholars = (e: string[]) => {
    setScholarIds(e);
  };
  return (
    <>
      <WordbyWordFilter
        totalRecords={totalRecords}
        perPage={perPage}
        verses={verses}
        verseLoader={verseLoader}
        fromVerse={fromVerse}
        toVerse={toVerse}
        changeFromVerse={(e) => setFromVerse(e)}
        changeToVerse={(e) => setToVerse(e)}
        changePerPage={(e) => setPerPage(e)}
        handleChangeSurah={handleChangeSurah}
        fetchWordByWordData={fetchWordByWordData}
        currentPage={currentPage}
        handleChangeScholars={handleChangeScholars}
        scholars={scholars}
        changeCurrentPage={changeCurrentPage}
        antIcon={antIcon}
        showSimpleArabic={showSimpleArabic}
        handleSimpleArabic={() => setShowSimpleArabic(!showSimpleArabic)}
      />
      <Spin spinning={loading} indicator={antIcon} className="mt-5">
        {/* <Row>
          <Col span={24}> */}
        <div
          style={{ paddingTop: "150px", overflowY: "scroll", width: "100%" }}
        >
          {data.map((item) => {
            return (
              <div key={item.id}>
                <AyatTranslation
                  scholarId={item.scholarId}
                  surahId={item.surahId}
                  ayatId={item.ayatId}
                  arabic={item.arabic}
                  simpleArabic={item.arabicSimple ?? ""}
                  translations={item.ayatTranslations}
                  checkPageStatus={checkPageStatus}
                  showSimpleArabic={showSimpleArabic}
                />
                <UpdatedWordByWord
                  columns={columns ?? []}
                  words={item.words ?? []}
                  showSimpleArabic={showSimpleArabic}
                />
              </div>
            );
          })}
        </div>
        {/* </Col>
        </Row> */}
      </Spin>
    </>
  );
}
export default WordbyWord;
