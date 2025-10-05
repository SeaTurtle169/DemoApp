import { Button, Card, Descriptions, Modal, Table, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPersonnelDetail, getReportsByPersonnel } from "../api/personnelAPI";

const { Title } = Typography;

const PersonnelDetail = () => {
  const { id } = useParams();
  const [personnel, setPersonnel] = useState(null);
  const [reports, setReports] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPersonnelDetail(id).then((res) => setPersonnel(res));
    getReportsByPersonnel(id).then((res) => setReports(res));
  }, [id]);

  const columns = [
    {
      title: "Ngày đánh giá",
      dataIndex: "date",
      render: (val) => (val ? dayjs(val).format("DD/MM/YYYY") : "-"),
    },
    { title: "Người đánh giá", dataIndex: ["employeeReported", "name"] },
    { title: "Loại đánh giá", dataIndex: ["competency", "name"] },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button
          onClick={() => {
            setSelectedReport(record);
            setModalOpen(true);
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <Title level={4}>Thông tin nhân sự</Title>
        {personnel && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Họ tên">{personnel.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{personnel.email}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{personnel.phone}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">{personnel.role?.name}</Descriptions.Item>
            <Descriptions.Item label="Phòng ban">{personnel.department?.name}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {personnel.active ? "Hoạt động" : "Ngừng"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <Title level={4} style={{ margin: 0 }}>
            Lịch sử đánh giá
          </Title>
          <Button type="primary" onClick={() => navigate(`/admin/newreport/${personnel.id}`)}>
            + Đánh giá mới
          </Button>
        </div>

        <Table rowKey="id" dataSource={reports} columns={columns} pagination={false} />
      </Card>

      <Modal
        title="Chi tiết đánh giá"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        {selectedReport && (
          <>
            <p>
              <b>Ngày:</b>{" "}
              {selectedReport.date ? dayjs(selectedReport.date).format("DD/MM/YYYYs") : "-"}
            </p>
            <p><b>Người đánh giá:</b> {selectedReport.employeeReported?.name}</p>
            <p><b>Loại đánh giá:</b> {selectedReport.competency?.name}</p>
            <p><b>Tiêu chí:</b></p>
            <ul>
              {selectedReport.details?.map((d, i) => (
                <li key={i}>
                  {d.criteria.name} - {d.result.name}
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PersonnelDetail;
