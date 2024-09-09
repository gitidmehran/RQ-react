import {
  Button,
  Card,
  Col,
  Input,
  Pagination,
  Row,
  Select,
  Typography,
  Switch,
} from "antd";
import React from "react";
const { Option } = Select;
const { Text } = Typography;
const style: React.CSSProperties = { padding: "0px 0px" };
interface Props {
  totalRecord: number;
  perPage: number;
  currentPage: number;
  showSimpleArabic: boolean;
  changePerPage: (perPage: number) => void;
  changeCurrentPage: (currentPage: number) => void;
  handleChangeSearchType: (e: string) => void;
  handleChangeSearch: (e: any) => void;
  handleChangeSearchByTranslation: (e: any) => void;
  fetchwordsearch: () => void;
  handleSimpleArabic: () => void;
}
const WordSearchFilter: React.FC<Props> = ({
  totalRecord,
  perPage,
  currentPage,
  showSimpleArabic,
  changePerPage,
  changeCurrentPage,
  fetchwordsearch,
  handleChangeSearchType,
  handleChangeSearch,
  handleChangeSearchByTranslation,
  handleSimpleArabic,
}) => {
  return (
    <>
      <Card style={{ position: "fixed", width: "100%", zIndex: 1 }}>
        <Row style={{ marginBottom: "20px" }}>
          <Col span={4}>
            <div style={{ padding: "-1px 25px", marginLeft: "30px" }}>
              <Text
                strong
                style={{ justifyContent: "center", fontSize: "24px" }}
              >
                Word Search
              </Text>
            </div>
          </Col>
          <Col span={4}>
            <div style={style}>
              <Select
                showSearch
                style={{ width: "85%", border: "1px solid #d9d9d9" }}
                placeholder="Select Search Type"
                optionFilterProp="children"
                className="dark:text-white"
                onChange={(e: string) => handleChangeSearchType(e)}
              >
                <Option value="word">Word Search</Option>
                <Option value="simple_word">Word Without Ayrab</Option>{" "}
                {/** by Ahmad */}
                <Option value="phrase">Phrase Search</Option> {/** by Ahmad */}
                <Option value="root_word">Root Word</Option>
                <Option value="translationKeyWord">Translation En/Ur</Option>
              </Select>
            </div>
          </Col>
          <Col span={6}>
            <div style={style}>
              <Input
                placeholder="Enter Word/Root/Translation"
                name="search"
                onChange={(e) => handleChangeSearch(e)}
                style={{ textAlign: "end", width: "90%", fontSize: "16px" }}
              />
            </div>
          </Col>

          {/* by Ahmad */}
          {/* <Col   span={3}>
                        <div style={style}>
                            <Input
                                placeholder="Enter translation"
                                name="searchByTranslation"
                                onChange={(e) => handleChangeSearchByTranslation(e)}
                                style={{ textAlign: 'end', width:'90%', fontSize:'16px' }}
                            />
                        </div>
                    </Col> */}
          {/* ---------- */}

          <Col span={3}>
            <div style={style}>
              <Select
                showSearch
                style={{ width: "80%" }}
                placeholder="Lines Per Page"
                optionFilterProp="children"
                className="dark:text-white"
                onChange={(e: number) => changePerPage(e)}
                defaultValue={perPage}
              >
                <Option value={50}>50</Option>
                <Option value={100}>100</Option>
                <Option value={300}>300</Option>
              </Select>
            </div>
          </Col>
          <Col span={2}>
            <div style={style}>
              <Button className="primary" style={{ width: "50%" }} disabled>
                {totalRecord}
              </Button>
            </div>
          </Col>
          <Col span={2}>
            <div style={style}>
              <Button className="primary" onClick={() => fetchwordsearch()}>
                Search
              </Button>
            </div>
          </Col>
          <Col span={2}>
            <div style={style}>
              <Switch
                checkedChildren="Show Simple"
                unCheckedChildren="Hide Simple"
                checked={showSimpleArabic ?? false}
                onChange={() => handleSimpleArabic && handleSimpleArabic()}
              />
            </div>
          </Col>
        </Row>
        <Pagination
          total={totalRecord}
          current={currentPage}
          pageSize={perPage}
          showSizeChanger={false}
          onChange={(e: number) => changeCurrentPage(e)}
          style={{ float: "right", paddingRight: "50px" }}
        />
      </Card>
    </>
  );
};

export default WordSearchFilter;
