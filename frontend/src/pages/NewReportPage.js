import useMediaQuery from "@mui/material/useMediaQuery";
import { Button, Card, Radio, Select, Table, Typography, message } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCriteriaByCompetency } from "../api/competencyAPI";
import { createReport } from "../api/personnelAPI";
const { Title } = Typography;

const NewReportPage = () => {
  const { id } = useParams(); // id của personnel
  const [competencyId, setCompetencyId] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [results, setResults] = useState({});
  const isMobile = useMediaQuery("(max-width: 576px)");
  const navigate = useNavigate();
  // Khi chọn competency → load criteria
  const handleSelectCompetency = (value) => {
    setCompetencyId(value);
    getCriteriaByCompetency(value).then((res) => {
      setCriteria(res);
      setResults({});
    });
  };

  const handleResultChange = (criteriaId, resultId) => {
    setResults((prev) => ({ ...prev, [criteriaId]: resultId }));
  };

  const handleSubmit = async () => {
  if (!competencyId) {
    message.error("Vui lòng chọn loại đánh giá!");
    return;
  }

  // kiểm tra tất cả tiêu chí đều đã chọn
  if (Object.keys(results).length !== criteria.length) {
    alert("Vui lòng chọn kết quả cho tất cả tiêu chí!");
    return;
  }

  const details = Object.entries(results).map(([criteriaId, resultId]) => ({
    criteriaId: parseInt(criteriaId),
    resultId,
  }));

  const payload = {
    personnelId: parseInt(id),
    competencyId,
    details,
  };
  console.log("Payload to submit:", payload);

  try {
    await createReport(payload);
    alert("Tạo đánh giá thành công!");
    navigate(`/admin/personnel/${id}`);
  } catch (e) {
    alert("Có lỗi xảy ra khi lưu đánh giá");
  }
};


  const columns = [
    { title: "Tiêu chí", dataIndex: "name" },
    {
      title: "Đúng",
      render: (_, record) => (
        <Radio
          checked={results[record.id] === 1}
          onChange={() => handleResultChange(record.id, 1)}
        />
      ),
      responsive: ["md"], 
    },
    {
      title: "Đủ",
      render: (_, record) => (
        <Radio
          checked={results[record.id] === 2}
          onChange={() => handleResultChange(record.id, 2)}
        />
      ),
      responsive: ["md"],
    },
    {
      title: "Sai",
      render: (_, record) => (
        <Radio
          checked={results[record.id] === 3}
          onChange={() => handleResultChange(record.id, 3)}
        />
      ),
      responsive: ["md"],
    },
  ];

  return (
    <Card>
      <Title level={4}>Tạo đánh giá mới</Title>

      <Select
        placeholder="Chọn loại đánh giá"
        style={{ width: 250, marginBottom: 20 }}
        onChange={handleSelectCompetency}
      >
        <Select.Option value={1}>Tác phong</Select.Option>
        <Select.Option value={2}>Kỹ thuật</Select.Option>
        <Select.Option value={3}>Học vấn</Select.Option>
      </Select>

      {criteria.length > 0 && (
        <>
          {/* ✅ Desktop thì dùng bảng, Mobile thì render card dạng list */}
          {isMobile ? (
            <div>
              {criteria.map((c) => (
                <Card key={c.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 500, marginBottom: 8 }}>{c.name}</div>
                  <Radio.Group
                    value={results[c.id]}
                    onChange={(e) => handleResultChange(c.id, e.target.value)}
                  >
                    <Radio value={1}>Đúng</Radio>
                    <Radio value={2}>Đủ</Radio>
                    <Radio value={3}>Sai</Radio>
                  </Radio.Group>
                </Card>
              ))}
            </div>
          ) : (
            <Table
              rowKey="id"
              dataSource={criteria}
              columns={columns}
              pagination={false}
            />
          )}

          <Button
            type="primary"
            style={{ marginTop: 15 }}
            onClick={handleSubmit}
          >
            Lưu đánh giá
          </Button>
        </>
      )}
    </Card>
  );
};

export default NewReportPage;
