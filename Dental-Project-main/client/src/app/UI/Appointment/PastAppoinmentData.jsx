import React, { useState, useEffect } from "react";
import {
  Card,
  Select,
  Row,
  Col,
  Typography,
  Collapse,
  Tag,
  Descriptions,
  Empty,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Text, Title } = Typography;
const { Panel } = Collapse;

const PastAppoinmentData = () => {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [relatedAccounts, setRelatedAccounts] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const user = JSON.parse(localStorage.getItem("User"));

  useEffect(() => {
    if (user?.role === "patient") {
      fetchRelatedAccounts();
    } else {
      fetchAllPatients();
    }
  }, [user?.role]);

  const fetchAllPatients = async () => {
    try {
      const response = await axios.get("/api/user/get/patientDDlist");
      setAllPatients(response.data);
      // Don't set default selection for non-patient users
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  };

  const fetchRelatedAccounts = async () => {
    try {
      const response = await axios.get(
        `/api/user/get/relevantUserDDList/${user?.id}`
      );
      setRelatedAccounts(response?.data || []);
      // Set current user as default selected
      setSelectedUser(user?.id);
      fetchAppointments(user?.id);
    } catch (error) {
      console.error("Error fetching related accounts:", error);
    }
  };

  const fetchAppointments = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/appointments/getpast/${userId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (value) => {
    setSelectedUser(value);
    fetchAppointments(value);
  };

  const getUserOptions = () => {
    if (user?.role === "patient") {
      return [
        { value: user?.id, label: `${user?.firstName} ${user?.lastName} (You)` },
        ...(relatedAccounts?.map((account) => ({
          value: account.RELATED_ID,
          label: `${account.NAME} (${account.RELATIONSHIP})`,
        })) || []),
      ];
    } else {
      return allPatients.map((patient) => ({
        value: patient.USER_ID,
        label: patient.NAME,
        searchText: `${patient.NAME} ${patient.USER_ID}`
      }));
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={4}>Past Appointments</Title>
              </Col>
              <Col span={8}>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select Patient"
                  options={getUserOptions()}
                  value={selectedUser}
                  onChange={handleUserChange}
                  filterOption={(input, option) => {
                    if (user?.role === "patient") {
                      return option?.label?.toLowerCase().includes(input.toLowerCase());
                    } else {
                      return option?.searchText?.toLowerCase().includes(input.toLowerCase());
                    }
                  }}
                  optionRender={(option) => (
                    user?.role === "patient" ? (
                      option.label
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{option.label}</span>
                        <span style={{ color: '#888' }}>{option.value}</span>
                      </div>
                    )
                  )}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Spin spinning={loading}>
            {appointments.length > 0 ? (
              <Collapse>
                {appointments.map((appointment) => (
                  <Panel
                    key={appointment.APPOINTMNET_ID}
                    header={
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Text strong>{appointment.APPOINTMNET_ID}</Text>
                        </Col>
                        <Col>
                          <Tag icon={<CalendarOutlined />} color="blue">
                            {moment(appointment.DATE).format("MMM DD, YYYY")}
                          </Tag>
                          <Tag icon={<DollarOutlined />} color="green">
                            Rs. {appointment.PRICE}
                          </Tag>
                        </Col>
                      </Row>
                    }
                  >
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="Doctor" span={2}>
                        Dr. {appointment.DOCTOR_NAME}
                      </Descriptions.Item>
                      <Descriptions.Item label="Time">
                        {appointment.START_TIME} - {appointment.END_TIME}
                      </Descriptions.Item>
                      <Descriptions.Item label="Status">
                        <Tag
                          color={
                            appointment.STATUS === "completed"
                              ? "green"
                              : "orange"
                          }
                        >
                          {appointment.STATUS?.toUpperCase()}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Doctor's Note" span={2}>
                        {appointment.DOCTOR_UPDATE || "No notes"}
                      </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginTop: "16px" }}>
                      <Title level={5}>
                        <MedicineBoxOutlined /> Prescribed Items
                      </Title>
                      <Row gutter={[16, 16]}>
                        {appointment.ITEMS.map((item) => (
                          <Col span={8} key={item.ITEM_ID}>
                            <Card size="small">
                              <Text strong>{item.ITEM_NAME}</Text>
                              <br />
                              <Text type="secondary">
                                {item.COUNT} {item.UNIT}
                              </Text>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            ) : (
              <Empty description="No past appointments found" />
            )}
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

export default PastAppoinmentData;
