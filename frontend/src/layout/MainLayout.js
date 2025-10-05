import { Layout } from "antd";
import TopNavbar from "../components/TopNavbar";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Navbar trên cùng */}
      <div style={{ background: "#001529" }}>
        <TopNavbar />
      </div>

      {/* Nội dung */}
      <Content
        style={{
          margin: "20px",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          minHeight: "calc(100vh - 120px)", // trừ chiều cao navbar
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;
