import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Checkbox, Col, Form, Input, message, Row, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
const { Title } = Typography;
const { Option } = Select;

const Login = () => {
  const [departments, setDepartments] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); // lưu lỗi backend
  const navigate = useNavigate(); // dùng để chuyển trang
  useEffect(() => {
    api.get("/getDepartments")
      .then((res) => {
        setDepartments(res.data || res); // nhớ lấy .data nếu axios
      })
      .catch(() => {
        setErrorMessage("Không thể tải danh sách chi nhánh");
      });
  }, []);


  const onFinish = async (values) => {
    try {

      const data = await api.post("/login", {
        username: values.username,
        password: values.password,
        departmentId: values.department,
      });

      console.log("Login response:", data);

      if (data.token) {
        // Lưu token và role
        if (values.remember) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("user", JSON.stringify(data.user)); // ✅ lưu thêm user
        } else {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("role", data.role);
          sessionStorage.setItem("user", JSON.stringify(data.user)); // ✅ lưu thêm user
        }

        message.success("Đăng nhập thành công!");

        // Điều hướng theo role
        if (data.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (data.role === "DIRECTOR" || data.role === "MANAGER") {
          navigate("/management");
        } else if (data.role === "SUPERVISOR") {
          navigate("/employees");
        } else {
          navigate("/");
        }
      } else {
        message.error("Đăng nhập thất bại: không có token trả về");
      }
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data?.message || "Có lỗi xảy ra!");
      } else {
        setErrorMessage("Không thể kết nối đến server");
      }
    }
  };


  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
        padding: 16,
      }}
    >
      <Col xs={24} sm={18} md={12} lg={8} xl={6}>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Title level={2} style={{ marginBottom: 0 }}>
              Đăng nhập
            </Title>
            <p style={{ color: "#666" }}>Chào mừng bạn quay lại 👋</p>
          </div>

          {/* Hiển thị lỗi từ backend */}
          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="department"
              label="Chi nhánh"
              rules={[{ required: true, message: "Vui lòng chọn chi nhánh!" }]}
            >
              <Select placeholder="Chọn chi nhánh">
                {departments.map((dep) => (
                  <Option key={dep.id} value={dep.id}>
                    {dep.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                size="large"
                block
                style={{ borderRadius: 8 }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
