import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

const TopNav = () => {
  const navigate = useNavigate();

  const user = {
    name: "Admin",
    role: "Administrator",
  };

  const items = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      label: "Logout",
      onClick: () => navigate("/"),
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        background: "#001529",
      }}
    >
      {/* Logo + Tên hệ thống */}
      <div style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
        🚀 My Dashboard
      </div>

      {/* Avatar + User Info */}
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        arrow
        overlayStyle={{ minWidth: 120 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <Avatar size={40} icon={<UserOutlined />} />
          <div style={{ lineHeight: "1.2" }}>
            <Text style={{ color: "#fff", fontWeight: 500 }}>{user.name}</Text>
            <br />
            <Text style={{ color: "#ccc", fontSize: 12 }}>{user.role}</Text>
          </div>
        </div>
      </Dropdown>
    </Header>
  );
};

export default TopNav;
