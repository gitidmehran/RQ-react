import React, { useState } from "react";
import UpdatedWordByWord from "../WordbyWord/UpdatedWordByWord";
import { fetchStoryTopics } from "../../Actions/Topics/Topics";
import TopicsFilterComponent from "../../components/FilterComponent/TopicsFilterComponent";
import { OpenNotification } from "../../Actions/Utilities/Utilities";
import PublishedTopicAyatTranslation from "../../components/AyatTranslation/PublishedTopicsAyatTranslation";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { TopicRequest } from "../../Actions/Topics/Topics";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export default function NonPublishedTopics() {
  const [loading, settLoading] = useState<boolean>(false);
  const [data, setData] = React.useState<any[]>([]);
  const [columns, setColumns] = React.useState<any>([]);

  const fetchTopicsData = (request: TopicRequest) => {
    settLoading(true);
    fetchStoryTopics(request)
      .then(({ data: response }) => {
        if (response.success) {
          settLoading(false);
          console.log(response.list);
          setColumns(response.columns);
          setData(response.list);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        console.log("error", err);
        settLoading(false);
      });
  };

  return (
    <>
      <TopicsFilterComponent
        title="Non Published Topics"
        fetchTopicsData={(e) => fetchTopicsData(e)}
      />
      <Spin spinning={loading} indicator={antIcon} className="mt-5">
        <div
          style={{ paddingTop: "150px", overflowY: "scroll", width: "100%" }}
        >
          {data.map((item) => {
            return (
              <div key={item.id}>
                <PublishedTopicAyatTranslation
                  scholarId={item.scholarId}
                  surahId={item.surahId}
                  ayatId={item.ayatId}
                  arabic={item.arabic}
                  translations={item.ayatTranslations}
                />
                <UpdatedWordByWord
                  columns={columns ?? []}
                  words={item.words ?? []}
                  showSimpleArabic={false}
                />
              </div>
            );
          })}
        </div>
      </Spin>
    </>
  );
}
