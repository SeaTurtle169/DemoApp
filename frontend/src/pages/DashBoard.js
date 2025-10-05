import { Card, Col, Row } from "antd";
import PieCard from "../components/PieChart";



const Dashboard = () => {
  // Fake data cho pie chart
  const userData = [
    { name: "Active", value: 120 },
    { name: "Inactive", value: 30 },
    { name: "Banned", value: 10 },
  ];

  const orderData = [
    { name: "Completed", value: 70 },
    { name: "Pending", value: 15 },
    { name: "Canceled", value: 4 },
  ];

  return (
<>
          <div style={{ padding: 20 }}>
            <h2>Dashboard Overview</h2>

            {/* Cards thống kê */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card title="Users">120 Active Users</Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card title="Revenue">$5,200 this month</Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card title="Orders">89 Orders</Card>
              </Col>
            </Row>

            {/* Charts */}
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
              <Col xs={24} md={12}>
                <PieCard title="User Distribution" data={userData} />
              </Col>
              <Col xs={24} md={12}>
                <PieCard title="Order Status" data={orderData} />
              </Col>
            </Row>
          </div>
     </>
  );
};

export default Dashboard;
