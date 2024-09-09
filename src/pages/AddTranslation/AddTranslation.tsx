/* eslint-disable array-callback-return */
/* eslint-disable no-useless-computed-key */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
} from "antd";
import {
  editTranslation,
  getRelatedWords,
  getScholarsTranslation,
  getTranslations,
  saveTranslation,
  UpdateTranslation,
  getPhraseWords,
  removeSingleWordTranslation,
  editWordSource,
  updateSourceWord
} from "../../Actions/Translation/translation";
import { filterSurah } from "../../Actions/WordByWordActions/WordByWord";
import { OpenNotification } from "../../Actions/Utilities/Utilities";
import { LoadingOutlined, MinusOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import './Style.css';
const { Text } = Typography;
const { Option } = Select;

const AddTranslation = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showInput, setShowInput] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scholar, setScholars] = useState<any>([]);
  const [relatedWords, setRelatedWords] = useState<any>([]);
  // const [disableWord, setDisableWord] = useState<any>([]);
  const [ayatTranslations, setAyatTranslations] = useState<any>([]);
  const [data, setdata] = useState<any>([]);
  const [data1, setdata1] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [wordsIds, setWordsIds] = useState<any>([]);
  const [allData, setAllData] = useState<any>({});
  const [quranicLexicons, setQuranicLexicons] = useState<any>({});
  const [verses, setVerses] = React.useState<any>([]);
  const [editWordData, setEditWordData] = React.useState<any>({});
  const [recordIndex, setRecordIndex] = React.useState<any>(undefined);
  const [wordId, setWordId] = React.useState<any>({});
  const [editwordId, setEditWordId] = React.useState<any>("");
  const [selectedScholar, setSelectedScholar] = React.useState<any>("");
  // const [editModalWordId, setEditModalWordId] = React.useState<any>("");
  const [editId, setEditId] = React.useState<any>("");
  const [totalWords, setTotalWords] = React.useState<any>(0);
  const [verseLoader, setVerseLoader] = React.useState<any>(false);
  const [showContent, setShowContent] = React.useState<any>(false);
  const [contentLoader, setContentLoader] = React.useState<any>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState<any>({
    scholarId: selectedScholar,
    surahId: "",
    ayatId: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editValues, setEditValues] = useState<any>({
    scholarId: selectedScholar,
    surahId: "",
    ayatId: "",
  });
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const surahId = location?.state?.surahId;
  const scholarId = location?.state?.scholarId;
  const ayatNo = location?.state?.ayatNo;
  const editWordModal = (record: any, index: any) => {
    setVerseLoader(false);
    editWordSource(record.referenceWord)
      .then(({ data: response }) => {
        if (response.success) {
          form.setFieldsValue(response.list[0])
          setdata1(response.list[0]);
          setVerseLoader(false);
          setEditWordData(record);
          setRecordIndex(index);
          setEditId("1");
          setWordId({
            id: record.referenceWord,
          });
          OpenNotification("success", response.message);
        }
        else {
          setVerseLoader(false);
          OpenNotification("error", response.message);
        }
      })
      .catch((err: any) => {
        OpenNotification("error", err);
      });
    setEditWordId(record.referenceWord);

    // setEditModalWordId(record.referenceWord);
    setIsModalOpen(true);
  };
  const handleRefEditData = (name: any, e: any, editWordData: any, recordIndex: any) => {
    if (e.value === "single_al_word") {
      setIsOpen(true);
      setSelectedRowKeys(data1?.relatedWords)
    }
    // if (e.value === "None") {
    //   setIsOpen(true);
    //   setRelatedWords([])
    //   setSelectedRowKeys([])

    // }

    Object.assign(editWordData, { [name]: e.value });
    const wordTranslation = [...data1];
    wordTranslation[recordIndex] = editWordData;
    setdata1(wordTranslation);
  }

  const onFinish = (values: any) => {
    // setIsModalOpen(false);
// console.log(data1);

    Object.assign(values, {
      ["relatedWords"]: data1?.relatedWords ?? data1[0].relatedWords,
      ["wordId"]: editwordId,
    });
    updateSourceWord(values).then(({ data: response }) => {
      if (response.success === true) {
        setContentLoader(false);
        navigate("/mytranslation");

        OpenNotification("success", response.message);
      }
    });
    // console.log('Success:', values);
  };
  Object.assign(editValues, {
    ["surahId"]: surahId,
    ["ayatId"]: ayatNo,
    ["scholarId"]: scholarId,
  });

  useEffect(() => {
    if (isOpen === true) {
      const id = { wordId: wordId.id };
      setModalLoading(true);

      if (wordId.check === true) {
        getPhraseWords(id).then(({ data: response }) => {
          if (response.success === true) {
            setModalLoading(false);
            const list = response.list;
            setRelatedWords(
              list.map((items: any) => ({
                key: items.id,
                disabled: items.disable,
                reference: [
                  <>
                    {items.surahNo}:{items.ayatNo}:{items.reference}
                  </>,
                ],
                word: items.word,
              }))
            );
            // setDisableWord(list.map((items: any) => (items.diable)))
            setWordsIds(list.map((items: any) => (items.id)));

            setTotalWords(response.totalWords);
          }
        });
      } else {
        getRelatedWords(id).then(({ data: response }) => {
          if (response.success === true) {
            setModalLoading(false);
            const list = response.list;
            console.log(response)
            setRelatedWords(
              list.map((items: any) => ({
                key: items.id,
                disabled: items.disable,
                reference: [
                  <>
                    {items.surahNo}:{items.ayatNo}:{items.reference}
                  </>,
                ],
                word: items.word,


              }))
            );
            setWordsIds(list.map((items: any) => (items.id)));
            setTotalWords(response.totalWords);
          }
        });
      }
    }
    getTranslations().then(({ data: response }) => {
      setScholars(response.data);
    });
    const userId = localStorage.getItem("userId");
    setSelectedScholar(userId);
  }, [isOpen, showInput, wordId]);

  const style: React.CSSProperties = { padding: "0px 0px" };
  var surahs = JSON.parse(localStorage?.getItem("surahs") as any);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const handleChangeSurah = (e: string, name: any) => {
    setVerseLoader(true);
    var data = new FormData();
    data.append("scholarId", selectedScholar);
    data.append("surahId", e);
    filterSurah(data)
      .then(({ data: response }) => {
        if (response.success) {
          setVerseLoader(false);
          setVerses(response.list);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err: any) => {
        OpenNotification("error", err);
      });
    setValues({
      ...values,
      [name]: e,
      scholarId: selectedScholar,
    });
  };

  const handledel = (index: any, record: any) => {
    setWordId("");
    setVerseLoader(true);
    const data2 = {
      wordId: record.wordId,
      row: record
    };
    removeSingleWordTranslation(data2)
      .then(({ data: response }) => {
        if (response.success) {
          setVerseLoader(false);
          const newdata = [...data];
          newdata[index] = response.row;
          setdata(newdata);
          OpenNotification("success", response.message);
        }
        else {
          setVerseLoader(false);
          OpenNotification("error", response.message);
        }
      })
      .catch((err: any) => {
        OpenNotification("error", err);
      });
  }
  const columns = [
    {
      title: "Action",
      dataIndex: "delete",
      width: 80,
      render: (_: any, record: any, index: any) => (
        <>
          <Space direction="horizontal">
            <Popconfirm
              title="Are you sure？"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handledel(index, record)}
            >
              <Button icon={<MinusOutlined />} shape={"circle"} danger />
            </Popconfirm>
          </Space>
        </>
      ),
    },
    {
      title: "Adressee",
      dataIndex: "addressee",
      render: (_: any, record: any, index: any) => (
        <>
          <input
            className="form-control"
            type="text"
            name="addressee"
            value={record.addressee}
            disabled={Boolean(record.disable === true)}
            onChange={(e) => handleChangeSave(e, index, record)}
          />
        </>
      ),
    },
    {
      title: "Addresser",
      dataIndex: "addresser",
      render: (_: any, record: any, index: any) => (
        <>
          <input
            className="form-control"
            type="text"
            disabled={Boolean(record.disable === true)}
            value={record.addresser}
            name="addresser"
            onChange={(e) => handleChangeSave(e, index, record)}
          />
        </>
      ),
    },
    {
      title: "Quranic Lexicon Reference",
      dataIndex: "abrahamicLocution",
      render: (_: any, record: any, index: any) => (
        <>
          <Select
            // showSearch
            style={{ width: 150, border: "1px solid #d9d9d9" }}
            placeholder="--Select--"
            optionFilterProp="children"
            className="dark:text-white"
            value={record.quranicLexicon}
            disabled={Boolean(record.disable === true)}
            onChange={(name, e) =>
              handleRefSaveData("quranicLexicon", e, index, record)
            }
          >
            <Option value="" selected>None</Option>
            {Object.entries(quranicLexicons).map(([keys, values]: any) => {
              return <Option value={keys}>{values}</Option>;
            })}
          </Select>
          <br />
          {record.quranicLexicon === "dual_al_word" && (
            <Select
              showSearch
              style={{ width: 150, border: "1px solid #d9d9d9" }}
              placeholder="--Select--"
              optionFilterProp="children"
              className="dark:text-white"
              value={record.quranicLexiconNumber}
              disabled={Boolean(record.disable === true)}
              onChange={(name, e) =>
                handleDisableRow("quranicLexiconNumber", e, index, record)
              }
            >
              {Array(9)
                .fill(1)
                .map((_, idx) => {
                  let val = idx + 2;
                  return (
                    <Option key={val} value={val}>
                      {val}
                    </Option>
                  );
                })}
            </Select>
          )}
          {/* {showInput && <input className="form-control" type="text" />} */}
        </>
      ),
    },
    {
      title: "English",
      dataIndex: "english",
      render: (_: any, record: any, index: any) => (
        <>
          <input
            className="form-control"
            type="text"
            disabled={Boolean(
              record.disable === true || record.englishDisabled === true
            )}
            value={record.english}
            name="english"
            onChange={(e) => handleChangeSave(e, index, record)}
          />
        </>
      ),
    },
    {
      title: "Urdu",
      dataIndex: "urdu",
      render: (_: any, record: any, index: any) => (
        <>
          <input
            className="form-control"
            type="text"
            disabled={Boolean(
              record.disable === true || record.urduDisabled === true
            )}
            value={record.urdu}
            name="urdu"
            onChange={(e) => handleChangeSave(e, index, record)}
            style={{ textAlign: "right" }}
          />
        </>
      ),
    },
    {
      title: "Word",
      width: "130px",
      dataIndex: "word",
      render: (_: any, record: any, index: any) => (
        <>
          {

            record.disable === true ? (
              <>
                <Tooltip title={record.referenceWord} color={'#2db7f5'} >
                  <div style={{ cursor: 'help' }}>{record.word}</div>
                  <div><a href="#" onClick={() => editWordModal(record, index)}>
                    Edit Source
                  </a></div>
                </Tooltip>
              </>
            ) : (
              <>
                <span>{record.word}</span>
              </>
            )}
        </>
      ),
    },
    {
      title: "#",
      dataIndex: "reference",
      width: "80px",
      render: (_: any, record: any) => (
        <>
          <span>{record.reference}</span>
        </>
      ),
    },
  ];
  useEffect(() => {
    if (
      values.surahId !== "" &&
      values.scholarId !== "" &&
      values.ayatId !== "" &&
      values.alreadyAdded.includes(false)
    ) {
      setContentLoader(true);
      setShowContent(false);
      getScholarsTranslation(values).then(({ data: response }) => {
        if (response.success === true) {
          setAllData(response.row);
          setQuranicLexicons(response.quranicLexicons);
          setAyatTranslations(response.row.ayatsTranslations);
          const dataa = response?.row?.words;
          setdata(dataa);
          setContentLoader(false);
          setShowContent(true);
          OpenNotification("success", response.message);
        }
      });
    }
    if (
      values.surahId !== "" &&
      values.scholarId !== "" &&
      values.ayatId !== "" &&
      values.alreadyAdded.includes(true)
    ) {
      setContentLoader(false);
      editTranslation(values).then(({ data: response }) => {
        setAllData(response.row);
        setAyatTranslations(response.row.ayatsTranslations);
        setQuranicLexicons(response.quranicLexicons);

        const dataa = response?.row?.words;
        // const dataa1 = response?.row?.words;
        setdata(dataa);
        setContentLoader(false);
        setShowContent(true);
        OpenNotification("success", response.message);

      });
      // OpenNotification("error", response.message);
    }
  }, [values]);
  useEffect(() => {
    if (
      editValues.surahId !== undefined &&
      editValues.scholarId !== undefined &&
      editValues.ayatId !== undefined
    ) {
      setContentLoader(true);
      setShowContent(false);
      editTranslation(editValues).then(({ data: response }) => {
        setAllData(response.row);
        setAyatTranslations(response.row.ayatsTranslations);
        setQuranicLexicons(response.quranicLexicons);

        const dataa = response?.row?.words;
        setdata(dataa);
        setContentLoader(false);
        setShowContent(true);
        OpenNotification("success", response.message);

      });
    }
  }, [editValues]);
  const handleCloseEditModal = () => {
    setIsModalOpen(false);
  }

  const handleCloseModel = () => {
    setIsOpen(false);
    if (editId === "1") {
      let index: any;
      let object: any;
      const result = [data1];
      if (wordId.check === true) {
        let id = Number(wordId.id.split(",")[0]);
        const thisid = result.map((items: any) => (items.relatedWords))
        index = thisid.findIndex((items: any) => items.wordId === id);
        object = thisid.find((items: any) => items.wordId === id);
      } else {
        index = result.findIndex((items: any) => items.wordId === wordId.id);
        object = result.find((items: any) => items.wordId === wordId.id);
      }


      Object.assign(object, {
        ["relatedWords"]: selectedRowKeys,
        ["quranicLexiconType"]: "Source",
      });
      const wordTranslation = [...result];
      wordTranslation[index] = object;
      // console.log(wordTranslation);

      setdata1(wordTranslation);
    }
    else {
      let index: any;
      let object: any;

      if (wordId.check === true) {
        let id = Number(wordId.id.split(",")[0]);
        const thisid = data.map((items: any) => (items.relatedWords))
        index = thisid.findIndex((items: any) => items.wordId === id);
        object = thisid.find((items: any) => items.wordId === id);
      } else {
        index = data.findIndex((items: any) => items.wordId === wordId.id);
        object = data.find((items: any) => items.wordId === wordId.id);
      }


      Object.assign(object, {
        ["relatedWords"]: selectedRowKeys,
        ["quranicLexiconType"]: "Source",
      });
      const wordTranslation = [...data];
      wordTranslation[index] = object;
      // console.log(wordTranslation);

      setdata(wordTranslation);
    }

  };

  const handleChangeSave = (e: any, index: any, dataa: any) => {
    Object.assign(dataa, {
      [e.target.name]: e.target.value,
    });

    const wordTranslation = [...data];
    wordTranslation[index] = dataa;
    setdata(wordTranslation);
  };

  const handleRefSaveData = (name: any, e: any, index: any, dataa: any) => {
console.log(dataa);
    if (e.value === "single_al_word") {
      setIsOpen(true);
      setWordId({
        id: dataa.wordId,
      });

      data.map((items: any) => {
        if (items.wordId === dataa.wordId) {
          setSelectedRowKeys(items.relatedWords)
        }
      });

    }

    if (e.value === "dual_al_word") {
      // setIsOpen(true);
      setShowInput(true);
    }
    setEditId("0");
    Object.assign(dataa, { [name]: e.value });
    const wordTranslation = [...data];
    wordTranslation[index] = dataa;
    setdata(wordTranslation);
  };

  const handleDisableRow = (name: any, e: any, index: any, dataa: any) => {
    let id = index;
    let ids = dataa.wordId;

    data.forEach((element: { disable: boolean }) => {
      element.disable = false;
    });
    for (let i = 0; i < e.value && i < data.length; i++) {
      if (id !== index) {
        let element = data[id];
        element.disable = true;
        ids += "," + element.wordId;
      }
      id++;
    }


    setIsOpen(true);
    setWordId({
      id: ids,
      check: true,
    });

    Object.assign(dataa, { [name]: e.value });
    const wordTranslation = [...data];
    wordTranslation[index] = dataa;
    setdata(wordTranslation);
  };

  const handleAyatTranslation = (e: any, items: any) => {
    Object.assign(items, { ["translation"]: e.target.value });
    const index = ayatTranslations.findIndex(
      (item: any) => item.languageId === items.languageId
    );
    const newAyatTranslation = [...ayatTranslations];
    newAyatTranslation[index] = items;
    setAyatTranslations(newAyatTranslation);
  };

  const handlechange = (e: string, name: any) => {
    if (name === "ayatId") {
      const filter = verses.filter((items: any) => items.ayatNo === e);
      const value = filter.map((items: any) => items.alreadyAdded);
      Object.assign(values, { ["alreadyAdded"]: value });
    }

    setValues({ ...values, [name]: e });
  };

  const handlesave = () => {
    if (
      editValues.surahId !== undefined &&
      editValues.scholarId !== undefined &&
      editValues.ayatId !== undefined
    ) {
      setContentLoader(true);
      const dataa = {
        scholarId: editValues.scholarId,
        surahId: editValues.surahId,
        ayatId: editValues.ayatId,
        ayatTranslations: ayatTranslations,
        words: data,
      };
      UpdateTranslation(dataa).then(({ data: response }) => {
        if (response.success === true) {
          setContentLoader(false);
          navigate("/mytranslation");
          OpenNotification("success", response.message);
        }
      });
    } else if (values.alreadyAdded.includes(true)) {
      setContentLoader(true);
      const dataa = {
        scholarId: values.scholarId,
        surahId: values.surahId,
        ayatId: values.ayatId,
        ayatTranslations: ayatTranslations,
        words: data,
      };
      UpdateTranslation(dataa).then(({ data: response }) => {
        if (response.success === true) {
          setContentLoader(false);
          navigate("/mytranslation");

          OpenNotification("success", response.message);
        }
      });
    } else if (values.alreadyAdded.includes(false)) {
      setContentLoader(true);
      const dataa = {
        scholarId: values.scholarId,
        surahId: values.surahId,
        ayatId: values.ayatId,
        ayatTranslations: ayatTranslations,
        words: data,
      };
      saveTranslation(dataa).then(({ data: response }) => {
        if (response.success === true) {
          setContentLoader(false);
          navigate("/mytranslation");

          OpenNotification("success", response.message);
        }
      });
    }
  };

  const relatedWordColumn = [
    {
      title: "Reference",
      dataIndex: "reference",
      className: "text-center",
    },
    {
      title: "Word",
      dataIndex: "word",
      className: "text-center",
    },
  ];
  const onSelectChange = (newSelectedRowKeys: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
    console.log(newSelectedRowKeys);

  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // console.log(allRelatedWords);
  
  const userName = localStorage.getItem("userName");
  const roleid = localStorage.getItem("role_id");

  return (
    <>
      {roleid !== "4" && (<>
        {surahId && ayatNo && scholarId ? null : (
          <Card size="small">
            <Row>
              <Col span={5}>
                <div style={{ padding: "-1px 25px" }}>
                  <Text
                    strong
                    style={{ justifyContent: "center", fontSize: "24px" }}
                  >
                    Add Translation
                  </Text>
                </div>
              </Col>

              <Col span={5}>
                <div style={style}>
                  <Select
                    showSearch
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      border: "1px solid #d9d9d9",
                    }}
                    // placeholder="Select Scholar"
                    optionFilterProp="children"
                    className="dark:text-white"
                    value={selectedScholar}
                    disabled
                  // onChange={(e: string, name: any) =>
                  //   handlechange(e, "scholarId")
                  // }
                  >
                    <Option value={selectedScholar}>{userName}</Option>
                  </Select>
                </div>
              </Col>
              <Col span={1}></Col>
              <Col span={5}>
                <div style={style}>
                  <Select
                    showSearch
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      border: "1px solid #d9d9d9",
                    }}
                    placeholder="Select Surah"
                    optionFilterProp="children"
                    className="dark:text-white"
                    onChange={(e: string, name: any) =>
                      handleChangeSurah(e, "surahId")
                    }
                  >
                    {surahs.map((res: any) => {
                      return (
                        <Option
                          value={res.id}
                          key={res.id}
                          style={{ textAlign: "right" }}
                        >
                          {res.arabic}
                          <span style={{ float: "right" }}>{" :" + res.id}</span>
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </Col>
              <Col span={1}></Col>
              <Col span={5}>
                <div style={style}>
                  <Spin spinning={verseLoader} indicator={antIcon}>
                    <Select
                      showSearch
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        border: "1px solid #d9d9d9",
                      }}
                      placeholder="Select Verse"
                      optionFilterProp="children"
                      className="dark:text-white"
                      onChange={(e: string, name: any) =>
                        handlechange(e, "ayatId")
                      }
                    >
                      {verses &&
                        verses.map((res: any) => {
                          return (
                            <>
                              {res.alreadyAdded === true ? (
                                <Option
                                  value={res.ayatNo}
                                  key={res.id}
                                  style={{
                                    textAlign: "right",
                                    backgroundColor: "lightgreen",
                                  }}
                                >
                                  {res.ayatNo}
                                  {res.alreadyAdded}
                                </Option>
                              ) : (
                                <Option
                                  value={res.ayatNo}
                                  key={res.id}
                                  style={{ textAlign: "right" }}
                                >
                                  {res.ayatNo}
                                  {res.alreadyAdded}
                                </Option>
                              )}
                            </>
                          );
                        })}
                    </Select>
                  </Spin>
                </div>
              </Col>
            </Row>
          </Card>
        )}
        <Spin spinning={contentLoader} indicator={antIcon} className="mt-5">
          {showContent && (
            <>
              <Card
                size="small"
                extra={
                  <>
                    <Title
                      level={4}
                      className="font-Calibri"
                      style={{ float: "right", textAlign: "right" }}
                    >
                      {allData?.arabic}
                    </Title>
                  </>
                }
              >
                <Card size="small" title="Ayat and Words Translation">
                  <Row style={{ flexDirection: "row-reverse" }}>
                    {ayatTranslations?.map((item: any) => {
                      return (
                        <>
                          <Col span={11} offset={1}>
                            {item.languageId === 1 ? (
                              <label className="float-right">Urdu</label>
                            ) : (
                              <label
                                className="float-left"
                                style={{ float: "left" }}
                              >
                                English
                              </label>
                            )}
                            <Input
                              type="text"
                              name="translation"
                              value={item.translation}
                              disabled={item.disabled ?? false}
                              onChange={(e) => handleAyatTranslation(e, item)}
                            />
                          </Col>
                        </>
                      );
                    })}
                    {/*  <Col span={11}>
                    <label htmlFor="" style={{ float: "right" }}>
                      Urdu
                    </label>
                    <Input
                      type="text"
                      style={{ textAlign: "right" }}
                      name="translation"
                      onChange={(e) => handleAyatTranslation(e)}
                    />
                  </Col> */}
                  </Row>
                </Card>
                <Card size="small">
                  {/* <table width="100%" style={{textAlign:'center'}}>
                <tr>
                    <th style={{ width:'18%' }}>Adressee</th>
                    <th style={{ width:'20%', textAlign:'center' }}>Addresser</th>
                    <th style={{ width:'10%' }}>Quranic Lexicon Reference</th>
                    <th style={{ width:'20%' }}>English</th>
                    <th style={{ width:'20%' }}>Urdu</th>
                    <th style={{ width:'5%' }}>Word</th>
                    <th style={{ width:'7%' }}>#</th>
                  </tr>
                </table> */}
                  <div>
                    <Spin spinning={verseLoader} indicator={antIcon}>
                      <Table
                        style={{
                          overflowY: "auto",
                          width: "100%",
                        }}
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        scroll={{ y: 500 }}
                        bordered
                        direction="rtl"
                        rowClassName="text-center "
                      />
                    </Spin>
                  </div>
                </Card>
                <Button
                  loading={contentLoader}
                  type="primary"
                  className="mt-2"
                  onClick={handlesave}
                >
                  Save
                </Button>
              </Card>
            </>
          )}
        </Spin>

        <Modal
          title={`Word References total words ${totalWords}`}
          open={isOpen}
          // onCancel={handleCloseModel}
          cancelButtonProps={{ style: { display: 'none' } }}
          onOk={handleCloseModel}
          destroyOnClose
          style={{ zIndex: "1050" }}
        >
          <Table
            size="small"
            rowSelection={rowSelection}
            columns={relatedWordColumn}
            dataSource={relatedWords}
            pagination={false}
            scroll={{ y: 250 }}
            bordered
            // record?.disabled ? 'disabled-row' : ''
            rowClassName={(record: {disabled:Boolean;})  => (record?.disabled ? 'disabled-row' : '')}
            loading={{ spinning: modalLoading, indicator: antIcon }}
          />
        </Modal>
        <Modal title="Edit Source Word" open={isModalOpen} onCancel={handleCloseEditModal} footer={false}>

          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >

            <Form.Item
              label="Urdu"
              name="urdu"

              rules={[{ message: 'Please input urdu!' }]}
            >
              <Input disabled={Boolean(data1?.urduDisabled === true)} />
            </Form.Item>

            <Form.Item
              label="English"
              name="english"
              rules={[{ message: 'Please input english!' }]}
            >
              <Input disabled={Boolean(data1?.englishDisabled === true)} />
            </Form.Item>
            <Form.Item
              label="Addresser"
              name="addresser"
              rules={[{ message: 'Please input addresser!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Addressee"
              name="addressee"
              rules={[{ message: 'Please input addressee!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Select"
              name="quranicLexicon"
              rules={[{ message: 'Please select option!' }]}
            >

              <Select
                style={{ border: "1px solid #d9d9d9" }}
                placeholder="--Select--"
                optionFilterProp="children"
                className="dark:text-white"

                onChange={(name, e) =>
                  handleRefEditData("quranicLexicon", e, editWordData, recordIndex)
                }
              >
                <Option value="" selected>None</Option>
                {Object.entries(quranicLexicons).map(([keys, values]: any) => {
                  return keys !== "dual_al_word" && <Option value={keys}>{values}</Option>

                })}
              </Select>
            </Form.Item>
            <Form.Item style={{ marginBottom: '0px' }}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>

        </Modal>
      </>
      )}
    </>
  );
};

export default AddTranslation;


