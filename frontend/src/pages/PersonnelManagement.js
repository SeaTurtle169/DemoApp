import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getDepartmentList } from "../api/departmentAPI";
import { deletePersonnel, getPersonnelList } from "../api/personnelAPI";
import { getRoleList } from "../api/roleAPI";
import PersonnelModal from "../components/PersonnelModal";

const { Option } = Select;

const PersonnelManagement = () => {
  const [personnels, setPersonnels] = useState([]);
  const [filteredPersonnels, setFilteredPersonnels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState(null);
  const [filterDept, setFilterDept] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPersonnelList();
        setPersonnels(data);
        setFilteredPersonnels(data);

        const deptData = await getDepartmentList();
        setDepartments(deptData);

        const roleData = await getRoleList();
        setRoles(roleData);
      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Hàm filter dữ liệu
  const applyFilters = (search = searchText, role = filterRole, dept = filterDept) => {
    const value = search.toLowerCase();
    const filtered = personnels.filter((item) => {
      const matchSearch =
        item.name?.toLowerCase().includes(value) ||
        item.email?.toLowerCase().includes(value) ||
        item.phone?.toLowerCase().includes(value) ||
        item.department?.name?.toLowerCase().includes(value) ||
        item.role?.name?.toLowerCase().includes(value) ||
        (item.active ? "active" : "inactive").includes(value);

      const matchRole = role ? item.role?.id === role : true;
      const matchDept = dept ? item.department?.id === dept : true;

      return matchSearch && matchRole && matchDept;
    });
    setFilteredPersonnels(filtered);
  };

  // Tìm kiếm tổng
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    applyFilters(value, filterRole, filterDept);
  };

  const handleRoleChange = (value) => {
    const role = value || null;
    setFilterRole(role);
    applyFilters(searchText, role, filterDept); // dùng role mới
  };

  // Lọc theo department
  const handleDeptChange = (value) => {
    const dept = value || null;
    setFilterDept(dept);
    applyFilters(searchText, filterRole, dept); // dùng dept mới
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department?.id,
        role: user.role?.id,
        isActive: user.active,
      });
    } else {
      form.resetFields();
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePersonnel(id);
      const updatedList = personnels.filter((u) => u.id !== id);
      setPersonnels(updatedList);
      setFilteredPersonnels(updatedList);
      message.success("Xoá nhân sự thành công!");
      setIsModalOpen(false);
      form.resetFields();
      setEditingUser(null);
    } catch (err) {
      console.error("Lỗi khi xoá nhân sự:", err);
      message.error(err.toString());
    }
  };

  const handleOk = (updatedUser) => {
    if (updatedUser) {
      let updatedList;
      if (editingUser) {
        updatedList = personnels.map((u) =>
          u.id === updatedUser.id ? updatedUser : u
        );
        message.success("Cập nhật nhân sự thành công");
      } else {
        updatedList = [...personnels, updatedUser];
        alert("Thêm nhân sự thành công");
      }
      setPersonnels(updatedList);
      setFilteredPersonnels(updatedList);
    }
    setIsModalOpen(false);
    form.resetFields();
    setEditingUser(null);
  };

  const columns = [
    { title: "No.", key: "index", render: (_, __, index) => index + 1 },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    {
      title: "Chi nhánh",
      dataIndex: ["department", "name"],
      key: "department",
      render: (dept) => dept || "—",
    },
    {
      title: "Role",
      dataIndex: ["role", "name"],
      key: "role",
      render: (role) => (
        <Tag color={role === "ADMIN" ? "red" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "status",
      render: (active) => (
        <Tag color={active ? "green" : "volcano"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý nhân sự</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên, email, sđt, chi nhánh, role, trạng thái..."
          prefix={<SearchOutlined />}
          style={{ width: 350 }}
          onChange={handleSearch}
          allowClear
        />

        <Select
          placeholder="Lọc theo Role"
          style={{ width: 200 }}
          allowClear
          onChange={handleRoleChange}
        >
          {roles.map((r) => (
            <Option key={r.id} value={r.id}>
              {r.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Lọc theo Chi nhánh"
          style={{ width: 200 }}
          allowClear
          onChange={handleDeptChange}
        >
          {departments.map((d) => (
            <Option key={d.id} value={d.id}>
              {d.name}
            </Option>
          ))}
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Thêm nhân sự
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredPersonnels}
        rowKey="id"
        bordered
      />

      <PersonnelModal
        open={isModalOpen}
        onOk={handleOk}
        onDelete={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        editingUser={editingUser}
        form={form}
      />
    </div>
  );
};

export default PersonnelManagement;
