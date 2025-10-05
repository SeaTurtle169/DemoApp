import {
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import '../asset/CSS/SideMenu.css';
const { Sider } = Layout;

const SideMenu = ({ isMobile, setIsMobile }) => {
  const navigate = useNavigate();

  // cấu hình items + đường dẫn
  const items = [
  {
    key: "/admin",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/admin/personnel",
    icon: <TeamOutlined />, 
    label: "Users",
  },
  {
    key: "/upload",
    icon: <UploadOutlined />,
    label: "Upload",
  },
  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => setIsMobile(broken)}
      style={{
        height: "100vh",
        position: isMobile ? "fixed" : "relative",
        left: 0,
        top: isMobile ? 64 : 0, // nếu có TopNav cao 64px
        zIndex: isMobile ? 1000 : "auto",
      }}
    >
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["/dashboard"]}
        items={items}
        onClick={({ key }) => navigate(key)} // <-- click menu thì navigate
      />
    </Sider>
  );
};

export default SideMenu;
