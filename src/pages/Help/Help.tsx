/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Col, Row } from 'antd';
import React, { useState } from 'react';
import '../../assets/Css/loginform.css';
import { SubmitLogin } from '../../Actions/LoginActions/Login';
import { OpenNotification } from "../../Actions/Utilities/Utilities";





const Help: React.FC = () => {
    let mainUrl = "";

    const url = process.env.REACT_APP_API_URL;
    if (url !== undefined) {
      let newUrl = url.split("/a");
      mainUrl = newUrl[0];
    }
    const updatedFileName = mainUrl+'/ResearchQuranUsersGuide.pdf';
    console.log(url, mainUrl);
    
    return (
        <>
            <Card title="User Guide" style={{width:'90%', textAlign:'center', margin:'0 auto'}}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="View User Guide" bordered={false}>
                        <Button type='primary'><a href={updatedFileName} rel="noreferrer"  target="_blank">User Guide</a></Button>
                        </Card>
                    </Col>
                    <Col span={8}>
                        {/* <Card title="Card title" bordered={false}>
                            Card content
                        </Card> */}
                    </Col>
                    <Col span={8}>
                        {/* <Card title="Card title" bordered={false}>
                            Card content
                        </Card> */}
                    </Col>
                </Row>
            </Card>
        </>
    );
};

export default Help;

