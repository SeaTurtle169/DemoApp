import { EditOutlined, LogoutOutlined } from "@ant-design/icons";
import { Badge, Button } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import "../asset/CSS/TopNavbar.css";

const TopNavbar = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="top-navbar">
      {/* Welcome */}
      <div className="welcome-section">
        <h3>Welcome {user ? user.name : "Guest"}</h3>
        <p>Things have evolved since your last visit</p>
      </div>

      {/* Tabs navigation */}
      <div className="tab-section">
        <NavLink to="/admin/dashboard" className="nav-tab">
          Dashboard{" "}
        </NavLink>

        <NavLink to="/admin/account" className="nav-tab">
          Quản lý tài khoản{" "}
          <Badge className="custom-badge" count={218} offset={[8, -2]} />
        </NavLink>

        <NavLink to="/admin/personnel" className="nav-tab">
          Quản lý nhân sự{" "}
          <Badge className="custom-badge" count={69} offset={[8, -2]} />
        </NavLink>

        <NavLink to="/admin/competency" className="nav-tab">
          Quản lý đánh giá{" "}
          <Badge className="custom-badge" count={4} offset={[8, -2]} />
        </NavLink>

        <NavLink to="/admin/personnelListByDepartment" className="nav-tab">
          Đánh giá nhân sự{" "}
        </NavLink>

        <NavLink to="/spot" className="nav-tab">
          <EditOutlined style={{ marginRight: 6 }} />
          SPOT
        </NavLink>
      </div>

      {/* Logout button */}
      <div className="logout-section" style={{ position: "absolute", right: 20, top: 20 }}>
        <Button type="primary" danger size="small" icon={<LogoutOutlined />} onClick={handleLogout}>
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default TopNavbar;
