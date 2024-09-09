/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { Button, Col, Pagination, Row, Space, Typography } from "antd";
import { Table } from "antd";
import { Popconfirm } from "antd";
import WordNotesForm from "./WordNotesForm/WordNotesForm";
import {
  getWordsNotes,
  saveNote,
  updateNote,
  filterSurah,
  filterAyatWord,
  deleteWordNote,
  getScholars,
  getLanguages,
} from "../../Actions/WordNotesActions/WordNotes";
import { OpenNotification } from "../../Actions/Utilities/Utilities";
const { Text } = Typography;
const WordNotes: React.FC = () => {
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [title, setTitle] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [selectedName, setSelectedName] = React.useState<any>("");
  const [file, setFile] = React.useState<any>();
  const [inputKey, setInputKey] = React.useState<any>("");
  const [scholars, setScholars] = React.useState<any>();
  const [totalRecord, setTotalRecord] = React.useState<number>(0);
  const [wordNotes, setWordNotes] = React.useState<any>([]);
  const [dataLoading, setDataLoading] = React.useState<boolean>(false);
  const [selectedSurah, setSelectedSurah] = React.useState<string>("");
  const [verses, setVerses] = React.useState<any>();
  const [selectedVerse, setSelectedVerse] = React.useState<string>("");
  const [words, setWords] = React.useState<any>();
  const [selectedWord, setSelectedWord] = React.useState<string>("");
  const [selectedScholar, setSelectedScholar] = React.useState<any>();
  const [updateId, setUpdateId] = React.useState<any>("");
  const [selectedWordId, setSelectedWordId] = React.useState<any>("");
  const [languages, setLanguages] = React.useState<any>();
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("");

  let mainUrl = "";
  const urll = process.env.REACT_APP_API_URL;
  if (urll !== undefined) {
    let newUrl = urll.split("/a");
    mainUrl = newUrl[0];
  }
  const handledel = (e: any) => {
    var id = e;
    setDataLoading(true);
    deleteWordNote(id)
      .then(({ data: response }) => {
        if (response.success) {
          setDataLoading(false);
          const list = wordNotes.filter((item: { id: any }) => item.id !== id);
          setWordNotes(list);
          OpenNotification("success", response.message);
        } else {
          OpenNotification("error", response.message);
          setDataLoading(false);
        }
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  };
  const getAllScholars = () => {
    getScholars()
      .then(({ data: response }) => {
        if (response.success) {
          setScholars(response.list);
          setLoading(false);
        } else {
          setLoading(false);
          OpenNotification("error", response.message);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        console.log("error", err);
      });
  };
  const handleChangeLanguage = (e: any) => {
    console.log(e.target.value);
    setSelectedLanguage(e.target.value);
  };
  const handleEdit = (e: any) => {
    // getAllScholars();

    const data = e;
    let randomString = Math.random().toString(36);
    setInputKey(randomString);
    setSelectedScholar(data.scholarId);
    setSelectedSurah(data.surahNo);
    setSelectedVerse(data.ayatNo);
    setSelectedWord(data.word);
    setSelectedWordId(data.wordId);
    setSelectedName(data.noteLabel);
    setUpdateId(data.id);
    setSelectedLanguage(data.languageId);
    setVerses("");
    setWords("");
    setTitle("Update Word Note");
    setIsOpen(true);
  };
  const handleFormOpen = () => {
    // getAllScholars();
    let randomString = Math.random().toString(36);
    setInputKey(randomString);
    // setSelectedScholar("");
    setSelectedName("");
    setSelectedWord("");
    setWords("");
    setSelectedVerse("");
    setVerses("");
    setSelectedSurah("");
    setUpdateId("");
    setTitle("Add Word Note");
    setIsOpen(true);
  };
  // const handleChangeScholar = (e: any) => {
  //   setSelectedScholar(e.target.value);
  // };
  const handleChangeName = (e: any) => {
    setSelectedName(e.target.value);
  };
  const handleChangeWord = (e: any) => {
    setSelectedWord(e.target.value);
  };
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };
  const handleCloseModel = () => {
    setIsOpen(false);
  };
  const handleSubmit = (id: any) => {
    setLoading(true);
    var data = new FormData();
    if (id) {
      data.append("scholarId", selectedScholar);
      data.append("surahId", selectedSurah);
      data.append("ayatId", selectedVerse);
      data.append("wordId", selectedWordId);
      data.append("noteLabel", selectedName);
      data.append("noteFile", file);
      data.append("languageId", selectedLanguage);
      updateNote(id, data)
        .then(({ data: response }) => {
          setLoading(false);
          setIsOpen(false);
          const notesCopy = [...wordNotes];
          const index = notesCopy.findIndex((item: any) => item.id === id);
          notesCopy[index] = response.row;
          setWordNotes(notesCopy);
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error Occured", err);
          OpenNotification("error", err.message);
        });
    } else {
      data.append("scholarId", selectedScholar);
      data.append("surahId", selectedSurah);
      data.append("ayatId", selectedVerse);
      data.append("wordId", selectedWord);
      data.append("noteLabel", selectedName);
      data.append("noteFile", file);
      data.append("languageId", selectedLanguage);
      saveNote(data)
        .then(({ data: response }) => {
          setLoading(false);
          setIsOpen(false);
          let notesCopy = [...wordNotes];
          notesCopy.unshift(response.row);
          setWordNotes(notesCopy);
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error Occured", err);
          OpenNotification("error", err.message);
        });
    }
  };
  const getAllWordNotes = () => {
    setDataLoading(true);
    getWordsNotes(currentPage)
      .then(({ data: response }) => {
        if (response.success) {
          console.log(response);
          setDataLoading(false);
          setWordNotes(response.list);
          setTotalRecord(response.total_records);
        } else {
          setDataLoading(false);
          OpenNotification("error", response.message);
        }
      })
      .catch((err: any) => {
        setDataLoading(false);
        console.log("error", err);
      });
  };
  const getAllLanguages = () => {
    getLanguages()
      .then(({ data: response }) => {
        if (response.success) {
          setLanguages(response.list);
          setLoading(false);
        } else {
          setLoading(false);
          OpenNotification("error", response.message);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        console.log("error", err);
      });
  };
  useEffect(() => {
    getAllWordNotes();
    getAllScholars();
    getAllLanguages();
    const userId = localStorage.getItem("userId");
    setSelectedScholar(userId);
    // eslint-disable-next-line
  }, [currentPage]);
  const handleChangeSurah = (e: any) => {
    const surah = e.target.value;
    filterSurah(e.target.value)
      .then(({ data: response }) => {
        setLoading(false);
        if (response.success) {
          setSelectedSurah(surah);
          setVerses(response.list);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  };
  const handleChangeAyat = (e: any) => {
    filterAyatWord(selectedSurah, e.target.value)
      .then(({ data: response }) => {
        setLoading(false);
        if (response.success) {
          setSelectedVerse(e.target.value);
          setWords(response.list);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  };
  const columns = [
    {
      title: "Sr",
      dataIndex: "id",
      key: "ninth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "File Name",
      dataIndex: "noteLabel",
      key: "eighth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Scholar Name",
      dataIndex: "scholarName",
      key: "seventh",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Surah",
      dataIndex: "surahNo",
      key: "sixth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Ayat",
      dataIndex: "ayatNo",
      key: "fifth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Word",
      dataIndex: "word",
      key: "forth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Language",
      dataIndex: "languageName",
      key: "tenth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "File",
      dataIndex: "noteFile",
      width: "5%",
      key: "third",
      className: "dark:bg-darkBody",
    },
    {
      title: "Action",
      dataIndex: "btn",
      key: "action",
      render: (
        _: any,
        record: { id: React.SetStateAction<null>; url: string }
      ) =>
        wordNotes.length >= 1 ? (
          <>
            <Space size="middle">
              <a
                href={record.url}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer"
              >
                View{" "}
              </a>
              <Button
                type="primary"
                size="small"
                onClick={() => handleEdit(record)}
                className="cursor-pointer"
              >
                Edit{" "}
              </Button>
              <Popconfirm
                title="sure to delete"
                onConfirm={() => handledel(record.id)}
              >
                <Button danger size="small">
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </>
        ) : null,
    },
  ];
  // console.log(wordNotes)
  return (
    <>
      <div className="container-fluid mt-5 mr-5">
        <div style={{ width: "100%" }}>
          <Row>
            <Col span={12}>
              <Text strong style={{ fontSize: "24px" }}>
                Word Notes
              </Text>
            </Col>
            <Col span={12}>
              <Button
                className="btn btn-info float-right mt-4"
                style={{ fontSize: "12px", marginTop: "6px" }}
                onClick={() => handleFormOpen()}
              >
                Add New
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={wordNotes}
            pagination={false}
            loading={dataLoading}
          />
          <Pagination
            total={totalRecord}
            current={currentPage}
            pageSize={10}
            onChange={(page: number) => setCurrentPage(page)}
          />
        </div>
        <WordNotesForm
          isOpen={isOpen}
          scholars={scholars}
          verses={verses}
          selectedSurah={selectedSurah}
          selectedVerse={selectedVerse}
          words={words}
          selectedScholar={selectedScholar}
          selectedName={selectedName}
          updateId={updateId}
          selectedWord={selectedWord}
          selectedWordId={selectedWordId}
          languages={languages}
          selectedLanguage={selectedLanguage}
          // handleChangeScholar={handleChangeScholar}
          handleCloseModel={handleCloseModel}
          handleChangeName={handleChangeName}
          handleFileChange={handleFileChange}
          handleChangeSurah={handleChangeSurah}
          handleChangeAyat={handleChangeAyat}
          handleChangeWord={handleChangeWord}
          handleSubmit={handleSubmit}
          handleChangeLanguage={handleChangeLanguage}
          title={title}
          inputKey={inputKey}
          loading={loading}
        />
      </div>
    </>
  );
};
export default WordNotes;
