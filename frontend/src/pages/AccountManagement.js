import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getDepartmentList } from "../api/departmentAPI";
import { deleteEmployee, getEmployeeList } from "../api/employeeAPI";
import { getRoleList } from "../api/roleAPI";
import UserModal from "../components/UserModal";

const { Option } = Select;

const UserManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form] = Form.useForm();

  // filter states
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState(null);
  const [filterDept, setFilterDept] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployeeList();
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (err) {
        console.error("Lỗi khi load employees:", err);
      }
    };

    const fetchRoles = async () => {
      try {
        const data = await getRoleList();
        setRoles(data);
      } catch (err) {
        console.error("Lỗi khi load roles:", err);
      }
    };

    const fetchDepartments = async () => {
      try {
        const data = await getDepartmentList();
        setDepartments(data);
      } catch (err) {
        console.error("Lỗi khi load departments:", err);
      }
    };

    fetchEmployees();
    fetchRoles();
    fetchDepartments();
  }, []);

  // Lọc dữ liệu khi filter thay đổi
  useEffect(() => {
    let filtered = employees;

    // search theo nhiều trường
    if (searchText) {
      filtered = filtered.filter((u) =>
        [u.name, u.email, u.phone, u.department?.name, u.role?.name]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(searchText.toLowerCase())
          )
      );
    }

    if (filterRole) {
      filtered = filtered.filter((u) => u.role?.id === filterRole);
    }

    if (filterDept) {
      filtered = filtered.filter((u) => u.department?.id === filterDept);
    }

    setFilteredEmployees(filtered);
  }, [searchText, filterRole, filterDept, employees]);

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday ? dayjs(user.birthday) : null,
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
      await deleteEmployee(id);
      setEmployees(employees.filter((u) => u.id !== id));
      message.success("Xoá nhân viên thành công!");
      setIsModalOpen(false);
      form.resetFields();
      setEditingUser(null);
    } catch (err) {
      console.error("Lỗi khi xoá nhân viên:", err);
      message.error(err.toString());
    }
  };

  const handleOk = (updatedUser) => {
    if (updatedUser) {
      if (editingUser) {
        setEmployees(
          employees.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
        message.success("Cập nhật tài khoản thành công");
      } else {
        setEmployees([...employees, updatedUser]);
        alert("Thêm tài khoản thành công");
      }
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
      <h2>Quản lý tài khoản</h2>

      {/* Thanh tìm kiếm + lọc */}
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo tên, email, sđt, role, chi nhánh..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        <Select
          placeholder="Lọc theo role"
          allowClear
          style={{ width: 180 }}
          onChange={(value) => setFilterRole(value || null)}
        >
          {roles.map((r) => (
            <Option key={r.id} value={r.id}>
              {r.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Lọc theo chi nhánh"
          allowClear
          style={{ width: 180 }}
          onChange={(value) => setFilterDept(value || null)}
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
          Thêm tài khoản
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="id"
        bordered
      />

      <UserModal
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

export default UserManagement;
