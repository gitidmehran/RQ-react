import React from "react";
import { Collapse } from "antd";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faGear,
  faLanguage,
  faBookOpenReader,
  faNotesMedical,
  faBook,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { version } from "../../../package.json";
const { Panel } = Collapse;
const SettingsContainer = ({ props }: { props: any }) => {
  const isDarkTheme = useSelector(({ theme }: { theme: any }) => theme.dark);
  const innerLinks = {
    fontSize: "13px",
    cursor: "pointer",
  };
  const roleid = localStorage.getItem("role_id");
  const laravelVersion = localStorage.getItem("server_version");

  return (
    <>
      <Collapse
        ghost
        accordion
        expandIconPosition="end"
        bordered={true}
        defaultActiveKey={["0"]}
        className="site-collapse-custom-collapse "
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
      .ant-collapse-header{color: ${
        isDarkTheme ? "#aaa" : "#333"
      }!important; transition: color .5s ease-in-out !important;}
      .ant-select-selection-item{color: ${
        isDarkTheme ? "#aaa" : "rgba(17, 24, 39,.6)"
      }!important; transition: color .5s ease-in-out !important;}
    `,
          }}
        />
        {/* <Panel
          header={[
            <FontAwesomeIcon
              icon={faUser}
              style={{ fontSize: "25px" }}
              className="mr-4 float-left dark:text-white-500 "
            />,
            "All Users",
          ]}
          key="1"
          className="site-collapse-custom-panel  text-lg  text-gray-50 font-semibold  "
        >
          <div className="flex justify-center mb-3">
            {" "}
            <Link to='/users' onClick={() => props?.setIsOpen(!props?.isOpen)} className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500" style={innerLinks}>
              Users
            </Link>
          </div>
        </Panel> */}

        <Panel
          header={[
            <FontAwesomeIcon
              icon={faBookOpenReader}
              style={{ fontSize: "25px" }}
              className="mr-4 float-left dark:text-white-500"
            />,
            roleid === "4"?"Guest Menu":"Q-Siyaam",
          ]}
          key="3"
          className="site-collapse-custom-panel text-lg  text-gray-50 font-semibold"
        >
          <div className="flex justify-center">
            <Link
              to="/wordbyword"
              onClick={() => props?.setIsOpen(!props?.isOpen)}
              className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
              style={innerLinks}
            >
              Word by Word
            </Link>
          </div>

          <div className="flex justify-center">
            <Link
              to="/wordsearch"
              onClick={() => props?.setIsOpen(!props?.isOpen)}
              className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
              style={innerLinks}
            >
              Word Search
            </Link>
          </div>
          <div className="flex justify-center">
            <Link
              to="/schollartranslation"
              onClick={() => props?.setIsOpen(!props?.isOpen)}
              className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
              style={innerLinks}
            >
              Scholar Translations
            </Link>
          </div>
          {(roleid !== "4") && (
          <div className="flex justify-center">
          
            <Link
              to="/usersettings"
              onClick={() => props?.setIsOpen(!props?.isOpen)}
              className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
              style={innerLinks}
            >
              Siyaam Settings
            </Link>
          
          </div>
          )}
          
            {(roleid === "3" || roleid !== "4") && (
              <div className="text-center">
                <Link
                  to="/users"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
                  style={innerLinks}
                >
                  Impersonate Users
                </Link>
              </div>
            )}
          
        </Panel>
        {roleid !== "4" && (
          <>
            <Panel
              header={[
                <FontAwesomeIcon
                  icon={faLanguage}
                  style={{ fontSize: "25px" }}
                  className="mr-4 float-left dark:text-white-500"
                />,
                "Translations",
              ]}
              key="4"
              className="site-collapse-custom-panel text-lg text-gray-50 font-semibold"
            >
              <div className="flex justify-center">
                <Link
                  to="/addtranslation"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
                  style={innerLinks}
                >
                  Add Translation
                </Link>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/mytranslation"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
                  style={innerLinks}
                >
                  My Translations
                </Link>
              </div>
              <div className="text-center">
                <Link
                  to="/refrencewords"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className="mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500 "
                  style={innerLinks}
                >
                  Quranic Lexicon
                </Link>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/stories"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
                  style={innerLinks}
                >
                  Stories
                </Link>
              </div>
            </Panel>
          </>
        )}

        {/* <Panel
          header={[
            <FontAwesomeIcon
              icon={faUserTie}
              style={{ fontSize: "25px" }}
              className="mr-4 float-left dark:text-white-500"
            />,
            "Scholars",
          ]}
          key="5"
          className="site-collapse-custom-panel text-lg text-gray-50 font-semibold"
        >
          <div className="text-center"></div>
        </Panel> */}
        {roleid !== "4" && (
          <>
            <Panel
              header={[
                <FontAwesomeIcon
                  icon={faNotesMedical}
                  style={{ fontSize: "25px" }}
                  className="mr-4 float-left dark:text-white-500"
                />,
                "Scholar Notes",
              ]}
              key="6"
              className="site-collapse-custom-panel text-lg text-gray-50 font-semibold"
            >
              <div className="text-center">
                <Link
                  to="/ayatnotes"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
                  style={innerLinks}
                >
                  Ayat Notes
                </Link>
              </div>
              <div className="text-center">
                <Link
                  to="/wordnotes"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
                  style={innerLinks}
                >
                  Word Notes
                </Link>
              </div>
              <div className="text-center">
                <Link
                  to="/grammernotes"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
                  style={innerLinks}
                >
                  Grammer Notes
                </Link>
              </div>
            </Panel>
          </>
        )}

        <Panel
          header={[
            <FontAwesomeIcon
              icon={faBook}
              style={{ fontSize: "25px" }}
              className="mr-4 float-left dark:text-white-500"
            />,
            "Topics",
          ]}
          key="8"
          className="site-collapse-custom-panel text-lg text-gray-50 font-semibold"
        >
          <div className="text-center">
            <Link
              to="/publishedtopics"
              onClick={() => props?.setIsOpen(!props?.isOpen)}
              className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
              style={innerLinks}
            >
              Published
            </Link>
          </div>
          {roleid !== "4" && (
            <>
              <div className="text-center">
                <Link
                  to="/nonpublishedtopics"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className="mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
                  style={innerLinks}
                >
                  Non Published
                </Link>
              </div>
            </>
          )}
        </Panel>
        {roleid === "1" && (
          <>
            <Panel
              header={[
                <FontAwesomeIcon
                  icon={faGear}
                  style={{ fontSize: "25px" }}
                  className="mr-4 float-left dark:text-white-500"
                />,
                "Settings",
              ]}
              key="7"
              className="site-collapse-custom-panel text-lg text-gray-50 font-semibold"
            >
              <div className="text-center">
                <Link
                  to="/users"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className=" mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
                  style={innerLinks}
                >
                  Users
                </Link>
              </div>
              <div className="text-center">
                <Link
                  to="/rootwords"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className="mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500"
                  style={innerLinks}
                >
                  Root Words
                </Link>
              </div>
              <div className="text-center">
                <Link
                  to="/adminpermissions"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className="mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500 "
                  style={innerLinks}
                >
                  Scholars Permission
                </Link>
              </div>
            </Panel>
          </>
        )}
        <Panel
              header={[
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ fontSize: "25px" }}
                  className="mr-4 float-left dark:text-white-500"
                />,
                "Help",
              ]}
              key="9"
              className="site-collapse-custom-panel text-lg text-gray-50 font-semibold"
            >
              <div className="text-center">
                <Link
                  to="/help"
                  onClick={() => props?.setIsOpen(!props?.isOpen)}
                  className="mb-0 text-gray-600 dark:text-gray-300 font-semibold transition-colors duration-500 "
                  style={innerLinks}
                >
                  User Guide
                </Link>
              </div>
            </Panel>
      </Collapse>
      <h6
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          textAlign: "center",
        }}
      >
        React Version {version} <br /> Laravel Version {laravelVersion}
      </h6>
    </>
  );
};

export default SettingsContainer;
