import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row, Select, Typography, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { StoryType } from "../../Types/Stories";
import { TopicRequest, fetchActiveStories } from "../../Actions/Topics/Topics";
import { OpenNotification } from "../../Actions/Utilities/Utilities";

const { Option } = Select;
const { Text } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const style: React.CSSProperties = { padding: "0px 0px" };
interface Props {
  title: string;
  fetchTopicsData: (e: TopicRequest) => void;
}

const TopicsFilterComponent: React.FC<Props> = ({ title, fetchTopicsData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [stories, setStories] = useState<StoryType[]>([]);
  const [storyId, setStoryId] = useState<string>("");
  const [sortType, setSortType] = useState<string>("");

  useEffect(() => {
    const status = title === "Non Published Topics" ? "all" : "";
    const fetchActiveStoriesData = () => {
      setLoading(true);
      fetchActiveStories(status)
        .then(({ data: response }) => {
          setLoading(false);
          if (response.success) {
            setStories(response.list);
          } else {
            OpenNotification("error", response.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log("error", err);
        });
    };
    fetchActiveStoriesData();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Card style={{ position: "fixed", width: "100%", zIndex: 1 }}>
        <Row style={{ marginBottom: "20px" }}>
          <Col span={8}>
            <div style={{ padding: "-1px 25px", marginLeft: "30px" }}>
              <Text
                strong
                style={{ justifyContent: "center", fontSize: "24px" }}
              >
                {title}
              </Text>
            </div>
          </Col>
          <Col span={6}>
            <div style={style}>
              <Spin spinning={loading} indicator={antIcon}>
                <Select
                  showSearch
                  style={{ width: "85%", border: "1px solid #d9d9d9" }}
                  placeholder="Select Story"
                  optionFilterProp="children"
                  className="dark:text-white"
                  value={storyId}
                  onChange={(e: string) => {
                    setSortType(sortType !== "" ? sortType : "storySequence");
                    setStoryId(e);
                  }}
                >
                  {stories.map((res: any) => {
                    return (
                      <Option value={res.id} key={res.id}>
                        {res.title + " "}
                        {" (" + res.scholar + ")"}
                      </Option>
                    );
                  })}
                </Select>
              </Spin>
            </div>
          </Col>
          <Col span={6}>
            <div style={style}>
              <Select
                showSearch
                style={{ width: "85%", border: "1px solid #d9d9d9" }}
                placeholder="Sort By"
                optionFilterProp="children"
                className="dark:text-white"
                value={sortType}
                onChange={(e: string) => setSortType(e)}
              >
                <Option value="storySequence">Story Sequence</Option>
                <Option value="ayatSequence">Ayat Sequence</Option>
              </Select>
            </div>
          </Col>
          <Col span={4}>
            <div style={style}>
              <Button
                className="primary"
                disabled={Boolean(storyId === "")}
                onClick={() => fetchTopicsData({ storyId, sortType })}
              >
                Search
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default TopicsFilterComponent;
