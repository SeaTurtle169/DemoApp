import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Descriptions,
    Form,
    Input,
    message,
    Modal,
} from "antd";
import { useState } from "react";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Fake user data (sau này có thể lấy từ API)
  const [user, setUser] = useState({
    username: "admin",
    email: "admin@example.com",
    role: "Administrator",
    status: "Active",
  });

  const openModal = () => {
    form.setFieldsValue({
      email: user.email,
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      setUser({ ...user, email: values.email });
      message.success("Cập nhật thông tin cá nhân thành công");
      setIsModalOpen(false);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Thông tin cá nhân"
        style={{ maxWidth: 600, margin: "0 auto" }}
        extra={<Button type="primary" onClick={openModal}>Chỉnh sửa</Button>}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Avatar size={80} icon={<UserOutlined />} />
          <h2 style={{ marginTop: 10 }}>{user.username}</h2>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
          <Descriptions.Item label="Status">{user.status}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Modal Edit */}
      <Modal
        title="Chỉnh sửa thông tin"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
