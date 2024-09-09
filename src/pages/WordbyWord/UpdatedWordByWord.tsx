/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Col, Modal, Row, Table, Tooltip } from "antd";
import {
  EyeOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { ModalDataType } from "../../Types/WordByWord";
import { OpenNotification } from "../../Actions/Utilities/Utilities";
import logo from "../../assets/images/letter-g.png";
interface Props {
  columns: any[];
  words: any[];
  showSimpleArabic: boolean;
}
let mainUrl = "";
const url = process.env.REACT_APP_API_URL;
if (url !== undefined) {
  let newUrl = url.split("/a");
  mainUrl = newUrl[0];
}

const s3Url = "https://rq-notes.s3.us-east-005.backblazeb2.com/grammar-notes/";
const morphemeUrl = "https://qgrmr-dev-lr.researchquran.org/api/find-by-wordid";

const UpdatedWordByWord: React.FC<Props> = ({
  columns,
  words,
  showSimpleArabic,
}) => {
  const [modalData, setModalData] = useState<ModalDataType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const token = localStorage.getItem("token");
  const handleModal = (e: any, wordId: number) => {
    e.preventDefault();
    setLoader(true);
    axios
      .post(
        morphemeUrl,
        { wordId: String(wordId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "access-control-allow-methods":
              "GET, PUT, POST, DELETE, HEAD, OPTIONS",
          },
        }
      )
      .then(({ data: response, status }) => {
        if (response.success && status === 200) {
          setModalData(response.list);
          setModalOpen(true);
          setLoader(false);
        } else {
          setLoader(false);
          setModalData([]);
          setModalOpen(true);
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        setLoader(false);
        setModalData([]);
        setModalOpen(true);
        //OpenNotification("error", "We are working to add all the arabic grammer deatils currently this word's grammer has not been updated.");
      });
  };
  const handleOk = () => {
    setModalOpen(false);
  };

  const Modalcolumns = [
    {
      title: "English Grammar",
      dataIndex: "en",
      key: "en",
    },
    {
      title: "English Sub Grammar",
      dataIndex: "sub_en",
      key: "sub_en",
    },
    {
      title: "Arabic Sub Grammar",
      dataIndex: "sub_ar",
      key: "sub_ar",
    },
    {
      title: "Arabic Grammar",
      dataIndex: "ar",
      key: "ar",
    },
    {
      title: "Pronoun English",
      render: (_text: any, record: any) => (
        <>
          {record?.morpheme_form?.en !== "" &&
          record?.morpheme_form?.en !== null ? (
            <>
              <span className="inner-word">{record?.morpheme_form?.en}</span>
            </>
          ) : (
            <>
              <span className="inner-word">-</span>
            </>
          )}
        </>
      ),
    },
    {
      title: "Pronoun Arabic",
      render: (_text: any, record: any) => (
        <>
          {record?.morpheme_form?.ur !== "" &&
          record?.morpheme_form?.ur !== null ? (
            <>
              <span className="inner-word">{record?.morpheme_form?.ur}</span>
            </>
          ) : (
            <>
              <span className="inner-word">-</span>
            </>
          )}
        </>
      ),
    },
    {
      title: "Weight Form",
      dataIndex: "weight_form",
      key: "weight_form",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Template",
      dataIndex: "template",
      key: "template",
    },
    {
      title: "Word",
      dataIndex: "word",
      key: "word",
    },
  ];
  return (
    <Row justify="space-around" style={{ marginBottom: "10px" }}>
      <Col xl={23}>
        <div style={{ overflowX: "auto", direction: "rtl" }}>
          <table
            className="table table-bordered "
            style={{ border: "1px solid #252525", direction: "rtl" }}
          >
            <tbody className="text-center ">
              {columns.map((columnItem, index) => (
                <div
                  className="word-display table-heading"
                  key={index}
                  style={{
                    position: "sticky",
                    right: "0",
                    backgroundColor: "	#71797E",
                  }}
                >
                  {columnItem.title === "اللفظ" ? (
                    <>
                      <div style={{ paddingBottom: "4px" }}>
                        {columnItem.title}
                      </div>
                    </>
                  ) : columnItem.title === "Grammar" ? (
                    <>
                      <div style={{ height: "30px" }}>{columnItem.title}</div>
                    </>
                  ) : (
                    <>{columnItem.title}</>
                  )}
                </div>
              ))}

              {words.map((wordItem, index) => {
                return (
                  <td>
                    {columns.map((columnItem, index) => {
                      return (
                        <div className="word-display" key={index}>
                          {wordItem[columnItem.key] !== undefined &&
                          wordItem[columnItem.key] !== "" ? (
                            <>
                              {columnItem.key === "word" ? (
                                <>
                                  {wordItem.quranicLexiconNumber >= 2 ||
                                  wordItem.quranicLexiconType === "Referred" ||
                                  wordItem.quranicLexiconType === "Source" ? (
                                    <>
                                      <div
                                        style={{
                                          backgroundColor: "gray",
                                          color: "lightgreen",
                                          paddingBottom: "4px",
                                        }}
                                      >
                                        <Tooltip
                                          title="View Grammer Details"
                                          color={"#2db7f5"}
                                        >
                                          <a
                                            href={`https://corpus.quran.com/wordmorphology.jsp?location=(${wordItem.reference})`}
                                            rel="noreferrer"
                                            style={{
                                              float: "right",
                                              color: "lightgreen",
                                            }}
                                            target="_blank"
                                          >
                                            <InfoCircleOutlined />
                                          </a>
                                        </Tooltip>
                                        <span className="inner-word">
                                          {wordItem[columnItem.key]}
                                        </span>
                                        {showSimpleArabic && (
                                          <p>
                                            <span className="inner-word">
                                              {wordItem.simpleWord ?? ""}
                                            </span>
                                          </p>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div style={{ paddingBottom: "4px" }}>
                                        <Tooltip
                                          title="View Grammer Details"
                                          color={"#2db7f5"}
                                        >
                                          <a
                                            href={`https://corpus.quran.com/wordmorphology.jsp?location=(${wordItem.reference})`}
                                            rel="noreferrer"
                                            style={{ float: "right" }}
                                            target="_blank"
                                          >
                                            <InfoCircleOutlined />
                                          </a>
                                        </Tooltip>
                                        {wordItem.rootWord !== "" &&
                                        wordItem.rootWord !== null &&
                                        wordItem.engRootWord !== "" &&
                                        wordItem.engRootWord !== null ? (
                                          <>
                                            <Tooltip
                                              title="Grammar Morpheme Details"
                                              color={"#2db7f5"}
                                            >
                                              {!loader ? (
                                                <a
                                                  href="#"
                                                  onClick={(e) =>
                                                    handleModal(e, wordItem.id)
                                                  }
                                                  rel="noreferrer"
                                                  className="float-right pr-2 text-success"
                                                  target="_blank"
                                                >
                                                  <img
                                                    src={logo}
                                                    alt="Icon"
                                                    className="w-4 pt-2 text-success"
                                                  />
                                                </a>
                                              ) : (
                                                <LoadingOutlined
                                                  className="float-right pt-3 text-success pr-2"
                                                  style={{ fontSize: 15 }}
                                                  spin
                                                />
                                              )}
                                            </Tooltip>
                                          </>
                                        ) : null}
                                        <Tooltip
                                          title="View Morphological Details"
                                          color={"#2db7f5"}
                                        >
                                          <a
                                            href={`https://qgrmr-dev.researchquran.org/landingpage?rootWord=${wordItem.engRootWord}&wordId=${wordItem.id}`}
                                            rel="noreferrer"
                                            style={{ float: "left" }}
                                            target="_blank"
                                          >
                                            <LinkOutlined />
                                          </a>
                                        </Tooltip>
                                        <span className="inner-word">
                                          {wordItem[columnItem.key]}
                                        </span>
                                        {showSimpleArabic && (
                                          <p>
                                            <span className="inner-word">
                                              {wordItem.simpleWord ?? ""}
                                            </span>
                                          </p>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : columnItem.key ===
                                "grammaticalDescription" ? (
                                <>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      height: "5px",
                                    }}
                                  >
                                    {wordItem.usmaniStyle !== "" && (
                                      <Tooltip
                                        title="Arabic 1"
                                        color={"#2db7f5"}
                                      >
                                        <a
                                          href={wordItem.usmaniStyle}
                                          rel="noreferrer"
                                          style={{
                                            float: "right",
                                            verticalAlign: "top",
                                            color: "green",
                                          }}
                                          target="_blank"
                                        >
                                          <EyeOutlined
                                            style={{
                                              height: "10px",
                                              width: "25px",
                                            }}
                                          />
                                        </a>
                                      </Tooltip>
                                    )}
                                    {wordItem.arabicGrammar !== "" && (
                                      <Tooltip
                                        title="Arabic 2"
                                        color={"#2db7f5"}
                                      >
                                        <a
                                          href={wordItem.arabicGrammar}
                                          rel="noreferrer"
                                          style={{
                                            float: "right",
                                            verticalAlign: "bottom",
                                            color: "blue",
                                            marginRight: "5px",
                                          }}
                                          target="_blank"
                                        >
                                          <EyeOutlined
                                            style={{
                                              height: "10px",
                                              width: "10px",
                                            }}
                                          />
                                        </a>
                                      </Tooltip>
                                    )}
                                  </div>

                                  {wordItem[columnItem.key].length >= 20 ? (
                                    <>
                                      <Tooltip
                                        title={wordItem[columnItem.key]}
                                        color={"#2db7f5"}
                                      >
                                        <span className="inner-word">{`${wordItem[
                                          columnItem.key
                                        ].substring(0, 20)}...`}</span>
                                      </Tooltip>
                                    </>
                                  ) : (
                                    <>
                                      <span className="inner-word">
                                        {wordItem[columnItem.key]}
                                      </span>
                                    </>
                                  )}
                                </>
                              ) : columnItem.key === "rootWord" ? (
                                <>
                                  {wordItem.rootWord !== "" &&
                                  wordItem.engRootWord !== "" ? (
                                    <>
                                      <Tooltip
                                        title="View Grammer Details"
                                        color={"#2db7f5"}
                                      >
                                        <a
                                          href={`https://corpus.quran.com/qurandictionary.jsp?q=${wordItem.engRootWord}`}
                                          rel="noreferrer"
                                          style={{ float: "right" }}
                                          target="_blank"
                                        >
                                          <InfoCircleOutlined />
                                        </a>
                                      </Tooltip>
                                      <Tooltip
                                        title="View Morphological Details"
                                        color={"#2db7f5"}
                                      >
                                        <a
                                          href={`https://qgrmr-dev.researchquran.org/Dashboard?rootWord=${wordItem.engRootWord}`}
                                          rel="noreferrer"
                                          style={{ float: "left" }}
                                          target="_blank"
                                        >
                                          <LinkOutlined />
                                        </a>
                                      </Tooltip>
                                    </>
                                  ) : null}
                                  <span className="inner-word">
                                    {wordItem.rootWord !== "" &&
                                    wordItem.engRootWord !== ""
                                      ? wordItem[columnItem.key]
                                      : "-"}
                                  </span>
                                </>
                              ) : columnItem.key === "quranicLexiconType" ? (
                                <>
                                  {wordItem.quranicLexiconNumber >= 2 ||
                                  wordItem.quranicLexiconType === "Referred" ||
                                  wordItem.quranicLexiconType === "Source" ? (
                                    <>
                                      <Tooltip
                                        title={wordItem?.otherDetail?.map(
                                          (items: any) =>
                                            items.type !== "" &&
                                            items.type !== null
                                              ? " " +
                                                items.scholar +
                                                ": " +
                                                items.type +
                                                ", "
                                              : ""
                                        )}
                                        color={"#2db7f5"}
                                      >
                                        <div
                                          style={{
                                            backgroundColor: "gray",
                                            color: "lightgreen",
                                          }}
                                        >
                                          <span className="inner-word">
                                            {wordItem[columnItem.key]}
                                          </span>
                                        </div>
                                      </Tooltip>
                                    </>
                                  ) : (
                                    <>
                                      <Tooltip
                                        title={wordItem?.otherDetail?.map(
                                          (items: any) =>
                                            items.type !== "" &&
                                            items.type !== null
                                              ? " " +
                                                items.scholar +
                                                ": " +
                                                items.type +
                                                ", "
                                              : ""
                                        )}
                                        color={"#2db7f5"}
                                      >
                                        {/* <EyeOutlined style={{ color: '#2db7f5', marginRight: '3px' }} /> */}
                                        <div
                                          style={{
                                            backgroundColor: "gray",
                                            color: "lightgreen",
                                          }}
                                        >
                                          <span className="inner-word">
                                            {wordItem[columnItem.key]}
                                          </span>
                                        </div>
                                      </Tooltip>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {columnItem.note !== "" &&
                                  wordItem[columnItem.note] !== "" &&
                                  wordItem[columnItem.key] !== undefined &&
                                  wordItem[columnItem.key] !== "" ? (
                                    <>
                                      <Tooltip
                                        title="View Word Details"
                                        color={"#2db7f5"}
                                      >
                                        <a
                                          href={wordItem[columnItem.note]}
                                          target="_blank"
                                          rel="noreferrer"
                                          style={{ float: "right" }}
                                        >
                                          <EyeOutlined
                                            style={{
                                              color: "#2db7f5",
                                              marginRight: "3px",
                                            }}
                                          />
                                        </a>
                                      </Tooltip>
                                      <span className="inner-word">
                                        {wordItem[columnItem.key]}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="inner-word">
                                        {wordItem[columnItem.key]}
                                      </span>
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {wordItem.quranicLexiconNumber >= 2 ||
                              wordItem.quranicLexiconType === "Referred" ||
                              wordItem.quranicLexiconType === "Source" ? (
                                <>
                                  <div
                                    style={{
                                      backgroundColor: "gray",
                                      color: "lightgreen",
                                    }}
                                  >
                                    -
                                  </div>
                                </>
                              ) : (
                                "-"
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </td>
                );
              })}
            </tbody>
          </table>
        </div>
      </Col>
      <Modal
        title="Grammer Details"
        width={modalData.length > 0 ? 1500 : 500}
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleOk}
        closable
      >
        {modalData.length > 0 ? (
          <Table
            dataSource={modalData}
            columns={Modalcolumns}
            pagination={false}
            bordered
          />
        ) : (
          <center>
            <InfoCircleOutlined className="text-danger text-lg m-0 pb-2" />
            <h6 className="text-danger font-bold">
              We are working to add all the arabic grammer deatils currently
              this word's grammer has not been updated.
            </h6>
          </center>
        )}
      </Modal>
    </Row>
  );
};
export default UpdatedWordByWord;
