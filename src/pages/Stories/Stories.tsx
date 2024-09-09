import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Typography, Button, Table, Space, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { StoryType, getAllStoriesResponse } from "../../Types/Stories";
import {
  getStoriesList,
  deleteStory,
  updateStoryStatus,
} from "../../Actions/Story/Story";
import { OpenNotification } from "../../Actions/Utilities/Utilities";
const Stories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [stories, setStories] = useState<StoryType[]>([]);

  useEffect(() => {
    setLoading(true);
    getStoriesList()
      .then((response: getAllStoriesResponse) => {
        setLoading(false);
        if (response.success) {
          OpenNotification("success", response.message);
          setStories(response.list);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        OpenNotification("error", err?.message);
      });
  }, []);

  const handleDelete = (id: number) => {
    deleteStory(id)
      .then((response) => {
        if (response.success) {
          OpenNotification("success", response.message);
          const filteredStories = stories.filter((item) => item.id !== id);
          setStories(filteredStories);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        OpenNotification("error", err?.message);
      });
  };

  const handleChangeStatus = (record: StoryType) => {
    const status =
      record.status === "Published" ? "Non-Published" : "Published";
    const request = { status: status };
    updateStoryStatus(record.id, request)
      .then((response) => {
        if (response.success) {
          OpenNotification("success", response.message);
          const index = stories.findIndex((item) => item.id === record.id);
          const storyCopy = [...stories];
          storyCopy[index] = response.row;
          setStories(storyCopy);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        OpenNotification("error", err?.message);
      });
  };

  const columns: ColumnsType<StoryType> = [
    {
      title: "Sr",
      dataIndex: "id",
      key: "ninth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "eighth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "seventh",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Scholar",
      dataIndex: "scholar",
      key: "sixth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Sections/Ayats",
      dataIndex: "totalCounts",
      key: "fifth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "eighth",
      width: "auto",
      className: "dark:bg-darkBody",
    },
    {
      title: "Action",
      dataIndex: "btn",
      key: "action",
      render: (_: any, record: StoryType) => (
        <>
          <Space size="middle">
            <Button
              type="primary"
              size="small"
              onClick={() => navigate(`/stories/edit/${record.id}`)}
              className="cursor-pointer"
            >
              Edit{" "}
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => handleChangeStatus(record)}
              className="cursor-pointer"
            >
              {record.status === "Published" ? "Un-Publish" : "Publis Now"}
            </Button>
            <Popconfirm
              title="sure to delete"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger size="small">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];
  const roleid = localStorage.getItem("role_id");
  return (
    <>
      {roleid !== "4" && (
        <>
          <div className="container-fluid mt-5 mr-5">
            <div style={{ width: "100%" }}>
              <Row>
                <Col span={12}>
                  <Typography.Text strong style={{ fontSize: "24px" }}>
                    Stories List
                  </Typography.Text>
                </Col>
                <Col span={12}>
                  <Button
                    className="btn btn-info float-right mt-4"
                    style={{ fontSize: "12px", marginTop: "6px" }}
                    onClick={() => navigate("/stories/add")}
                  >
                    Add New
                  </Button>
                </Col>
              </Row>
              <Table
                loading={loading}
                columns={columns}
                dataSource={stories}
                rowKey={"id"}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Stories;
