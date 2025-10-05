import { EyeOutlined } from "@ant-design/icons";
import { Button, Input, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPersonnelByDepartment } from "../api/personnelAPI";

const { Title } = Typography;

const PersonnelList = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // lấy dữ liệu
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const departmentId = user?.department?.id;

  useEffect(() => {
    if (!departmentId) return;
    getPersonnelByDepartment(departmentId)
      .then((res) => {
        setData(res);
        setFiltered(res);
      })
      .catch((err) => console.error("API error:", err));
  }, [departmentId]);

  // search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    if (!value) {
      setFiltered(data);
      return;
    }
    setFiltered(
      data.filter((p) => {
        return (
          p.name?.toLowerCase().includes(value) ||
          p.email?.toLowerCase().includes(value) ||
          p.phone?.toLowerCase().includes(value) ||
          p.role?.name?.toLowerCase().includes(value) ||
          p.department?.name?.toLowerCase().includes(value) ||
          (p.active ? "hoạt động" : "ngừng").includes(value)
        );
      })
    );
  };

  const columns = [
    { title: "STT", render: (_, __, i) => i + 1, responsive: ["md"] },
    { title: "Họ tên", dataIndex: "name" },
    {
      title: "Email",
      dataIndex: "email",
      render: (val) => (isMobile ? val?.substring(0, 7) + "..." : val),
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      responsive: ["md"],
    },
    {
      title: "Phòng ban",
      dataIndex: ["department", "name"],
      responsive: ["md"],
    },
    {
      title: "Vai trò",
      dataIndex: ["role", "name"],
      responsive: ["md"],
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (val) => (val ? "Hoạt động" : "Ngừng"),
      responsive: ["md"],
    },
    {
      title: "Hành động",
      render: (_, record) =>
        isMobile ? (
          <Button
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/personnel/${record.id}`)}
          />
        ) : (
          <Button
            type="primary"
            onClick={() => navigate(`/admin/personnel/${record.id}`)}
          >
            Thực hiện đánh giá
          </Button>
        ),
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Danh sách nhân sự
        </Title>
        <Input
          placeholder="Tìm kiếm theo mọi tiêu chí"
          onChange={handleSearch}
          allowClear
          style={{ width: 300 }}
        />
      </div>
      <Table
        style={{ marginTop: 15 }}
        rowKey="id"
        dataSource={filtered}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default PersonnelList;
