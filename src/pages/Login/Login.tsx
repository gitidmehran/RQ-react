/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Col, Input, Modal, Row, Spin } from "antd";
import React, { useState } from "react";
import "../../assets/Css/loginform.css";
import { SubmitLogin } from "../../Actions/LoginActions/Login";
import { OpenNotification } from "../../Actions/Utilities/Utilities";
import { LoadingOutlined } from "@ant-design/icons";

const Login: React.FC = () => {
  const token = localStorage.getItem("token");
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<any>({});
  const [requestAccount, setRequestAccount] = useState<any>({});

  if (typeof token === "undefined" && token === "" && token === null) {
    window.location.href = "/";
  }

  const handleChange = (e: { target: { value: any; name: any } }) => {
    const { value } = e.target;
    setCredentials({
      ...credentials,
      [e.target.name]: value,
    });
  };
  const handleSubmit = (name: string) => {
    setLoading(true);
    const payload = {
      ["email"]: "guest@researchquran.org",
      ["password"]: "123456",
    };
    let newPayload;
    if (name === "applicationUser") {
      newPayload = credentials;
    } else {
      setCredentials({});
      newPayload = payload;
    }
    SubmitLogin(newPayload)
      .then(({ data: response }) => {
        setLoading(false);
        if (response.success) {
          console.log(response);
          localStorage.setItem(
            "arabicLetters",
            JSON.stringify(response.arabice_letters)
          );
          localStorage.setItem("surahs", JSON.stringify(response.surahs));
          localStorage.setItem("token", response.token);
          localStorage.setItem("server_version", response.server_version);
          localStorage.setItem("userName", response.user_data[0].name);
          localStorage.setItem("role_id", response.user_data[0].role);
          localStorage.setItem("userId", response.user_data[0].id);
          window.location.href = "/";
          OpenNotification("success", response.message);
        }
      })
      .catch(() => {
        OpenNotification(
          "error",
          "These credentials do not match our records."
        );
        setLoading(false);
      });
  };
  const handleChangeAccount = (e: React.SyntheticEvent) => {
	const target = e.target as HTMLInputElement; 
	setRequestAccount({
		...requestAccount,
		[target.name]: target.value,
	  });
  }
  const handleOk = () => {
    setIsModalOpen(false);
	console.log(requestAccount);
	
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleRegisterAccount = () => {
    setIsModalOpen(true);
  };
  return (
    <div className="main">
      <Spin spinning={loading} indicator={antIcon}>
        <section className="wrapper">
          <div className="heading">
            <h1 style={{ fontSize: "30px" }}>Sign In</h1>
            <p>
              New user?{" "}
              <span
                style={{ cursor: "pointer", color: "#1890ff" }}
                onClick={handleRegisterAccount}
              >
                Request an account
              </span>
            </p>
          </div>
          <form name="signin" className="form">
            <div className="input-control">
              <label className="input-label" hidden>
                {" "}
                Email Address{" "}
              </label>
              <Input
                type="email"
                name="email"
                id="email"
				required
                placeholder="Email Address"
                value={credentials?.email}
                onChange={(e: any) => handleChange(e)}
              />
            </div>
            <div className="input-control">
              <label className="input-label" hidden>
                {" "}
                Password{" "}
              </label>
              <Input
                type="password"
                name="password"
				required
                id="password"
                placeholder="Password"
                value={credentials?.password}
                onChange={(e: any) => handleChange(e)}
              />
            </div>
            <div className="input-control">
              <Button
                type="primary"
                onClick={() => handleSubmit("applicationUser")}
              >
                Sign In
              </Button>
              <Button type="primary" onClick={() => handleSubmit("guestUser")}>
                Guest Sign In
              </Button>
            </div>
          </form>
        </section>
      </Spin>
      <Modal
        title="Request An Account"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row className="mb-1">
          <Col span={12} className="pr-1">
            <label htmlFor="">Name</label>
            <Input type="text" placeholder="Enter your full name" name="name" onChange={(e:any) => handleChangeAccount(e)}/>
          </Col>
          <Col span={12} className="pl-1">
            <label htmlFor="">Email</label>
            <Input type="email" placeholder="Enter your email" name="email" onChange={(e:any) => handleChangeAccount(e)}/>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col span={12} className="pr-1">
            <label htmlFor="">Phone</label>
            <Input type="number" placeholder="Enter your phone no." name="phone" onChange={(e:any) => handleChangeAccount(e)}/>
          </Col>
          <Col span={12} className="pl-1">
            <label htmlFor="">Address</label>
            <Input type="text" placeholder="Enter your address" name="address" onChange={(e:any) => handleChangeAccount(e)}/>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col span={12} className="pr-1">
            <label htmlFor="">Referrer Name</label>
            <Input type="text" placeholder="Enter referrer name" name="referrerName" onChange={(e:any) => handleChangeAccount(e)}/>
          </Col>
          <Col span={12} className="pl-1">
            <label htmlFor="">Referrer Email</label>
            <Input type="email" placeholder="Enter referrer email" name="referrerEmail" onChange={(e:any) => handleChangeAccount(e)}/>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Login;
