/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Form, Table, Tabs, Tag } from "antd";
import { useEffect } from "react";
import {
  getPermissions,
  savePermissions,
} from "../../Actions/AdminPermisssionActions/AdminPermissionAction";
import { OpenNotification } from "./../../Actions/Utilities/Utilities";
import { LoadingOutlined } from "@ant-design/icons";
import { Button } from "antd";

import type { TabsProps } from "antd";
import { useNavigate } from "react-router";

const AdminPermissions: React.FC = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [impersonationData, setImpersonationData] = useState<any>([]);
  const [publishScholarPermissionData, setPublishScholarPermissionData] =
    useState<any>([]);
  const [nonpublishScholarPermissions, setNonpublishScholarPermissions] =
    useState<any>([]);
  const [userPermissionData, setUserPermissionData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { CheckableTag } = Tag;
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [selectedTagsPer, setSelectedTagsPer] = useState<any>([]);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [tabNumber, setTabNumber] = useState<any>("");
  const roleid = localStorage.getItem("role_id");
  const navigate = useNavigate()
  useEffect(() => {
    getPermission();
  }, []);

  const handleChange = (
    record: any,
    checked: boolean,
    tag: any,
    tagType: boolean
  ) => {
    let nextSelectedTags;
    if (tagType) {
      nextSelectedTags = checked
        ? [...selectedTagsPer, tag]
        : selectedTagsPer.filter((t: any) => t !== tag);
    } else {
      nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t: any) => t !== tag);
    }

    Object.assign(tag, { checked: checked });
    Object.assign({ ...record }, { scholars: tag });

    if (tagType) {
      setSelectedTagsPer(nextSelectedTags);
    } else {
      setSelectedTags(nextSelectedTags);
    }
  };

  function getPermission() {
    setLoading(true);
    getPermissions().then(({ data: response }) => {
      if (response.success === true) {
        setLoading(false);
        const { list } = response;
        setImpersonationData(list.impersonation);
        setPublishScholarPermissionData(list.publishScholarPermissions);
        setNonpublishScholarPermissions(list.nonpublishScholarPermissions);
        setUserPermissionData(list.userPermissions);
        OpenNotification("success", response.message);
      } else {
        setLoading(false);

        OpenNotification("error", response.message);
      }
    });
  }

  const handleSaveImpersonation = async () => {
    try {
      setLoading(true);

      const newData = [...impersonationData];
      const req = { request: newData };
      savePermissions(req).then(({ data: response }) => {
        if (response.success === true) {
          setLoading(false);
          OpenNotification("success", response.message);
        } else {
          setLoading(false);
          OpenNotification("error", response.message);
        }
      });
    } catch (errInfo: any) {
      OpenNotification("error", errInfo);
    }
  };
  const handleGuestUserSettings = () => {
    const guestUserId = "54";
        navigate(`/usersettings`, {state: guestUserId})

  }

  const handleSavePermissions = async () => {
    try {
      // setLoading(true);

      let newDataPer;
      let newDataBasicUserPer;
      let req;

      if (tabNumber === "2") {
        newDataPer = [...publishScholarPermissionData];
        req = { type: "scholar_permission", request: newDataPer };
      }

      if (tabNumber === "3") {
        newDataPer = [...nonpublishScholarPermissions];
        req = { type: "scholar_permission", request: newDataPer };
      }

      if (tabNumber === "4") {
        newDataBasicUserPer = [...userPermissionData];
        req = { type: "basic_permission", request: newDataBasicUserPer };
      }

      savePermissions(req).then(({ data: response }) => {
        if (response.success === true) {
          setLoading(false);
          OpenNotification("success", response.message);
        } else {
          setLoading(false);
          OpenNotification("error", response.message);
        }
      });
    } catch (errInfo: any) {
      OpenNotification("error", errInfo);
    }
  };

  const columns1 = [
    {
      title: "#",
      dataIndex: "id",
    },
    {
      title: "Scholar Name",
      dataIndex: "name",
    },
    {
      title: "Scholar allowed to be impersonated",
      dataIndex: "scholars",
      render: (_: any, record: any) =>
        record.scholars.map((items: any) => {
          return (
            <CheckableTag
              key={items.id}
              checked={items.checked === true ? true : false}
              onChange={(checked) =>
                handleChange(record, checked, items, false)
              }
            >
              {items.shortName}
            </CheckableTag>
          );
        }),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        return (
          <>
            <Button
              className="bg-success text-light"
              onClick={() => handleSaveImpersonation()}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
          </>
        );
      },
    },
  ];

  const columns2 = [
    {
      title: "#",
      dataIndex: "id",
      render: (_: any, record: any, index: number) => {
        ++index;
        return index;
      },
    },
    {
      title: "User Name",
      dataIndex: "name",
    },
    {
      title: "Scholar allowed to be viewed",
      dataIndex: "scholars",
      render: (_: any, record: any) =>
        record.scholars.map((items: any) => {
          return (
            <CheckableTag
              key={items.id}
              checked={items.checked === true ? true : false}
              onChange={(checked) => handleChange(record, checked, items, true)}
            >
              {items.shortName}
            </CheckableTag>
          );
        }),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        return (
          <>
              <Button
                className="bg-success text-light"
                onClick={() => handleSavePermissions()}
                style={{ marginRight: 8 }}
              >
                Save
              </Button>
            {tabNumber === "4" && (
              <Button
                className="bg-success text-light"
                onClick={() => handleGuestUserSettings()}
                style={{ marginRight: 8 }}
              >
                Edit Settings
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Impersonation`,
      children: (
        <Form form={form} component={false}>
          <Table
            rowKey="id"
            loading={{ spinning: loading, indicator: antIcon }}
            bordered
            dataSource={impersonationData}
            columns={columns1}
          />
        </Form>
      ),
    },
    {
      key: "2",
      label: `Publish Scholar Permission`,
      children: (
        <Form form={form2} component={false}>
          <Table
            rowKey="id"
            loading={{ spinning: loading, indicator: antIcon }}
            bordered
            dataSource={publishScholarPermissionData}
            columns={columns2}
          />
        </Form>
      ),
    },
    {
      key: "3",
      label: `Non-Publish Scholar Permission`,
      children: (
        <Form form={form2} component={false}>
          <Table
            rowKey="id"
            loading={{ spinning: loading, indicator: antIcon }}
            bordered
            dataSource={nonpublishScholarPermissions}
            columns={columns2}
          />
        </Form>
      ),
    },
    {
      key: "4",
      label: `User Permission`,
      children: (
        <Form form={form} component={false}>
          <Table
            rowKey="id"
            loading={{ spinning: loading, indicator: antIcon }}
            bordered
            dataSource={userPermissionData}
            columns={columns2}
          />
        </Form>
      ),
    },
  ];

  const onChange = (key: string) => {
    setTabNumber(key);
  };

  return (
    <>
      {roleid !== "4" && (
        <>
          <Tabs
            onChange={onChange}
            type="card"
            items={items}
          // {data.map((_: any, i: any | undefined) => {
          //   const id = String(i + 1);
          //   return {
          //     label: `Tab ${id}`,
          //     key: id,
          //     children:
          //     <Form form={form} component={false}>
          //       <Table
          //         loading={{ spinning: loading, indicator: antIcon }}
          //         bordered
          //         dataSource={_}
          //         columns={columns2}
          //       />
          //     </Form>
          //   };
          // })}
          />
        </>
      )}
    </>
  );
};

export default AdminPermissions;
