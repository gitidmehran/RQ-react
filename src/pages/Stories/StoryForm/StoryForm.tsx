import React, { useState, useEffect } from "react";
import { Row, Col, Input, Card, Button, Collapse } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Ayats,
  SectionsType,
  singleStoryResponse,
} from "../../../Types/Stories";
import {
  createStory,
  getSingleStory,
  updateStory,
} from "../../../Actions/Story/Story";

import { OpenNotification } from "../../../Actions/Utilities/Utilities";
import DragableTable from "../../../components/DragableTable/DragableTable";
import Sections from "../Sections/Sections";

const { Panel } = Collapse;

const ayatColumns: ColumnsType<Ayats> = [
  {
    title: "Sequence",
    dataIndex: "sequence",
    width: "2%",
  },
  {
    title: "Ayat",
    dataIndex: "arabic",
    className: "text-right font-noorehuda text-lg",
  },
  {
    title: "Reference",
    dataIndex: "reference",
    width: "5%",
  },
];

const StoryForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [storyId, setStoryId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sections, setSections] = useState<SectionsType[]>([]);
  const [oldSection, setOldSection] = useState<SectionsType | null>(null);
  const [oldStory, setOldStory] = useState<singleStoryResponse | null>(null);

  useEffect(() => {
    if (params.id !== undefined && params.id !== "") {
      const id = Number(params.id);
      getSingleStory(id)
        .then((response) => {
          setStoryId(id);
          const { row } = response;
          setOldStory(row);
          setTitle(row.title);
          setDescription(row.description);
          setSections(row.sections);
        })
        .catch((err) => [OpenNotification("error", err?.message)]);
    }
  }, [params]);

  const handleSequenceChange = (items: Ayats[], title: string) => {
    const sectionIndex = sections.findIndex(
      (item) =>
        item.sectionTitle.toLocaleLowerCase() === title.toLocaleLowerCase()
    );
    const sectionsCopy = [...sections];
    let selectedSection = sectionsCopy[sectionIndex];
    const selectedSectionStartSequence = selectedSection.ayats[0].sequence ?? 0;
    const list = [] as Ayats[];
    items.forEach((item, index) => {
      const newSequence = index + selectedSectionStartSequence;
      item = { ...item, sequence: newSequence };
      list.push(item);
    });
    selectedSection = { ...selectedSection, ayats: list };
    sectionsCopy[sectionIndex] = selectedSection;
    setSections(sectionsCopy);
  };

  const handleSaveSection = (row: SectionsType) => {
    const sectionsCopy = [...sections];

    const lastSectionAyats: Ayats[] =
      sections[sections.length - 1]?.ayats ?? [];
    let lastSequence =
      lastSectionAyats[lastSectionAyats.length - 1]?.sequence ?? 0;

    const list = [] as Ayats[];

    row.ayats.forEach((ayat, index) => {
      const number = index + 1;
      const sequence = number + lastSequence;

      list.push({
        ...ayat,
        sequence: sequence,
        sectionTitle: row.sectionTitle,
      });
    });

    sectionsCopy.push({
      sectionTitle: row.sectionTitle,
      ayats: list,
    });
    setSections(sectionsCopy);
    handleCloseModal();
  };

  const handleUpdateSection = (row: SectionsType) => {
    let sectionsCopy = [...sections];

    const sectionIndex = sectionsCopy.findIndex(
      (item) => item.sectionTitle === oldSection?.sectionTitle
    );

    const oldSectionAyats = oldSection?.ayats ?? [];
    const oldSectionAyatsStartSequence = oldSectionAyats[0].sequence ?? 0;
    const list = [] as Ayats[];
    const { ayats } = row;

    ayats.forEach((ayat, index) => {
      const number = index;
      const sequence = number + oldSectionAyatsStartSequence;

      list.push({
        ...ayat,
        sequence: sequence,
        sectionTitle: row.sectionTitle,
      });
    });
    const newSection = {
      sectionTitle: row.sectionTitle,
      ayats: list,
    };
    sectionsCopy[sectionIndex] = newSection;

    if (oldSection?.ayats.length !== ayats.length) {
      const lastSequence = list[list.length - 1].sequence ?? 0;
      sectionsCopy = updateNextSectionsSequence(
        sectionsCopy,
        lastSequence,
        sectionIndex
      );
    }
    setSections(sectionsCopy);
    handleCloseModal();
  };

  const updateNextSectionsSequence = (
    sectionsCopy: SectionsType[],
    lastSectionSequence: number,
    sectionIndex: number
  ) => {
    sectionIndex = sectionIndex + 1;
    const nextSections = sectionsCopy.slice(sectionIndex);
    if (nextSections.length > 0) {
      nextSections.forEach((section: SectionsType) => {
        const index = sectionsCopy.findIndex(
          (item) => item.sectionTitle === section.sectionTitle
        );
        const sectionAyatCopy = [...section.ayats];
        section.ayats.forEach((ayat: Ayats, index: number) => {
          const ayatIndex = sectionAyatCopy.findIndex(
            (item: Ayats) => item.id === ayat.id
          );
          const sequence = index + 1;
          ayat = { ...ayat, sequence: lastSectionSequence + sequence };
          sectionAyatCopy[ayatIndex] = ayat;
        });
        section = { ...section, ayats: sectionAyatCopy };
        sectionsCopy[index] = section;
        lastSectionSequence =
          sectionAyatCopy[sectionAyatCopy.length - 1].sequence ?? 0;
      });
    }
    return sectionsCopy;
  };

  const handleCloseModal = () => {
    setOldSection(null);
    setIsModalOpen(false);
  };

  const saveStory = () => {
    if (title === "") {
      OpenNotification("error", "Please Enter Story Title");
      return false;
    }

    if (sections.length === 0) {
      OpenNotification("error", "Please Add Atleast One Section in the Story");
      return false;
    }

    const request = {
      title: title,
      description: description,
      sections: sections,
    };
    if (storyId === null) {
      createStory(request)
        .then((response) => {
          OpenNotification("success", response.message);
          setTitle("");
          setDescription("");
          setSections([]);
          navigate("/stories");
        })
        .catch((err) => {
          OpenNotification("error", err?.message);
        });
    } else {
      updateStory(storyId, request)
        .then((response) => {
          OpenNotification("success", response.message);
          setTitle("");
          setDescription("");
          setSections([]);
          navigate("/stories");
        })
        .catch((err) => {
          OpenNotification("error", err?.message);
        });
    }
  };

  const handleEditSection = (section: SectionsType) => {
    setOldSection(section);
    setIsModalOpen(true);
  };

  const genExtra = (section: SectionsType) => (
    <EditOutlined
      onClick={(event: any) => {
        event.stopPropagation();
        handleEditSection(section);
      }}
    />
  );

  const onDragEnd = (result:any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    console.log(result, items);
    
    // Use the handler here to update the state in the parent component
   setSections(items)
  };

  return (
    <div className="container-fluid mt-2">
      <div style={{ width: "100%" }}>
        <Row>
          <Col style={{ width: "100%" }}>
            <Card title="Add New Story">
              <label htmlFor="">Title</label>
              <Input
                required
                type="text"
                placeholder="Story Title"
                name="title"
                value={title}
                size="large"
                onChange={(e: any) => setTitle(e.target.value)}
              />
              <label htmlFor="">Description</label>
              <Input.TextArea
                rows={4}
                placeholder="Story Description"
                name="description"
                value={description}
                size="large"
                onChange={(e: any) => setDescription(e.target.value)}
              />
            </Card>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col style={{ width: "100%" }}>
            <Card
              title="Story Sections"
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    handleCloseModal();
                    setIsModalOpen(true);
                  }}
                >
                  Add Section
                </Button>
              }
            >
              <Row>
              <Col style={{ width: "100%" }}>
      {sections.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {sections.map((item, index) => (
                  <Draggable key={index} draggableId={`item-${index}`} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Collapse defaultActiveKey={[0]}>
                        <Panel header={item.sectionTitle} key={index} extra={genExtra(item)}>
                          <DragableTable
                            key={index}
                            sectionTitle={item.sectionTitle}
                            columns={ayatColumns}
                            list={item.ayats}
                            handleSequenceChange={(ayats: any, title: string) =>
                              handleSequenceChange(ayats, title)
                            }
                          />
                        </Panel>
                    </Collapse>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Col>
                {sections.length > 0 && (
                  <Button
                    type="primary"
                    className="mt-3"
                    disabled={Boolean(
                      !(
                        (storyId !== null &&
                          JSON.stringify(oldStory?.sections) !==
                            JSON.stringify(sections)) ||
                        title !== oldStory?.title ||
                        description !== oldStory.description
                      )
                    )}
                    onClick={() => saveStory()}
                  >
                    Save Story
                  </Button>
                )}
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      <Sections
        oldSection={oldSection}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        handleSaveSection={(row: SectionsType) => handleSaveSection(row)}
        handleUpdateSection={(row: SectionsType) => handleUpdateSection(row)}
      />
    </div>
  );
};

export default StoryForm;
