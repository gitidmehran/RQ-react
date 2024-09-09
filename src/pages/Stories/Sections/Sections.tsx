import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Row, Col, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SectionsType, Ayats } from "../../../Types/Stories";
import { OpenNotification } from "../../../Actions/Utilities/Utilities";
import { filterSurah } from "../../../Actions/WordNotesActions/WordNotes";

interface Props {
  oldSection: SectionsType | null;
  isModalOpen: boolean;
  handleSaveSection: (item: SectionsType) => void;
  handleUpdateSection: (item: SectionsType) => void;
  handleCloseModal: () => void;
}

const { Option } = Select;

const Sections: React.FC<Props> = ({
  oldSection,
  isModalOpen,
  handleSaveSection,
  handleUpdateSection,
  handleCloseModal,
}) => {
  const storedAyatNames = JSON.parse(localStorage?.getItem("surahs") as any);
  const [loading, setLoading] = useState<boolean>(false);
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const [sectionAyats, setSectionAyats] = useState<SectionsType["ayats"]>([]);
  const [surahAyats, setSurahAyats] = useState<Ayats[]>([]);

  useEffect(() => {
    if (oldSection !== null) {
      setSurahAyats([]);
      setSectionTitle(oldSection.sectionTitle);
      setSectionAyats(oldSection.ayats);
    }
  }, [oldSection]);

  const filterSurahAyats = (surahId: number) => {
    setLoading(true);
    filterSurah(surahId)
      .then(({ data: response }) => {
        setLoading(false);
        if (response.success) {
          OpenNotification("success", response.message);
          setSurahAyats(response.list);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        OpenNotification("error", err.message);
      });
  };

  const handleAyatSelection = (ayat: Ayats) => {
    let sectionAyatsCopy = [...sectionAyats];
    if (sectionAyatsCopy.findIndex((item) => item.id === ayat.id) === -1) {
      sectionAyatsCopy.push(ayat);
    } else {
      sectionAyatsCopy = sectionAyatsCopy.filter((item) => item.id !== ayat.id);
    }
    setSectionAyats(sectionAyatsCopy);
  };

  const handleRemove = (record: Ayats) => {
    let sectionAyatsCopy = [...sectionAyats];
    sectionAyatsCopy = sectionAyatsCopy.filter((item) => item.id !== record.id);
    setSectionAyats(sectionAyatsCopy);
  };

  const handleSave = () => {
    if (sectionTitle === "") {
      OpenNotification("error", "Please Enter Section Title");
      return false;
    }
    if (sectionAyats.length === 0) {
      OpenNotification("error", "Please Select Ayats");
      return false;
    }
    const request: SectionsType = { sectionTitle, ayats: sectionAyats };
    oldSection !== null
      ? handleUpdateSection(request)
      : handleSaveSection(request);
    setSurahAyats([]);
    setSectionTitle("");
    setSectionAyats([]);
  };

  const isAlreadyAdded = (record: Ayats) => {
    const filter = sectionAyats.filter((item: Ayats) => item.id === record.id);
    return Boolean(filter.length > 0);
  };

  const handleClose = () => {
    setSurahAyats([]);
    setSectionTitle("");
    setSectionAyats([]);
    handleCloseModal();
  };

  const columns: ColumnsType<Ayats> = [
    {
      title: "Ayat",
      dataIndex: "arabic",
      className: "font-noorehuda text-lg text-right",
      width: "90%",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      width: "5%",
    },
    {
      title: "#",
      dataIndex: "id",
      width: "5%",
      render: (_, record: Ayats) => (
        <>
          <Input
            type="checkbox"
            disabled={isAlreadyAdded(record)}
            checked={Boolean(sectionAyats.indexOf(record) > -1)}
            onChange={() => handleAyatSelection(record)}
          />
        </>
      ),
    },
  ];

  const actionColumns: ColumnsType<Ayats> = [
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div onClick={() => handleRemove(record)} style={{ cursor: "pointer" }}>
          Remove
        </div>
      ),
    },
    {
      title: "Ayat",
      dataIndex: "arabic",
      className: "font-noorehuda text-lg text-right",
      width: "90%",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      width: "5%",
    },
  ];

  return (
    <Modal
      title={oldSection !== null ? "Update Section" : "Add New Section"}
      open={isModalOpen}
      onOk={() => handleClose()}
      onCancel={() => handleClose()}
      footer={[
        <Button key="back" onClick={() => handleClose()}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => handleSave()}>
          {oldSection !== null ? "Update" : "Save"}
        </Button>,
      ]}
      width={1000}
    >
      <Row>
        <Col style={{ width: "100%" }}>
          <Input
            required
            type="text"
            placeholder="Section Title"
            name="sectionTitle"
            value={sectionTitle}
            size="large"
            onChange={(e: any) => setSectionTitle(e.target.value)}
          />
        </Col>
        <Col className="mt-3" style={{ width: "100%" }}>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a surah"
            optionFilterProp="children"
            onChange={(e: any) => filterSurahAyats(Number(e))}
          >
            {storedAyatNames.map((res: any) => {
              return (
                <Option
                  value={res.id}
                  key={res.id}
                  style={{ textAlign: "right" }}
                >
                  {res.arabic}{" "}
                  <span style={{ float: "right" }}>{" :" + res.id}</span>
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col style={{ width: "100%" }}>
          <Table
            rowClassName={(record) =>
              isAlreadyAdded(record) ? "highlighted-row" : ""
            }
            rowKey={"id"}
            columns={columns}
            dataSource={surahAyats}
            pagination={false}
            loading={loading}
            style={{
              maxHeight: "300px",
              overflowY: "scroll",
            }}
          />
        </Col>
        {sectionAyats.length > 0 && (
          <Col style={{ width: "100%" }} className="mt-5">
            <Table
              rowKey={"id"}
              columns={actionColumns}
              dataSource={sectionAyats}
              pagination={false}
              style={{
                maxHeight: "300px",
                overflowY: "scroll",
              }}
            />
          </Col>
        )}
      </Row>
    </Modal>
  );
};
export default Sections;
