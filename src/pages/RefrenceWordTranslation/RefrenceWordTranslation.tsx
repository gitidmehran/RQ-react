/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row, Select, Space, Table, Typography } from "antd";
import { Form, Input, InputNumber } from "antd";
import './style.css';

import {
  getRefernceWords,
  // getScholars,
  saveRelatedWords,
  removeRelatedWords,
  getRelatedWords
} from "../../Actions/ReferenceWord/ReferenceWordAction";
import {
  CloseOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { OpenNotification } from "../../Actions/Utilities/Utilities";
import { SaveOutlined } from "@ant-design/icons";
import { Modal } from "antd";
const { Text } = Typography;
const { Option } = Select;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: any;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const RefrenceWordTranslation = () => {
  // const [scholars, setScholars] = useState([]);
  const [loader, setloader] = useState(false);
  const [values, setValues] = useState<any>({});
  const [letters, setLetters] = useState<any>({});
  /*   const [scholarId, setScholarId] = useState('');
   */ const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const [newData, setNewData] = useState<any>([]);
  const [relatedWords, setRelatedWords] = useState<any>([]);
  const [editingKey, setEditingKey] = useState("");
  const [referenceWordId, setReferenceWordId] = React.useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [oldSelectedRowKeys, setOldSelectedRowKeys] = useState<any>([]);
  // const [nonSelectedRowIndex, setNonSelectedRowIndex] = useState<any>(null);

  // eslint-disable-next-line
  const [selectedScholar, setSelectedScholar] = React.useState<any>("");
  const [total, setCount] = useState("");

  useEffect(() => {
    getAllDataFunction();

    // eslint-disable-next-line
  }, []);
  // const getAllRelatedWords = () => {

  // }
  const getAllDataFunction = () => {
    setloader(true);
    const userId = localStorage.getItem("userId");
    setSelectedScholar(userId);
    var data = new FormData();
    data.append("scholarId", String(userId));
    getRefernceWords(data).then(({ data: response }) => {
      if (response.success === true) {
        setData(response.list);
        setNewData(response.list);
        setLetters(response.letters);
        setloader(false);
        setCount(response.total);
        OpenNotification("success", response.message);
      } else {
        setloader(false);
        OpenNotification("error", response.message);
      }
    });
    setValues({
      ...values,
      'scholarId': userId
    });
  }

  const isEditing = (record: any) => record.id === editingKey;

  const edit = (record: any) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as any;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        Object.assign(item, row);
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        const alldata = {};
        Object.assign(alldata, { scholarId: values.scholarId, row: item });
        setloader(true);
        saveRelatedWords(alldata).then(({ data: response }) => {
          if (response.success === true) {
            setData(newData);
            setloader(false);
            setEditingKey("");
            OpenNotification("success", response.message);
          } else {
            setloader(false);

            OpenNotification("error", response.message);
          }
        });
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo: any) {
      OpenNotification("error", errInfo);
    }
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpen = (record: any, index: any) => {
    setloader(true);
    const getwordId = { wordId: record.wordId };
    getRelatedWords(getwordId).then(({ data: response }) => {
      if (response.success === true) {
        setloader(false);
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
        // setWordsIds(list.map((items: any) => (items.id)));
        // setTotalWords(response.totalWords);
      }
    });
    setReferenceWordId(record.wordId);
    console.log(record)
    const list = record.relatedWords;
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
    setSelectedRowKeys(
      list.map((items: any) => (items.id))
    )
    setOldSelectedRowKeys(
      list.map((items: any) => (items.id))
    )
    setIsOpen(true);
  };
  // const handlechange = (e: any, name: any) => {
  //   setValues({
  //     ...values,
  //     [name]: e,
  //   });
  // };

  // const handleSearch = () => {
  //   setloader(true);
  //   var data = new FormData();
  //   data.append("scholarId", selectedScholar);
  //   getRefernceWords(data).then(({ data: response }) => {
  //     if (response.success === true) {
  //       setData(response.list);
  //       setSuccess(response.success)
  //       setNewData(response.list);
  //       setLetters(response.letters);
  //       setloader(false);
  //       OpenNotification("success", response.message);
  //     } else {
  //       setloader(false);
  //       OpenNotification("error", response.message);
  //     }
  //   });
  // };
  const handleCloseModel = () => {
    setIsOpen(false);
  };
  const metacolumns = [
    {
      title: "Refrence",
      dataIndex: "reference",
      className: "text-center",
    },
    {
      title: "Word",
      dataIndex: "word",
      className: "text-center",
    },
  ];

  const columns = [
    {
      title: "Actions",
      dataIndex: "operation",
      className: "text-center",
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              icon={<SaveOutlined />}
              shape={"circle"}
              type={"primary"}
              style={{ marginRight: 8 }}
              onClick={() => save(record.id)}
            />
            <Button
              icon={<CloseOutlined />}
              shape={"circle"}
              onClick={cancel}
            />
          </Space>
        ) : (
          <>
            <Space>
              <Button
                icon={<EditOutlined />}
                shape={"circle"}
                style={{ marginRight: 8 }}
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              />
            </Space>
          </>
        );
      },
    },
    {
      title: "Addressee",
      dataIndex: "addressee",
      editable: true,
    },
    {
      title: "Addresser",
      dataIndex: "addresser",
      editable: true,
    },
    {
      title: "Um-ul-kitaab",
      dataIndex: "umUlKitaab",
      editable: true,
      className: "text-nowrap",
    },
    {
      title: "English",
      dataIndex: "english",
      editable: true,
    },
    {
      title: "Urdu",
      dataIndex: "urdu",
      editable: true,
      className: 'urduclass',
      align: 'right'
    },
    {
      title: "Word",
      dataIndex: "word",
      editable: false,
      className: "font-Calibri text-lg	p-2",
    },
    {
      title: "#",
      dataIndex: "reference",
      editable: false,
      className: "text-center",
      render: (_: any, record: any, index: any) => {
        return (
          <>
            <Typography.Link onClick={() => handleOpen(record, index)}>
              View Refered words
            </Typography.Link>
            <Typography>{"(" + _ + ")"}</Typography>
          </>
        );
      },
    },
  ];
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const mergedColumns = columns.map((col:any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleFilterLetter = (e: any) => {
    const list = newData.filter((items: any) => items.word.startsWith(e));
    setData(list);
  };
  const handleUpdateReference = () => {
    setOldSelectedRowKeys("");
    setSelectedRowKeys([]);
    const payload = {
      wordId: referenceWordId,
      relatedWordIds: selectedRowKeys,
      oldRelatedWordIds: oldSelectedRowKeys,
    }
    removeRelatedWords(payload).then(({ data: response }) => {
      if (response.success === true) {
        setIsOpen(false);
        console.log(response);
        // OpenNotification("success", response.message);
        getAllDataFunction();
      } else {
        OpenNotification("error", response.message);
      }
    });


  }
  const onSelectChange = (newSelectedRowKeys: any) => {
    setSelectedRowKeys(newSelectedRowKeys);

  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // getCheckboxProps: () => ({
    //   disabled: false,
    // }),
  };
  // const userName = localStorage.getItem("userName");

  const roleid = localStorage.getItem("role_id")
  return (
    <>
      {roleid !== "4" && (<>
        <Modal
          title={`Word References total words `}
          open={isOpen}
          onCancel={handleCloseModel}
          onOk={handleUpdateReference}
          okText="Update"
          // destroyOnClose
          // footer={null}
          style={{ zIndex: "1050" }}
        >
          <Table
            size="small"
            rowSelection={rowSelection}
            columns={metacolumns}
            dataSource={relatedWords}
            pagination={false}
            bordered={true}
            rowClassName={(record) => (record.disabled ? 'disabled-row' : '')}
            // rowClassName={"text-center"}
            scroll={{ y: 300 }}
            loading={{ spinning: loader, indicator: antIcon }}
          />
        </Modal>
        <Card size="small">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
            <Col className="gutter-row" span={8}>
              <div style={{ padding: "-1px 25px" }}>
                <Text
                  strong
                  style={{ justifyContent: "center", fontSize: "24px" }}
                >
                  Add Quranic Lexicon Meanings
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        <Card>
          <>
            <Row>
              <Col span={21}>
                <Badge.Ribbon text={"Total: " + total} placement="start"></Badge.Ribbon>
              </Col>
              <Col span={3} >
                <Select
                  placeholder="Search by letter"
                  optionFilterProp="children"
                  // className="float-right mb-3 w-52" 
                  style={{ marginBottom: '20px', width: '165px', justifyContent: 'flex-end' }}
                  // allowClear
                  onChange={(e) => handleFilterLetter(e)}
                >
                  {Object.values(letters).map((values: any) => {
                    return <Option value={values}>{values}</Option>;
                  })}
                </Select>
              </Col>
            </Row>
            <Form form={form} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                loading={{ spinning: loader, indicator: antIcon }}
                bordered
                /* scroll={{ y: 520 }} */
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                  onChange: cancel,
                }}
              />
            </Form>
          </>
        </Card>

      </>)
      }
    </>
  );
};

export default RefrenceWordTranslation;
